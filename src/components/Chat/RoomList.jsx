import React from 'react';
import Button from '../Button';
import Image from '../Image';

const RoomList = ({
  rooms,
  roomId,
  myUserName,
  socketRef,
  setRoomId,
  setTextMessage,
  setChatMessages,
  setAllMessagesLoaded,
}) => {
  /* Trete Raum bei */
  const enterRoom = id => {
    if (!id) return;
    setRoomId(id);
    setTextMessage('');
    setChatMessages([]);
    setAllMessagesLoaded(false);
    socketRef.current?.emit('enterRoom', { roomId: id });
  };

  /* Verlasse den Raum Permanent */
  const exitRoom = id => {
    if (!id) return;
    socketRef.current?.emit('exitRoom', { roomId: id });
  };
  return (
    <div className='chat__room-list'>
      {rooms.map(el => (
        <div
          key={el._id}
          className={`chat__room ${
            el.id === roomId ? 'chat__room--active' : ''
          } ${el.dateRead ? '' : 'chat__room--unread'}`}
          onClick={() => enterRoom(el._id)}
        >
          <Image
            alt='Conversation User'
            className='chat__room-image'
            src={el.image ? el.image : '/user.png'}
          />
          <div className='chat__room-preview'>
            <input
              type='checkbox'
              id={`toggle-${el._id}`}
              className='chat__room-options-checkbox'
            />

            <label htmlFor={`toggle-${el._id}`} className='chat__room-options'>
              ^
            </label>

            <div id={`content-${el._id}`} className='chat__room-options-menu'>
              <div className='chat__room-options-menu-item'>
                <Button
                  value={'Raum verlassen'}
                  onClick={() => exitRoom(el._id)}
                />
              </div>
            </div>
            <span className='chat__room-preview-name'>{el.name}</span>
            <span className='chat__room-preview-text'>
              {el.lastMessage ? (
                <>
                  <span
                    className={
                      el.lastMessage.userName === myUserName
                        ? 'chat__room-preview-text--me'
                        : 'chat__room-preview-text--other'
                    }
                  >
                    {el.lastMessage.userName + ':'}
                  </span>
                  {el.lastMessage.contents?.[0]?.content || ''}
                </>
              ) : (
                ''
              )}
            </span>
            <span className='chat__room-preview-date'>
              {el.lastMessage
                ? new Date(el.lastMessage.createdAt).toLocaleString()
                : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
