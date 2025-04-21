import React from 'react';
import { Slider, Text, SliderProps } from '@fluentui/react-components';
import { useActionCenterStyles } from '../styles';

interface ActionCenterProps {
    isOpen: boolean;
    actionCenterRef: React.RefObject<HTMLDivElement>;
    theme: string;
    wifiEnabled: boolean;
    bluetoothEnabled: boolean;
    airplaneMode: boolean;
    batteryLevelOn: boolean;
    darkModeEnabled: boolean;
    accessibilityEnabled: boolean;
    volume: number;
    brightness: number;
    batteryPercent: number;
    toggleTheme: () => void;
    toggleQuickAction: (action: string) => void;
    setVolume: (value: number) => void;
    setBrightness: (value: number) => void;
}

// Custom slider with Windows 11 style
const Win11Slider: React.FC<SliderProps & { currentTheme: string }> = (props) => {
    const { currentTheme, ...rest } = props;
    const sliderColor = currentTheme === 'dark' ? '#60CDFF' : '#005FB8';
    
    return (
        <Slider
            {...rest}
            thumb={{
                style : {
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    backgroundColor: sliderColor,
                    
                }
            }}
            
            rail={{
                style : {
                    backgroundColor: sliderColor,
                    borderRadius: '10px',
                    width: '100%',
                    border: 'none',
                    fill: sliderColor,
                }
            }}
            style={{
                width : "100%",
                // '--slider-rail-background': 'rgba(200, 200, 200, 0.2)',
                // '--slider-rail-fill-background': sliderColor,
                // '--slider-thumb-background': sliderColor,
                // '--slider-thumb-border-radius': '50%',
                // '--slider-rail-height': '4px',
                // '--slider-thumb-size': '10px',
            
            } as React.CSSProperties}
        />
    );
};

export const ActionCenter: React.FC<ActionCenterProps> = ({
    isOpen,
    actionCenterRef,
    theme,
    wifiEnabled,
    bluetoothEnabled,
    airplaneMode,
    batteryLevelOn,
    darkModeEnabled,
    accessibilityEnabled,
    volume,
    brightness,
    batteryPercent,
    toggleTheme,
    toggleQuickAction,
    setVolume,
    setBrightness
}) => {
    const styles = useActionCenterStyles();
    const isDark = theme === 'dark';

    // Theme-specific styles
    const containerStyle = {
        backgroundColor: isDark ? '#202020' : '#ffffff',
        border: isDark ? '1px solid #333333' : '1px solid #e6e6e6'
    };
    
    const textColor = {
        color: isDark  ? '#ffffff' : '#000000'
    };
    
    const quickActionStyle = (active: boolean) => ({
        backgroundColor: active 
            ? (isDark ? '#60CDFF' : '#005FB8') 
            : (isDark ? '#2b2b2b' : '#f5f5f5'),
        border: isDark ? 'none' : '1px solid #0000000F'
    });
    
    const iconFilter = (active: boolean) => ({
        filter: active && !isDark
            ? 'brightness(0)'
            : (isDark && !active ? 'brightness(0) invert(1)' : 'brightness(0)') // White in dark mode, black in light mode
    });

    if (!isOpen) return null;

    // Quick actions as shown in the image
    const quickActions = [
        {
            id: 'wifi',
            icon: '/src/assets/icons/wifi.svg',
            label: 'Figma',
            active: wifiEnabled,
            onClick: () => toggleQuickAction('wifi')
        },
        {
            id: 'bluetooth',
            icon: '/src/assets/icons/bluetooth.svg',
            label: 'Bluetooth',
            active: bluetoothEnabled,
            onClick: () => toggleQuickAction('bluetooth')
        },
        {
            id: 'airplane',
            icon: '/src/assets/icons/airplane.svg',
            label: 'Airplane mode',
            active: airplaneMode,
            onClick: () => toggleQuickAction('airplane')
        },
        {
            id: 'batteryLevel',
            icon: '/src/assets/icons/battery-saver.svg',
            label: 'Battery saver',
            active: batteryLevelOn,
            onClick: () => toggleQuickAction('batteryLevel')
        },
        {
            id: 'darkMode',
            icon: '/src/assets/icons/moon.svg',
            label: 'Dark Mode',
            active: darkModeEnabled,
            onClick: toggleTheme
        },
        {
            id: 'accessibility',
            icon: '/src/assets/icons/happy-person.svg',
            label: 'Accessibility',
            active: accessibilityEnabled,
            onClick: () => toggleQuickAction('accessibility')
        }
    ];

    return (
        <div ref={actionCenterRef} className={styles.actionCenterPopup} style={containerStyle}>
            <div className={styles.actionCenterHeader}>
                <Text className={styles.actionCenterTitle} style={textColor}>Quick Settings</Text>
            </div>
            
            {/* Quick Actions Grid - 3x2 as in image */}
            <div className={styles.quickActions}>
                {quickActions.map(action => (
                    <div 
                        key={action.id}
                        className={styles.quickAction}
                        style={quickActionStyle(action.active)}
                        onClick={action.onClick}
                    >
                        <img 
                            src={action.icon} 
                            alt={action.label}
                            style={{
                                ...iconFilter(action.active),
                                filter: theme === "dark" || action.active ? "invert(0)" : "invert(1)",
                                width: '16px',
                                height: '16px'
                            }}
                        />
                    </div>
                ))}
            </div>
            
            {/* Sliders Section */}
            <div className={styles.slidersSection}>
                {/* Volume slider */}
                <div className={styles.sliderRow}>
                    <div className={styles.sliderIcon}>
                        <img 
                            src="/src/assets/icons/volume.svg" 
                            alt="Volume"
                            width="16"
                            height="16"
                            style={iconFilter(false)}
                        />
                    </div>
                    <div className={styles.sliderControl}>
                        <Win11Slider
                            value={volume}
                            min={0}
                            max={100}
                            onChange={(_, data) => setVolume(data.value)}
                            currentTheme={theme}
                        />
                    </div>
                    {/* <div className={styles.sliderArrow}>
                        <img 
                            src="/src/assets/icons/chevron-top.svg" 
                            alt="More"
                            style={{ 
                                transform: 'rotate(90deg)', 
                                width: '16px', 
                                height: '16px',
                                ...iconFilter(false)
                            }}
                        />
                    </div> */}
                </div>
                
                {/* Brightness slider */}
                <div className={styles.sliderRow}>
                    <div className={styles.sliderIcon}>
                        <img 
                            src="/src/assets/icons/sun.svg" 
                            alt="Brightness"
                            width="22"
                            height="22"
                            style={iconFilter(false)}
                        />
                    </div>
                    <div className={styles.sliderControl}>
                        <Win11Slider
                            value={brightness}
                            min={0}
                            max={100}
                            onChange={(_, data) => setBrightness(data.value)}
                            currentTheme={theme}
                        />
                    </div>
                    {/* <div className={styles.sliderArrow}>
                    </div> */}
                </div>
            </div>
            
            {/* Battery section */}
            <div className={styles.batteryInfo} style={{borderTop: isDark ? '1px solid #333333' : '1px solid #e6e6e6'}}>
                <div className={styles.batteryIcon}>
                    <img 
                        src="/src/assets/icons/battery.svg" 
                        alt="Battery"
                        width="20"
                        height="20"
                        style={iconFilter(false)}
                    />
                </div>
                <div className={styles.batteryText}>
                    <Text style={textColor}>{batteryPercent}%</Text>
                </div>
                <div className={styles.editButton}>
                    <img 
                        src="/src/assets/icons/pencil.svg" 
                        alt="Edit"
                        width="18"
                        height="18"
                        style={iconFilter(false)}
                    />
                </div>
                <div className={styles.settingsButton}>
                    <img 
                        src="/src/assets/icons/settings.svg" 
                        alt="Settings"
                        width="18"
                        height="18"
                        style={iconFilter(false)}
                    />
                </div>
            </div>
        </div>
    );
}; 