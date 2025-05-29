import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); 
  };

  return (
    <div className='flex gap-2 m-2'>
      <button className='border p-2 border-black' onClick={() => changeLanguage('en')}>English</button>
      <button className='border p-2 border-black' onClick={() => changeLanguage('fr')}>French</button>
      <button className='border p-2 border-black' onClick={() => changeLanguage('nl')}>Dutch</button>
    </div>
  );
};

export default LanguageSwitcher;
