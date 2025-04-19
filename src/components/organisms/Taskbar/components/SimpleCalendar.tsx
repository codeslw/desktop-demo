import React, { useState } from 'react';
import { useCalendarStyles } from '../styles';

// Define props for the simple calendar
interface SimpleCalendarProps {
    id: string;
    today: Date;
    selected: Date;
    onSelectionChange: (date: Date) => void;
}

export const SimpleCalendar: React.FC<SimpleCalendarProps> = ({ 
    id, 
    today, 
    selected, 
    onSelectionChange 
}) => {
    const styles = useCalendarStyles();
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    
    const formatMonthYear = (date: Date): string => {
        return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
    };
    
    const previousMonth = (): void => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };
    
    const nextMonth = (): void => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };
    
    const daysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };
    
    const firstDayOfMonth = (year: number, month: number): number => {
        return new Date(year, month, 1).getDay();
    };
    
    const renderCalendar = (): JSX.Element[] => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const days: JSX.Element[] = [];
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        
        // Previous month days
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
        }
        
        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            const isSelected = selected && date.toDateString() === selected.toDateString();
            const isToday = date.toDateString() === today.toDateString();
            
            days.push(
                <div 
                    key={`day-${i}`}
                    className={`${styles.calendarDay} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                    onClick={() => onSelectionChange(date)}
                >
                    {i}
                </div>
            );
        }
        
        return days;
    };
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
        <div id={id} className={styles.calendar}>
            <div className={styles.calendarHeader}>
                <div className={styles.monthYear}>{formatMonthYear(currentMonth)}</div>
                <div className={styles.calendarNav}>
                    <button className={styles.navButton} onClick={previousMonth}>&lt;</button>
                    <button className={styles.navButton} onClick={nextMonth}>&gt;</button>
                </div>
            </div>
            <div className={styles.weekdays}>
                {weekdays.map(day => (
                    <div key={day} className={styles.weekday}>{day}</div>
                ))}
            </div>
            <div className={styles.days}>
                {renderCalendar()}
            </div>
        </div>
    );
}; 