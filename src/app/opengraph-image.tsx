import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const alt = 'Anthony Riley'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BAND_HEIGHT = 120

export default async function OpengraphImage() {
  const cover = await readFile(path.join(process.cwd(), 'public/images/cover.jpg'))
  const coverSrc = `data:image/jpeg;base64,${cover.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#ffffff',
        }}
      >
        <img
          src={coverSrc}
          width={1200}
          height={630 - BAND_HEIGHT}
          style={{ width: 1200, height: 630 - BAND_HEIGHT, objectFit: 'cover' }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 72,
            width: '100%',
            height: BAND_HEIGHT,
            fontSize: 40,
            letterSpacing: 3,
            color: '#000000',
          }}
        >
          anthonyriley.org
        </div>
      </div>
    ),
    { ...size },
  )
}
