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
import { useQueryClient } from 'react-query';


type NotificationPlacement = NotificationArgsProps['placement'];

const notificationSound = new Audio('/info.mp3'); // Use public path

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [canPlaySound, setCanPlaySound] = useState(false);


    const queryClient = useQueryClient();

  

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
      notificationSound.play().catch(() => {});
      notificationSound.play().catch((err) => {
  console.error('Audio play error:', err);
});

    }
  };








  // const backendUrl = 'https://backendapi.zealweb.in/';
  const backendUrl = 'http://localhost:2432/';

  const socket = useRef(io(backendUrl, {
  query: { userId: userid },
transports: ['polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
})).current;





  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      console.log('Connected to Socket.IO server');
    };

    const onReminder = (data: any) => {
      console.log('Reminder event data:', data);
      if (String(data.userId) === String(userid)) {
        openNotification(data.message || 'Reminder Notification', 'topRight', true);

         if (userid) {
          queryClient.invalidateQueries(['mentionByUser', Number(userid)]);
        }
      }
    };

    const onServerMessage = (data: any) => {
      console.log('Received from server:', data);
    };

    const onMessage = (msg: any) => {
      console.log('Received:', msg);
    };

    socket.on('connect', onConnect);
    socket.on('reminder', onReminder);
    socket.on('serverMessage', onServerMessage);
    socket.on('message', onMessage);

    // Optional: Remove onAny if not needed
    // socket.onAny((event, ...args) => { ... });

    return () => {
      socket.off('connect', onConnect);
      socket.off('reminder', onReminder);
      socket.off('serverMessage', onServerMessage);
      socket.off('message', onMessage);
      socket.disconnect();
    };
  }, [socket, userid]);

 
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
