import React, { useEffect, useState } from 'react'
import { useTheme } from '../../Contexts/ThemeContext'

const Switch = ({ value, setValue, fieldKey }) => {
  const { theme } = useTheme()
  const [isChecked, setIsChecked] = useState(value?.[fieldKey] === "1")

  useEffect(() => {
    setIsChecked(value?.[fieldKey] === "1")
  }, [value, fieldKey])

  const handleCheckboxChange = () => {
    const newCheckedState = !isChecked
    setIsChecked(newCheckedState)
    setValue(prev => ({ ...prev, [fieldKey]: newCheckedState ? "1" : "0" }))
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
        <div
          className={`block h-7 w-12 rounded-full transition ${
            isChecked ? 'bg-blue-500' : theme === 'dark' ? 'bg-[#1b1c1e]' : 'bg-[#f7f7f7]'
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform duration-300 transform shadow-md ${
            isChecked ? 'translate-x-5' : ''
          }`}
        ></div>
      </div>
    </label>
  )
}

export default Switch
