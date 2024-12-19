import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import Image from '../../components/Image';
import CreateRoom from '../../components/CreateRoom';
import Cookies from 'js-cookie';

const Chat = () => {
  const navigate = useNavigate();

  const myUserName = Cookies.get('userName');

  const [isCreateRoomVisible, setIsCreateRoomVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const roomBodyRef = useRef(null);
  const [roomBodyScrollPosition, setRoomBodyScrollPosition] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [roomDetails, setRoomDetails] = useState({
    id: '',
    name: '',
    members: [],
    image: '',
  });

  const [textMessage, setTextMessage] = useState('');
  const [rooms, setRooms] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [roomBodyNeedToScrollDown, setRoomBodyNeedToScrollDown] =
    useState(false); // Neue Nachricht eingetroffen, bitte runterscrollen
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
        // console.log(
        //   'Socket wird getrennt:',
        //   socketRef.current.id ||
        //     'Keine Socket-ID verfügbar (vermutlich bereits getrennt)'
        // );
        console.log(
          'Socket wird getrennt' ||
            'Keine Socket-ID verfügbar (vermutlich bereits getrennt)'
        );
        socketRef.current.disconnect();
        socketRef.current = null; // Setze die Referenz auf null, um spätere Konflikte zu vermeiden
      }
    };
  }, [navigate]);

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

  /* Sende Nachrichten */
  const sendMessage = e => {
    e.preventDefault();

    // Überprüfe ob Enter oder Shift + Enter gedrückt wurde
    if (e.shiftKey === true && e.key === 'Enter') return;

    // Wenn nur Enter, sende Nachricht
    if (e.key === 'Enter') {
      if (!textMessage.trim() || !roomId) return;
      socketRef.current?.emit('sendChatMessage', {
        textMessage,
        roomId,
      });
      setTextMessage('');
    }
  };

  /* Suche älteste Nachricht */
  const getOldestMessage = messages => {
    return messages.reduce(
      (oldest, current) => (current._id < oldest._id ? current : oldest),
      messages[0]
    );
  };

  /* RoomBody Scroll Position tracken Funktion */
  const roomBodyUpdateScrollPosition = el => {
    const scrollPosition =
      el.target.scrollHeight - el.target.offsetHeight - el.target.scrollTop;
    setRoomBodyScrollPosition(scrollPosition);
  };

  /* Räume initial laden */
  useEffect(() => {
    socketRef.current?.emit('findRooms');
    socketRef.current?.on('receiveRooms', data => setRooms(data));
    socketRef.current?.on('error', data => console.log(data)); // To-Do Show Error in UI
    return () => {
      socketRef.current?.off('receiveRooms');
      socketRef.current?.off('error');
    };
  }, []);

  /* Handle neue Nachrichten und Raum Details */
  useEffect(() => {
    if (!roomId) return;

    const handleRoomData = data => {
      setLoadingMessages(true);
      // Überprüfe ob Raum Details vorhanden sind und aktualisiere diese
      if (data.roomDetails) setRoomDetails(data.roomDetails);
      // Überprüfe ob Nachrichten vorhanden sind
      if (!data.roomMessages || data.roomMessages?.length === 0) {
        setAllMessagesLoaded(true);
        setLoadingMessages(false);
        return;
      }

      // Filtere Nachrichten und aktualisiere das Objekt
      setChatMessages(prevMessages => {
        let newMessages = [];

        // Prüfen, ob `roomMessages` ein Array oder ein einzelnes Objekt ist
        if (Array.isArray(data.roomMessages)) {
          newMessages = data.roomMessages;
        } else if (data.roomMessages && typeof data.roomMessages === 'object') {
          newMessages = [data.roomMessages]; // Einzelnes Objekt in ein Array packen
        }

        // Neue Nachrichten anhängen
        const filteredMessages = [...prevMessages, ...newMessages].filter(
          (msg, index, self) => index === self.findIndex(m => m._id === msg._id)
        );

        const sortedMessages = filteredMessages
          .slice()
          .sort((a, b) => a._id.localeCompare(b._id));

        setLoadingMessages(false);
        setRoomBodyNeedToScrollDown(true); // Neue Nachricht eingetroffen, nach unten scrollen erforderlich

        return sortedMessages;
      });
    };

    // Führe Funktion aus wenn das Event getriggered wird.
    socketRef.current?.on('receiveRoomData', handleRoomData);
    return () => {
      socketRef.current?.off('receiveRoomData', handleRoomData);
    };
  }, [roomId, setAllMessagesLoaded, setLoadingMessages]);

  /* RoomBody Scroll nach oben um ältere nachrichten zu laden */
  useEffect(() => {
    if (
      roomId &&
      roomBodyRef.current &&
      !allMessagesLoaded &&
      !loadingMessages
    ) {
      if (roomBodyRef.current.scrollTop === 0) {
        // Oberen Rand erreicht
        const oldestVisibleMessage = getOldestMessage(chatMessages);

        setLoadingMessages(true);
        // Lade ältere nachrichten
        socketRef.current?.emit('loadChatMessagePrevious', {
          roomId: roomId,
          msgId: oldestVisibleMessage?._id,
        });

        // Scroll zur Nachricht
        roomBodyRef.current.scrollTo({
          top: roomBodyRef.current.scrollTop + 5,
          behavior: 'smooth',
        });
      }
    }
  }, [
    roomBodyScrollPosition,
    roomId,
    chatMessages,
    allMessagesLoaded,
    loadingMessages,
  ]);

  /* RoomBody Scroll nach unten wenn neue Nachricht eintrifft und User nicht hochgescrollt hat #UX */
  useEffect(() => {
    if (
      roomBodyNeedToScrollDown === true &&
      roomBodyScrollPosition === 0 &&
      roomBodyRef.current &&
      loadingMessages === false
    ) {
      roomBodyRef.current.scrollTo({
        top: roomBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setRoomBodyNeedToScrollDown(false);
    }
  }, [roomBodyNeedToScrollDown, roomBodyScrollPosition, loadingMessages]);

  /* RoomBody Scroll Position tracken Eventlistener hinzufügen */
  useEffect(() => {
    // Erst wenn RoomId gesetzt darf der Eventlistener hinzugefügt werden
    if (roomId) {
      const roomBodyRefCurrent = roomBodyRef.current;
      if (roomBodyRefCurrent) {
        roomBodyRefCurrent.addEventListener(
          'scroll',
          roomBodyUpdateScrollPosition
        );

        return () => {
          roomBodyRefCurrent.removeEventListener(
            'scroll',
            roomBodyUpdateScrollPosition
          );
        };
      }
    }
  }, [roomId]);

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

                <label
                  htmlFor={`toggle-${el._id}`}
                  className='chat__room-options'
                >
                  ^
                </label>

                <div
                  id={`content-${el._id}`}
                  className='chat__room-options-menu'
                >
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
      </div>
      <div className='chat__main'>
        {Object.keys(roomDetails).length && roomId ? (
          <>
            <div className='chat__main-header'>
              <Image
                alt='Conversation User'
                className='chat__main-header-image'
                src={roomDetails.image ? roomDetails.image : '/user.png'}
              />
              <div className='chat__main-header-info'>
                <span className='chat__main-header-info-name'>
                  {roomDetails.name}
                </span>
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
                          {(Date.now() - new Date(el.activeAt).getTime()) /
                            1000 >
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
            <div id='roomBody' className='chat__main-body' ref={roomBodyRef}>
              {chatMessages.map(el => (
                <div
                  key={el._id}
                  id={`message-${el._id}`}
                  className={`chat__main-body-message ${
                    el.userName !== myUserName
                      ? 'chat__main-body-message--other'
                      : 'chat__main-body-message--me'
                  } `}
                >
                  <span
                    className={`chat__main-body-message-username ${
                      el.userName !== myUserName
                        ? 'chat__main-body-message-username--other'
                        : 'chat__main-body-message-username--me'
                    }`}
                  >
                    {el.userName}
                  </span>
                  {el.contents?.[0]?.content}
                  <span className='chat__main-body-message-datetime'>
                    {new Date(el.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className='chat__main-body-scrolldown'>
                {roomBodyNeedToScrollDown ? '⬇️ New Message ⬇️' : ''}
              </div>
            </div>
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
                  className='chat__main-footer-button'
                  value='➡'
                />
              </form>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Chat;
