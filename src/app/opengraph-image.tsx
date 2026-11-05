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
          background: '#ffffff',
        }}
      >
        <img
          src={cover}
          width={1200}
          height={630}
          style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }}
        />
        <img
          src={profile}
          width={280}
          height={280}
          style={{
            position: 'absolute',
            top: 175,
            left: 460,
            width: 280,
            height: 280,
            objectFit: 'cover',
            border: '8px solid #ffffff',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
