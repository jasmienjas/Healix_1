import React, { useState } from 'react';
import { FaBell, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

function Notifications() {
  // Sample notifications data with reminder notifications
  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Your appointment with Dr. Ahmad has been confirmed for tomorrow at 3:00 PM.',
      time: '2 hours ago',
      isRead: false,
      actionText: 'Confirm Appointment',
    },
    {
      id: 2,
      type: 'alert',
      message: 'You have a new message from Dr. Mustafa regarding your medical test results.',
      time: '1 day ago',
      isRead: true,
      actionText: 'View Message',
    },
    {
      id: 3,
      type: 'success',
      message: 'Your profile information has been updated successfully.',
      time: '3 days ago',
      isRead: false,
      actionText: 'View Profile',
    },
    {
      id: 4,
      type: 'reminder',
      message: 'Take your medication: Aspirin 100mg',
      time: '12:00 PM',
      isRead: false,
      actionText: 'Dismiss Reminder',
    },
    {
      id: 5,
      type: 'reminder',
      message: 'Your appointment with Dr. Jessica is in 30 minutes.',
      time: '2:30 PM',
      isRead: false,
      actionText: 'Confirm Appointment',
    },
  ];

  // State to manage notifications
  const [notificationsState, setNotificationsState] = useState(notifications);

  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notificationsState.map((notification) =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    setNotificationsState(updatedNotifications);
  };

  // Dismiss a reminder notification
  const dismissReminder = (id) => {
    const updatedNotifications = notificationsState.filter(
      (notification) => notification.id !== id
    );
    setNotificationsState(updatedNotifications);
  };

  // Count unread notifications
  const unreadCount = notificationsState.filter((notification) => !notification.isRead).length;

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">
        Notifications {unreadCount > 0 && <span className="text-red-500">({unreadCount} Unread)</span>}
      </h1>
      
      <div className="space-y-4">
        {notificationsState.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card p-4 rounded-lg ${notification.isRead ? 'bg-gray-200' : 'bg-blue-100'} 
              ${notification.type === 'alert' ? 'border-l-4 border-red-500' : ''}
              ${notification.type === 'info' ? 'border-l-4 border-blue-500' : ''}
              ${notification.type === 'success' ? 'border-l-4 border-green-500' : ''}
              ${notification.type === 'reminder' ? 'border-l-4 border-yellow-500' : ''}
            `}
          >
            <div className="flex justify-between items-center">
              <div className="flex flex-col text-left">
                <p className="font-semibold">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
              </div>
              <div>
                {!notification.isRead && (
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              {notification.type === 'reminder' && !notification.isRead && (
                <button
                  onClick={() => dismissReminder(notification.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full"
                >
                  {notification.actionText}
                </button>
              )}
              {(notification.type === 'info' || notification.type === 'alert') && !notification.isRead && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                  {notification.actionText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
