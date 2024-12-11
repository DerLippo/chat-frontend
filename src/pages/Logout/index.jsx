import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Notification from '../../components/Notification';
import Button from '../../components/Button';

const Logout = () => {
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setNotification({ type: '', message: '' });
    setLoading(true); // Ladezustand aktivieren
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'production'
            ? process.env.REACT_APP_API_URL
            : process.env.REACT_APP_API_URL_DEV
        }/logout`,
        { method: 'POST', credentials: 'include' } // Sendet Cookie mit
      );

      if (!response.ok) throw new Error('Logout fehlgeschlagen.');

      Cookies.remove('loggedIn', { path: '/' });
      setNotification({ type: 'success', message: 'Logout erfolgreich.' });
      navigate('/login'); // Weiterleitung zur Login-Seite
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Fehler beim Logout: ${err.message}`,
      });
    } finally {
      setLoading(false); // Ladezustand deaktivieren
    }
  };

  return (
    <div className='logout'>
      <Notification type={notification.type} message={notification.message} />
      <Button
        className={'logout__button'}
        value={loading ? 'Logging out...' : 'Logout'}
        onClick={handleLogout}
        disabled={loading}
      />
    </div>
  );
};

export default Logout;
