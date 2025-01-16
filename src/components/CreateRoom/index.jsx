import { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import Notfication from '../Notification';

const CreateRoom = ({ myUserName, onClose, onCreate }) => {
  const [roomName, setRoomName] = useState('');
  const [memberNames, setMemberNames] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });

  const handleInput = function (e) {
    const inputValue = e.target.value;
    const membersArray = inputValue.split(',').map(name => name.trim());

    // Prüfe ob der eigen username enthalten ist
    if (!membersArray.includes(myUserName)) {
      const updatedMembers = [myUserName, ...membersArray];
      setMemberNames(updatedMembers.join(', '));
    } else {
      setMemberNames(inputValue);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!roomName.trim() || !memberNames.trim()) {
      setNotification({
        type: 'error',
        message: 'Bitte Raumname und Mitglieder eingeben.',
      });
      return;
    }

    const membersArray = memberNames.split(',').map(name => name.trim());

    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'production'
            ? process.env.REACT_APP_API_URL
            : process.env.REACT_APP_API_URL_DEV
        }/createRoom`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: roomName, members: membersArray }),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Raum konnte nicht erstellt werden.`
        );
      }

      const newRoom = await response.json();
      setNotification({
        type: 'success',
        message: 'Raum erfolgreich erstellt.',
      });
      onCreate(newRoom.room);
      onClose();
    } catch (err) {
      setNotification({ type: 'error', message: `Fehler: ${err.message}` });
    }
  };

  return (
    <div className='createRoom'>
      <Notfication type={notification.type} message={notification.message} />
      <form onSubmit={handleSubmit} className='createRoom__form'>
        <Input
          className='createRoom__input'
          placeholder='Raumname'
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
        />

        <Input
          className='createRoom__input'
          placeholder='Mitglieder (Nutzername Getrennt durch ",")'
          value={memberNames}
          onChange={handleInput}
        />
        <Button
          type='submit'
          value='Raum erstellen'
          className='createRoom__button'
        />
        <Button
          onClick={onClose}
          value='Abbrechen'
          className='createRoom__button'
        />
      </form>
    </div>
  );
};

export default CreateRoom;
