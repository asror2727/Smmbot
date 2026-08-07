import 'dotenv/config';
import { Telegraf, Markup, session } from 'telegraf';
import {
  getServices,
  createOrder,
  getOrderStatus,
  getBalance,
} from './smmApi.js';

const bot = new Telegraf(process.env.BOT_TOKEN);
const MARKUP = parseFloat(process.env.PRICE_MARKUP || '1.5');

bot.use(session());
bot.use((ctx, next) => {
  ctx.session ??= {};
  return next();
});

// Narxni sizning ustama koeffitsiyentingiz bilan hisoblash
function priceFor(apiRate) {
  return (parseFloat(apiRate) * MARKUP).toFixed(2);
}

bot.start((ctx) =>
  ctx.reply(
    "Assalomu alaykum! SMM xizmatlar botiga xush kelibsiz.\n\n" +
      "/xizmatlar - mavjud xizmatlar ro'yxati\n" +
      "/buyurtma - yangi buyurtma berish\n" +
      "/holat - buyurtma holatini tekshirish"
  )
);

// Xizmatlar ro'yxatini ko'rsatish
bot.command('xizmatlar', async (ctx) => {
  try {
    const services = await getServices();
    const top = services.slice(0, 15); // birinchi 15 tasi (uzun ro'yxat bosilib ketmasin)

    let text = "📋 Mavjud xizmatlar:\n\n";
    for (const s of top) {
      text += `#${s.service} — ${s.name}\n`;
      text += `Narx: ${priceFor(s.rate)} so'm / 1000 ta\n`;
      text += `Min: ${s.min} | Max: ${s.max}\n\n`;
    }
    text += "Buyurtma berish uchun: /buyurtma";

    await ctx.reply(text);
  } catch (err) {
    console.error(err);
    await ctx.reply("Xizmatlar ro'yxatini olishda xatolik yuz berdi.");
  }
});

// Buyurtma berish jarayonini boshlash (bosqichma-bosqich)
bot.command('buyurtma', (ctx) => {
  ctx.session.step = 'awaiting_service';
  ctx.reply("Xizmat ID raqamini kiriting (masalan: 1):");
});

bot.on('text', async (ctx, next) => {
  const step = ctx.session.step;
  if (!step) return next();

  if (step === 'awaiting_service') {
    ctx.session.service = ctx.message.text.trim();
    ctx.session.step = 'awaiting_link';
    return ctx.reply("Havolani (link) kiriting:");
  }

  if (step === 'awaiting_link') {
    ctx.session.link = ctx.message.text.trim();
    ctx.session.step = 'awaiting_quantity';
    return ctx.reply("Miqdorni kiriting (masalan: 1000):");
  }

  if (step === 'awaiting_quantity') {
    ctx.session.quantity = ctx.message.text.trim();
    ctx.session.step = null;

    try {
      const result = await createOrder({
        service: ctx.session.service,
        link: ctx.session.link,
        quantity: ctx.session.quantity,
      });

      if (result.order) {
        await ctx.reply(
          `✅ Buyurtma qabul qilindi!\nBuyurtma raqami: ${result.order}\n\n` +
            `Holatini tekshirish uchun: /holat ${result.order}`
        );
      } else {
        await ctx.reply(`❌ Xatolik: ${result.error || 'Nomaʼlum xato'}`);
      }
    } catch (err) {
      console.error(err);
      await ctx.reply("Buyurtma berishda xatolik yuz berdi.");
    }
    return;
  }

  return next();
});

// Buyurtma holatini tekshirish: /holat 23501
bot.command('holat', async (ctx) => {
  const parts = ctx.message.text.split(' ');
  const orderId = parts[1];

  if (!orderId) {
    return ctx.reply("Foydalanish: /holat <buyurtma_raqami>");
  }

  try {
    const result = await getOrderStatus(orderId);
    await ctx.reply(
      `📦 Buyurtma #${orderId}\n` +
        `Holat: ${result.status}\n` +
        `Boshlang'ich: ${result.start_count}\n` +
        `Qolgan: ${result.remains}`
    );
  } catch (err) {
    console.error(err);
    await ctx.reply("Holatni tekshirishda xatolik yuz berdi.");
  }
});

// Faqat admin uchun: balansni tekshirish
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map((s) => s.trim());

bot.command('balans', async (ctx) => {
  if (!ADMIN_IDS.includes(String(ctx.from.id))) {
    return ctx.reply("Bu buyruq faqat admin uchun.");
  }
  try {
    const result = await getBalance();
    await ctx.reply(`💰 Balans: ${result.balance} ${result.currency}`);
  } catch (err) {
    console.error(err);
    await ctx.reply("Balansni tekshirishda xatolik yuz berdi.");
  }
});

bot.launch();
console.log('Bot ishga tushdi...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
