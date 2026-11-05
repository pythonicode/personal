import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const alt = 'Anthony Riley'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The cover is 1400x350, so at full width it is 300px tall and shown uncropped
const COVER_HEIGHT = 300
const FOOTER_PADDING = 72

export default async function OpengraphImage() {
  const cover = await readFile(path.join(process.cwd(), 'public/images/cover.jpg'))
  const coverSrc = `data:image/jpeg;base64,${cover.toString('base64')}`

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
          src={coverSrc}
          width={1200}
          height={COVER_HEIGHT}
          style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: COVER_HEIGHT }}
        />
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: COVER_HEIGHT,
            left: 0,
            width: 1200,
            height: 630 - COVER_HEIGHT,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: FOOTER_PADDING,
            paddingRight: FOOTER_PADDING,
            color: '#000000',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 44,
              fontWeight: 800,
              textShadow: '1px 0 0 #000000, -1px 0 0 #000000, 0 1px 0 #000000',
            }}
          >
            Anthony Riley
          </div>
          <div style={{ display: 'flex', fontSize: 36, letterSpacing: 3 }}>anthonyriley.org</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
