import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

// Taskbar styles
export const useTaskbarStyles = makeStyles({
    taskbar_wrapper: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'var(--general-bg)',
        backdropFilter: 'var(--taskbar-backdrop-filter)',
    },
    taskbar: {
        position: 'relative',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('0', '12px'),
        ...shorthands.borderRadius('8px 8px 0 0'),
        ...shorthands.margin('0', '12px'),
        zIndex: 1000,
        width: 'auto',
        minWidth: '800px'
    },
    rightSection: {
        position: 'absolute',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px'
    },
    timeSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        marginLeft: "5px",
        color: 'var(--text-color)',
        cursor: 'pointer',
        ...shorthands.padding('4px', '10px'),
        ...shorthands.borderRadius('4px'),
        ':hover': {
            backgroundColor: 'var(--icon-hover-bg)'
        }
    },
    time: {
        fontWeight: 'medium'
    },
    date: {
        fontSize: '10px',
        opacity: 0.8
    },
    actionCenterTrigger: {
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer',
        ...shorthands.borderRadius('4px'),
        ...shorthands.padding('2px', '4px'),
        ':hover': {
            backgroundColor: 'var(--icon-hover-bg)'
        }
    }
});

// Calendar styles
export const useCalendarStyles = makeStyles({
    calendarPopup: {
        position: 'absolute',
        bottom: '70px',
        right: '12px',
        backgroundColor: 'var(--popover-bg)',
        ...shorthands.borderRadius('12px'),
        ...shorthands.padding('16px'),
        width: '360px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        zIndex: 1001,
        border: '1px solid var(--divider-color)',
    },
    calendar: {
        width: '100%',
        color: 'var(--text-color)'
    },
    calendarHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    monthYear: {
        fontSize: '18px',
        fontWeight: 'bold'
    },
    calendarNav: {
        display: 'flex',
        gap: '8px'
    },
    navButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-color)',
        fontSize: '16px',
        ...shorthands.padding('4px', '8px'),
        ...shorthands.borderRadius('4px'),
        ':hover': {
            backgroundColor: 'var(--icon-hover-bg)'
        }
    },
    weekdays: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        marginBottom: '8px'
    },
    weekday: {
        fontSize: '12px',
        color: 'var(--text-color-secondary)',
        fontWeight: '600',
        ...shorthands.padding('4px')
    },
    days: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridGap: '2px'
    },
    calendarDay: {
        ...shorthands.padding('8px'),
        textAlign: 'center',
        ...shorthands.borderRadius('50%'),
        cursor: 'pointer',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ':hover': {
            backgroundColor: 'var(--icon-hover-bg)'
        }
    },
    today: {
        backgroundColor: 'var(--brand-color)',
        color: 'white',
        ':hover': {
            backgroundColor: 'var(--brand-color-darker)'
        }
    },
    selected: {
        backgroundColor: 'var(--brand-color-light)',
        ':hover': {
            backgroundColor: 'var(--brand-color-light-hover)'
        }
    },
    emptyDay: {
        ...shorthands.padding('8px')
    },
    calendarContainer: {
        marginBottom: '20px'
    },
    notificationsHeader: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-color)',
        marginBottom: '8px',
        marginTop: '24px'
    }
});

// Action Center styles
export const useActionCenterStyles = makeStyles({
    actionCenterPopup: {
        position: 'absolute',
        bottom: '70px',
        right: '12px',
        ...shorthands.borderRadius('12px'),
        ...shorthands.padding('16px'),
        width: '380px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        zIndex: 1001,
    },
    actionCenterHeader: {
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionCenterTitle: {
        fontSize: '16px',
        fontWeight: '600',
    },
    quickActions: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridGap: '8px',
        marginBottom: '20px'
    },
    quickAction: {
        borderRadius: '8px',
        padding : "16px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    quickActionLabel: {
        fontSize: '12px',
        marginTop: '8px',
        textAlign: 'center'
    },
    slidersSection: {
        marginBottom: '20px',
    },
    sliderRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '14px',
        width: '100%',
        ':last-child': {
            marginBottom: '0'
        }
    },
    sliderInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    sliderIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '10px',
    },
    sliderControl: {
        flex: 1,
        width: '100%',
    },
    sliderArrow: {
        marginLeft: '10px',
    },
    batteryInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
    },
    batteryIcon: {
    },
    batteryText: {
        flex: 1,
        marginLeft: '8px',
        fontSize: '14px',
    },
    editButton: {
        marginLeft: 'auto',
        marginRight: '16px',
    },
    settingsButton: {
    },
});

// Notification styles
export const useNotificationStyles = makeStyles({
    notification: {
        backgroundColor: 'var(--notification-bg)',
        ...shorthands.borderRadius('8px'),
        ...shorthands.padding('12px'),
        marginBottom: '8px'
    },
    notificationTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-color)',
        marginBottom: '4px'
    },
    notificationBody: {
        fontSize: '12px',
        color: 'var(--text-color-secondary)'
    },
    notificationTime: {
        fontSize: '10px',
        color: 'var(--text-color-secondary)',
        marginTop: '4px',
        textAlign: 'right'
    },
}); 