import React from 'react';
import Button from '../Button';
import Textarea from '../Textarea';

const RoomFooter = ({ socketRef, roomId, textMessage, setTextMessage }) => {
  /* Sende Nachrichten */
  const sendMessage = e => {
    e.preventDefault();

    // Überprüfe ob Enter oder Shift + Enter gedrückt wurde
    if (e.shiftKey === true && e.key === 'Enter') return;

    // Wenn nur Enter, sende Nachricht
    if (e.key === 'Enter' || e.target.id === 'sendMessageButton') {
      if (!textMessage.trim() || !roomId) return;
      socketRef.current?.emit('sendChatMessage', {
        textMessage,
        roomId,
      });
      setTextMessage('');
    }
  };

  return (
    <div className='chat__main-footer'>
      <Button
        className='chat__main-footer-button chat__main-footer-button--hidden'
        value='🙂'
      />
      <form onSubmit={sendMessage}>
        <Textarea
          className='chat__main-footer-textarea'
          value={textMessage}
          onChange={e => {
            setTextMessage(e.target.value);
          }}
          onKeyUp={e => sendMessage(e)}
        />
        <Button
          type='submit'
          id='sendMessageButton'
          className='chat__main-footer-button'
          value='➡'
          onClick={sendMessage}
        />
      </form>
    </div>
  );
};

export default RoomFooter;
