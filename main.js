import { GoogleGenerativeAI } from "@google/generative-ai";

const businessInfo = `
Uttar Pradesh Branch
Address: [Full Address in UP]
Phone Number: [Local phone number]
Email (branch-specific): [UP branch email]
Opening Hours:
Monday – Friday: 10:00 AM – 8:00 PM
Saturday: 10:00 AM – 6:00 PM
Sunday: Closed

Delhi Branch
Address: [Full Address in Delhi]
Phone Number: [Local phone number]
Email (branch-specific): [Delhi branch email]
Opening Hours:
Monday – Friday: 11:00 AM – 9:00 PM
Saturday: 11:00 AM – 7:00 PM
Sunday: Closed
`;

// FAQs (keyword → answer)
const faqs = {
  "business hours": "Our Uttar Pradesh branch is open Mon–Sat, 10 AM to 8 PM. Delhi branch is open Mon–Sat, 11 AM to 9 PM. Both branches remain closed on Sundays.",
  "contact number": "You can reach our Uttar Pradesh branch at 123456789 and Delhi branch at 000000000.",
  "customer support": "For Uttar Pradesh, call 123456789. For Delhi, call 000000000.",
  "email": "For Uttar Pradesh, email [UP email]. For Delhi, email [Delhi email].",
  "store location": "We have two branches — one in Uttar Pradesh ([full address]) and another in Delhi ([full address]).",
  "return policy": "Items can be returned within 7 days with the original receipt, unused, and in original packaging.",
  "exchange": "Yes, exchanges are accepted within 10 days for size or color issues.",
  "refund": "Refunds are processed to the original payment method within 5–7 business days after approval.",
  "delivery": "Yes, standard delivery takes 3–5 working days. Orders above ₹999 qualify for free shipping.",
  "payment methods": "We accept Cash, Cards, UPI, Net Banking, and Wallets.",
  "parking": "Yes, both branches provide customer parking.",
  "social media": "We are active on Facebook, Instagram, and Twitter."
};

const API_KEY = "AIzaSyAPqJiQXwq6EXTkjmWzHVImBc-3347MDsg";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstructions: businessInfo
});

const chat = model.startChat({ history: [] });

async function sendMessage() {
  const inputEl = document.querySelector(".chat-window input");
  const chatBox = document.querySelector(".chat-window .chat");
  const userMessage = inputEl.value.trim();

  if (!userMessage) return;
  inputEl.value = "";

  // Show user message
  chatBox.insertAdjacentHTML(
    "beforeend",
    `<div class="user"><p>${userMessage}</p></div>`
  );
  chatBox.scrollTop = chatBox.scrollHeight;

  const normalizedQuestion = userMessage.toLowerCase();

  // Show loader
  chatBox.insertAdjacentHTML("beforeend", `<div class="loader"></div>`);
  const loader = chatBox.querySelector(".loader");

  try {
    let responseText = "";

    // ✅ Keyword-based matching
    let matched = false;
    for (let keyword in faqs) {
      if (normalizedQuestion.includes(keyword)) {
        responseText = faqs[keyword];
        matched = true;
        break;
      }
    }

    // If no keyword match → Gemini AI
    if (!matched) {
      const result = await chat.sendMessage(userMessage);
      responseText = result.response
        ? await result.response.text()
        : "Sorry, I couldn't understand that.";
    }

    // Show AI/FAQ response
    chatBox.insertAdjacentHTML(
      "beforeend",
      `<div class="model"><p>${responseText}</p></div>`
    );
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error(error);
    chatBox.insertAdjacentHTML(
      "beforeend",
      `<div class="error"><p>The message could not be sent. Please try again.</p></div>`
    );
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Remove loader
  if (loader) loader.remove();
}

// Event listeners
document.querySelector(".chat-window .input-area button").addEventListener("click", sendMessage);
document.querySelector(".chat-window input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
 document.querySelector(".chat-button")
.addEventListener("click",()=> {
    document.querySelector("body").classList.add("chat-open");
});
 document.querySelector(".chat-window button.close")
.addEventListener("click",()=> {
    document.querySelector("body").classList.remove("chat-open");
});