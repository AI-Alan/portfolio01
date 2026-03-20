import { GoogleGenerativeAI } from '@google/generative-ai'
import { getChatContextPrompt } from '@/lib/getChatContext'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const BASE_SYSTEM_PROMPT = `You are ARIA — an AI assistant embedded in Aman's personal portfolio website.

## Core Behavior
- Answer questions about Aman using ONLY the provided dynamic portfolio data.
- If a detail is missing, say you are not sure and direct the user to the Contact page.
- Be friendly, professional, and concise.
- Respond in the same language the user uses.
- Keep responses brief (typically 2-4 sentences), unless user asks for depth.
- Never fabricate facts, dates, metrics, achievements, links, or project details.
`

export async function getChatResponse(
  userMessage: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const dynamicContext = await getChatContextPrompt()
  const systemInstruction = `${BASE_SYSTEM_PROMPT}\n\n${dynamicContext}`

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction,
  })

  const chat = model.startChat({
    history: history
      .map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      }))
      // Gemini history MUST start with 'user' role
      .filter((h, i) => (i === 0 ? h.role === 'user' : true)),
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
  })

  const result = await chat.sendMessage(userMessage)
  const text = result.response.text()
  if (!text) throw new Error('Empty response from Gemini')
  return text
}
