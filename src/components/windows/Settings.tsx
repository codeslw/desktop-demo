import { makeStyles, shorthands, Text, mergeClasses, Input } from '@fluentui/react-components';
import { memo, useState } from 'react';
import { Window } from '../organisms/Window';
import { useWindowContext } from '../../contexts/WindowContext';
import { 
  Search20Regular,
  Settings20Regular,
  Laptop20Regular,
  Wifi2Regular,
  Bluetooth20Regular,
  PersonAccounts20Regular,
  Timer20Regular,
  Games20Regular,
  Accessibility20Regular,
  LockClosed20Regular,
  AppsListDetail20Regular,
  ColorBackground20Regular,
  Speaker0Regular,
  Alert20Regular,
  WindowDevTools20Regular,
  Storage20Regular,
  Document20Regular,
  WindowNew20Regular
} from '@fluentui/react-icons';

// Define the styles for the Settings window
const useSettingsStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--window-content-bg)',
    color: 'var(--text-color)',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 32px 8px',
    backgroundColor: 'var(--window-toolbar-bg)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    margin: '10px 0 20px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '680px',
    position: 'relative',
    marginBottom: '16px',
  },
  searchInput: {
    backgroundColor: 'var(--window-bg)',
    borderRadius: '4px',
    width: '100%',
    height: '36px',
    ...shorthands.padding('4px', '8px', '4px', '40px'),
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    '&:focus-within': {
      ...shorthands.borderColor('var(--window-accent)'),
    },
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '8px',
    color: 'var(--text-color-secondary)',
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '240px',
    borderRight: '1px solid var(--window-border)',
    backgroundColor: 'var(--window-toolbar-bg)',
    overflowY: 'auto',
    paddingTop: '12px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    cursor: 'pointer',
    borderRadius: '4px',
    margin: '2px 8px',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
    },
  },
  navItemActive: {
    backgroundColor: 'var(--icon-selected-bg)',
    '&:hover': {
      backgroundColor: 'var(--icon-selected-hover-bg)',
    },
  },
  navIcon: {
    marginRight: '16px',
    color: 'var(--text-color)',
    fontSize: '20px',
  },
  navLabel: {
    fontSize: '14px',
  },
  mainContent: {
    flex: 1,
    padding: '24px 32px',
    overflowY: 'auto',
  },
  categoryTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  card: {
    backgroundColor: 'var(--window-toolbar-bg)',
    borderRadius: '8px',
    ...shorthands.padding('16px'),
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardIcon: {
    marginRight: '12px',
    color: 'var(--window-accent)',
    fontSize: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: '13px',
    color: 'var(--text-color-secondary)',
    marginTop: '4px',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
  },
  profileAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'var(--window-accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    marginRight: '16px',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileName: {
    fontSize: '20px',
    fontWeight: '600',
  },
  accountLink: {
    color: 'var(--window-accent)',
    marginTop: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px',
  },
});

// Define the types of categories for the settings
interface SettingsCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const Settings = memo(() => {
  const styles = useSettingsStyles();
  const { windows } = useWindowContext();
  const [activeCategory, setActiveCategory] = useState<string>('system');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Log that Settings component is rendering
  console.log('Settings component is rendering');
  
  // Define the settings categories
  const categories: SettingsCategory[] = [
    { id: 'system', name: 'System', icon: <Laptop20Regular className={styles.navIcon} /> },
    { id: 'bluetooth', name: 'Bluetooth & devices', icon: <Bluetooth20Regular className={styles.navIcon} /> },
    { id: 'network', name: 'Network & internet', icon: <Wifi2Regular className={styles.navIcon} /> },
    { id: 'personalization', name: 'Personalization', icon: <ColorBackground20Regular className={styles.navIcon} /> },
    { id: 'apps', name: 'Apps', icon: <AppsListDetail20Regular className={styles.navIcon} /> },
    { id: 'accounts', name: 'Accounts', icon: <PersonAccounts20Regular className={styles.navIcon} /> },
    { id: 'time', name: 'Time & language', icon: <Timer20Regular className={styles.navIcon} /> },
    { id: 'gaming', name: 'Gaming', icon: <Games20Regular className={styles.navIcon} /> },
    { id: 'accessibility', name: 'Accessibility', icon: <Accessibility20Regular className={styles.navIcon} /> },
    { id: 'privacy', name: 'Privacy & security', icon: <LockClosed20Regular className={styles.navIcon} /> },
    { id: 'windows', name: 'Windows Update', icon: <WindowNew20Regular className={styles.navIcon} /> },
  ];

  // Handle category selection
  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
  };

  // System cards for when system category is selected
  const systemCards = [
    { id: 'display', title: 'Display', icon: <Laptop20Regular className={styles.cardIcon} />, description: 'Brightness, night light, display profile' },
    { id: 'sound', title: 'Sound', icon: <Speaker0Regular className={styles.cardIcon} />, description: 'Volume, troubleshooting, spatial sound' },
    { id: 'notifications', title: 'Notifications', icon: <Alert20Regular className={styles.cardIcon} />, description: 'App notifications, do not disturb' },
    { id: 'focus', title: 'Focus', icon: <WindowDevTools20Regular className={styles.cardIcon} />, description: 'Focus sessions, priority notifications' },
    { id: 'storage', title: 'Storage', icon: <Storage20Regular className={styles.cardIcon} />, description: 'Storage usage, cleanup recommendations' },
    { id: 'multitasking', title: 'Multitasking', icon: <Document20Regular className={styles.cardIcon} />, description: 'Snap layouts, desktops, alt-tab' },
  ];

  // Render system settings content
  const renderSystemContent = () => (
    <div>
      <Text className={styles.categoryTitle}>System</Text>
      <div className={styles.cardGrid}>
        {systemCards.map(card => (
          <div key={card.id} className={styles.card}>
            <div className={styles.cardHeader}>
              {card.icon}
              <Text className={styles.cardTitle}>{card.title}</Text>
            </div>
            <Text className={styles.cardDescription}>{card.description}</Text>
          </div>
        ))}
      </div>
    </div>
  );

  // Render accounts settings content (example)
  const renderAccountsContent = () => (
    <div>
      <Text className={styles.categoryTitle}>Accounts</Text>
      
      <div className={styles.profileSection}>
        <div className={styles.profileAvatar}>U</div>
        <div className={styles.profileInfo}>
          <Text className={styles.profileName}>User</Text>
          <Text className={styles.accountLink}>Manage your Microsoft account</Text>
        </div>
      </div>
      
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Your info</Text>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <PersonAccounts20Regular className={styles.cardIcon} />
            <Text className={styles.cardTitle}>Account settings</Text>
          </div>
          <Text className={styles.cardDescription}>
            Sign-in options, personal info, work access, email
          </Text>
        </div>
      </div>
      
      <div className={styles.section}>
        <Text className={styles.sectionTitle}>Account settings</Text>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <LockClosed20Regular className={styles.cardIcon} />
              <Text className={styles.cardTitle}>Sign-in options</Text>
            </div>
            <Text className={styles.cardDescription}>
              Password, PIN, fingerprint, security key
            </Text>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <WindowNew20Regular className={styles.cardIcon} />
              <Text className={styles.cardTitle}>Windows backup</Text>
            </div>
            <Text className={styles.cardDescription}>
              Back up your Windows experience to the cloud
            </Text>
          </div>
        </div>
      </div>
    </div>
  );

  // Render content based on active category
  const renderContent = () => {
    switch (activeCategory) {
      case 'system':
        return renderSystemContent();
      case 'accounts':
        return renderAccountsContent();
      default:
        return (
          <div>
            <Text className={styles.categoryTitle}>{categories.find(c => c.id === activeCategory)?.name}</Text>
            <Text>This settings category is not implemented in the demo.</Text>
          </div>
        );
    }
  };

  return (
    <Window
      id="settings"
      title="Settings"
      icon="/settings.svg"
      initialWidth={1000}
      initialHeight={700}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <Text className={styles.title}>Settings</Text>
          <div className={styles.searchBar}>
            <Search20Regular className={styles.searchIcon} />
            <Input 
              className={styles.searchInput}
              placeholder="Find a setting"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.sidebar}>
            {categories.map(category => (
              <div
                key={category.id}
                className={mergeClasses(
                  styles.navItem,
                  activeCategory === category.id && styles.navItemActive
                )}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.icon}
                <Text className={styles.navLabel}>{category.name}</Text>
              </div>
            ))}
          </div>
          <div className={styles.mainContent}>
            {renderContent()}
          </div>
        </div>
      </div>
    </Window>
  );
}); 