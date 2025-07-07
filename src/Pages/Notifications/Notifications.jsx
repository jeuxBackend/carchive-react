import React from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import { getNotifications } from '../../API/portalServices'

function Notifications() {
    const {theme} = useTheme()
    const getNotificationsApi = async () =>{
        const response = getNotifications()
    }
  return (
    <div>Notifications</div>
  )
}

export default Notifications