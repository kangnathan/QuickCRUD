import { useCallback } from 'react'
import axios from 'axios'
import { usePostContext } from '../context/PostContext'

const useFetchPosts = (user, startDate, endDate) => {
  const { dispatch } = usePostContext()

  return useCallback(async () => {
    if (!user) return
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const { data } = await axios.get('/api/currentUserPosts', {
        params: { startDate: startDate || '', endDate: endDate || '' }
      })
      dispatch({ type: 'SET_POSTS', payload: data.posts })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error fetching posts.' })
    }
  }, [user, startDate, endDate, dispatch])
}

export default useFetchPosts