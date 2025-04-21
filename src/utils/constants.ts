import { DesktopState } from "../types";
import {FolderItem} from "../components/windows/FolderWindow"

export const INITIAL_DESKTOP_STATE: DesktopState = {
    icons: [
      {
        id: 'thispc',
        name: 'This PC',
        icon: '/src/assets/icons/thispc.svg',
        position: { x: 0, y: 0 }
      },
      {
        id: 'report',
        name: 'Reports',
        icon: '/src/assets/icons/report.svg',
        position: { x: 0, y: 100 }
      },
      
      {
        id: 'settings',
        name: 'Settings',
        icon: '/src/assets/icons/settings.svg',
        position: { x: 0, y: 200 }
      },
    
    ],
    wallpaper: '' // Handled by CSS variables now
  };
  
export const GRID_SIZE = 100;


export const DEFAULT_WINDOW_ITEMS: FolderItem[] = [
  // Drives
  { 
    id: 'c-drive', 
    name: 'Local Disk (C:)', 
    type: 'drive', 
    icon: '/src/assets/icons/ssd.svg', 
    size: '120 GB free of 500 GB' 
  },
  { 
    id: 'd-drive', 
    name: 'Data (D:)', 
    type: 'drive', 
    icon: '/src/assets/icons/ssd.svg', 
    size: '350 GB free of 1 TB' 
  },
  
  // Folders
  { 
    id: 'desktop', 
    name: 'Desktop', 
    type: 'folder', 
    icon: '/src/assets/icons/folders.svg', 
    location: 'This PC'
  },
  { 
    id: 'documents', 
    name: 'Documents', 
    type: 'folder', 
    icon: '/src/assets/icons/folders.svg', 
    location: 'This PC'
  },
  { 
    id: 'downloads', 
    name: 'Downloads', 
    type: 'folder', 
    icon: '/src/assets/icons/folders.svg', 
    location: 'This PC'
  },
  { 
    id: 'music', 
    name: 'Music', 
    type: 'folder', 
    icon: '/src/assets/icons/folders.svg', 
    location: 'This PC'
  },
  { 
    id: 'pictures', 
    name: 'Pictures', 
    type: 'folder', 
    icon: '/src/assets/icons/folders.svg', 
    location: 'This PC'
  },
  { 
    id: 'videos', 
    name: 'Videos', 
    type: 'folder', 
    icon: '/src/assets/icons/folders.svg', 
    location: 'This PC'
  }
];
