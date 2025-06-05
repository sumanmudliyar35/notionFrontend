import React, { useState } from 'react';
import * as styled from './style';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import MainContent from '../maincontent/Maincontent';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom'; // <-- import Outlet


interface LayoutProps {
  // children: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <styled.LayoutWrapper>

      <Header collapsed={collapsed} onToggle={toggleSidebar} />

      <styled.Body>
        <Sidebar collapsed={collapsed} />
        <MainContent collapsed={collapsed}><Outlet/></MainContent>
      </styled.Body>
    </styled.LayoutWrapper>
  );
};

export default Layout;
