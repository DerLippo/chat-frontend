import { useEffect } from 'react';
import Cookies from 'js-cookie';

export const useTokenRefresh = () => {
  useEffect(() => {
    const refreshAuthToken = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NODE_ENV === 'production'
              ? process.env.REACT_APP_API_URL
              : process.env.REACT_APP_API_URL_DEV
          }/refresh-token`,
          {
            method: 'POST',
            credentials: 'include', // Cookie wird automatisch mitgesendet
          }
        );
        const loggedIn = !!Cookies.get('loggedIn');
        if (!response.ok && loggedIn) {
          Cookies.remove('loggedIn');
          window.location.href = '/login';
          throw new Error('Token-Erneuerung fehlgeschlagen');
        }
      } catch (err) {
        console.error('Token konnte nicht erneuert werden:', err);
      }
    };

    // Intervall zur Token-Erneuerung
    const interval = setInterval(() => {
      refreshAuthToken();
    }, 29 * 60 * 1000); // Token kurz vor Ablauf erneuern (alle 29 Minuten)

    return () => clearInterval(interval); // Cleanup
  }, []);
};
