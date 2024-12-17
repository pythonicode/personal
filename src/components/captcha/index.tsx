const RenderCaptcha = ({ base64 }: { base64: string }) => {
  return <img src={`data:image/svg+xml;base64,${base64}`} alt="SVG Render" className="svg-image" />
}

export { RenderCaptcha }
