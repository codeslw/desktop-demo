import { makeStyles, shorthands, Text } from '@fluentui/react-components';
import { memo, useState, useEffect } from 'react';
import { Window } from '../organisms/Window';
import { ContextMenu, ContextMenuItem } from '../molecules/ContextMenu';
import { useWindowContext, SnapRegion } from '../../contexts/WindowContext';
import { SnapLayoutOverlay } from '../molecules/SnapLayoutOverlay';
import { Toolbar } from '../molecules/Toolbar';
import { PathBar } from '../molecules/PathBar';
import { FileItem } from '../molecules/FileItem';

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
          className={`${styles.navItem} ${activePath === 'This PC' ? styles.navItemActive : ''}`}
          onClick={() => onNavigate?.('This PC')}
        >
          <img src="/src/assets/icons/thispc.svg" alt="This PC" className={styles.navIcon} />
          <span>This PC</span>
        </div>
        <div 
          className={`${styles.navItem} ${activePath === 'Desktop' ? styles.navItemActive : ''}`}
          onClick={() => onNavigate?.('Desktop')}
        >
          <img src="/src/assets/icons/folders.svg" alt="Desktop" className={styles.navIcon} />
          <span>Desktop</span>
        </div>
        <div 
          className={`${styles.navItem} ${activePath === 'Documents' ? styles.navItemActive : ''}`}
          onClick={() => onNavigate?.('Documents')}
        >
          <img src="/src/assets/icons/folders.svg" alt="Documents" className={styles.navIcon} />
          <span>Documents</span>
        </div>
        <div 
          className={`${styles.navItem} ${activePath === 'Downloads' ? styles.navItemActive : ''}`}
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
  const { openWindow, getWindowById, snapWindow, getSnapRegionFromPosition, updateWindowContent } = useWindowContext();
  
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
  
  // State for snap layout
  const [showSnapLayout, setShowSnapLayout] = useState(false);
  
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
      onOpenFile?.(item.id, `${path}/${item.name}`);
    }
  };

  // Open folder in current window
  const openFolderInCurrentWindow = (item: FolderItem) => {
    if (onOpenFolder) {
      // If parent component provided the function, use it
      onOpenFolder(item.id, `${path}/${item.name}`);
    } else {
      // If no handler provided, handle it directly here
      // Create sample folder contents based on the item type
      const folderItems = generateFolderContents(item);
      
      // Directly update the window using context
      const newPath = `${path}/${item.name}`;
      updateWindowContent(id, item.name, newPath, folderItems);
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
      onOpenFolderInNewWindow(item.id, `${path}/${item.name}`, []);
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
        path: `${path}/${item.name}`,
        position: { x: offsetX, y: offsetY },
        size: { width: initialWidth, height: initialHeight }
      });
    } else {
      openWindow(newWindowId, item.name, {
        type: 'folder',
        path: `${path}/${item.name}`
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
      ? items.find(item => item.id === selectedItem) 
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
                const newPath = `${path}/${selectedItemData.name}`;
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
  const drives = items.filter(item => item.type === 'drive');
  const folders = items.filter(item => item.type === 'folder');
  const files = items.filter(item => item.type === 'file');
  
  return (
    <>
      <Window 
        id={id} 
        title={title} 
        icon={icon}
        initialWidth={initialWidth}
        initialHeight={initialHeight}
      >
        <div className={styles.container}>
          <Toolbar>
            <button 
              className={styles.toolbarButton}
              onClick={() => openFolderInCurrentWindow(folders[0])}
              disabled={folders.length === 0}
            >
              ⬅️
            </button>
            <button className={styles.toolbarButton}>↩️</button>
            <button className={styles.toolbarButton}>➡️</button>
            <span className={styles.toolbarSeparator}>|</span>
            <button className={styles.toolbarButton}>📋</button>
            <button className={styles.toolbarButton}>⚙️</button>
            <button 
              className={styles.toolbarButton}
              onClick={handleMultitaskingClick}
              title="Multitasking View"
            >
              ⧉
            </button>
            <div style={{ flex: 1 }}></div>
            <button className={styles.toolbarButton}>🔍</button>
          </Toolbar>
          
          <PathBar path={path} />
          
          <div className={styles.content}>
            <Sidebar activePath={path} />
            
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
                        className={`${styles.folderItem} ${selectedItem === item.id ? styles.selectedItem : ''}`}
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
                        className={`${styles.folderItem} ${selectedItem === item.id ? styles.selectedItem : ''}`}
                        onClick={(e) => handleItemClick(item.id, e)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                      >
                        <img src={item.icon} alt={item.name} className={styles.itemIcon} />
                        <div className={styles.itemDetails}>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemInfo}>{item.location || path}</div>
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
                        className={`${styles.folderItem} ${selectedItem === item.id ? styles.selectedItem : ''}`}
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
            </div>
          </div>
          
          <StatusBar itemCount={items.length} />
          
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