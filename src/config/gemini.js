import {
  GoogleGenAI,
} from '@google/genai';

async function runChat(prompt) {
  const ai = new GoogleGenAI({apiKey: '[Your_API_Key]'});
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  
  let fullResponse = '';
  
  // Collect all chunks instead of returning after the first one
  for await (const chunk of response) {
    console.log(chunk.text);
    fullResponse += chunk.text; // Accumulate all chunks
  }
  
  return fullResponse; // Return the complete response
}

export default runChat;
