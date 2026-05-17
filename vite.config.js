import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Groq proxy plugin for local dev — injects API key server-side
function groqProxyPlugin() {
  return {
    name: 'groq-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }
        const chunks = []
        req.on('data', c => chunks.push(c))
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString() || '{}')
            const apiKey = process.env.GROQ_API_KEY || ''

            const mappedMessages = []
            if (body.system) {
              mappedMessages.push({ role: 'system', content: body.system })
            }
            mappedMessages.push(...(body.messages || []))

            const payload = {
              model: body.model || 'llama-3.1-8b-instant',
              messages: mappedMessages,
              max_tokens: body.max_tokens || 1000,
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
            const text = data?.choices?.[0]?.message?.content || ''

            res.setHeader('Content-Type', 'application/json')
            res.statusCode = upstream.status
            if (!upstream.ok) {
              return res.end(JSON.stringify(data))
            }
            res.end(JSON.stringify({ content: [{ text }], raw: data }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), groqProxyPlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: { output: { manualChunks: { recharts: ['recharts'] } } },
  },
  server: { port: 5173 },
})
