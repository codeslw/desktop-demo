import { DesktopState } from "../types";

export const INITIAL_DESKTOP_STATE: DesktopState = {
    icons: [
      {
        id: 'edge',
        name: 'Microsoft Edge',
        icon: '/src/assets/icons/edge.svg',
        position: { x: 50, y: 50 }
      },
      {
        id: 'file-explorer',
        name: 'File Explorer',
        icon: '/src/assets/icons/file-explorer.svg',
        position: { x: 150, y: 50 }
      },
      {
        id: 'settings',
        name: 'Settings',
        icon: '/src/assets/icons/settings.svg',
        position: { x: 250, y: 50 }
      },
      {
        id: 'store',
        name: 'Microsoft Store',
        icon: '/src/assets/icons/store.svg',
        position: { x: 350, y: 50 }
      }
    ],
    wallpaper: '' // Handled by CSS variables now
  };
  
  export const GRID_SIZE = 100;