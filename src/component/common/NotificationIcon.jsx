import React from 'react';

const NotificationIcon = ({ notificationCount }) => {

    if(!notificationCount || notificationCount == 0) {
        return
    }
  return (
      <div className="absolute -top-2 -right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
        {notificationCount}
      </div>
  );
};

export default NotificationIcon;
