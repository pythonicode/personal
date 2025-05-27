'use server'

import { client } from '@/lib/actions'
import { sign } from '@/lib/crypto/signatures'

export const generateCaptcha = client.action(async () => {
  const lower = Math.round((Math.floor(Math.random() * 5) + Math.random()) * 10) / 10
  const upper = Math.round((lower + Math.floor(Math.random() * 5) + 1 + Math.random()) * 10) / 10
  const expression = ['2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'][
    Math.floor(Math.random() * 9)
  ]

  // Create an SVG with the expression
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="100">
      <text x="50%" y="50%" 
            dominant-baseline="middle" 
            text-anchor="middle" 
            font-family="math, serif" 
            font-size="24">
        <tspan x="45%">
          <tspan dx="20" dy="-20" font-size="12">${upper.toFixed(1)}</tspan>
          <tspan dx="-25" dy="40" font-size="12">${lower.toFixed(1)}</tspan>
          <tspan dy="-20" font-size="32">∫</tspan>
        </tspan>
        <tspan dx="5">${expression} dx</tspan>
      </text>
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
