import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

import Input from '../../components/Input';
import Button from '../../components/Button';
import CreateRoom from '../../components/CreateRoom';
import RoomList from '../../components/Chat/RoomList.jsx';
import RoomHeader from '../../components/Chat/RoomHeader.jsx';
import RoomBody from '../../components/Chat/RoomBody.jsx';
import RoomFooter from '../../components/Chat/RoomFooter.jsx';

const ChatLayout = () => {
  const navigate = useNavigate();

  const myUserName = Cookies.get('userName');

  const [isCreateRoomVisible, setIsCreateRoomVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [roomDetails, setRoomDetails] = useState({
    id: '',
    name: '',
    members: [],
    image: '',
  });
  const [roomStats, setRoomStats] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const socketRef = useRef(null); // Ref für die Socket-Instanz

  /* Initialisiere den Socket */
  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_API_URL
        : process.env.REACT_APP_API_URL_DEV,
      {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 5000,
        reconnectionDelayMax: 30000,
      }
    );

    socketRef.current = socket;

    socket.on('connect', () => {
      // console.log('Socket verbunden:', socket.id);
      console.log('Socket verbunden');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      // console.log('Socket getrennt:', socket.id || 'Keine ID verfügbar');
      console.log('Socket getrennt' || 'Keine ID verfügbar');
      setIsConnected(false);
    });

    socket.on('connect_error', err => {
      // console.error('WebSocket-Fehler:', err.message);
      if (err.message === 'Authentication error') {
        console.warn(
          'Authentifizierungsfehler. Weiterleitung zur Login-Seite.'
        );
        Cookies.remove('loggedIn');
        navigate('/login');
      }
    });

    // Cleanup: Trenne Verbindung beim Verlassen
    return () => {
      if (socketRef.current) {
        console.log(
          'Socket wird getrennt' ||
            'Keine Socket-ID verfügbar (vermutlich bereits getrennt)'
        );
        socketRef.current.disconnect();
        socketRef.current = null; // Setze die Referenz auf null, um spätere Konflikte zu vermeiden
      }
    };
  }, [navigate]);

  /* Event-Listener für Erfolgreiches Raum verlassen */
  useEffect(() => {
    const handleExitRoomSuccessfull = () => {
      setRoomId('');
      socketRef.current?.emit('findRooms'); // Lade Raumliste neu
    };
    socketRef.current?.on('exitRoomSuccessfull', handleExitRoomSuccessfull);
    return () => {
      socketRef.current?.off('exitRoomSuccessfull', handleExitRoomSuccessfull);
    };
  }, []);

  /* Räume initial laden */
  useEffect(() => {
    socketRef.current?.emit('findRooms');
    socketRef.current?.on('receiveRooms', data => setRooms(data));
    socketRef.current?.on('error', data => console.log(data)); // To-Do Show Error in UI
    return () => {
      socketRef.current?.off('receiveRooms');
      socketRef.current?.off('error');
    };
  }, [socketRef, setRooms]);

  /* Aktualisiere Online Status */
  useEffect(() => {
    const updateOnlineStatus = setInterval(() => {
      socketRef.current?.emit('updateOnlineStatus', { roomId });
    }, 10000);

    return () => clearInterval(updateOnlineStatus);
  }, [roomId]);

  return (
    <div className='chat'>
      <div className='chat__left'>
        <Input className='chat__search' placeholder='Search' />
        <div className='chat__left-header'>
          <Button
            className={'chat__room-create-button'}
            value='Neuen Raum erstellen'
            onClick={() => setIsCreateRoomVisible(true)}
          />
          <div className='chat__connection'>
            {isConnected ? (
              <div
                className='chat__connection--connected'
                title='Connected'
              ></div>
            ) : (
              <div
                className='chat__connection--disconnected'
                title='Disconnected'
              ></div>
            )}
          </div>
        </div>

        {isCreateRoomVisible && (
          <div className='overlay'>
            <CreateRoom
              myUserName={myUserName}
              onClose={() => setIsCreateRoomVisible(false)}
              onCreate={newRoom =>
                setRooms(prevRooms => [...prevRooms, newRoom])
              }
            />
          </div>
        )}

        <RoomList
          rooms={rooms}
          roomId={roomId}
          myUserName={Cookies.get('userName')}
          socketRef={socketRef}
          setRoomId={setRoomId}
          setTextMessage={setTextMessage}
          setChatMessages={setChatMessages}
          setAllMessagesLoaded={setAllMessagesLoaded}
        />
      </div>
      <div className='chat__main'>
        {Object.keys(roomDetails).length && roomId ? (
          <>
            <RoomHeader roomDetails={roomDetails} myUserName={myUserName} />
            <RoomBody
              myUserName={Cookies.get('userName')}
              roomId={roomId}
              socketRef={socketRef}
              allMessagesLoaded={allMessagesLoaded}
              chatMessages={chatMessages}
              roomStats={roomStats}
              setRoomStats={setRoomStats}
              setRoomDetails={setRoomDetails}
              setChatMessages={setChatMessages}
              setAllMessagesLoaded={setAllMessagesLoaded}
            />
            <RoomFooter
              socketRef={socketRef}
              roomId={roomId}
              textMessage={textMessage}
              setTextMessage={setTextMessage}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
