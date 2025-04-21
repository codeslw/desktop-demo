import React, { memo, useState, useEffect, useRef } from 'react';
import { useId, makeStyles, shorthands, mergeClasses } from '@fluentui/react-components';
import { TaskbarButton } from '../../../molecules/TaskbarButton';
import { useTheme } from '../../../../contexts/ThemeContext';
import { StartMenu } from '../../StartMenu';
import { useTaskbarStyles } from '../styles';
import { taskbarApps } from '../data';
import { ActionCenter } from './ActionCenter';
import { Calendar } from './Calendar';

export const Taskbar = memo(() => {
    const styles = useTaskbarStyles();
    const { theme, toggleTheme } = useTheme();
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [actionCenterOpen, setActionCenterOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    
    // Create refs for click outside detection
    const actionCenterRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    
    // Quick actions states
    const [wifiEnabled, setWifiEnabled] = useState(true);
    const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
    const [airplaneMode, setAirplaneMode] = useState(false);
    const [batteryMode, setBatteryMode] = useState('Best performance');
    const [castEnabled, setCastEnabled] = useState(false);
    const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
    const [nightMode, setNightMode] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    
    // Slider states
    const [volume, setVolume] = useState(75);
    const [brightness, setBrightness] = useState(80);
    const [batteryPercent, setBatteryPercent] = useState(85);
    
    // Calendar state
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if clicked element is part of action center
            const isActionCenterClicked = 
                actionCenterRef.current?.contains(event.target as Node) ||
                (event.target as Element).closest?.('.action-center-trigger') !== null;

            // Check if clicked element is part of calendar
            const isCalendarClicked = 
                calendarRef.current?.contains(event.target as Node) ||
                (event.target as Element).closest?.('.calendar-trigger') !== null;
            
            // Close popovers if clicked outside
            if (!isActionCenterClicked) {
                setActionCenterOpen(false);
            }
            
            if (!isCalendarClicked) {
                setCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const toggleStartMenu = () => {
        setStartMenuOpen(!startMenuOpen);
    };

    const toggleActionCenter = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActionCenterOpen(!actionCenterOpen);
        // Close calendar popup if open
        if (calendarOpen) setCalendarOpen(false);
    };

    const toggleCalendar = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCalendarOpen(!calendarOpen);
        // Close action center popup if open
        if (actionCenterOpen) setActionCenterOpen(false);
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const handleCalendarChange = (date: Date): void => {
        setSelectedDate(date);
    };

    const toggleQuickAction = (action: string): void => {
        switch (action) {
            case 'wifi':
                setWifiEnabled(!wifiEnabled);
                break;
            case 'bluetooth':
                setBluetoothEnabled(!bluetoothEnabled);
                break;
            case 'airplane':
                setAirplaneMode(!airplaneMode);
                break;
            case 'cast':
                setCastEnabled(!castEnabled);
                break;
            case 'accessibility':
                setAccessibilityEnabled(!accessibilityEnabled);
                break;
            case 'nightMode':
                setNightMode(!nightMode);
                break;
            case 'focus':
                setFocusMode(!focusMode);
                break;
            case 'theme':
                toggleTheme();
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.taskbar_wrapper}>
            {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} />}
            <div className={styles.taskbar}>
                {taskbarApps.map(app => (
                    <TaskbarButton
                        key={app.id}
                        icon={app.icon}
                        alt={app.alt}
                        onClick={app.id === 'start' ? toggleStartMenu :
                            app.id === 'settings' ? () => console.log('Settings clicked') :
                                () => console.log(`${app.alt} clicked`)}
                        active={app.id === 'start' && startMenuOpen}
                    />
                ))}

                <div className={styles.rightSection}>
                    {/* Action Center trigger */}
                    <div 
                        className={mergeClasses(
                            styles.actionCenterTrigger,
                            'action-center-trigger'
                        )}
                        onClick={toggleActionCenter}
                    >
                        <TaskbarButton
                            icon="/wifi.svg"
                            alt="WiFi"
                            size='small'
                        />
                        <TaskbarButton
                            icon="/volume.svg"
                            alt="Volume"
                            size='small'
                        />
                        <TaskbarButton
                            icon="/battery.svg"
                            alt="Battery"
                            size='small'
                        />
                    </div>

                    {/* Calendar trigger */}
                    <div 
                        className={mergeClasses(
                            styles.timeSection,
                            'calendar-trigger'
                        )}
                        onClick={toggleCalendar}
                    >
                        <div className={styles.time}>{formatTime(currentTime)}</div>
                        <div className={styles.date}>{formatDate(currentTime)}</div>
                    </div>
                    
                    {/* Action Center Popup */}
                    <ActionCenter 
                        isOpen={actionCenterOpen}
                        actionCenterRef={actionCenterRef}
                        theme={theme}
                        wifiEnabled={wifiEnabled}
                        bluetoothEnabled={bluetoothEnabled}
                        airplaneMode={airplaneMode}
                        batteryLevelOn={focusMode}
                        darkModeEnabled={theme === 'dark'}
                        accessibilityEnabled={accessibilityEnabled}
                        volume={volume}
                        brightness={brightness}
                        batteryPercent={batteryPercent}
                        toggleTheme={toggleTheme}
                        toggleQuickAction={toggleQuickAction}
                        setVolume={value => setVolume(value)}
                        setBrightness={value => setBrightness(value)}
                    />
                    
                    {/* Calendar Popup */}
                    <Calendar 
                        isOpen={calendarOpen}
                        selectedDate={selectedDate}
                        onDateChange={handleCalendarChange}
                        calendarRef={calendarRef}
                    />
                </div>
            </div>
        </div>
    );
}); 