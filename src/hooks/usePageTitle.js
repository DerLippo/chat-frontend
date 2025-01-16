import { useState, useEffect } from 'react';

const usePageTitle = function ({ state }) {
  const [title, setTitle] = useState(document.title); // Standard Title vom Dokument
  const [titleStates, setTitleStates] = useState({
    default: '',
    loggedOut: 'Ausgeloggt',
    loggedIn: 'Eingeloggt',
    newMessage: 'Neue Nachricht',
    inactive: 'Inaktiv',
  });
  const [titleCurrentState, setTitleCurrentState] = useState('default');

  useEffect(
    function () {
      if (
        state &&
        titleStates.hasOwnProperty(state) &&
        titleCurrentState !== state
      ) {
        const newTitle = title + ' - ' + titleStates[state];
        document.title = newTitle;
        setTitleCurrentState(state);
      }
    },
    [title, titleStates, titleCurrentState, state]
  );
};

export default usePageTitle;
