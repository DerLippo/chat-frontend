import { React, useEffect, useState, useRef } from 'react';

const RoomBody = ({
  chatMessages,
  myUserName,
  roomId,
  socketRef,
  allMessagesLoaded,
  setRoomStats,
  setRoomDetails,
  setChatMessages,
  setAllMessagesLoaded,
}) => {
  const roomBodyRef = useRef(null);
  const [roomBodyNeedToScrollDown, setRoomBodyNeedToScrollDown] =
    useState(false); // Neue Nachricht eingetroffen, bitte runterscrollen
  const [roomBodyScrollPosition, setRoomBodyScrollPosition] = useState(0);

  const [loadingMessages, setLoadingMessages] = useState(true);

  /* Handle neue Nachrichten und Raum Details */
  useEffect(() => {
    if (!roomId) return;

    const handleRoomData = data => {
      setLoadingMessages(true);
      // Überprüfe ob Raum Details vorhanden sind und aktualisiere diese
      if (data.roomDetails) setRoomDetails(data.roomDetails);
      if (data.roomStats) setRoomStats(data.roomStats);
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
  }, [
    socketRef,
    roomId,
    setAllMessagesLoaded,
    setLoadingMessages,
    setRoomDetails,
    setChatMessages,
    setRoomStats,
  ]);

  /* Suche älteste Nachricht */
  const getOldestMessage = messages => {
    return messages.reduce(
      (oldest, current) => (current._id < oldest._id ? current : oldest),
      messages[0]
    );
  };

  /* RoomBody Scroll Position tracken Funktion */
  const roomBodyUpdateScrollPosition = el => {
    if (!el.target) return;
    const scrollPosition =
      el.target.scrollHeight - el.target.offsetHeight - el.target.scrollTop;
    setRoomBodyScrollPosition(scrollPosition);
  };

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
    socketRef,
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
    // Erst wenn RoomId gesetzt ist, darf der Eventlistener hinzugefügt werden
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

  return (
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
  );
};

export default RoomBody;
