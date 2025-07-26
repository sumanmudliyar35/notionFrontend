import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as styled from './style';
import { Drawer, Input } from 'antd'; // <-- Import Input
import NotificationDrawer from '../notificationDrawer/NotificationDrawer';
import CustomSearchInput from '../CustomSearchInput/CustomSearchInput';
import { useGetUsersMenu } from '../../api/get/getUsersMenu';
import { UserOutlined, SettingOutlined, LogoutOutlined, BellOutlined, CheckSquareOutlined, RetweetOutlined, TeamOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useGetUnseenNotificationCount } from '../../api/get/getUnseenNotificationCount';
import { DashboardOutlined } from '@ant-design/icons';
import AccessModal from '../AccessModal/AccessModal';


interface SidebarProps {
  collapsed: boolean;
}

const iconStyle = { color: '#4caf50', marginRight: 8 };



const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const roleid = localStorage.getItem('roleid');
  const userId = localStorage.getItem('userid');
  
  const {data: usersMenu} = useGetUsersMenu(userId || '0');


  const [showLeads, setShowLeads] = useState(false);

  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (usersMenu?.data) {
      setShowLeads(usersMenu?.showLeads || false);
      setShowLogs(usersMenu?.showLogs || false);
    }
  }, [usersMenu, userId]);

  const {data: unseenNotificationCount} = useGetUnseenNotificationCount(userId || '0');



  const menuItems = [
  {
    key: 'notifications',
    label: <>{`Notifications (${unseenNotificationCount?.count || 0} unread)`}</>,
    icon: <BellOutlined style={{ ...iconStyle, color: '#52c41a' }} />,
    onClick: 'drawer',
  },

  ...(showLeads
    ? [
        {
          key: 'leads',
          label: 'Leads',
          icon: <TeamOutlined style={{ ...iconStyle, color: '#fa8c16' }} />,
          path: '/leads',
        },
      ]
    : []),

    ...(showLogs
    ? [

        {
    key: 'logs',
    label: 'Logs',
    icon: <DashboardOutlined style={{ ...iconStyle, color: '#1890ff' }} />,
    path: '/logs',
  },
    ] : []),
  

 
 
];



const adminMenuItems = [
    {
    key: 'admin',
    label: 'Admin',
    icon: <SettingOutlined style={{ ...iconStyle, color: '#faad14' }} />,
    path: '/admin',
    // adminOnly: true,
  },

   {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined style={{ ...iconStyle, color: '#1890ff' }} />,
    path: '/dashboard',
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
  const navigate = useNavigate();
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openUserMenus, setOpenUserMenus] = useState<{ [key: string]: boolean }>({});
  const drawerContainerRef = useRef<HTMLDivElement>(null);

  const [accessorId, setAccessorId] = useState<string | number | undefined>(undefined);

  const [openAccessModal, setOpenAccessModal] = useState(false);
  // const handleNavigate = (path: string) => {
  //   navigate(path);
  // };

  const handleNavigate = (path: string, state?: any) => {
    console.log('Navigating to:', path, 'with state:', state);
  navigate(path, state ? { state } : undefined);
};

  const handleAccessModalOpen = (id: string | number) => {
    setAccessorId(id);
    setOpenAccessModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

 
 
  

const userMenuItems = Array.isArray(usersMenu?.data)
  ? usersMenu.data.map((user: any) => ({
      key: `user-${user.userId}`,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span>{user.name}</span>
          {/* <EllipsisOutlined
            style={{ marginLeft: 8, color: '#aaa', cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation();
              handleAccessModalOpen(user.userId);
            }}
          /> */}
        </span>
      ),
      // icon: <UserOutlined style={{ ...iconStyle, color: '#1890ff' }} />,
            searchText: user.name, // <-- Add this line

       icon: user.profileUrl
        ? (
            <img
              src={user.profileUrl}
              alt={user.name}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: 8,
                border: '2px solid #1890ff',
                    aspectRatio: '1',         // Modern browsers only

                background: '#fff',
              }}

              onClick={e => {
              e.stopPropagation();
              handleAccessModalOpen(user.userId);
            }}
            />
          )
        : <UserOutlined style={{ ...iconStyle, color: '#1890ff' }} />,
      path: `/user/${user.userId}/task`,...(user.accessType ? { accessType: user.accessType } : {}),
      children: [
        {
          key: `user-${user.userId}-task`,
          label: 'Task',
          icon: <CheckSquareOutlined style={{ ...iconStyle, color: '#52c41a' }} />,
          path: `/user/${user.userId}/task`,
              ...(user.accessType ? { accessType: user.accessType } : {}),

        },
        {
          key: `user-${user.userId}-recursive-task`,
          label: 'Recursive Task',
          icon: <RetweetOutlined style={{ ...iconStyle, color: '#faad14' }} />,
          path: `/user/${user.userId}/recursive-task`,
              ...(user.accessType ? { accessType: user.accessType } : {}),

        },
      ],
    }))
  : [];


  // Combine static and dynamic menu items
  const combinedMenu = [
    ...menuItems,
    ...userMenuItems,
    ...(roleid === '1' ? adminMenuItems : []), // Only add admin items if roleid is 1
    ...lastMenuItem
  ];

  // Filter menu items based on search (including children)
 // Fix the filterMenu function to handle React elements in labels
// const filterMenu = (items: any[]): any[] =>
//   items
//     .map((item: any) => {
//       // Get the text representation of the label (either a string or from React element)
//       const labelText = typeof item.label === 'string' 
//         ? item.label 
//         : (item.key === 'notifications' ? 'Notifications' : ''); // Handle special cases
      
//       if (item.children) {
//         const filteredChildren = filterMenu(item.children);
//         if (
//           labelText.toLowerCase().includes(search.toLowerCase()) ||
//           filteredChildren.length
//         ) {
//           return { ...item, children: filteredChildren };
//         }
//         return null;
//       }
      
//       return labelText.toLowerCase().includes(search.toLowerCase()) ? item : null;
//     })
//     .filter(Boolean);

const filterMenu = (items: any[]): any[] =>
  items
    .map((item: any) => {
      // Use searchText if available, else fallback to label
      const labelText = item.searchText
        ? item.searchText
        : typeof item.label === 'string'
          ? item.label
          : (item.key === 'notifications' ? 'Notifications' : '');

      if (item.children) {
        const filteredChildren = filterMenu(item.children);
        if (
          labelText.toLowerCase().includes(search.toLowerCase()) ||
          filteredChildren.length
        ) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }

      return labelText.toLowerCase().includes(search.toLowerCase()) ? item : null;
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
    // Highlight if current path matches item's path
    const isSelected = item.path && location.pathname === item.path;

    return (
    <React.Fragment key={item.key}>
  <styled.MenuItem
    onClick={() => {
      if (item.onClick === 'drawer') handleOpenDrawer();
      else if (item.onClick === 'logout') handleLogout();
      // If item has both path and children, navigate and toggle open/close
      else if (item.path && item.children) {
        // handleNavigate(item.path, ); // Navigate to parent path
                      handleNavigate(item.path, item.accessType ? { accessType: item.accessType } : undefined);

        setOpenUserMenus(prev => ({
          ...prev,
          [item.key]: !prev[item.key],
        }));
      }
      // If only path (no children), navigate
      else if (item.path) handleNavigate(item.path, item.accessType ? { accessType: item.accessType } : undefined);
      else if (isUser) {
        setOpenUserMenus(prev => ({
          ...prev,
          [item.key]: !prev[item.key],
        }));
      }
    }}
    style={{
      ...(item.children ? { fontWeight: 600, cursor: isUser ? 'pointer' : undefined } : {}),
      ...(isSelected
        ? { background: 'rgba(255,255,255,0.055)', color: '#fff', borderRadius: 6 }
        : {}),
    }}
  >
    {item.icon}
    {item.label}
  </styled.MenuItem>
  {item.children && isUser && isOpen && (
    <styled.menuChildren>
      {renderMenuItems(item.children)}
    </styled.menuChildren>
  )}
  {item.children && !isUser && (
    <styled.menuChildren>
      {renderMenuItems(item.children)}
    </styled.menuChildren>
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
        userId={Number(userId)}
      />



      {openAccessModal && (
        <AccessModal
          open={openAccessModal}
          onClose={() => setOpenAccessModal(false)}
          accessorId={accessorId}
        />
      )}
    </styled.SidebarWrapper>
  );
};

export default Sidebar;
