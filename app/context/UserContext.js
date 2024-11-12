import React, { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null) // Store the entire user object

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/currentUser') // Ensure this matches your actual API route
        const data = await response.json()

        if (response.ok) {
          setUserData(data.user || { error: 'Unknown User' }) // Set full user data or fallback if undefined
        } else {
          console.error('Failed to fetch user data:', data.error)
          setUserData({ error: 'Unknown User' }) // Default on error
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setUserData({ error: 'Unknown User' }) // Default on fetch error
      }
    }

    fetchUserData()
  }, [])

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
