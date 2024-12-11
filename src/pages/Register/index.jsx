import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Notification from '../../components/Notification';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    setLoading(true); // Ladezustand aktivieren

    if (!username || !email || !password) {
      setNotification({
        type: 'error',
        message: `Bitte fülle alle Felder aus.`,
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
        }/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) throw new Error(`Es trat ein Fehler auf.`);

      setNotification({
        type: 'success',
        message: 'Du hast dich erfolgreich registriert.',
      });
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/login');
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Es trat ein Fehler auf: ${err.message}`,
      });
    } finally {
      setLoading(false); // Ladezustand deaktivieren
    }
  };

  return (
    <div className='register'>
      <Notification type={notification.type} message={notification.message} />
      <form className='register__form' action='#' onSubmit={handleSubmit}>
        <Input
          className='register__form-input'
          type='text'
          placeholder='Username'
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          className='register__form-input'
          type='email'
          placeholder='Email'
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          className='register__form-input'
          type='password'
          placeholder='Password'
          onChange={e => setPassword(e.target.value)}
        />{' '}
        <Button
          className='register__form-button'
          value={loading ? 'Registering...' : 'Register'}
          disabled={loading}
        />
        <Link to='/account-recovery'>Reset Password</Link>
      </form>
    </div>
  );
};

export default Register;
