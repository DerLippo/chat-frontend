import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ loggedIn }) => {
  const [headerCollapsed, setHeaderCollapsed] = useState(true);

  const toggleHeaderCollapsed = () => {
    setHeaderCollapsed(prev => !prev);
  };

  return (
    <header className={`header ${headerCollapsed ? 'header--closed' : ''}`}>
      <>
        <svg
          onClick={toggleHeaderCollapsed}
          className={`header__burger ${
            headerCollapsed ? 'header__burger--closed' : ''
          }`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 10 10'
          stroke='#eee'
          strokeWidth='.6'
          fill='rgba(0,0,0,0)'
          strokeLinecap='round'
        >
          <path d='M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7'>
            <animate
              dur='0.2s'
              attributeName='d'
              values='M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7;M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7'
              fill='freeze'
              begin='reverse.begin'
            />
            <animate
              dur='0.2s'
              attributeName='d'
              values='M2,3L5,3L8,3M2,5L8,5M2,7L5,7L8,7;M3,3L5,5L7,3M5,5L5,5M3,7L5,5L7,7'
              fill='freeze'
              begin='start.begin'
            />
          </path>
          <rect width='10' height='10' stroke='none'>
            <animate
              dur='2s'
              id='reverse'
              attributeName='width'
              begin='click'
            />
          </rect>
          <rect width='10' height='10' stroke='none'>
            <animate
              dur='0.001s'
              id='start'
              attributeName='width'
              values='10;0'
              fill='freeze'
              begin='click'
            />
            <animate
              dur='0.001s'
              attributeName='width'
              values='0;10'
              fill='freeze'
              begin='reverse.begin'
            />
          </rect>
        </svg>
      </>
      <nav className='nav-main'>
        <ul className='nav-main__list'>
          {loggedIn ? (
            <>
              <li className='nav-main__list-item nav-main__list-item--mobile'>
                <Link to='/'>Chat</Link>
              </li>
              <li className='nav-main__list-item nav-main__list-item--mobile'>
                <Link to='/settings'>Settings</Link>
              </li>
              <li className='nav-main__list-item nav-main__list-item--mobile'>
                <Link to='/logout'>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li className='nav-main__list-item nav-main__list-item--mobile'>
                <Link to='/login'>Login</Link>
              </li>
              <li className='nav-main__list-item nav-main__list-item--mobile'>
                <Link to='/register'>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
export default Header;
