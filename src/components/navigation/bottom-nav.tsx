import NavLink from './nav-link'
import ThemeToggle from './theme-toggle'

const BottomNav = () => {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-background bg-opacity-50 border-border border rounded flex justify-center z-50">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/contact">Contact</NavLink>
      <ThemeToggle />
    </nav>
  )
}

export default BottomNav
