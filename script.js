<script>
  const API_KEY = "여기에_발급받으신_Gemini_API_Key를_넣으세요";

  // ==========================
  // Gemini 질문 함수
  // ==========================
  async function askGemini() {

    const inputField = document.getElementById("chat-input");
    const messageBox = document.getElementById("chat-messages");

    const userText = inputField.value.trim();

    if (!userText) return;

    // 사용자 질문 표시
    messageBox.innerHTML += `
      <div style="margin-bottom:10px;text-align:right;">
        <b>나:</b> ${userText}
      </div>
    `;

    inputField.value = "";
    messageBox.scrollTop = messageBox.scrollHeight;

    // 로딩 표시
    messageBox.innerHTML += `
      <div id="loading-message" style="margin-bottom:10px;color:#777;">
        <b>AI 강사:</b> 생각하고 있습니다...
      </div>
    `;

    try {

      const prompt = `
너는 '커피 교육 AI'이다.

아래에 제공된 교육자료를 가장 우선적으로 참고하여 답변한다.

[중요 규칙]

1. 교육자료에 있는 내용을 우선적으로 사용한다.
2. 교육자료에 없는 내용은 교육자료의 내용인 것처럼 만들어내지 않는다.
3. 교육자료에서 확실하게 설명하지 않은 내용은 일반적인 커피 지식을 사용하더라도 구분해서 설명한다.
4. '무조건', '100%'와 같은 표현은 교육자료의 취지와 다르게 사용하지 않는다.
5. 교육생이 이해하기 쉽도록 설명한다.
6. 필요하면 실제 카페에서의 사례를 들어 설명한다.
7. 질문과 관련된 교육자료의 핵심 내용을 먼저 설명한다.

[교육자료]

${KNOWLEDGE}

[교육생 질문]

${userText}

위 내용을 바탕으로 친절하고 전문적으로 답변해줘.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      document.getElementById("loading-message")?.remove();

      if (!data.candidates || !data.candidates[0]) {
        throw new Error("Gemini 응답 오류");
      }

      const botReply =
        data.candidates[0].content.parts[0].text
          .replace(/\n/g, "<br>");

      messageBox.innerHTML += `
        <div style="margin-bottom:10px;">
          <b>AI 강사:</b> ${botReply}
        </div>
      `;

    } catch (error) {

      document.getElementById("loading-message")?.remove();

      messageBox.innerHTML += `
        <div style="color:red;margin-bottom:10px;">
          AI 응답 중 오류가 발생했습니다.<br>
          API 키 또는 Gemini 설정을 확인해주세요.
        </div>
      `;

      console.error(error);
    }

    messageBox.scrollTop = messageBox.scrollHeight;
  }
</script>
