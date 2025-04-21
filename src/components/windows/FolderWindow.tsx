import { makeStyles, shorthands, Text, mergeClasses } from '@fluentui/react-components';
import { memo, useState, useEffect } from 'react';
import { Window } from '../organisms/Window';
import { ContextMenu, ContextMenuItem } from '../molecules/ContextMenu';
import { useWindowContext, SnapRegion } from '../../contexts/WindowContext';
import { SnapLayoutOverlay } from '../molecules/SnapLayoutOverlay';
import { Toolbar } from '../molecules/Toolbar';
import { PathBar } from '../molecules/PathBar';
import { FileItem } from '../molecules/FileItem';
import { ArrowLeft20Regular, ArrowRight20Regular, ArrowStepBack20Regular, ArrowStepIn20Regular, ArrowUp20Regular, List20Regular, Search20Regular, Settings20Regular, Window20Regular } from '@fluentui/react-icons';
import { DEFAULT_WINDOW_ITEMS } from '../../utils/constants';

// Define folder view types
export type FolderViewType = 'icons' | 'details' | 'tiles' | 'list';

export interface FolderItem {
  id: string;
  name: string;
  icon: string;
  type: 'file' | 'folder' | 'drive';
  dateModified?: string;
  size?: string;
  location?: string;
}

interface FolderWindowProps {
  id: string;
  title: string;
  icon: string;
  path: string;
  items: FolderItem[];
  initialWidth?: number;
  initialHeight?: number;
  onOpenFolder?: (folderId: string, path: string) => void;
  onOpenFile?: (fileId: string, path: string) => void;
  onOpenFolderInNewWindow?: (folderId: string, path: string, folderItems: FolderItem[]) => void;
}

// Define a history entry type to store complete state
interface NavigationHistoryEntry {
  path: string;
  items: FolderItem[];
  title: string;
}

// Toolbar component
const FolderToolbar = memo(({ children }: { children: React.ReactNode }) => {
  const styles = useFolderStyles();
  return <div className={styles.toolbar}>{children}</div>;
});

// Toolbar button
const FolderToolbarButton = memo(({
  icon,
  label,
  onClick,
  divider
}: {
  icon?: string;
  label?: string;
  onClick?: () => void;
  divider?: boolean;
}) => {
  const styles = useFolderStyles();

  if (divider) {
    return <div className={styles.toolbarDivider} />;
  }

  return (
    <button className={styles.toolbarButton} onClick={onClick}>
      {icon ? <img src={icon} alt="" className={styles.buttonIcon} /> : null}
      {label && <span>{label}</span>}
    </button>
  );
});

// Address bar component
const AddressBar = memo(({
  path,
  icon
}: {
  path: string;
  icon: string;
}) => {
  const styles = useFolderStyles();

  return (
    <div className={styles.addressBar}>
      <div className={styles.addressBarPath}>
        <img src={icon} alt="Icon" style={{ width: '18px', height: '18px', marginRight: '8px' }} />
        <span>{path}</span>
      </div>
      <div className={styles.searchBar}>
        <span style={{ marginRight: '4px' }}>🔍</span>
        <span>Search</span>
      </div>
    </div>
  );
});

// Sidebar component
const Sidebar = memo(({
  activePath,
  onNavigate
}: {
  activePath: string;
  onNavigate?: (path: string) => void;
}) => {
  const styles = useFolderStyles();

  return (
    <div className={styles.sidebar}>
      <div className={styles.navSection}>
        <div className={styles.navTitle}>Quick access</div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'This PC' && styles.navItemActive
          )}
          onClick={() => onNavigate?.('This PC')}
        >
          <img src="/src/assets/icons/thispc.svg" alt="This PC" className={styles.navIcon} />
          <span>This PC</span>
        </div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'Desktop' && styles.navItemActive
          )}
          onClick={() => onNavigate?.('Desktop')}
        >
          <img src="/src/assets/icons/folders.svg" alt="Desktop" className={styles.navIcon} />
          <span>Desktop</span>
        </div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'Documents' && styles.navItemActive
          )}
          onClick={() => onNavigate?.('Documents')}
        >
          <img src="/src/assets/icons/folders.svg" alt="Documents" className={styles.navIcon} />
          <span>Documents</span>
        </div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'Downloads' && styles.navItemActive
          )}
          onClick={() => onNavigate?.('Downloads')}
        >
          <img src="/src/assets/icons/folders.svg" alt="Downloads" className={styles.navIcon} />
          <span>Downloads</span>
        </div>
      </div>
      <div className={styles.navSection}>
        <div className={styles.navTitle}>OneDrive</div>
        <div className={styles.navItem}>
          <span>OneDrive</span>
        </div>
      </div>
    </div>
  );
});

// Status bar component
const StatusBar = memo(({ itemCount }: { itemCount: number }) => {
  const styles = useFolderStyles();

  return (
    <div className={styles.statusBar}>
      <span>{itemCount} items</span>
    </div>
  );
});

// Common styles for folder windows
const useFolderStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--window-content-bg)',
    color: 'var(--text-color)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    height: '46px',
    backgroundColor: 'var(--window-toolbar-bg)',
    ...shorthands.borderBottom('1px', 'solid', 'var(--window-border)'),
    ...shorthands.padding('0', '12px'),
    gap: '4px',
  },
  toolbarButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('6px', '10px'),
    ...shorthands.borderRadius('4px'),
    ...shorthands.margin('0', '2px'),
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    color: 'var(--text-color)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
    },
    transition: 'background-color 0.15s ease',
    fontSize: '13px',
    gap: '6px',
    height: '34px',
    minWidth: 'unset'
  },
  toolbarSeparator: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--window-border)',
    ...shorthands.margin('0', '8px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-color-secondary)',
    opacity: 0.5,
  },
  buttonIcon: {
    width: '16px',
    height: '16px',
  },
  toolbarDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--window-border)',
    ...shorthands.margin('0', '8px'),
  },
  addressBar: {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    backgroundColor: 'var(--window-addressbar-bg)',
    ...shorthands.borderBottom('1px', 'solid', 'var(--window-border)'),
    ...shorthands.padding('0', '16px'),
  },
  addressBarPath: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    flexGrow: 1,
    ...shorthands.padding('8px', '10px'),
    backgroundColor: 'var(--window-bg)',
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    transition: 'border-color 0.15s ease',
    '&:hover': {
      ...shorthands.borderColor('var(--window-accent)'),
    },
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    width: '220px',
    ...shorthands.padding('8px', '10px'),
    ...shorthands.margin('0', '8px'),
    backgroundColor: 'var(--window-bg)',
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    transition: 'border-color 0.15s ease',
    '&:hover': {
      ...shorthands.borderColor('var(--window-accent)'),
    },
  },
  sidebar: {
    width: '220px',
    ...shorthands.borderRight('1px', 'solid', 'var(--window-border)'),
    backgroundColor: 'var(--window-sidebar-bg)',
    ...shorthands.padding('12px', '0'),
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
  },
  mainContent: {
    flexGrow: 1,
    ...shorthands.padding('20px'),
    overflow: 'auto',
    position: 'relative',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    ...shorthands.margin('0', '0', '16px', '0'),
    color: 'var(--window-title-color)',
  },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    ...shorthands.gap('12px'),
    ...shorthands.margin('0', '0', '24px', '0'),
  },
  folderItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', 'transparent'),
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--window-item-hover-bg)',
      ...shorthands.borderColor('var(--window-border)'),
    },
    transition: 'all 0.15s ease',
    userSelect: 'none',
  },
  selectedItem: {
    backgroundColor: 'var(--icon-selected-bg)',
    ...shorthands.borderColor('var(--window-accent)'),
    '&:hover': {
      backgroundColor: 'var(--icon-selected-hover-bg)',
    },
  },
  itemIcon: {
    width: '32px',
    height: '32px',
    ...shorthands.margin('0', '12px', '0', '0'),
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500',
    ...shorthands.margin('0', '0', '4px', '0'),
  },
  itemInfo: {
    fontSize: '12px',
    color: 'var(--text-color-secondary)',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    height: '28px',
    backgroundColor: 'var(--window-statusbar-bg)',
    ...shorthands.borderTop('1px', 'solid', 'var(--window-border)'),
    ...shorthands.padding('0', '16px'),
    fontSize: '12px',
    color: 'var(--text-color-secondary)',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('8px', '16px'),
    fontSize: '14px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--window-item-hover-bg)',
    },
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    backgroundColor: 'var(--icon-hover-bg)',
    borderLeftColor: 'var(--window-accent)',
  },
  navIcon: {
    width: '18px',
    height: '18px',
    ...shorthands.margin('0', '10px', '0', '0'),
  },
  navSection: {
    ...shorthands.margin('0', '0', '20px', '0'),
  },
  navTitle: {
    fontSize: '12px',
    fontWeight: '600',
    ...shorthands.padding('4px', '18px'),
    color: 'var(--text-color-secondary)',
    textTransform: 'uppercase',
  },
});

export const FolderWindow = memo(({
  id,
  title,
  icon,
  path,
  items,
  initialWidth = 900,
  initialHeight = 650,
  onOpenFolder,
  onOpenFile,
  onOpenFolderInNewWindow
}: FolderWindowProps) => {
  const styles = useFolderStyles();
  const { openWindow, getWindowById, snapWindow, getSnapRegionFromPosition, updateWindowContent, getAllWindows } = useWindowContext();

  // State for selected items and context menu
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    isVisible: boolean;
    itemId?: string;
  }>({
    x: 0,
    y: 0,
    isVisible: false
  });

  // State for navigation history - store complete state
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  
  // State for current folder items and path
  const [currentPath, setCurrentPath] = useState(path);
  const [currentItems, setCurrentItems] = useState(items);
  const [currentTitle, setCurrentTitle] = useState(title);

  // State for snap layout
  const [showSnapLayout, setShowSnapLayout] = useState(false);
  
  // Window positioning - center window if it's the first one
  useEffect(() => {
    const allWindows = getAllWindows();
    // If this is the first window or there's only one window (this one), center it
    if (allWindows.length <= 1) {
      const windowElement = document.getElementById(`window-${id}`);
      if (windowElement) {
        // Get screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Calculate center position
        const left = Math.max(0, (screenWidth - initialWidth) / 2);
        const top = Math.max(0, (screenHeight - initialHeight) / 2);
        
        // Update window position
        windowElement.style.left = `${left}px`;
        windowElement.style.top = `${top}px`;
      }
    }
  }, [id, initialWidth, initialHeight, getAllWindows]);

  // Initialize with provided props
  useEffect(() => {
    // Set current state
    setCurrentPath(path);
    setCurrentItems(items);
    setCurrentTitle(title);
    
    // Initialize navigation history with initial state
    setNavigationHistory([{ path, items, title }]);
    setCurrentHistoryIndex(0);
    
    console.log('FolderWindow initialized with path:', path);
  }, [path, items, title]);

  // Debug effect to log navigation history changes
  useEffect(() => {
    console.log('Navigation state updated:', {
      history: navigationHistory.map(entry => entry.path),
      currentIndex: currentHistoryIndex,
      currentPath,
      historyLength: navigationHistory.length
    });
  }, [navigationHistory, currentHistoryIndex, currentPath]);

  // Listen for custom snap preview events from Window component
  useEffect(() => {
    const handleSnapPreview = (e: CustomEvent) => {
      const detail = e.detail as { windowId: string; x: number; y: number };
      if (detail.windowId === id) {
        setShowSnapLayout(true);
      }
    };

    const handleSnapPreviewEnd = (e: CustomEvent) => {
      const detail = e.detail as { windowId: string };
      if (detail.windowId === id) {
        setShowSnapLayout(false);
      }
    };

    window.addEventListener('window-snap-preview', handleSnapPreview as EventListener);
    window.addEventListener('window-snap-preview-end', handleSnapPreviewEnd as EventListener);

    return () => {
      window.removeEventListener('window-snap-preview', handleSnapPreview as EventListener);
      window.removeEventListener('window-snap-preview-end', handleSnapPreviewEnd as EventListener);
    };
  }, [id]);

  // Navigation functions
  const navigateToPath = (targetPath: string, newItems?: FolderItem[], newTitle?: string) => {
    console.log('Navigating to:', targetPath, 'Current index:', currentHistoryIndex, 'History length:', navigationHistory.length);
    
    // Normalize targetPath for special paths
    const normalizedPath = targetPath === 'This PC' ? '' : targetPath;
    
    // Check if we're navigating to the same path
    if (normalizedPath === currentPath) {
      console.log('Already at this path, not updating history');
      return;
    }
    
    // Check if this path exists in history
    const existingPathIndex = navigationHistory.findIndex(entry => entry.path === normalizedPath);
    
    if (existingPathIndex >= 0) {
      // Path exists in history, use it directly
      console.log('Path already exists in history at index:', existingPathIndex);
      const historyEntry = navigationHistory[existingPathIndex];
      setCurrentPath(historyEntry.path);
      setCurrentItems(historyEntry.items);
      setCurrentTitle(historyEntry.title);
      setCurrentHistoryIndex(existingPathIndex);
      
      // Update window content
      updateWindowContent(id, historyEntry.title, historyEntry.path, historyEntry.items);
      return;
    }
    
    // Extract title from path or use the provided one
    let effectiveTitle = newTitle;
    if (!effectiveTitle) {
      const pathParts = normalizedPath.split('/').filter(Boolean);
      effectiveTitle = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'This PC';
    }
    
    // Prepare items for the new path
    let effectiveItems: FolderItem[] = [];
    
    if (newItems && newItems.length > 0) {
      effectiveItems = newItems;
    } else if (normalizedPath === '') {
      // Default items for root/This PC
      effectiveItems = [
        {
          id: 'drive-c',
          name: 'Local Disk (C:)',
          type: 'drive',
          icon: '/src/assets/icons/ssd.svg',
          size: '120 GB free of 500 GB'
        },
        {
          id: 'documents',
          name: 'Documents',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: 'downloads',
          name: 'Downloads',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        }
      ];
    } else {
      // Generate default items for the path
      effectiveItems = [
        {
          id: `${normalizedPath}-subfolder1`,
          name: 'Subfolder',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: `${normalizedPath}-file1`,
          name: 'Document.txt',
          type: 'file',
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Today'
        }
      ];
    }
    
    const newHistoryEntry = { 
      path: normalizedPath, 
      items: effectiveItems, 
      title: effectiveTitle 
    };
    
    // Only add to history if this is a new navigation (not back/forward)
    // We determine this by checking if we're at the end of our history array
    const isNewNavigation = currentHistoryIndex === navigationHistory.length - 1;
    
    let newIndex = currentHistoryIndex;
    
    if (isNewNavigation) {
      console.log('Adding new path to history');
      // Add the new entry to history, removing any forward history
      const newHistory = [
        ...navigationHistory.slice(0, currentHistoryIndex + 1), 
        newHistoryEntry
      ];
      setNavigationHistory(newHistory);
      newIndex = newHistory.length - 1;
      setCurrentHistoryIndex(newIndex);
    } else {
      // If we're using back/forward navigation, just update the position
      newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
    }
    
    // Update the current state
    setCurrentPath(normalizedPath);
    setCurrentItems(effectiveItems);
    setCurrentTitle(effectiveTitle);
    
    // Log the updated history state
    console.log('History updated:', {
      newEntry: newHistoryEntry,
      newIndex: newIndex,
      historyLength: isNewNavigation ? navigationHistory.length + 1 : navigationHistory.length
    });
    
    // Update window content
    updateWindowContent(id, effectiveTitle, normalizedPath, effectiveItems);
  };
  
  // Handle back navigation
  const handleBack = () => {
    console.log('Back button clicked. Current index:', currentHistoryIndex, 'History length:', navigationHistory.length);
    
    if (currentHistoryIndex > 0) {
      const targetIndex = currentHistoryIndex - 1;
      const historyEntry = navigationHistory[targetIndex];
      
      console.log('Navigating back to:', historyEntry.path, 'Index:', targetIndex, 'Entry:', historyEntry);
      
      // Update state directly from history - no need to regenerate items
      setCurrentPath(historyEntry.path);
      setCurrentItems(historyEntry.items);
      setCurrentHistoryIndex(targetIndex);
      setCurrentTitle(historyEntry.title);
      
      // Update window content
      updateWindowContent(id, historyEntry.title, historyEntry.path, historyEntry.items);
    } else {
      console.log('Cannot go back - at the beginning of history');
    }
  };
  
  // Handle forward navigation
  const handleForward = () => {
    console.log('Forward button clicked. Current index:', currentHistoryIndex, 'History length:', navigationHistory.length);
    
    if (currentHistoryIndex < navigationHistory.length - 1) {
      const targetIndex = currentHistoryIndex + 1;
      const historyEntry = navigationHistory[targetIndex];
      
      console.log('Navigating forward to:', historyEntry.path, 'Index:', targetIndex, 'Entry:', historyEntry);
      
      // Update state directly from history - no need to regenerate items
      setCurrentPath(historyEntry.path);
      setCurrentItems(historyEntry.items);
      setCurrentHistoryIndex(targetIndex);
      setCurrentTitle(historyEntry.title);
      
      // Update window content
      updateWindowContent(id, historyEntry.title, historyEntry.path, historyEntry.items);
    } else {
      console.log('Cannot go forward - at the end of history');
    }
  };
  
  // Handle breadcrumb navigation
  const handleBreadcrumbNavigation = (targetPath: string) => {
    console.log('Breadcrumb navigation to:', targetPath);
    
    // Check if the path exists in history
    const normalizedPath = targetPath === 'This PC' ? '' : targetPath;
    const existingPathIndex = navigationHistory.findIndex(entry => entry.path === normalizedPath);
    
    if (existingPathIndex >= 0) {
      console.log('Breadcrumb path exists in history at index:', existingPathIndex);
      // If the path is in history, just navigate to that index directly
      const historyEntry = navigationHistory[existingPathIndex];
      setCurrentPath(historyEntry.path);
      setCurrentItems(historyEntry.items);
      setCurrentTitle(historyEntry.title);
      setCurrentHistoryIndex(existingPathIndex);
      
      // Update window content
      updateWindowContent(id, historyEntry.title, historyEntry.path, historyEntry.items);
      return;
    }
    
    // If path not in history, prepare items for navigation
    let folderItems: FolderItem[] = [];
    let folderTitle = '';
    
    // Special handling for 'This PC'
    if (normalizedPath === '') {
      folderItems = [
        {
          id: 'drive-c',
          name: 'Local Disk (C:)',
          type: 'drive',
          icon: '/src/assets/icons/ssd.svg',
          size: '120 GB free of 500 GB'
        },
        {
          id: 'documents',
          name: 'Documents',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: 'downloads',
          name: 'Downloads',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        }
      ];
      folderTitle = 'This PC';
    } else {
      // For path segments, generate items based on the target path
      const pathSegments = normalizedPath.split('/').filter(Boolean);
      folderTitle = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
      
      folderItems = [
        {
          id: `${normalizedPath}-subfolder1`,
          name: 'Subfolder',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: `${normalizedPath}-file1`,
          name: 'Document.txt',
          type: 'file',
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday'
        }
      ];
    }
    
    // Navigate to the path
    navigateToPath(normalizedPath, folderItems, folderTitle);
  };

  // Handle snap selection
  const handleSnapSelect = (region: SnapRegion) => {
    if (region !== SnapRegion.NONE) {
      snapWindow(id, region);
    }
    setShowSnapLayout(false);
  };

  // Handle item click
  const handleItemClick = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedItem(itemId);
  };

  // Add function to toggle snap layout directly from toolbar
  const handleMultitaskingClick = () => {
    setShowSnapLayout(true);
  };

  // Handle item double-click
  const handleItemDoubleClick = (item: FolderItem) => {
    if (item.type === 'folder' || item.type === 'drive') {
      openFolderInCurrentWindow(item);
    } else if (item.type === 'file') {
      onOpenFile?.(item.id, `${currentPath}/${item.name}`);
    }
  };

  // Open folder in current window
  const openFolderInCurrentWindow = (item: FolderItem) => {
    if (onOpenFolder) {
      // If parent component provided the function, use it
      onOpenFolder(item.id, `${currentPath}/${item.name}`);
    } else {
      // If no handler provided, handle it directly here
      // Create sample folder contents based on the item type
      const folderItems = generateFolderContents(item);
      
      // Generate the new path
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      
      // The key change - explicitly use navigateToPath to ensure history is updated
      navigateToPath(newPath, folderItems, item.name);
      
      console.log('Opened folder in current window:', {
        path: newPath,
        historyLength: navigationHistory.length + 1
      });
    }
  };

  // Generate folder contents helper function
  const generateFolderContents = (item: FolderItem): FolderItem[] => {
    let folderItems: FolderItem[] = [];

    // Generate some sample contents
    if (item.name.includes('Program Files')) {
      folderItems = [
        {
          id: 'prog1',
          name: 'Microsoft',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: 'prog2',
          name: 'Common Files',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        }
      ];
    } else if (item.name.includes('Users')) {
      folderItems = [
        {
          id: 'user1',
          name: 'Public',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: 'user2',
          name: 'User',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        }
      ];
    } else if (item.name.includes('Projects')) {
      folderItems = [
        {
          id: 'proj1',
          name: 'Project1',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: 'proj2',
          name: 'README.md',
          type: 'file',
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday'
        }
      ];
    } else {
      // Default folder contents
      folderItems = [
        {
          id: `${item.id}-subfolder1`,
          name: 'Subfolder',
          type: 'folder',
          icon: '/src/assets/icons/folders.svg'
        },
        {
          id: `${item.id}-file1`,
          name: 'Document.txt',
          type: 'file',
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Today'
        }
      ];
    }

    return folderItems;
  };

  // Open folder in new window
  const openFolderInNewWindow = (item: FolderItem) => {
    if (onOpenFolderInNewWindow) {
      // If the parent component provided the function, use it
      onOpenFolderInNewWindow(item.id, `${currentPath}/${item.name}`, []);
      return;
    }

    // Fallback to default behavior
    // Generate a unique ID for the new window
    const newWindowId = `folder-${item.id}-${Date.now()}`;

    // Get current window position
    const currentWindow = getWindowById(id);

    // Create a new window with offset from current window
    if (currentWindow) {
      const offsetX = currentWindow.position.x + 50;
      const offsetY = currentWindow.position.y + 50;

      openWindow(newWindowId, item.name, {
        type: 'folder',
        path: `${currentPath}/${item.name}`,
        position: { x: offsetX, y: offsetY },
        size: { width: initialWidth, height: initialHeight }
      });
    } else {
      openWindow(newWindowId, item.name, {
        type: 'folder',
        path: `${currentPath}/${item.name}`
      });
    }
  };

  // Handle context menu
  const handleContextMenu = (event: React.MouseEvent, itemId?: string) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      isVisible: true,
      itemId
    });

    // If right-clicking on an item, select it
    if (itemId) {
      setSelectedItem(itemId);
    }
  };

  // Handle clicking outside to close context menu
  const handleContentClick = (event: React.MouseEvent) => {
    // Only clear selection if not right-clicking
    if (event.button !== 2) {
      setSelectedItem(null);
    }

    if (contextMenu.isVisible) {
      setContextMenu({ ...contextMenu, isVisible: false });
    }
  };

  // Context menu items
  const getContextMenuItems = (): ContextMenuItem[] => {
    const selectedItemData = selectedItem
      ? currentItems.find(item => item.id === selectedItem)
      : null;

    // If an item is selected, show item-specific context menu
    if (selectedItem && selectedItemData) {
      const isFolder = selectedItemData.type === 'folder' || selectedItemData.type === 'drive';

      return [
        {
          id: 'open',
          label: 'Open',
          onClick: () => handleItemDoubleClick(selectedItemData)
        },
        ...(isFolder
          ? [{
            id: 'openInNewWindow',
            label: 'Open in new window',
            onClick: () => {
              // Get folder items for the selected folder
              const newPath = `${currentPath}/${selectedItemData.name}`;
              if (onOpenFolderInNewWindow) {
                onOpenFolderInNewWindow(selectedItemData.id, newPath, []);
              } else {
                openFolderInNewWindow(selectedItemData);
              }
            }
          } as ContextMenuItem]
          : [{
            id: 'openWith',
            label: 'Open with',
            disabled: true
          } as ContextMenuItem]
        ),
        { id: 'divider1', divider: true },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X' },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C' },
        { id: 'divider2', divider: true },
        { id: 'delete', label: 'Delete', shortcut: 'Delete', danger: true },
        { id: 'rename', label: 'Rename', shortcut: 'F2' },
        { id: 'divider3', divider: true },
        { id: 'properties', label: 'Properties' }
      ];
    }

    // Background context menu (no item selected)
    return [
      { id: 'view', label: 'View' },
      { id: 'sort', label: 'Sort by' },
      { id: 'refresh', label: 'Refresh', shortcut: 'F5' },
      { id: 'divider1', divider: true },
      { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', disabled: true },
      { id: 'divider2', divider: true },
      { id: 'newFolder', label: 'New folder' },
      { id: 'newShortcut', label: 'New shortcut' },
      { id: 'divider3', divider: true },
      { id: 'properties', label: 'Properties' }
    ];
  };

  // Group items by type
  const drives = currentItems.filter(item => item.type === 'drive');
  const folders = currentItems.filter(item => item.type === 'folder');
  const files = currentItems.filter(item => item.type === 'file');

  // Handle navigation to parent directory
  const navigateToParent = () => {
    // Extract parent path from current path
    const pathParts = currentPath.split('/').filter(Boolean);
    
    // If already at root, do nothing
    if (pathParts.length === 0) return;
    
    // Remove the last part to get the parent path
    const parentPathParts = pathParts.slice(0, pathParts.length - 1);
    const parentPath = parentPathParts.join('/');
    
    // If we're navigating to root (empty path after filtering)
    if (parentPathParts.length === 0) {
      handleBreadcrumbNavigation('This PC');
      return;
    }
    
    // Check if parent path is in history
    const parentPathIndex = navigationHistory.findIndex(entry => entry.path === parentPath);
    
    if (parentPathIndex >= 0) {
      // If parent path is in history, use that entry
      console.log('Parent path found in history at index:', parentPathIndex);
      const historyEntry = navigationHistory[parentPathIndex];
      
      setCurrentPath(historyEntry.path);
      setCurrentItems(historyEntry.items);
      setCurrentHistoryIndex(parentPathIndex);
      setCurrentTitle(historyEntry.title);
      
      // Update window content
      updateWindowContent(id, historyEntry.title, historyEntry.path, historyEntry.items);
      return;
    }
    
    // If not in history, navigate to parent path with generated items
    const newTitle = parentPathParts[parentPathParts.length - 1];
    navigateToPath(parentPath, undefined, newTitle);
  };

  return (
    <>
      <Window
        id={id}
        title={currentTitle}
        icon={icon}
        initialWidth={initialWidth}
        initialHeight={initialHeight}
      >
        <div className={styles.container}>
          <Toolbar>
            <button
              className={styles.toolbarButton}
              onClick={handleBack}
              disabled={currentHistoryIndex <= 0}
              title="Back"
            >
              <ArrowLeft20Regular />
            </button>
            <button 
              className={styles.toolbarButton}
              onClick={handleForward}
              disabled={currentHistoryIndex >= navigationHistory.length - 1}
              title="Forward"
            >
              <ArrowRight20Regular />
            </button>
            <button 
              className={styles.toolbarButton}
              onClick={navigateToParent}
              disabled={currentPath.split('/').filter(Boolean).length === 0}
              title="Up to parent directory"
            >
              <ArrowUp20Regular />
            </button>
            <span className={styles.toolbarSeparator}>
              <Window20Regular />
            </span>
            <button className={styles.toolbarButton}>
              <List20Regular />
            </button>
            <button className={styles.toolbarButton}>
              <Settings20Regular />
            </button>
            <button
              className={styles.toolbarButton}
              onClick={handleMultitaskingClick}
              title="Multitasking View"
            >
              <Window20Regular />
            </button>
            <div style={{ flex: 1 }}></div>
            <button className={styles.toolbarButton}>
              <Search20Regular/>
            </button>
          </Toolbar>

          <PathBar 
            path={currentPath} 
            onNavigate={handleBreadcrumbNavigation}
          />

          <div className={styles.content}>
            <Sidebar activePath={currentPath} />

            <div
              className={styles.mainContent}
              onClick={handleContentClick}
              onContextMenu={(e) => handleContextMenu(e)}
            >
              {drives.length > 0 && (
                <>
                  <Text className={styles.sectionTitle}>Devices and drives</Text>
                  <div className={styles.itemGrid}>
                    {drives.map(item => (
                      <div
                        key={item.id}
                        className={mergeClasses(
                          styles.folderItem,
                          selectedItem === item.id && styles.selectedItem
                        )}
                        onClick={(e) => handleItemClick(item.id, e)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                      >
                        <img src={item.icon} alt={item.name} className={styles.itemIcon} />
                        <div className={styles.itemDetails}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemInfo}>{item.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {folders.length > 0 && (
                <>
                  <Text className={styles.sectionTitle}>Folders</Text>
                  <div className={styles.itemGrid}>
                    {folders.map(item => (
                      <div
                        key={item.id}
                        className={mergeClasses(
                          styles.folderItem,
                          selectedItem === item.id && styles.selectedItem
                        )}
                        onClick={(e) => handleItemClick(item.id, e)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                      >
                        <img src={item.icon} alt={item.name} className={styles.itemIcon} />
                        <div className={styles.itemDetails}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemInfo}>{item.location || currentPath}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {files.length > 0 && (
                <>
                  <Text className={styles.sectionTitle}>Files</Text>
                  <div className={styles.itemGrid}>
                    {files.map(item => (
                      <div
                        key={item.id}
                        className={mergeClasses(
                          styles.folderItem,
                          selectedItem === item.id && styles.selectedItem
                        )}
                        onClick={(e) => handleItemClick(item.id, e)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                      >
                        <img src={item.icon} alt={item.name} className={styles.itemIcon} />
                        <div className={styles.itemDetails}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemInfo}>{item.dateModified || ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Show appropriate message if folder is empty */}
              {currentItems.length === 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--text-color-secondary)',
                  fontSize: '14px'
                }}>
                  <div style={{ marginBottom: '8px' }}>This folder is empty</div>
                  <div>Drag files here to add them to this folder</div>
                </div>
              )}
            </div>
          </div>

          <StatusBar itemCount={currentItems.length} />

          {/* Context menu */}
          {contextMenu.isVisible && (
            <ContextMenu
              items={getContextMenuItems()}
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
            />
          )}
        </div>
      </Window>

      {/* Snap layout overlay */}
      <SnapLayoutOverlay
        isVisible={showSnapLayout}
        onSnapSelect={handleSnapSelect}
      />
    </>
  );
}); 