import { getUser } from '@/app/lib/actions/auth'
import AuthButtonClient from './AuthButtonClient'

export default async function AuthButton() {
  const user = await getUser()
  
  return <AuthButtonClient user={user} />
}
