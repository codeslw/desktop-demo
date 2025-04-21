import { makeStyles, shorthands, Input, Popover, PopoverSurface, PopoverTrigger, Text } from '@fluentui/react-components';
import { SearchRegular, ChevronRightRegular } from '@fluentui/react-icons';
import { memo, useRef, useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';


interface StartMenuProps {
  onClose: () => void;
}

const useStyles = makeStyles({
  overlay: {
    // position: 'fixed',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // zIndex: 900
  },
  startMenu: {
    position: 'fixed',
    bottom: '70px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '660px',
    height: '700px',
    backgroundColor: 'var(--menu-bg)',
    // backdropFilter: 'var(--taskbar-backdrop-filter)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('16px', '24px', '28px', '24px'),
    zIndex: 1000,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column'
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '24px'
  },
  searchInput: {
    backgroundColor: 'var(--icon-hover-bg)',
    ...shorthands.borderRadius('24px'),
    ...shorthands.padding('10px', '16px', '10px', '40px'),
    width: '100%',
    height: '40px',
    fontSize: '14px',
    border: 'none',
    color: 'var(--text-color)',
    outline: 'none',
    '::placeholder': {
      color: 'var(--text-color-secondary)'
    }
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-color-secondary)',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchResultsContainer: {
    width: '660px',
    backgroundColor: 'var(--popover-bg)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('12px'),
    maxHeight: '400px',
    overflowY: 'auto',
    boxShadow: '0 8px 16px var(--shadow-color)',
    backdropFilter: 'blur(40px)'
  },
  searchCategories: {
    marginBottom: '8px'
  },
  searchCategoryTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-color-secondary)',
    ...shorthands.padding('8px', '12px', '4px', '12px'),
    textTransform: 'uppercase'
  },
  searchResult: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('10px', '12px'),
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    justifyContent: 'space-between',
    ':hover': {
      backgroundColor: 'var(--icon-hover-bg)'
    }
  },
  searchResultLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  searchResultIcon: {
    width: '24px',
    height: '24px',
    marginRight: '12px',
    objectFit: 'contain'
  },
  searchResultText: {
    color: 'var(--text-color)',
    fontSize: '14px'
  },
  searchResultChevron: {
    color: 'var(--text-color-secondary)',
    fontSize: '12px'
  },
  pinned: {
    marginBottom: '24px'
  },
  pinnedTitle: {
    fontSize: '15px',
    fontWeight: 'normal',
    margin: '0 0 16px 4px',
    color: 'var(--text-color-secondary)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridGap: '12px'
  },
  appIcon: {
    ...shorthands.borderRadius('4px'),
    width: '96px',
    height: '90px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('8px'),
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'var(--icon-hover-bg)'
    }
  },
  iconImg: {
    width: '40px',
    height: '40px',
    marginBottom: '8px'
  },
  appName: {
    fontSize: '12px',
    textAlign: 'center',
    color: 'var(--text-color)',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  recommendedSection: {
    marginTop: '20px'
  }
});

export const StartMenu = memo(({ onClose }: StartMenuProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const pinnedApps = [
    { id: 'edge', name: 'Microsoft Edge', icon: '/edge.svg' },
    { id: 'word', name: 'Word', icon: '/word.svg' },
    { id: 'powerpoint', name: 'PowerPoint', icon: '/power-point.svg' },
    { id: 'folders', name: 'File Explorer', icon: '/folders.svg' },
    { id: 'outlook', name: 'Outlook', icon: '/outlook.svg' },
    { id: 'store', name: 'Microsoft Store', icon: '/store.svg' },
    { id: 'photos', name: 'Photos', icon: '/pictures.svg' },
    { id: 'settings', name: 'Settings', icon: '/settings.svg' },
    { id: 'calculator', name: 'Calculator', icon: '/calculator.svg' },
    { id: 'spotify', name: 'Spotify', icon: '/spotify.svg' },
    { id: 'xbox', name: 'Xbox', icon: '/xbox.svg' },
    { id: 'notepad', name: 'Notepad', icon: '/notepad.svg' }
  ];

  const filteredApps = pinnedApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.startMenu} ref={menuRef}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>
            <SearchRegular />
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Type here to search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Popover open={showSearchResults} positioning={{ position: 'below', align: 'start' }}>
            <PopoverTrigger>
              <div style={{ display: 'none' }}></div>
            </PopoverTrigger>
            <PopoverSurface className={styles.searchResultsContainer}>
              {filteredApps.length > 0 ? (
                <>
                  <div className={styles.searchCategories}>
                    <Text className={styles.searchCategoryTitle}>Apps</Text>
                    {filteredApps.slice(0, 3).map(app => (
                      <div key={app.id} className={styles.searchResult}>
                        <div className={styles.searchResultLeft}>
                          <img src={app.icon} alt={app.name} className={styles.searchResultIcon} />
                          <span className={styles.searchResultText}>{app.name}</span>
                        </div>
                        <ChevronRightRegular className={styles.searchResultChevron} />
                      </div>
                    ))}
                  </div>

                  <div className={styles.searchCategories}>
                    <Text className={styles.searchCategoryTitle}>Documents</Text>
                    <div className={styles.searchResult}>
                      <div className={styles.searchResultLeft}>
                        <img src="/word.svg" alt="Document" className={styles.searchResultIcon} />
                        <span className={styles.searchResultText}>Recent {searchQuery} document.docx</span>
                      </div>
                      <ChevronRightRegular className={styles.searchResultChevron} />
                    </div>
                  </div>

                  <div className={styles.searchCategories}>
                    <Text className={styles.searchCategoryTitle}>Web Results</Text>
                    <div className={styles.searchResult}>
                      <div className={styles.searchResultLeft}>
                        <img src="/edge.svg" alt="Edge" className={styles.searchResultIcon} />
                        <span className={styles.searchResultText}>Search the web for "{searchQuery}"</span>
                      </div>
                      <ChevronRightRegular className={styles.searchResultChevron} />
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.searchResult}>
                  <span className={styles.searchResultText}>No results found for "{searchQuery}"</span>
                </div>
              )}
            </PopoverSurface>
          </Popover>
        </div>
        
        <div className={styles.pinned}>
          <h3 className={styles.pinnedTitle}>Pinned</h3>
          <div className={styles.grid}>
            {pinnedApps.map(app => (
              <div key={app.id} className={styles.appIcon}>
                <img src={app.icon} alt={app.name} className={styles.iconImg} />
                <span className={styles.appName}>{app.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.recommendedSection}>
          <h3 className={styles.pinnedTitle}>Recommended</h3>
          <div className={styles.grid}>
            {pinnedApps.slice(0, 6).map(app => (
              <div key={`rec-${app.id}`} className={styles.appIcon}>
                <img src={app.icon} alt={app.name} className={styles.iconImg} />
                <span className={styles.appName}>Recent {app.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
