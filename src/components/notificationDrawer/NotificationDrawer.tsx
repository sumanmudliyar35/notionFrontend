import React, { use, useEffect, useState } from 'react';
import { Drawer, Spin, List, Typography, Tooltip } from 'antd';
import { useGetMentionByUser } from '../../api/get/getMentionByUser';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { formatDisplayDate } from '../../utils/commonFunction';
import { useUpdateMentionById } from '../../api/put/updateMentionById';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';


interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  getContainer: HTMLElement | false;
  userId: number; // Assuming userId is passed as a prop, otherwise you can fetch it from localStorage or context
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
  getContainer,
  userId
}) => {
  // Responsive width: 350px for desktop, 90vw for mobile
  const drawerWidth = window.innerWidth < 600 ? '90vw' : 350;

  const navigate = useNavigate();


  // Get userId from localStorage or context as needed
  // const userId = Number(localStorage.getItem('userid'));
  const { data: notificationData, isLoading, refetch } = useGetMentionByUser(userId);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initial fetch or setup if needed
    if (notificationData && notificationData.length > 0) {
      setNotifications(notificationData);
    } 
  }, [notificationData]);


  const updateMentionStatusMutate = useUpdateMentionById();
  const handleUpdateMentionStatus = async (mentionId: number, isRead: boolean) => {
    try {

    
    

      await updateMentionStatusMutate.mutateAsync([ {isRead: isRead ? false : true }, mentionId ]);
      setNotifications((prevNotifications: any) =>
        prevNotifications.map((notification: any) =>{
          return(
          notification.mentionId === mentionId ? { ...notification, isSeen: isRead ? false : true } : notification
          )
     } )
      );  
    } catch (error) {
      console.error("Error updating mention status:", error);
    }
  };

  const handleNotificationClick = (item: any) => {

    console.log('Notification clicked:', item);
  if (item.type === 'lead') {
    navigate('/leads', { state: { highlightRowId: item.leadId } });
    onClose(); // Optionally close the drawer
  }

  if (item.type === 'task') {
    navigate('/user/' + item.assignedTo + `/task/`, { state: { highlightRowId: item.taskId } });
    onClose(); // Optionally close the drawer
  }
  // Add more types if needed
};

  return (
    <Drawer
      title="Notifications"
      placement="right"
      onClose={onClose}
      open={open}
      width={drawerWidth}
      getContainer={getContainer}
      style={{ position: 'absolute', backgroundColor: '#202020', color: '#808080', zIndex:5000 }}
      closeIcon={<CloseOutlined style={{ color: '#808080' }} />}
    >
      {isLoading ? (
        <Spin />
      ) : notifications && notifications.length > 0 ? (
        <List
          dataSource={notifications}
          renderItem={(item: any) => (
            <List.Item
              style={{
                background: item.status === 'read' ? '#181818' : '#1d2026', // Slightly different bg for unread
                borderRadius: 8,
                marginBottom: 10,
                padding: '12px 16px',
                border: '1px solid #23272f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                cursor: 'pointer', // Show it's clickable
                transition: 'background-color 0.2s',
              }}
              className="notification-item"
                onClick={() => handleNotificationClick(item)}

            >
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography.Text strong style={{ color: '#52c41a' }}>
                  {item.userName}
                </Typography.Text>
                <div style={{
                  marginLeft: 'auto', // push to right
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ color: '#aaa', fontSize: 12 }}>
                    {item.createdAt ? formatDisplayDate(item.createdAt) : ''}
                  </span>
                  
                  {/* Read status indicator with ticks */}
                  {item.isSeen ? (
                    <Tooltip title="Read">
                      <span style={{ display: 'inline-flex' }}               
                       onClick={() => handleUpdateMentionStatus(item?.mentionId, item.isSeen)}
>
                        <DoneAllIcon 
                          style={{ 
                            color: '#52c41a', 
                            fontSize: 12, 
                            marginLeft: 4 
                          }} 
                        />
                       
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unread">
                      <CheckOutlined 
                        style={{ 
                          color: '#888', 
                          fontSize: 12, 
                          marginLeft: 4 
                        }} 

                      onClick={() => handleUpdateMentionStatus(item?.mentionId, item.isSeen)}

                      />
                    </Tooltip>
                  )}
                </div>
              </div>
              <div style={{ 
                color: item.status === 'read' ? '#aaa' : '#fff', 
                marginTop: 4,
                fontWeight: item.status === 'read' ? 'normal' : 'medium'
              }}>
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

// Add this CSS to your styles or in a style tag
const styles = `
  .notification-item:hover {
    background-color: #23272f !important;
  }
`;

export default NotificationDrawer;