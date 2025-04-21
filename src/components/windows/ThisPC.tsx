import { memo, useState } from 'react';
import { FolderWindow, FolderItem } from './FolderWindow';
import { useWindowContext } from '../../contexts/WindowContext';
import { DEFAULT_WINDOW_ITEMS } from '../../utils/constants';

export const ThisPC = memo(() => {
  const { openWindow, updateWindowContent } = useWindowContext();
  const [currentWindowItems, setCurrentWindowItems] = useState(DEFAULT_WINDOW_ITEMS);
  
  // Define drives and folders for This PC

  
  // Handler for opening folders
  const handleOpenFolder = (folderId: string, path: string) => {
    // Prepare items for the selected folder
    let folderItems: FolderItem[] = [];
    
    // In a real app you'd fetch actual folder contents
    // This is just a simulation with some example files
    if (folderId === 'documents') {
      folderItems = [
        { 
          id: 'document1', 
          name: 'Resume.docx', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday, 2:30 PM'
        },
        { 
          id: 'document2', 
          name: 'Budget.xlsx', 
          type: 'file', 
          icon: '/src/assets/icons/xbox.svg',
          dateModified: 'Last week'
        },
        { 
          id: 'document-subfolder', 
          name: 'Projects', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        }
      ];
      setCurrentWindowItems(folderItems)
    } else if (folderId === 'pictures') {
      folderItems = [
        { 
          id: 'picture1', 
          name: 'Vacation.jpg', 
          type: 'file', 
          icon: '/src/assets/icons/pictures.svg',
          dateModified: 'June 15, 2023'
        },
        { 
          id: 'picture2', 
          name: 'Family.png', 
          type: 'file', 
          icon: '/src/assets/icons/pictures.svg',
          dateModified: 'May 10, 2023'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'desktop') {
      folderItems = [
        { 
          id: 'desktop-file1', 
          name: 'Shortcut.lnk', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday, 9:30 AM'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'downloads') {
      folderItems = [
        { 
          id: 'download1', 
          name: 'Setup.exe', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Today, 11:30 AM'
        },
        { 
          id: 'download2', 
          name: 'Archive.zip', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday, 3:45 PM'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'music') {
      folderItems = [
        { 
          id: 'music1', 
          name: 'Song.mp3', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Last month'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'videos') {
      folderItems = [
        { 
          id: 'video1', 
          name: 'Clip.mp4', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: '2 days ago'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId.includes('drive')) {
      // Sample content for drive
      folderItems = [
        { 
          id: 'drive-folder1', 
          name: 'Program Files', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        },
        { 
          id: 'drive-folder2', 
          name: 'Users', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        },
        { 
          id: 'drive-folder3', 
          name: 'Windows', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        }
      ];
      setCurrentWindowItems(folderItems)

    }
    
    // Update the current window with new folder contents
    updateWindowContent("thispc", path, path, folderItems);
  };

  // Handler for opening folders in a new window
  const handleOpenFolderInNewWindow = (folderId: string, path: string, folderItems: FolderItem[]) => {
    // Create a unique window ID for the new window
    const windowId = `folder-${folderId}-${Date.now()}`;
    
    // If no folder items were passed, use the same logic to generate them
    if (!folderItems || folderItems.length === 0) {
      folderItems = getFolderItemsForPath(folderId, path);
    }
    
    // Open a new window with the folder contents
    openWindow(windowId, path, {
      type: 'folder',
      path: path,
      folderItems: folderItems
    });
  };
  
  // Helper function to get folder items for a path
  const getFolderItemsForPath = (folderId: string, path: string): FolderItem[] => {
    // This is the same logic as in handleOpenFolder
    let folderItems: FolderItem[] = [];
    
    if (folderId === 'documents') {
      folderItems = [
        { 
          id: 'document1', 
          name: 'Resume.docx', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday, 2:30 PM'
        },
        { 
          id: 'document2', 
          name: 'Budget.xlsx', 
          type: 'file', 
          icon: '/src/assets/icons/xbox.svg',
          dateModified: 'Last week'
        },
        { 
          id: 'document-subfolder', 
          name: 'Projects', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'pictures') {
      folderItems = [
        { 
          id: 'picture1', 
          name: 'Vacation.jpg', 
          type: 'file', 
          icon: '/src/assets/icons/pictures.svg',
          dateModified: 'June 15, 2023'
        },
        { 
          id: 'picture2', 
          name: 'Family.png', 
          type: 'file', 
          icon: '/src/assets/icons/pictures.svg',
          dateModified: 'May 10, 2023'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'desktop') {
      folderItems = [
        { 
          id: 'desktop-file1', 
          name: 'Shortcut.lnk', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday, 9:30 AM'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'downloads') {
      folderItems = [
        { 
          id: 'download1', 
          name: 'Setup.exe', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Today, 11:30 AM'
        },
        { 
          id: 'download2', 
          name: 'Archive.zip', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Yesterday, 3:45 PM'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'music') {
      folderItems = [
        { 
          id: 'music1', 
          name: 'Song.mp3', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: 'Last month'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId === 'videos') {
      folderItems = [
        { 
          id: 'video1', 
          name: 'Clip.mp4', 
          type: 'file', 
          icon: '/src/assets/icons/word.svg',
          dateModified: '2 days ago'
        }
      ];
      setCurrentWindowItems(folderItems)

    } else if (folderId.includes('drive')) {
      // Sample content for drive
      folderItems = [
        { 
          id: 'drive-folder1', 
          name: 'Program Files', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        },
        { 
          id: 'drive-folder2', 
          name: 'Users', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        },
        { 
          id: 'drive-folder3', 
          name: 'Windows', 
          type: 'folder', 
          icon: '/src/assets/icons/folders.svg'
        }
      ];
      setCurrentWindowItems(folderItems)
    }
    
    return folderItems;
  };
  
  return (
    <FolderWindow
      id="thispc"
      title="This PC"
      icon="/src/assets/icons/thispc.svg"
      path="This PC"
      items={currentWindowItems}
      initialWidth={900}
      initialHeight={650}
      onOpenFolder={handleOpenFolder}
      onOpenFolderInNewWindow={handleOpenFolderInNewWindow}
    />
  );
}); 