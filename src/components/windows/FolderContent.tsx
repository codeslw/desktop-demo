import { memo } from 'react';
import { FolderWindow, FolderItem } from './FolderWindow';
import { useWindowContext } from '../../contexts/WindowContext';

interface FolderContentProps {
  id: string;
}

export const FolderContent = memo(({ id }: FolderContentProps) => {
  const { windows, openWindow, getWindowById, updateWindowContent } = useWindowContext();
  
  // Get window data from context
  const windowData = windows.find(w => w.id === id);
  
  if (!windowData) return null;
  
  // Handler for opening subfolders
  const handleOpenFolder = (folderId: string, path: string) => {
    // Prepare items for the selected folder (sample data)
    let folderItems: FolderItem[] = [];
    
    // For demonstration: if opening a subfolder, show some sample content
    // In a real app, you would fetch actual folder contents
    if (path.includes('Projects')) {
      folderItems = [
        { 
          id: 'project1', 
          name: 'Project A', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        },
        { 
          id: 'project2', 
          name: 'Project B', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        },
        { 
          id: 'readme', 
          name: 'README.md', 
          type: 'file', 
          icon: '/src/assets/images/word.svg',
          dateModified: 'Today, 10:30 AM'
        }
      ];
    } else if (path.includes('Users')) {
      folderItems = [
        { 
          id: 'user1', 
          name: 'Administrator', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        },
        { 
          id: 'user2', 
          name: 'Public', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        },
        { 
          id: 'user3', 
          name: 'User', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        }
      ];
    } else if (path.includes('Program Files')) {
      folderItems = [
        { 
          id: 'app1', 
          name: 'Microsoft', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        },
        { 
          id: 'app2', 
          name: 'Windows Defender', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        }
      ];
    } else {
      // Default folder contents for any other path
      folderItems = [
        { 
          id: 'sample-folder', 
          name: 'Sample Folder', 
          type: 'folder', 
          icon: '/src/assets/images/folders.svg'
        },
        { 
          id: 'sample-file', 
          name: 'Sample File.txt', 
          type: 'file', 
          icon: '/src/assets/images/word.svg',
          dateModified: 'Just now'
        }
      ];
    }
    
    // Update the current window with new folder contents
    updateWindowContent(id, path, path, folderItems);
  };
  
  // Open folder in a new window
  const openFolderInNewWindow = (folderId: string, path: string, folderItems: FolderItem[]) => {
    // Generate a unique ID for the new window
    const windowId = `folder-${folderId}-${Date.now()}`;
    
    // Open a new window for the folder
    openWindow(windowId, path, {
      type: 'folder',
      path: path,
      folderItems: folderItems
    });
  };
  
  return (
    <FolderWindow
      id={id}
      title={windowData.title}
      icon="/src/assets/images/folders.svg"
      path={windowData.path || ''}
      items={windowData.folderItems || []}
      initialWidth={900}
      initialHeight={650}
      onOpenFolder={handleOpenFolder}
      onOpenFolderInNewWindow={openFolderInNewWindow}
    />
  );
}); 