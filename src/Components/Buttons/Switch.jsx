import React, { useState } from 'react'
import { useTheme } from '../../Contexts/ThemeContext'


const Switch = () => {
  const [isChecked, setIsChecked] = useState(false)
  const {theme} = useTheme()

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <label className='flex cursor-pointer select-none items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          className='sr-only'
        />
        <div className={`block h-8 w-14 rounded-full transition ${isChecked ? 'bg-blue-500' :(theme==="dark"?"bg-[#1b1c1e]":"bg-[#f7f7f7]")}`}></div>
        <div
          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-300 transform shadow-md ${
            isChecked ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
    </label>
  )
}

export default Switch
