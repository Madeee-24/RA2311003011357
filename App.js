import { useEffect, useState } from 'react';
import './App.css';

const NOTIFICATION_API = 'http://20.207.122.201/evaluation-service/notifications';

const typeWeight = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'placement':
      return 3;
    case 'result':
      return 2;
    case 'events':
      return 1;
    default:
      return 0;
  }
};

function App() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch(NOTIFICATION_API);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Notifications API response:', data);

        const rawNotifications = Array.isArray(data)
          ? data
          : Array.isArray(data.notifications)
          ? data.notifications
          : [];

        const sortedNotifications = rawNotifications
          .slice()
          .sort((a, b) => typeWeight(b.type) - typeWeight(a.type));

        setNotifications(sortedNotifications.slice(0, 10));
        setError(null);
      } catch (fetchError) {
        console.error('Error fetching notifications:', fetchError);
        setNotifications([]);
        setError(fetchError.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Campus Notifications</h1>
        <p>Latest hiring, results, and events updates.</p>
      </header>

      {loading && <p>Loading notifications…</p>}

      {error && (
        <div className="notification-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <ul className="notification-list">
        {notifications.length === 0 && !loading && !error && (
          <li>No notifications available.</li>
        )}

        {notifications.map((notification, index) => (
          <li key={notification.id || index} className="notification-item">
            <span className="notification-type">{notification.type || 'unknown'}</span>
            <span className="notification-title">
              {notification.title || notification.message || 'Untitled notification'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
