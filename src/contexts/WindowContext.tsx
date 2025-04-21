import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// Snap regions for Windows 11 style multitasking
export enum SnapRegion {
  NONE = 'none',
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  zIndex: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  isMaximized: boolean;
  isMinimized: boolean;
  // Added for folder opening simulation
  type?: string;
  path?: string;
  // For folder contents
  folderItems?: any[];
  // Window snapping support
  snapRegion?: SnapRegion;
  // Save pre-snap dimensions for restore
  preSnapState?: {
    position: { x: number, y: number };
    size: { width: number, height: number };
  };
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (id: string, title: string, options?: Partial<WindowState>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number, width?: number, height?: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  updateWindowContent: (id: string, title: string, path: string, folderItems: any[]) => void;
  getWindowById: (id: string) => WindowState | undefined;
  // New functions for window snapping
  snapWindow: (id: string, region: SnapRegion) => void;
  unsnap: (id: string) => void;
  getSnapRegionFromPosition: (x: number, y: number) => SnapRegion;
  getAllWindows: () => WindowState[];
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

// Top z-index starts at 100 and increases as windows are brought to front
let topZIndex = 100;

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const viewportSizeRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight - 48, // Adjust for taskbar
  });
  
  // Update viewport size on window resize
  useEffect(() => {
    const handleResize = () => {
      viewportSizeRef.current = {
        width: window.innerWidth,
        height: window.innerHeight - 48, // Adjust for taskbar
      };
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getWindowById = useCallback((id: string) => {
    return windows.find(w => w.id === id);
  }, [windows]);

  const openWindow = useCallback((id: string, title: string, options?: Partial<WindowState>) => {
    setWindows(prev => {
      // Check if window is already open
      const existingWindow = prev.find(w => w.id === id);
      if (existingWindow) {
        // If minimized, restore it
        if (existingWindow.isMinimized) {
          return prev.map(w => 
            w.id === id ? { ...w, isMinimized: false, zIndex: ++topZIndex } : w
          );
        }
        // Otherwise bring to front
        return prev.map(w => 
          w.id === id ? { ...w, zIndex: ++topZIndex } : w
        );
      }

      // Generate random position that's not too close to edges
      const randomX = Math.max(50, Math.min(window.innerWidth - 500, Math.random() * (window.innerWidth - 800) + 100));
      const randomY = Math.max(50, Math.min(window.innerHeight - 400, Math.random() * (window.innerHeight - 600) + 100));

      // Create new window
      return [...prev, {
        id,
        title,
        isOpen: true,
        zIndex: ++topZIndex,
        position: { 
          x: options?.position?.x ?? randomX,
          y: options?.position?.y ?? randomY
        },
        size: { 
          width: options?.size?.width ?? 800, 
          height: options?.size?.height ?? 600 
        },
        isMaximized: options?.isMaximized ?? false,
        isMinimized: options?.isMinimized ?? false,
        type: options?.type,
        path: options?.path,
        folderItems: options?.folderItems,
        snapRegion: SnapRegion.NONE,
      }];
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: true } : w
    ));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: false } : w
    ));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: ++topZIndex } : w
    ));
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number, width?: number, height?: number) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      const newPosition = { x, y };
      const newSize = width && height ? { width, height } : w.size;
      // Skip update if nothing changed
      if (
        w.position.x === x &&
        w.position.y === y &&
        w.size.width === newSize.width &&
        w.size.height === newSize.height
      ) {
        return w;
      }
      return { ...w, position: newPosition, size: newSize };
    }));
  }, []);

  const updateWindowSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size: { width, height } } : w
    ));
  }, []);

  const updateWindowContent = useCallback((id: string, title: string, path: string, folderItems: any[]) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { 
        ...w, 
        title,
        path,
        folderItems,
        type: 'folder' // Ensure type is set to folder
      } : w
    ));
  }, []);

  // Function to determine the snap region based on mouse position
  const getSnapRegionFromPosition = useCallback((x: number, y: number): SnapRegion => {
    const { width, height } = viewportSizeRef.current;
    
    // Snap edge threshold (px from screen edge) - increased for better detection
    const threshold = 30;
    
    // Left edge detection
    if (x < threshold) {
      if (y < height / 3) return SnapRegion.TOP_LEFT;
      if (y > height * 2 / 3) return SnapRegion.BOTTOM_LEFT;
      return SnapRegion.LEFT;
    }
    
    // Right edge detection
    if (x > width - threshold) {
      if (y < height / 3) return SnapRegion.TOP_RIGHT;
      if (y > height * 2 / 3) return SnapRegion.BOTTOM_RIGHT;
      return SnapRegion.RIGHT;
    }
    
    // Top edge
    if (y < threshold) {
      if (x < width / 3) return SnapRegion.TOP_LEFT;
      if (x > width * 2 / 3) return SnapRegion.TOP_RIGHT;
      return SnapRegion.TOP;
    }
    
    // Bottom edge
    if (y > height - threshold) {
      if (x < width / 3) return SnapRegion.BOTTOM_LEFT;
      if (x > width * 2 / 3) return SnapRegion.BOTTOM_RIGHT;
      return SnapRegion.BOTTOM;
    }
    
    return SnapRegion.NONE;
  }, []);
  
  // Snap a window to a region
  const snapWindow = useCallback((id: string, region: SnapRegion) => {
    if (region === SnapRegion.NONE) return;
    
    const { width, height } = viewportSizeRef.current;
    
    setWindows(prev => {
      const targetWindow = prev.find(w => w.id === id);
      if (!targetWindow) return prev;
      
      // Save pre-snap state if not already snapped
      const preSnapState = 
        targetWindow.snapRegion === SnapRegion.NONE || !targetWindow.preSnapState
          ? {
              position: { ...targetWindow.position },
              size: { ...targetWindow.size }
            }
          : targetWindow.preSnapState;
      
      let position = { x: 0, y: 0 };
      let size = { width: 0, height: 0 };
      
      // Calculate new position and size based on snap region
      switch (region) {
        case SnapRegion.LEFT:
          position = { x: 0, y: 0 };
          size = { width: width / 2, height };
          break;
        case SnapRegion.RIGHT:
          position = { x: width / 2, y: 0 };
          size = { width: width / 2, height };
          break;
        case SnapRegion.TOP:
          position = { x: 0, y: 0 };
          size = { width, height: height / 2 };
          break;
        case SnapRegion.BOTTOM:
          position = { x: 0, y: height / 2 };
          size = { width, height: height / 2 };
          break;
        case SnapRegion.TOP_LEFT:
          position = { x: 0, y: 0 };
          size = { width: width / 2, height: height / 2 };
          break;
        case SnapRegion.TOP_RIGHT:
          position = { x: width / 2, y: 0 };
          size = { width: width / 2, height: height / 2 };
          break;
        case SnapRegion.BOTTOM_LEFT:
          position = { x: 0, y: height / 2 };
          size = { width: width / 2, height: height / 2 };
          break;
        case SnapRegion.BOTTOM_RIGHT:
          position = { x: width / 2, y: height / 2 };
          size = { width: width / 2, height: height / 2 };
          break;
      }
      
      return prev.map(w => 
        w.id === id 
          ? { 
              ...w, 
              position, 
              size, 
              snapRegion: region, 
              preSnapState,
              isMaximized: false 
            } 
          : w
      );
    });
  }, []);
  
  // Unsnap a window and restore its previous position
  const unsnap = useCallback((id: string) => {
    setWindows(prev => {
      const window = prev.find(w => w.id === id);
      if (!window || window.snapRegion === SnapRegion.NONE) return prev;
      
      return prev.map(w => 
        w.id === id 
          ? { 
              ...w, 
              position: w.preSnapState?.position || w.position,
              size: w.preSnapState?.size || w.size,
              snapRegion: SnapRegion.NONE,
              preSnapState: undefined
            } 
          : w
      );
    });
  }, []);

  return (
    <WindowContext.Provider value={{ 
      windows, 
      openWindow, 
      closeWindow, 
      minimizeWindow,
      maximizeWindow,
      restoreWindow,
      bringToFront,
      updateWindowPosition,
      updateWindowSize,
      updateWindowContent,
      getWindowById,
      // New snap functionality
      snapWindow,
      unsnap,
      getSnapRegionFromPosition,
      getAllWindows: () => windows
    }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
}; 