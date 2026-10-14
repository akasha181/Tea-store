import { Header } from './Header'
import type { HeaderProps } from './Header'

export type NavbarProps = HeaderProps

export const Navbar: React.FC<NavbarProps> = (props) => {
  return <Header {...props} />
}

export { Header }
