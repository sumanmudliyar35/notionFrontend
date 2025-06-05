import React from 'react';
import { Drawer, Spin, List, Typography } from 'antd';
import { useGetMentionByUser } from '../../api/get/getMentionByUser';
import { CloseOutlined } from '@ant-design/icons';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  getContainer: HTMLElement | false;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
  getContainer,
}) => {
  // Responsive width: 350px for desktop, 90vw for mobile
  const drawerWidth = window.innerWidth < 600 ? '90vw' : 350;

  // Get userId from localStorage or context as needed
  const userId = Number(localStorage.getItem('userid'));
  const { data, isLoading } = useGetMentionByUser(userId);

  return (
    <Drawer
      title="Notifications"
      placement="right"
      onClose={onClose}
      open={open}
      width={drawerWidth}
      getContainer={getContainer}
      style={{ position: 'absolute', backgroundColor: '#202020', color: '#808080' }}
      closeIcon={<CloseOutlined style={{ color: '#808080' }} />}
    >
      {isLoading ? (
        <Spin />
      ) : data && data.length > 0 ? (
        <List
          dataSource={data}
          renderItem={(item: any) => (
            <List.Item
              style={{
                background: '#181818',
                borderRadius: 8,
                marginBottom: 10,
                padding: '12px 16px',
                border: '1px solid #23272f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography.Text strong style={{ color: '#52c41a' }}>
                  {item.userName}
                </Typography.Text>
                <span style={{
                  color: '#aaa',
                  fontSize: 12,
                  marginLeft: 'auto', // push to right
                }}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : ''}
                </span>
              </div>
              <div style={{ color: '#fff', marginTop: 4 }}>
                {item.message || 'You were mentioned.'}
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ color: '#aaa', textAlign: 'center', marginTop: 32 }}>
          No new notifications.
        </div>
      )}
    </Drawer>
  );
};

export default NotificationDrawer;