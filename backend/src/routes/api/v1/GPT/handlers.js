import fetch from "node-fetch";

export async function poMessageToChatGPT(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    try {
      const { content } = req.body;
  
      // 構造發送給 ChatGPT API 的請求
      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content }, // 將收到的消息加入到 ChatGPT API 的 messages 中
        ],
      };
  
      // 發送請求給 ChatGPT API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey, // 替換為您的 OpenAI API 金鑰
        },
        body: JSON.stringify(apiRequestBody),
      });
  
      // 檢查響應的狀態碼
      if (!response.ok) {
        throw new Error(`Failed to fetch response from ChatGPT API: ${response.statusText}`);
      }
  
      // 解析回應
      const responseData = await response.json();
  
      // 從回應中提取 ChatGPT 的回答
      const chatGPTResponse = responseData.choices[0]?.message?.content;
  
      // 在此處可以對 chatGPTResponse 進行任何必要的後續處理
  
      // 返回成功的回應給前端
      res.status(200).json({ success: true, message: "Message sent to ChatGPT successfully", chatGPTResponse });
    } catch (error) {
      console.error("Error sending message to ChatGPT:", error);
      res.status(500).json({ success: false, error: "Failed to send message to ChatGPT" });
    }
  }