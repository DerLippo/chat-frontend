import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Notification from '../../components/Notification';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    setLoading(true); // Ladezustand aktivieren

    if (!username || !password) {
      setNotification({
        type: 'error',
        message: 'Bitte alle Felder ausfüllen.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'production'
            ? process.env.REACT_APP_API_URL
            : process.env.REACT_APP_API_URL_DEV
        }/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login fehlgeschlagen.');

      Cookies.set('loggedIn', true, { path: '/' });
      Cookies.set('userName', data.name, { path: '/' });
      setNotification({ type: 'success', message: 'Login erfolgreich.' });
      setUsername('');
      setPassword('');

      navigate('/chat');
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Login fehlgeschlagen: ${err.message}`,
      });
    } finally {
      setLoading(false); // Ladezustand deaktivieren
    }
  };

  return (
    <div className='login'>
      <Notification type={notification.type} message={notification.message} />
      <form className='login__form' action='#' onSubmit={handleSubmit}>
        <Input
          className='login__form-input'
          type='text'
          placeholder='Username'
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          className='login__form-input'
          type='password'
          placeholder='Password'
          onChange={e => setPassword(e.target.value)}
        />{' '}
        <Button
          className='login__form-button'
          value={loading ? 'Logging in...' : 'Login'}
          disabled={loading}
        />
        <Link to='/account-recovery'>Reset Password</Link>
      </form>
    </div>
  );
};

export default Login;
