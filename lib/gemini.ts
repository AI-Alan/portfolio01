import { GoogleGenerativeAI } from '@google/generative-ai'
import { getChatContextPrompt } from '@/lib/getChatContext'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const CONTACT_PAGE_URL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact`

const BASE_SYSTEM_PROMPT = `You are ARIA — an AI assistant embedded in Aman's personal portfolio website.

## Core Behavior
- Answer questions about Aman using ONLY the provided dynamic portfolio data.
- If a detail is missing, say you are not sure and share this contact link: ${CONTACT_PAGE_URL}
- Be friendly, professional, and concise.
- Respond in the same language the user uses.
- Keep responses brief (typically 2-4 sentences), unless user asks for depth.
- Never fabricate facts, dates, metrics, achievements, links, or project details.
- Tense rules for experience entries:
  - Completed entry (current=false and end date is not "Present"): ALWAYS use past tense.
  - Ongoing entry (current=true or end date is "Present"): use present tense.
  - Never use future tense words like "will" or "going to" for completed entries.
`

const MAX_HISTORY_MESSAGES = 8
const MAX_HISTORY_CHARS = 1400

function getTrimmedHistory(history: { role: string; content: string }[]) {
  const recent = history.slice(-MAX_HISTORY_MESSAGES)
  const trimmed: { role: string; content: string }[] = []
  let totalChars = 0

  for (let i = recent.length - 1; i >= 0; i -= 1) {
    const item = recent[i]
    const nextChars = totalChars + item.content.length
    if (nextChars > MAX_HISTORY_CHARS) break
    trimmed.unshift(item)
    totalChars = nextChars
  }

  return trimmed
}

export async function getChatResponse(
  userMessage: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const dynamicContext = await getChatContextPrompt()
  const systemInstruction = `${BASE_SYSTEM_PROMPT}\n\n${dynamicContext}`
  const trimmedHistory = getTrimmedHistory(history)
  const historyChars = trimmedHistory.reduce((sum, item) => sum + item.content.length, 0)
  const totalInputChars = userMessage.length + historyChars + systemInstruction.length

  console.info('[chat-metrics]', {
    messageChars: userMessage.length,
    historyMessages: trimmedHistory.length,
    originalHistoryMessages: history.length,
    historyChars,
    systemInstructionChars: systemInstruction.length,
    totalInputChars,
  })

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction,
  })

  const chat = model.startChat({
    history: trimmedHistory
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
