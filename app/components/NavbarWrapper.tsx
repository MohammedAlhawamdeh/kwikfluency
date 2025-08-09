import Navbar from './Navbar'
import AuthButton from './auth/AuthButton'

export default function NavbarWrapper() {
  return <Navbar authButton={<AuthButton />} />
}
