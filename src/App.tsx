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

type NotificationPlacement = NotificationArgsProps['placement'];

const notificationSound = new Audio('/info.mp3'); // Use public path

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [canPlaySound, setCanPlaySound] = useState(false);

  

  const openNotification = (message: string, placement: NotificationPlacement) => {
    api.info({
      message: message,
      placement: placement,
      duration: 0, // Stays until user closes

    });
    if (canPlaySound) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});
    }
  };

  const userid = localStorage.getItem('userid');
  const wsUrl = userid
    ? `wss://api.zealweb.in/?userId=${userid}`
    : 'wss://api.zealweb.in/';

  // useEffect(() => {
  //   let ws: WebSocket | null = null;
  //   let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  //   const connect = () => {
  //     ws = new WebSocket(wsUrl);


  //     ws.onopen = () => {
  //       console.log('WebSocket connected');
  //     };

  //     ws.onmessage = (event) => {
  //       try {
  //         const data = JSON.parse(event.data);
  //         openNotification(data.message || 'Notification', 'topRight');
  //       } catch {
  //         openNotification(String(event.data), 'topRight');
  //       }
  //     };

  //     // ws.onclose = () => {
  //     //   console.log('WebSocket disconnected, attempting to reconnect...');
  //     //   reconnectTimeout = setTimeout(connect, 3000);
  //     // };

  //     // ws.onerror = (error) => {
  //     //   console.error('WebSocket error:', error);
  //     //   ws?.close();
  //     // };
  //   };

  //   connect();

  //   return () => {
  //     ws?.close();
  //     if (reconnectTimeout) clearTimeout(reconnectTimeout);
  //   };
  //   // eslint-disable-next-line
  // }, [wsUrl]);

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

            
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
