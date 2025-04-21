export interface DesktopIcon {
    id: string;
    name: string;
    icon: string;
    position: {
      x: number;
      y: number;
    };
  }
  
  export interface DesktopState {
    icons: DesktopIcon[];
    wallpaper: string;
  }

  export interface WindowProps {
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    isMaximized: boolean;
  }
  