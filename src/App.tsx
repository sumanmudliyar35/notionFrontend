import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { notification } from 'antd';
import Home from './pages/home/home';
import Leads from './pages/leads/Leads';
import Login from './pages/login/Login';
import Layout from './components/layout/Layout';
import Admin from './pages/admin/Admin';
import Notification from './pages/notification/Notification';
import type { NotificationArgsProps } from 'antd';
import Tasks from './pages/tasks/Tasks';
import RecursiveTask from './pages/recursiveTask/RecursiveTask';
import Dashboard from './pages/dashboard/Dashboard';
import './customApp.css'; // Import your CSS file
import { useGetReminderByUser } from './api/get/getReminderByUser';
import { io } from 'socket.io-client';
import Logs from './pages/logs/Logs';


type NotificationPlacement = NotificationArgsProps['placement'];

const notificationSound = new Audio('/info.mp3'); // Use public path

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [canPlaySound, setCanPlaySound] = useState(false);

  

  const userid = localStorage.getItem('userid');

  const openNotification = (message: string, placement: NotificationPlacement,PlaySound: boolean ) => {
    api.info({
      message: message,
      placement: placement,
      duration: 0, // Stays until user closes

    });

    console.log('Notification opened:', message, PlaySound == true, PlaySound);
    if (PlaySound == true) {
      notificationSound.currentTime = 0;
      notificationSound.volume = 1;
notificationSound.muted = false;
      console.log('Playing sound');
      notificationSound.play().catch(() => {});
      notificationSound.play().catch((err) => {
  console.error('Audio play error:', err);
});

    }
  };







  const socket = useRef(io('https://api.zealweb.in/', {
    query: {
      userId: userid
    }
  })).current;





  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('reminder', (data) => {
  console.log('Reminder received:', data.userId, userid, data.userId == userid);
  if (data.userId == userid) {
    openNotification(data.message || 'Reminder Notification', 'topRight', true);
  }
});

socket.on('serverMessage', (data) => {
  console.log('Received from server:', data);
  // openNotification(data.message || 'Notification from server', 'topRight', true);
});

socket.on('message', (msg) => {
  console.log('Received:', msg);
});



 
  return (
    <>
      {contextHolder}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/notifications" element={<Notification />} />
            {/* <Route path="/tasks" element={<Tasks />} /> */}
            <Route path="/user/:userid/task" element={<Tasks />} />
            <Route path="/user/:userid/recursive-task" element={<RecursiveTask />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logs" element={<Logs/>}/>

            
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
