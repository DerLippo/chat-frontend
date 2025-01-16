import React from 'react';
import Image from '../Image';

const RoomHeader = ({ roomDetails, myUserName }) => {
  return (
    <div className='chat__main-header'>
      <Image
        alt='Conversation User'
        className='chat__main-header-image'
        src={roomDetails.image ? roomDetails.image : '/user.png'}
      />
      <div className='chat__main-header-info'>
        <span className='chat__main-header-info-name'>{roomDetails.name}</span>
        <div className='chat__main-header-info-user'>
          {roomDetails.members.length > 0
            ? roomDetails.members.map(el => (
                <span
                  key={el._id || el.userName}
                  className={
                    el.userName === myUserName
                      ? 'chat__main-header-info-user--me'
                      : 'chat__main-header-info-user--other'
                  }
                >
                  {(Date.now() - new Date(el.activeAt).getTime()) / 1000 >
                  30 ? (
                    <>
                      <div
                        className='chat__main-header-info-user--offline'
                        title={new Date(el.activeAt).toLocaleString()}
                      ></div>
                      {el.userName}
                    </>
                  ) : (
                    <>
                      <div
                        className='chat__main-header-info-user--online'
                        title={new Date(el.activeAt).toLocaleString()}
                      ></div>
                      {el.userName}
                    </>
                  )}
                </span>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
