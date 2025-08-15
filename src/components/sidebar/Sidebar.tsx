import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as styled from './style';
import { Drawer, Input } from 'antd';
import NotificationDrawer from '../notificationDrawer/NotificationDrawer';
import CustomSearchInput from '../CustomSearchInput/CustomSearchInput';
import { useGetUsersMenu } from '../../api/get/getUsersMenu';
import { UserOutlined, SettingOutlined, LogoutOutlined, BellOutlined, CheckSquareOutlined, RetweetOutlined, TeamOutlined, EllipsisOutlined, DashboardOutlined, ToolOutlined, ClusterOutlined } from '@ant-design/icons';
import AccessModal from '../AccessModal/AccessModal';
import { useGetUnseenNotificationCount } from '../../api/get/getUnseenNotificationCount';

// DND-kit imports
import { DndContext, closestCenter, useSensor, PointerSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useGetUsersMenuOrder } from '../../api/get/getUsersMenuOrder';
import { useUpdateUsersMenuOrder } from '../../api/put/updateUsersMenuOrder';

interface SidebarProps {
  collapsed: boolean;
}

const iconStyle = { color: '#4caf50', marginRight: 8 };

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const roleid = localStorage.getItem('roleid');
  const userId = localStorage.getItem('userid');
  const { data: usersMenu } = useGetUsersMenu(userId || '0');
  const [showLeads, setShowLeads] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (usersMenu?.data) {
      setShowLeads(usersMenu?.showLeads || false);
      setShowLogs(usersMenu?.showLogs || false);
    }
  }, [usersMenu, userId]);


  const { data: unseenNotificationCount } = useGetUnseenNotificationCount(userId || '0');

  const {data:usersMenuOrder, refetch: refetchUsersMenuOrder} = useGetUsersMenuOrder(userId || '0');

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
          {
            key: 'Speed',
            label: 'speed',
            icon: <TeamOutlined style={{ ...iconStyle, color: '#fa8c16' }} />,
            path: '/speed',
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
        ]
      : []),
  ];

  const adminMenuItems = [
    {
      key: 'admin',
      label: 'Admin',
      icon: <SettingOutlined style={{ ...iconStyle, color: '#faad14' }} />,
      path: '/admin',
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
  key: 'location-hub',
  label: 'Location Hub',
icon: <ClusterOutlined style={{ ...iconStyle, color: '#1890ff' }} />,  children: [
    // ...other children,
    {
      key: 'maintance',
      label: 'Cleaning',
      icon: <ToolOutlined style={{ ...iconStyle, color: '#faad14' }} />, // orange/yellow color, not blue
      path: '/maintance',
    },
  ],
},
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

  const handleNavigate = (path: string, state?: any) => {
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
          </span>
        ),
        searchText: user.name,
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
                  aspectRatio: '1',
                  background: '#fff',
                }}
                onClick={e => {
                  e.stopPropagation();
                  handleAccessModalOpen(user.userId);
                }}
              />
            )
          : <UserOutlined style={{ ...iconStyle, color: '#1890ff' }} />,
        path: `/user/${user.userId}/task`, ...(user.accessType ? { accessType: user.accessType } : {}),
        children: [
          {
            key: `user-${user.userId}-task`,
            label: 'Task',
            icon: <CheckSquareOutlined style={{ ...iconStyle, color: '#52c41a' }} />,
            path: `/user/${user.userId}/task`, ...(user.accessType ? { accessType: user.accessType } : {}),
          },
          {
            key: `user-${user.userId}-recursive-task`,
            label: 'Recursive Task',
            icon: <RetweetOutlined style={{ ...iconStyle, color: '#faad14' }} />,
            path: `/user/${user.userId}/recursive-task`, ...(user.accessType ? { accessType: user.accessType } : {}),
          },
        ],
      }))
    : [];

 const combinedMenu = useMemo(() => [
  ...menuItems,
  ...userMenuItems,
  ...(roleid === '1' ? adminMenuItems : []),
  ...lastMenuItem
], [menuItems, userMenuItems, roleid, adminMenuItems, lastMenuItem, ]);



  // --- DND-kit logic ---
  const sensors = useSensors(useSensor(PointerSensor));
  const [menuOrder, setMenuOrder] = useState(combinedMenu.map(item => item.key));


useEffect(() => {
  let newOrder = combinedMenu.map(item => item.key);
  if (usersMenuOrder && usersMenuOrder.menuOrder && roleid === '1') {
    try {
      const parsedOrder = JSON.parse(usersMenuOrder.menuOrder);
      if (Array.isArray(parsedOrder)) {
        newOrder = parsedOrder;
      }
    } catch (e) {
      // fallback to default if parsing fails
    }
  }
  // Only update state if the order actually changed
  if (JSON.stringify(menuOrder) !== JSON.stringify(newOrder)) {
    setMenuOrder(newOrder);
  }
}, [usersMenuOrder, combinedMenu]);











  // useEffect(() => {
  //   setMenuOrder(combinedMenu.map(item => item.key));
  // }, [usersMenu, showLeads, showLogs, roleid]);


  const updateMenusOrderMutate = useUpdateUsersMenuOrder();

  const updateMenuOrder = async (newOrder: string[]) => {
    try {
      await updateMenusOrderMutate.mutateAsync([newOrder, userId]);
      refetchUsersMenuOrder();
      
    } catch (error) {
      console.error('Error updating menu order:', error);
    }

  }

  const handleMenuDragEnd = (event: any) => {
    const { active, over } = event;
    if (active?.id && over?.id && active.id !== over.id) {
      const oldIndex = menuOrder.indexOf(active.id);
      const newIndex = menuOrder.indexOf(over.id);
      const newOrder = Array.from(menuOrder);
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      setMenuOrder(newOrder);

      updateMenuOrder(newOrder);
    }
  };

  // --- Filtering ---
  const filterMenu = (items: any[]): any[] =>
    items
      .map((item: any) => {
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

  // --- Sortable Row ---
  const SortableMenuItem = ({ item }: { item: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.key });
    // const isUser = item.children && item.key.startsWith('user-');
    const isUser = item.children && (item.key.startsWith('user-') || item.key === 'location-hub');
    const isOpen = openUserMenus[item.key];
    const isSelected = item.path && location.pathname === item.path;


    return (
      <div
        ref={setNodeRef}
        style={{
          transform: transform ? `translateY(${transform.y}px)` : undefined,
          transition,
          opacity: isDragging ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            padding: '0 6px',
            color: '#aaa',
            fontSize: 16,
            userSelect: 'none',
          }}
          onClick={e => e.stopPropagation()}
        >
  {roleid === "1" && (<span
  style={{
    fontSize: 20,
    color: '#aaa',
    cursor: 'grab',
    userSelect: 'none',
    // padding: '0 6px',
    display: 'flex',
    alignItems: 'center',
  }}
>
  &#8942; {/* Unicode U+22EE */}
</span>    

  )}


</span>
        {/* Menu item */}
        <div style={{ flex: 1 }}>
          <styled.MenuItem
            onClick={e => {
              e.stopPropagation();
              if (item.onClick === 'drawer') handleOpenDrawer();
              else if (item.onClick === 'logout') handleLogout();
              else if (item.children) {
                handleNavigate(item.path, item.accessType ? { accessType: item.accessType } : undefined);

                setOpenUserMenus(prev => ({
                  ...prev,
                  [item.key]: !prev[item.key],
                }));
              }
              else if (item.path) {
                handleNavigate(item.path, item.accessType ? { accessType: item.accessType } : undefined);
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
          {/* Children */}
          {item.children && isOpen && (
            <styled.menuChildren>
              {item.children.map((child: any) => (
                <styled.MenuItem
                  key={child.key}
                  onClick={e => {
                    e.stopPropagation(); // Prevent parent toggle
                    if (child.path) {
                      handleNavigate(child.path, child.accessType ? { accessType: child.accessType } : undefined);
                    }
                  }}
                  style={{
                    fontWeight: 500,
                    paddingLeft: 4,
                    cursor: 'pointer',
                    color: location.pathname === child.path ? '#1890ff' : undefined,
                    background: location.pathname === child.path ? 'rgba(24,144,255,0.08)' : undefined,
                    borderRadius: 4,
                    margin: '2px 0',
                  }}
                >
                  {child.icon}
                  {child.label}
                </styled.MenuItem>
              ))}
            </styled.menuChildren>
          )}
          {item.children && !isUser && (
            <styled.menuChildren>
              {item.children.map((child: any) => (
                <styled.MenuItem
                  key={child.key}
                  onClick={e => {
                    e.stopPropagation();
                    if (child.path) {
                      handleNavigate(child.path, child.accessType ? { accessType: child.accessType } : undefined);
                    }
                  }}
                  style={{
                    fontWeight: 500,
                    paddingLeft: 24,
                    cursor: 'pointer',
                    color: location.pathname === child.path ? '#1890ff' : undefined,
                    background: location.pathname === child.path ? 'rgba(24,144,255,0.08)' : undefined,
                    borderRadius: 4,
                    margin: '2px 0',
                  }}
                >
                  {child.icon}
                  {child.label}
                </styled.MenuItem>
              ))}
            </styled.menuChildren>
          )}
        </div>
      </div>
    );
  };

  // --- Render Menu with DND ---
  const renderMenuDraggable = (items: any[]) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleMenuDragEnd}
    >
      <SortableContext items={menuOrder} strategy={verticalListSortingStrategy}>
        {menuOrder.map((key) => {
          const item = items.find((itm: any) => itm.key === key);
          if (!item) return null;
          return <SortableMenuItem key={item.key} item={item} />;
        })}
      </SortableContext>
    </DndContext>
  );

  const renderMenu = () => (
    <>
      <CustomSearchInput
        ref={searchInputRef}
        placeholder="Search menu"
        value={search}
        onChange={e => setSearch(e.target.value)}
        allowClear
      />
      {renderMenuDraggable(filteredMenu.length ? filteredMenu : combinedMenu)}
    </>
  );

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
