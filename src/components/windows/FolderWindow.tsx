import { makeStyles, shorthands, Text, mergeClasses } from '@fluentui/react-components';
import { memo, useState, useEffect } from 'react';
import { Window } from '../organisms/Window';
import { ContextMenu, ContextMenuItem } from '../molecules/ContextMenu';
import { useWindowContext, SnapRegion } from '../../contexts/WindowContext';
import { SnapLayoutOverlay } from '../molecules/SnapLayoutOverlay';
import { Toolbar } from '../molecules/Toolbar';
import { PathBar } from '../molecules/PathBar';
import { FileItem } from '../molecules/FileItem';
import { 
  ArrowLeft20Regular, 
  ArrowRight20Regular, 
  ArrowStepBack20Regular, 
  ArrowStepIn20Regular, 
  ArrowUp20Regular, 
  List20Regular, 
  Search20Regular, 
  Settings20Regular, 
  Window20Regular 
} from '@fluentui/react-icons';
import { DEFAULT_WINDOW_ITEMS } from '../../utils/constants';
import { 
  useNavigate, 
  useLocation, 
  useParams, 
  Routes, 
  Route, 
  useMatch 
} from 'react-router-dom';

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

// Folder content provider - mock data for folders
const getFolderContents = (path: string): FolderItem[] => {
  // Normalize path
  const normalizedPath = path === 'This PC' ? '' : path;
  
  // Root/This PC
  if (!normalizedPath || normalizedPath === '') {
    return [
      {
        id: 'drive-c',
        name: 'Local Disk (C:)',
        type: 'drive',
        icon: '/ssd.svg',
        size: '120 GB free of 500 GB'
      },
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        icon: '/folders.svg'
      },
      {
        id: 'downloads',
        name: 'Downloads',
        type: 'folder',
        icon: '/folders.svg'
      }
    ];
  }
  
  // Program Files
  if (normalizedPath.includes('Program Files')) {
    return [
      {
        id: 'prog1',
        name: 'Microsoft',
        type: 'folder',
        icon: '/folders.svg'
      },
      {
        id: 'prog2',
        name: 'Common Files',
        type: 'folder',
        icon: '/folders.svg'
      }
    ];
  } 
  
  // Users
  if (normalizedPath.includes('Users')) {
    return [
      {
        id: 'user1',
        name: 'Public',
        type: 'folder',
        icon: '/folders.svg'
      },
      {
        id: 'user2',
        name: 'User',
        type: 'folder',
        icon: '/folders.svg'
      }
    ];
  }
  
  // Projects
  if (normalizedPath.includes('Projects')) {
    return [
      {
        id: 'proj1',
        name: 'Project1',
        type: 'folder',
        icon: '/folders.svg'
      },
      {
        id: 'proj2',
        name: 'README.md',
        type: 'file',
        icon: '/word.svg',
        dateModified: 'Yesterday'
      }
    ];
  }
  
  // Default folder contents
  const pathSegments = normalizedPath.split('/').filter(Boolean);
  const folderId = pathSegments[pathSegments.length - 1];
  
  return [
    {
      id: `${folderId}-subfolder1`,
      name: 'Subfolder',
      type: 'folder',
      icon: '/folders.svg'
    },
    {
      id: `${folderId}-file1`,
      name: 'Document.txt',
      type: 'file',
      icon: '/word.svg',
      dateModified: 'Today'
    }
  ];
};

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
  const navigate = useNavigate();

  return (
    <div className={styles.sidebar}>
      <div className={styles.navSection}>
        <div className={styles.navTitle}>Quick access</div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'This PC' && styles.navItemActive
          )}
          onClick={() => navigate('/explorer')}
        >
          <img src="/thispc.svg" alt="This PC" className={styles.navIcon} />
          <span>This PC</span>
        </div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'Desktop' && styles.navItemActive
          )}
          onClick={() => navigate('/explorer/Desktop')}
        >
          <img src="/folders.svg" alt="Desktop" className={styles.navIcon} />
          <span>Desktop</span>
        </div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'Documents' && styles.navItemActive
          )}
          onClick={() => navigate('/explorer/Documents')}
        >
          <img src="/folders.svg" alt="Documents" className={styles.navIcon} />
          <span>Documents</span>
        </div>
        <div
          className={mergeClasses(
            styles.navItem,
            activePath === 'Downloads' && styles.navItemActive
          )}
          onClick={() => navigate('/explorer/Downloads')}
        >
          <img src="/folders.svg" alt="Downloads" className={styles.navIcon} />
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

// Folder content component
const FolderContent = () => {
  const styles = useFolderStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { openWindow, updateWindowContent } = useWindowContext();
  
  // Extract path from URL
  const currentPath = location.pathname.replace('/explorer/', '');
  
  // Get folder items based on the path
  const items = getFolderContents(currentPath);
  
  // State for UI interactions
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

  // Clear selection when path changes
  useEffect(() => {
    setSelectedItem(null);
  }, [currentPath]);
  
  // Handle item click
  const handleItemClick = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedItem(itemId);
  };
  
  // Handle item double-click
  const handleItemDoubleClick = (item: FolderItem) => {
    if (item.type === 'folder' || item.type === 'drive') {
      // Navigate to the subfolder
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      navigate(`/explorer/${newPath}`);
    } else if (item.type === 'file') {
      // Handle file opening logic
      console.log('Opening file:', item.name);
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

    if (itemId) {
      setSelectedItem(itemId);
    }
  };
  
  // Handle clicking outside to close context menu
  const handleContentClick = (event: React.MouseEvent) => {
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
      ? items.find(item => item.id === selectedItem)
      : null;

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
              // Create new window for this folder
              const newWindowId = `folder-${selectedItemData.id}-${Date.now()}`;
              const newPath = `${currentPath}/${selectedItemData.name}`;
              openWindow(newWindowId, selectedItemData.name, {
                type: 'folder',
                path: newPath
              });
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

    // Background context menu
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
  const drives = items.filter(item => item.type === 'drive');
  const folders = items.filter(item => item.type === 'folder');
  const files = items.filter(item => item.type === 'file');

  return (
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

      {items.length === 0 && (
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
  );
};

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
  const { openWindow, getWindowById, snapWindow, getAllWindows } = useWindowContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for snap layout
  const [showSnapLayout, setShowSnapLayout] = useState(false);
  
  // Format the current path from router location
  const currentPathSegment = location.pathname.replace('/explorer/', '');
  const currentPath = currentPathSegment === 'explorer' ? '' : currentPathSegment;
  
  // Get current folder title
  const getCurrentTitle = () => {
    if (!currentPath) return 'This PC';
    const segments = currentPath.split('/');
    return segments[segments.length - 1];
  };
  
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

  // Handle snap selection
  const handleSnapSelect = (region: SnapRegion) => {
    if (region !== SnapRegion.NONE) {
      snapWindow(id, region);
    }
    setShowSnapLayout(false);
  };

  // Navigation handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  // Handle navigation to parent directory
  const navigateToParent = () => {
    if (!currentPath) return; // Already at root
    
    const pathSegments = currentPath.split('/');
    pathSegments.pop(); // Remove last segment
    
    const parentPath = pathSegments.join('/');
    navigate(`/explorer/${parentPath}`);
  };

  // Handle breadcrumb navigation
  const handleBreadcrumbNavigation = (targetPath: string) => {
    navigate(`/explorer/${targetPath === 'This PC' ? '' : targetPath}`);
  };

  // Handle multitasking view
  const handleMultitaskingClick = () => {
    setShowSnapLayout(true);
  };

  return (
    <>
      <Window
        id={id}
        title={getCurrentTitle()}
        icon={icon}
        initialWidth={initialWidth}
        initialHeight={initialHeight}
      >
        <div className={styles.container}>
          <Toolbar>
            <button
              className={styles.toolbarButton}
              onClick={handleBack}
              title="Back"
            >
              <ArrowLeft20Regular />
            </button>
            <button 
              className={styles.toolbarButton}
              onClick={handleForward}
              title="Forward"
            >
              <ArrowRight20Regular />
            </button>
            <button 
              className={styles.toolbarButton}
              onClick={navigateToParent}
              disabled={!currentPath}
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
            path={currentPath || 'This PC'} 
            onNavigate={handleBreadcrumbNavigation}
          />

          <div className={styles.content}>
            <Sidebar activePath={currentPath || 'This PC'} />
            
            {/* Use FolderContent directly instead of Routes to ensure it always updates */}
            <FolderContent key={location.pathname} />
          </div>

          <StatusBar itemCount={getFolderContents(currentPath).length} />
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