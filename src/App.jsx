import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useTokenRefresh } from './hooks/useTokenRefresh';
// import logo from './logo.svg';
import './App.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!Cookies.get('loggedIn'));
  const [userName, setUserName] = useState(Cookies.get('userName'));

  useTokenRefresh();

  // Überwache Änderungen am "loggedIn"-Cookie und "userName"-Cookie
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
              <Route path='/settings' element={<Settings />}></Route>
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
