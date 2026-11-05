import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const alt = 'Anthony Riley'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const photo = await readFile(path.join(process.cwd(), 'public/images/profile.jpg'))
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '96px 110px',
          background: '#ffffff',
          color: '#000000',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 92, fontWeight: 800, lineHeight: 1 }}>
            Anthony Riley
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 36,
              color: '#666666',
            }}
          >
            Athlete · Developer · Entrepreneur
          </div>
        </div>
        <img
          src={photoSrc}
          width={280}
          height={280}
          style={{ objectFit: 'cover', border: '1px solid #000000' }}
        />
      </div>
    ),
    { ...size },
  )
}
