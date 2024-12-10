import React from 'react'
import sanitizeHtml from 'sanitize-html'

interface Props {
  htmlContent: string
}

export const HtmlRenderer: React.FC<Props> = ({ htmlContent }) => {
  const sanitizedHtml = sanitizeHtml(htmlContent)
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}
