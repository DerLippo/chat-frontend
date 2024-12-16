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
          const error = await response.json();
          throw new Error(error.message || 'Token-Erneuerung fehlgeschlagen');
        }
      } catch (err) {
        console.error('Token konnte nicht erneuert werden:', err);
      }
    };

    // Intervall zur Token-Erneuerung
    const interval = setInterval(() => {
      refreshAuthToken();
    }, 30 * 60 * 1000); // Token regelmäßig erneuern (alle 30 Minuten)

    return () => clearInterval(interval); // Cleanup
  }, []);
};
