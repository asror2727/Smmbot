import 'dotenv/config';

const API_URL = process.env.SMM_API_URL;
const API_KEY = process.env.SMM_API_KEY;

/**
 * SMM panel API'siga so'rov yuborish uchun umumiy funksiya.
 * Diqqat: bu yerda faqat "xavfsiz" action'lar qo'llab-quvvatlanadi.
 * "number" va "number_sms" (virtual raqam / SMS kod olish) qasddan
 * qo'shilmagan — ular telefon tasdiqlash tizimlarini chetlab o'tish
 * uchun ishlatilishi mumkin.
 */
async function callApi(params) {
  const body = new URLSearchParams({ key: API_KEY, ...params });

  const res = await fetch(API_URL, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    throw new Error(`API xatosi: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Barcha mavjud xizmatlar ro'yxatini olish
export function getServices() {
  return callApi({ action: 'services' });
}

// Yangi buyurtma yaratish
export function createOrder({ service, link, quantity }) {
  return callApi({ action: 'add', service, link, quantity });
}

// Bitta buyurtma holatini tekshirish
export function getOrderStatus(order) {
  return callApi({ action: 'status', order });
}

// Bir nechta buyurtma holatini tekshirish (vergul bilan ajratilgan ID'lar)
export function getMultipleOrderStatus(orders) {
  return callApi({ action: 'status', orders });
}

// Buyurtmani qayta tiklash (refill)
export function refillOrder(order) {
  return callApi({ action: 'refill', order });
}

// Buyurtmalarni bekor qilish
export function cancelOrders(orders) {
  return callApi({ action: 'cancel', orders });
}

// Panel balansini tekshirish
export function getBalance() {
  return callApi({ action: 'balance' });
}

// Telegram Stars sotib olish
export function buyStars({ username, quantity }) {
  return callApi({ action: 'stars', username, quantity });
}

// Telegram Gift yuborish
export function sendGift({ username, gift }) {
  return callApi({ action: 'gift', username, gift });
}
