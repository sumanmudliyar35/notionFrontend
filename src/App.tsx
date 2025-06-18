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

type NotificationPlacement = NotificationArgsProps['placement'];

const notificationSound = new Audio('/info.mp3'); // Use public path

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [canPlaySound, setCanPlaySound] = useState(false);

  // Enable sound after first user interaction
  useEffect(() => {
    const enableSound = () => setCanPlaySound(true);
    window.addEventListener('click', enableSound, { once: true });
    window.addEventListener('keydown', enableSound, { once: true });
    return () => {
      window.removeEventListener('click', enableSound);
      window.removeEventListener('keydown', enableSound);
    };
  }, []);

  const openNotification = (message: string, placement: NotificationPlacement) => {
    api.info({
      message: message,
      placement: placement,
    });
    console.log('Notification:', canPlaySound);
    if (canPlaySound) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});
    }
  };

  const userid = localStorage.getItem('userid');
  const wsUrl = userid
    ? `ws://localhost:2432?userId=${userid}`
    : 'ws://localhost:2432';

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          openNotification(data.message || 'Notification', 'topRight');
        } catch {
          openNotification(String(event.data), 'topRight');
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws?.close();
      };
    };

    connect();

    return () => {
      ws?.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
    // eslint-disable-next-line
  }, [wsUrl]);

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
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
