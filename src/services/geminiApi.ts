const apiKey = 'AIzaSyBgGESJ9SEbnwHo1JTac-EhDFVt6xvTRWo';

interface Part {
  text: string;
}

interface Content {
  parts: Part[];
}

export async function sendToGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      // Инструкция для ИИ: только психология
      {
        role: 'user',
        parts: [
          {
            text:
              'Ты — профессиональный психолог. Отвечай только на вопросы, связанные с психологией. ' +
              'Если вопрос не относится к психологии, вежливо сообщи, что можешь отвечать только на психологические темы.',
          },
        ],
      },
      // Сообщение пользователя
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка API: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (data?.candidates?.length > 0) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('Пустой ответ от Gemini');
}
