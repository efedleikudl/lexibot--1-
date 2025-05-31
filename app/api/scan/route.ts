import { NextRequest, NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs/promises'
import path from 'path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import type { IncomingMessage } from 'http'
import fetch from 'node-fetch'

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

async function parseTxt(filePath: string) {
  return await fs.readFile(filePath, 'utf-8')
}

async function parseDocx(filePath: string) {
  const result = await mammoth.extractRawText({ path: filePath })
  return result.value
}

async function parsePdf(filePath: string) {
  const data = await fs.readFile(filePath)
  const result = await pdfParse(data)
  return result.text
}

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm({ multiples: false })
  const tempDir = path.join(process.cwd(), 'tmp')
  await fs.mkdir(tempDir, { recursive: true })

  // Convert NextRequest to Node.js IncomingMessage
  const nodeReq = req as unknown as IncomingMessage

  return new Promise((resolve, reject) => {
    form.parse(nodeReq, async (err: any, fields: any, files: any) => {
      if (err) {
        resolve(NextResponse.json({ error: 'File upload error' }, { status: 400 }))
        return
      }
      const file = files.file
      if (!file || Array.isArray(file)) {
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }))
        return
      }
      const filePath = file.filepath || file.path
      let text = ''
      try {
        if (file.mimetype === 'application/pdf') {
          text = await parsePdf(filePath)
        } else if (
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.originalFilename?.endsWith('.docx')
        ) {
          text = await parseDocx(filePath)
        } else if (file.mimetype === 'text/plain' || file.originalFilename?.endsWith('.txt')) {
          text = await parseTxt(filePath)
        } else {
          resolve(NextResponse.json({ error: 'Unsupported file type' }, { status: 400 }))
          return
        }
        // Send extracted text to OpenAI API (server-side)
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'You are a helpful legal assistant.' },
              { role: 'user', content: text }
            ]
          })
        })
        if (!aiResponse.ok) {
          resolve(NextResponse.json({ error: 'AI API error' }, { status: 500 }))
          return
        }
        const aiResult = await aiResponse.json()
        resolve(NextResponse.json({ result: aiResult }))
      } catch (e) {
        resolve(NextResponse.json({ error: 'Failed to parse file' }, { status: 500 }))
      }
    })
  })
}
