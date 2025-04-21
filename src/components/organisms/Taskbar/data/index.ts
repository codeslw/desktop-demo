// Define the app icons for the taskbar
export const taskbarApps = [
    { id: 'start', icon: '/start.svg', alt: 'Start Menu' },
    { id: 'search', icon: '/search-taskbar.svg', alt: 'Search' },
    { id: 'explorer', icon: '/file-explorer.svg', alt: 'File Explorer' },
    { id: 'edge', icon: '/edge.svg', alt: 'Microsoft Edge' },
    { id: 'store', icon: '/store.svg', alt: 'Microsoft Store' },
    { id: 'settings', icon: '/settings.svg', alt: 'Settings' }
];

// Define quick action data
export const getQuickActions = (
    wifiEnabled: boolean,
    bluetoothEnabled: boolean,
    airplaneMode: boolean,
    theme: string,
    castEnabled: boolean,
    accessibilityEnabled: boolean,
    nightMode: boolean,
    focusMode: boolean,
    toggleTheme: () => void,
    toggleQuickAction: (action: string) => void
) => [
    {
        id: 'wifi',
        icon: '/wifi.svg',
        label: 'WiFi',
        active: wifiEnabled,
        onClick: () => toggleQuickAction('wifi')
    },
    {
        id: 'bluetooth',
        icon: '/bluetooth.svg',
        label: 'Bluetooth',
        active: bluetoothEnabled,
        onClick: () => toggleQuickAction('bluetooth')
    },
    {
        id: 'airplane',
        icon: '/airplane.svg',
        label: 'Airplane mode',
        active: airplaneMode,
        onClick: () => toggleQuickAction('airplane')
    },
    {
        id: 'theme',
        icon: theme === 'dark' ? '/moon.svg' : '/sun.svg',
        label: theme === 'dark' ? 'Light theme' : 'Dark theme',
        active: theme === 'dark',
        onClick: toggleTheme
    },
    {
        id: 'cast',
        icon: '/desktop-manager.svg',
        label: 'Cast',
        active: castEnabled,
        onClick: () => toggleQuickAction('cast')
    },
    {
        id: 'accessibility',
        icon: '/happy-person.svg',
        label: 'Accessibility',
        active: accessibilityEnabled,
        onClick: () => toggleQuickAction('accessibility')
    },
    {
        id: 'nightMode',
        icon: '/moon.svg',
        label: 'Night light',
        active: nightMode,
        onClick: () => toggleQuickAction('nightMode')
    },
    {
        id: 'batteryMode',
        icon: '/battery-saver.svg',
        label: 'Battery saver',
        active: focusMode,
        onClick: () => toggleQuickAction('focus')
    }
];

// Fake notification data
export const notificationsData = [
    {
        id: 1,
        title: 'Windows Update',
        body: 'Updates are available for your device. Click to install them.',
        time: '2 hours ago'
    },
    {
        id: 2,
        title: 'Microsoft Edge',
        body: 'Your browsing is protected. Your security settings are up to date.',
        time: '5 hours ago'
    }
]; 