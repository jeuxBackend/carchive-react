import React from 'react';
import { useTheme } from '../../Contexts/ThemeContext';

const InsuranceSwitch = ({ checked = false, disabled = false, onChange }) => {
  const { theme } = useTheme();

  return (
    <label className='flex cursor-pointer select-none items-center'>
      <div className='relative'>
        <input
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className='sr-only'
          disabled={disabled}
        />
        <div className={`block h-8 w-14 rounded-full transition ${checked ? 'bg-blue-500' : (theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7]")}`}></div>
        <div
          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform duration-300 transform shadow-md ${
            checked ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};

export default InsuranceSwitch;