import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styled from './style';
import { Drawer, Input } from 'antd'; // <-- Import Input
import NotificationDrawer from '../notificationDrawer/NotificationDrawer';
import CustomSearchInput from '../CustomSearchInput/CustomSearchInput';
import { useGetUsersMenu } from '../../api/get/getUsersMenu';
import { UserOutlined, SettingOutlined, LogoutOutlined, BellOutlined, CheckSquareOutlined, RetweetOutlined, TeamOutlined } from '@ant-design/icons';

interface SidebarProps {
  collapsed: boolean;
}

const iconStyle = { color: '#4caf50', marginRight: 8 };

const menuItems = [
  {
    key: 'notifications',
    label: 'Notifications',
    icon: <BellOutlined style={{ ...iconStyle, color: '#52c41a' }} />,
    onClick: 'drawer',
  },
  {
    key: 'leads',
    label: 'Leads',
    icon: <TeamOutlined style={{ ...iconStyle, color: '#fa8c16' }} />, // <-- new icon and color
    path: '/leads',
  },

  // {
  //   key: 'tasks',
  //   label: 'Tasks',
  //   icon: <UserOutlined style={{ ...iconStyle, color: '#1890ff' }} />,
  //   path: '/tasks',
  //   // adminOnly: true,

  // },
 
];



const adminMenuItems = [
    {
    key: 'admin',
    label: 'Admin',
    icon: <SettingOutlined style={{ ...iconStyle, color: '#faad14' }} />,
    path: '/admin',
    // adminOnly: true,
  },


];

const lastMenuItem = [
 
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined style={{ ...iconStyle, color: '#f5222d' }} />,
    onClick: 'logout',
  },

];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const roleid = localStorage.getItem('roleid');
  const userId = localStorage.getItem('userid');
  
  const {data: usersMenu} = useGetUsersMenu(userId || '0');
  const navigate = useNavigate();


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openUserMenus, setOpenUserMenus] = useState<{ [key: string]: boolean }>({});
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

   // Add this for debugging
   console.log('usersMenu:', usersMenu);
   console.log('usersMenu?.data:', usersMenu?.data);
 
   // Defensive: only map if Array.isArray
   const userMenuItems = Array.isArray(usersMenu?.data)
     ? usersMenu.data.map((user: any) => ({
         key: `user-${user.userId}`,
         label: user.name,
         icon: <UserOutlined style={{ ...iconStyle, color: '#1890ff' }} />,
         children: [
           {
             key: `user-${user.userId}-task`,
             label: 'Task',
             icon: <CheckSquareOutlined style={{ ...iconStyle, color: '#52c41a' }} />,
             path: `/user/${user.userId}/task`,
           },
           {
             key: `user-${user.userId}-recursive-task`,
             label: 'Recursive Task',
             icon: <RetweetOutlined style={{ ...iconStyle, color: '#faad14' }} />,
             path: `/user/${user.userId}/recursive-task`,
           },
         ],
       }))
     : [];


     console.log('userMenuItems:', userMenuItems);

  // Combine static and dynamic menu items
  const combinedMenu = [
    ...menuItems,
    ...userMenuItems,
    ...(roleid === '1' ? adminMenuItems : []), // Only add admin items if roleid is 1
    ...lastMenuItem
  ];

  // Filter menu items based on search (including children)
  const filterMenu = (items: any[]): any[] =>
    items
      .map((item: any) => {
        if (item.children) {
          const filteredChildren = filterMenu(item.children);
          if (
            item.label.toLowerCase().includes(search.toLowerCase()) ||
            filteredChildren.length
          ) {
            return { ...item, children: filteredChildren };
          }
          return null;
        }
        return item.label.toLowerCase().includes(search.toLowerCase()) ? item : null;
      })
      .filter(Boolean);

  const filteredMenu = filterMenu(combinedMenu);

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
  

  const renderMenuItems = (items: any[]) =>
  items.map(item => {
    const isUser = item.children && item.key.startsWith('user-');
    const isOpen = openUserMenus[item.key];

    return (
      <React.Fragment key={item.key}>
        <styled.MenuItem
          onClick={() => {
            if (item.onClick === 'drawer') handleOpenDrawer();
            else if (item.onClick === 'logout') handleLogout();
            else if (item.path) handleNavigate(item.path);
            else if (isUser) {
              setOpenUserMenus(prev => ({
                ...prev,
                [item.key]: !prev[item.key],
              }));
            }
          }}
          style={item.children ? { fontWeight: 600, cursor: isUser ? 'pointer' : undefined } : {}}
        >
          {item.icon}
          {item.label}
        </styled.MenuItem>
        {item.children && isUser && isOpen && (
          <div style={{ paddingLeft: 24 }}>
            {renderMenuItems(item.children)}
          </div>
        )}
        {item.children && !isUser && (
          <div style={{ paddingLeft: 24 }}>
            {renderMenuItems(item.children)}
          </div>
        )}
      </React.Fragment>
    );
  });

  const renderMenu = () => (
    <>
      <CustomSearchInput
        ref={searchInputRef}
        placeholder="Search menu"
        value={search}
        onChange={e => setSearch(e.target.value)}
        allowClear
      />
      {renderMenuItems(filteredMenu)}
    </>
  );

  // Build user menu items dynamically
 

  return (
    <styled.SidebarWrapper $collapsed={collapsed}>
      {collapsed ? (
        <styled.HoverMenu className="hover-menu">{renderMenu()}</styled.HoverMenu>
      ) : (
        <styled.Menu>{renderMenu()}</styled.Menu>
      )}
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
