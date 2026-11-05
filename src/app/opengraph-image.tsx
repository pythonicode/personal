import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const alt = 'Anthony Riley'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Matches the site: hairline grid rules, square corners, General Sans
const INK = '#000000'
const LINE = '#cccccc'

const OUTER = 56
const FRAME_WIDTH = size.width - OUTER * 2
const FRAME_HEIGHT = size.height - OUTER * 2
const COVER_HEIGHT = Math.round((FRAME_WIDTH - 2) / 4) // cover is 4:1 and shown uncropped
const FOOTER_HEIGHT = FRAME_HEIGHT - 2 - COVER_HEIGHT - 1 // inside the frame border and cover rule

const dataUri = (file: Buffer) => `data:image/jpeg;base64,${file.toString('base64')}`

export default async function OpengraphImage() {
  const [cover, profile, medium] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/images/cover.jpg')),
    readFile(path.join(process.cwd(), 'public/images/profile.jpg')),
    readFile(path.join(process.cwd(), 'src/app/GeneralSans-Medium.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: OUTER,
          background: '#ffffff',
          fontFamily: 'General Sans',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            border: `1px solid ${LINE}`,
          }}
        >
          <img
            src={dataUri(cover)}
            width={FRAME_WIDTH - 2}
            height={COVER_HEIGHT}
            style={{ width: FRAME_WIDTH - 2, height: COVER_HEIGHT, borderBottom: `1px solid ${LINE}` }}
          />
          <div style={{ display: 'flex', flex: 1, alignItems: 'stretch' }}>
            <img
              src={dataUri(profile)}
              width={FOOTER_HEIGHT}
              height={FOOTER_HEIGHT}
              style={{
                width: FOOTER_HEIGHT,
                height: FOOTER_HEIGHT,
                objectFit: 'cover',
                borderRight: `1px solid ${LINE}`,
              }}
            />
            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                paddingLeft: 56,
                fontSize: 40,
                fontWeight: 500,
                letterSpacing: 6,
                textTransform: 'uppercase',
                color: INK,
              }}
            >
              anthonyriley.org
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'General Sans', data: medium, weight: 500, style: 'normal' }],
    },
  )
}
