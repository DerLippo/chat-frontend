import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTokenRefresh } from './hooks/useTokenRefresh';
// import logo from './logo.svg';
import './App.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import Chat from './pages/Chat';
import Logout from './pages/Logout';
import Login from './pages/Login';
import Register from './pages/Register';
import usePageTitleRefresh from './hooks/usePageTitle';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('loggedIn'));
  const [userName, setUserName] = useState(Cookies.get('userName'));

  // Hooks
  useTokenRefresh();
  usePageTitleRefresh({ state: !loggedIn ? 'loggedOut' : 'loggedIn' });

  // Überwache Änderungen am "loggedIn"-Cookie und "userName"-Cookie
  // Wenn ausgeloggt -> Ändere Title Tag
  useEffect(() => {
    const interval = setInterval(() => {
      const isLoggedInCookie = !!Cookies.get('loggedIn');
      const isUserNameCookie = Cookies.get('userName');

      if (isLoggedInCookie !== loggedIn) {
        setLoggedIn(isLoggedInCookie);
      }

      if (!isUserNameCookie !== userName) {
        setUserName(isUserNameCookie);
      }
    }, 6000);

    return () => clearInterval(interval); // Verhindert Memory Leaks
  }, [loggedIn, userName]);
  return (
    <div className='App'>
      <BrowserRouter>
        <Header loggedIn={loggedIn} />
        <Routes>
          {!loggedIn ? (
            <>
              <Route path='*' element={<Login />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/register' element={<Register />}></Route>
            </>
          ) : (
            <>
              <Route path='*' element={<Chat />}></Route>
              <Route path='/chat' element={<Chat />}></Route>
              <Route path='/logout' element={<Logout />}></Route>
            </>
          )}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
