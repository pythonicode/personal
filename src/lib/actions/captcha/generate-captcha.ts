'use server'

import { client } from '@/lib/actions'
import { sign } from '@/lib/crypto/signatures'

export const generateCaptcha = client.action(async () => {
  const lower = Math.round((Math.floor(Math.random() * 5) + Math.random()) * 10) / 10
  const upper = Math.round((lower + Math.floor(Math.random() * 5) + 1 + Math.random()) * 10) / 10
  const expression = ['2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'][
    Math.floor(Math.random() * 9)
  ]

  // Create an SVG with the expression. Each piece is placed explicitly so the
  // limits sit at the top and bottom of the integral sign, with the integrand after it.
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"
         font-family="'STIX Two Math', 'Cambria Math', 'Times New Roman', serif" fill="#000">
      <text x="131" y="36" font-size="16" text-anchor="middle">${upper.toFixed(1)}</text>
      <text x="131" y="114" font-size="16" text-anchor="middle">${lower.toFixed(1)}</text>
      <text x="108" y="90" font-size="58" text-anchor="middle">∫</text>
      <text x="146" y="80" font-size="26">${expression} <tspan font-style="italic" dx="2">dx</tspan></text>
    </svg>
  `.trim()

  const answer = ((upper * upper - lower * lower) * parseInt(expression)) / 2

  // Convert string to UTF-8 then to base64
  const base64 = Buffer.from(svg).toString('base64')
  const signedAnswer = sign(answer.toFixed(2).toString())

  return {
    base64,
    signedAnswer,
  }
})
