// api/ai.js — Vercel Serverless Function
// Proxies requests to Groq API, keeping your API key server-side

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured. Add it in Vercel → Settings → Environment Variables.' })
  }

  try {
    const { messages = [], model, max_tokens, system } = req.body || {}
    const mappedMessages = []

    if (system) {
      mappedMessages.push({ role: 'system', content: system })
    }

    mappedMessages.push(...messages)

    const payload = {
      model: model || 'llama-3.1-8b-instant',
      messages: mappedMessages,
      max_tokens: max_tokens || 1000,
      temperature: 0.3,
    }

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await upstream.json()
    if (!upstream.ok) {
      return res.status(upstream.status).json(data)
    }

    const text = data?.choices?.[0]?.message?.content || ''
    return res.status(200).json({ content: [{ text }], raw: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
