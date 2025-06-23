const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ask-ai", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Thiếu nội dung câu hỏi." });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Bạn là một trợ lý AI giúp học sinh giải bài toán lớp 9.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
    });

    res.json({ choices: chatResponse.choices });
  } catch (error) {
    console.error("Lỗi khi gọi OpenAI:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi khi gọi AI." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
