// import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'
import { withContentCollections } from '@content-collections/next'

const nextConfig: NextConfig = {
  // Your Next.js config here
}

export default withContentCollections(nextConfig)
