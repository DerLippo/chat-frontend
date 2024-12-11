import { useState } from 'react';

const Settings = () => {
  const [showContent, setShowContent] = useState('general');

  const handleMenuClick = name => {
    if (!name) return;
    setShowContent(name);
  };

  return (
    <div className='settings'>
      <div className='settings__menu'>
        <div
          className='settings__menu-item'
          onClick={() => handleMenuClick('general')}
        >
          General
        </div>
        <div
          className='settings__menu-item'
          onClick={() => handleMenuClick('email')}
        >
          Email
        </div>
        <div
          className='settings__menu-item'
          onClick={() => handleMenuClick('password')}
        >
          Password
        </div>
      </div>
      <div
        className={`settings__content ${
          showContent === 'general'
            ? `settings__content`
            : `settings__content settings__content--hidden`
        }`}
      >
        General
      </div>
      <div
        className={`settings__content ${
          showContent === 'email'
            ? `settings__content`
            : `settings__content settings__content--hidden`
        }`}
      >
        Email
      </div>
      <div
        className={`settings__content ${
          showContent === 'password'
            ? `settings__content`
            : `settings__content settings__content--hidden`
        }`}
      >
        Password
      </div>
    </div>
  );
};
export default Settings;
