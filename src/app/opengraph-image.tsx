import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const alt = 'Anthony Riley'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const dataUri = async (file: string, mime: string) => {
  const buffer = await readFile(path.join(process.cwd(), 'public/images', file))
  return `data:${mime};base64,${buffer.toString('base64')}`
}

export default async function OpengraphImage() {
  const [cover, profile] = await Promise.all([
    dataUri('cover.jpg', 'image/jpeg'),
    dataUri('profile.jpg', 'image/jpeg'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          background: '#050505',
          color: '#ffffff',
        }}
      >
        <img
          src={cover}
          width={1200}
          height={630}
          style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background:
              'linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.7) 40%, rgba(5,5,5,0.35) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 6,
            background: '#ffffff',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            position: 'absolute',
            left: 96,
            bottom: 96,
          }}
        >
          <img
            src={profile}
            width={220}
            height={220}
            style={{ objectFit: 'cover', border: '4px solid #ffffff' }}
          />
          <div style={{ display: 'flex', marginLeft: 40, marginBottom: 6, fontSize: 96, fontWeight: 800, lineHeight: 1 }}>
            Anthony Riley
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
