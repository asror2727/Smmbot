# SMM Reseller Bot

Telegram orqali SMM xizmatlarni (follower, layk va h.k.) sotadigan bot.

## Nima kiritilmagan va nega

`smmApi.js` faylida panelning **`number`** (virtual raqam sotib olish) va
**`number_sms`** (SMS kod olish) action'lari qasddan qo'shilmagan. Bu
funksiyalar telefon-tasdiqlash (OTP) tizimlarini chetlab o'tish uchun
ishlatiladi va odatda soxta akkaunt yaratish, firibgarlik yoki spam uchun
foydalaniladi. Shu sabab ularni botga integratsiya qilib bermadim.

## 1. Lokal ishga tushirish

```bash
npm install
cp .env.example .env
# .env faylni oching va BOT_TOKEN, SMM_API_KEY qiymatlarini kiriting
npm start
```

- `BOT_TOKEN` — @BotFather orqali yangi bot yaratib oling.
- `SMM_API_KEY` — @Winner_smm_bot orqali ro'yxatdan o'tib profilingizdan oling.
- `ADMIN_IDS` — o'zingizning Telegram user ID'ingizni kiriting (masalan @userinfobot orqali bilib oling), vergul bilan bir nechtasini yozish mumkin.

## 2. GitHub'ga joylash

```bash
git init
git add .
git commit -m "SMM reseller bot"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NOMI.git
git push -u origin main
```

**Muhim:** `.env` faylni hech qachon GitHub'ga yuklamang — u maxfiy
kalitlaringizni o'z ichiga oladi. `.gitignore` fayli buni avtomatik oldini
oladi.

## 3. Render.com'ga deploy qilish

1. https://render.com saytida ro'yxatdan o'ting va GitHub akkauntingizni ulang.
2. **New +** → **Background Worker** (bot doim ishlab tursin desangiz shu, chunki bu polling-based bot, web server emas).
3. Repository'ni tanlang.
4. Sozlamalar:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment** bo'limida `.env` dagi barcha o'zgaruvchilarni (`BOT_TOKEN`, `SMM_API_KEY`, `SMM_API_URL`, `PRICE_MARKUP`, `ADMIN_IDS`) qo'lda kiriting.
6. **Create Background Worker** tugmasini bosing — Render avtomatik build qilib, botni ishga tushiradi.

Har safar GitHub'dagi `main` branch'ga push qilganingizda, Render avtomatik qayta deploy qiladi.

## 4. Narxlash haqida

API sizga xizmatning **tannarxini** (`rate`) beradi. Bot kodida `PRICE_MARKUP`
orqali o'zingiz ustama qo'shasiz (masalan 1.5 = 50% ustama). Buni `.env`
faylida o'zgartirishingiz mumkin — kodni qayta yozish shart emas.
