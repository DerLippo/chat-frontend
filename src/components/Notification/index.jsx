const Notification = ({ type, message }) => {
  if (!message) return null;

  const notificationClass = `notification ${
    type === 'error' ? 'notification--error' : 'notification--success'
  }`;

  return <div className={notificationClass}>{message}</div>;
};

export default Notification;
