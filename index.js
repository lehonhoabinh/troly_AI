async function handleImage() {
  const file = document.getElementById("imageInput").files[0];
  const loading = document.getElementById("loading");
  const questionBox = document.getElementById("question");

  if (!file) return;

  loading.textContent = "🔍 Đang nhận dạng ảnh (OCR)...";

  const { data: { text } } = await Tesseract.recognize(file, "eng+vie", {
    logger: m => console.log(m)
  });

  questionBox.value = text.trim();
  loading.textContent = "✅ Đã trích xuất văn bản từ ảnh.";
}

async function askAI() {
  const question = document.getElementById("question").value.trim();
  const responseBox = document.getElementById("response");

  if (!question) {
    responseBox.textContent = "⚠️ Vui lòng nhập hoặc chụp đề bài.";
    return;
  }

  responseBox.textContent = "⏳ AI đang suy nghĩ...";

  try {
    const response = await fetch("http://localhost:3000/api/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      responseBox.textContent = data.choices[0].message.content.trim();
    } else {
      responseBox.textContent = "⚠️ Không nhận được phản hồi từ AI.";
    }
  } catch (error) {
    console.error(error);
    responseBox.textContent = "❌ Có lỗi xảy ra khi gửi câu hỏi.";
  }
}
