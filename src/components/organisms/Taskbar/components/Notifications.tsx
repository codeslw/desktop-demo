import React from 'react';
import { Text } from '@fluentui/react-components';
import { useNotificationStyles } from '../styles';
import { notificationsData } from '../data';

export const Notifications: React.FC = () => {
    const styles = useNotificationStyles();

    return (
        <>
            <Text className={styles.notificationTitle} style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                marginTop: '24px'
            }}>
                Notifications
            </Text>
            
            {notificationsData.map(notification => (
                <div key={notification.id} className={styles.notification}>
                    <div className={styles.notificationTitle}>{notification.title}</div>
                    <div className={styles.notificationBody}>
                        {notification.body}
                    </div>
                    <div className={styles.notificationTime}>{notification.time}</div>
                </div>
            ))}
        </>
    );
}; 