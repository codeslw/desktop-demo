import React, { useRef } from 'react';
import { useCalendarStyles } from '../styles';
import { SimpleCalendar } from './SimpleCalendar';
import { Notifications } from './Notifications';
import { useId } from '@fluentui/react-components';

interface CalendarProps {
    isOpen: boolean;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    calendarRef: React.RefObject<HTMLDivElement>;
}

export const Calendar: React.FC<CalendarProps> = ({ 
    isOpen, 
    selectedDate, 
    onDateChange,
    calendarRef 
}) => {
    const styles = useCalendarStyles();
    const calendarId = useId("calendar");

    if (!isOpen) return null;

    return (
        <div ref={calendarRef} className={styles.calendarPopup}>
            {/* Custom Calendar Component */}
            <div className={styles.calendarContainer}>
                <SimpleCalendar
                    id={calendarId}
                    today={new Date()}
                    selected={selectedDate}
                    onSelectionChange={onDateChange}
                />
            </div>
            
            {/* Notifications section below the calendar */}
            <Notifications />
        </div>
    );
}; 