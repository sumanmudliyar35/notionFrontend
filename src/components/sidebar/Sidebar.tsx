import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styled from './style';
import { Drawer } from 'antd'; // <-- Import Drawer
import { UserOutlined, SettingOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import NotificationDrawer from '../notificationDrawer/NotificationDrawer';

interface SidebarProps {
  collapsed: boolean;
}

const iconStyle = { color: '#4caf50', marginRight: 8 }; // green color & spacing

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const roleid = localStorage.getItem('roleid');
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // <-- Drawer state
  const drawerContainerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const renderMenu = () => (
    <>
      <styled.MenuItem onClick={handleOpenDrawer}>
        <BellOutlined style={{ ...iconStyle, color: '#52c41a' }} />
        Notifications
      </styled.MenuItem>

      <styled.MenuItem onClick={() => handleNavigate('/leads')}>
        <UserOutlined style={{ ...iconStyle, color: '#1890ff' }} />
        Leads
      </styled.MenuItem>

      {roleid === '1' && (
        <styled.MenuItem onClick={() => handleNavigate('/admin')}>
          <SettingOutlined style={{ ...iconStyle, color: '#faad14' }} />
          Admin
        </styled.MenuItem>
      )}

      <styled.MenuItem onClick={handleLogout}>
        <LogoutOutlined style={{ ...iconStyle, color: '#f5222d' }} />
        Logout
      </styled.MenuItem>
    </>
  );

  return (
    <styled.SidebarWrapper $collapsed={collapsed}>
      {collapsed ? (
        <styled.HoverMenu className="hover-menu">{renderMenu()}</styled.HoverMenu>
      ) : (
        <styled.Menu>{renderMenu()}</styled.Menu>
      )}
      {/* Drawer container placed right after menu */}
      <div ref={drawerContainerRef} style={{ display: 'inline-block', verticalAlign: 'top' }} />
    <NotificationDrawer
  open={isDrawerOpen}
  onClose={handleCloseDrawer}
  getContainer={drawerContainerRef.current || false}
/>
    </styled.SidebarWrapper>
  );
};

export default Sidebar;
