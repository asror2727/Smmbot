// ===============================
// VAQTINCHALIK: SMM Cloud xizmatlar ro'yxatini olish
// (bir marta ishlatib, natijani ko'rib, keyin o'chirib tashlang)
// ===============================
// DIQQAT: bu fayl faqat xizmatlar ro'yxatini olish uchun.
// /confirm komandasi uchun pastdagi alohida faylga qarang.

if(user.telegramid != 7651404790){
  Bot.sendMessage("❌ Sizda ruxsat yo'q.")
  return
}

let API_URL = "https://smmcloud.uz/Smm_hizmatlar_tezkor_bot/api/v2"
let API_KEY = "hOoz3OxHcSclvjuPobcOoTd4xRqqgenL"

HTTP.post({
  url: API_URL,
  body: {
    key: API_KEY,
    action: "services"
  },
  success: function(response){
    // Bu javob juda uzun bo'lishi mumkin — Telegram xabari 4096 belgidan
    // oshsa bo'lakларга bo'lib yuboramiz.
    let text = response
    let chunkSize = 3500
    for(let i = 0; i < text.length; i += chunkSize){
      Bot.sendMessage(text.substring(i, i + chunkSize))
    }
  },
  error: function(error){
    Bot.sendMessage("❌ Xatolik: " + error)
  }
})
