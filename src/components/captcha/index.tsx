const RenderCaptcha = ({ base64 }: { base64: string }) => {
  return (
    <div className="flex justify-center border border-border bg-background px-3 py-2">
      <img
        src={`data:image/svg+xml;base64,${base64}`}
        alt="Solve the integral to reveal the email address"
        className="svg-image h-auto w-full max-w-[240px] dark:invert"
      />
    </div>
  )
}

export { RenderCaptcha }
