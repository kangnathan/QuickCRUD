import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePostContext } from '../context/PostContext'

const useFetchUser = () => {
  const router = useRouter()
  const { dispatch } = usePostContext()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/currentUser')
        if (res.ok) {
          const userData = await res.json()
          dispatch({ type: 'SET_USER', payload: userData })
        } else {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      }
    }
    fetchUser()
  }, [router, dispatch])
}

export default useFetchUser