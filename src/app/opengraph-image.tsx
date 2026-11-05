import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const alt = 'Anthony Riley'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Matches the site: hairline grid rules, square corners, General Sans
const INK = '#000000'
const MUTED = 'rgba(0, 0, 0, 0.55)'
const LINE = '#cccccc'

const OUTER = 56
const FRAME_WIDTH = size.width - OUTER * 2
const FRAME_HEIGHT = size.height - OUTER * 2
const COVER_HEIGHT = Math.round((FRAME_WIDTH - 2) / 4) // cover is 4:1 and shown uncropped
const URL_CELL_WIDTH = 380

export default async function OpengraphImage() {
  const [cover, bold, medium] = await Promise.all([
    readFile(path.join(process.cwd(), 'public/images/cover.jpg')),
    readFile(path.join(process.cwd(), 'src/app/GeneralSans-Bold.ttf')),
    readFile(path.join(process.cwd(), 'src/app/GeneralSans-Medium.ttf')),
  ])
  const coverSrc = `data:image/jpeg;base64,${cover.toString('base64')}`

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
            src={coverSrc}
            width={FRAME_WIDTH - 2}
            height={COVER_HEIGHT}
            style={{ width: FRAME_WIDTH - 2, height: COVER_HEIGHT, borderBottom: `1px solid ${LINE}` }}
          />
          <div style={{ display: 'flex', flex: 1, alignItems: 'stretch' }}>
            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                paddingLeft: 56,
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: -2,
                color: INK,
              }}
            >
              Anthony Riley
            </div>
            <div
              style={{
                display: 'flex',
                width: URL_CELL_WIDTH,
                alignItems: 'center',
                justifyContent: 'center',
                borderLeft: `1px solid ${LINE}`,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: MUTED,
              }}
            >
              anthonyriley.org
            </div>
          </div>
          {/* Small square marker where the grid lines meet, like the resume timeline */}
          <div
            style={{
              position: 'absolute',
              top: COVER_HEIGHT - 3,
              left: FRAME_WIDTH - 2 - URL_CELL_WIDTH - 3,
              width: 7,
              height: 7,
              background: INK,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'General Sans', data: bold, weight: 700, style: 'normal' },
        { name: 'General Sans', data: medium, weight: 500, style: 'normal' },
      ],
    },
  )
}
