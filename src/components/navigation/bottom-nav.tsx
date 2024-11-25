import NavLink from './nav-link'
import ThemeToggle from './theme-toggle'

const BottomNav = () => {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-950 border dark:border-neutral-700 rounded bg-opacity-90 flex justify-center">
      <NavLink href="/">Home</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/contact">Contact</NavLink>
      <ThemeToggle />
    </nav>
  )
}

export default BottomNav
