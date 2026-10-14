import NavLink from './nav-link'
import ThemeToggle from './theme-toggle'

const BottomNav = () => {
  return (
    <nav className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 justify-center rounded border border-border bg-background bg-opacity-50">
      <span aria-hidden className="card-edge-shine" style={{ animationDuration: '9s' }} />
      <NavLink href="/#home">Home</NavLink>
      <NavLink href="/#resume">Resume</NavLink>
      <NavLink href="/#posts">Posts</NavLink>
      <NavLink href="/#projects">Projects</NavLink>
      <ThemeToggle />
    </nav>
  )
}

export default BottomNav
