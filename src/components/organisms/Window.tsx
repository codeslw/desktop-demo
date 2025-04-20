import { makeStyles, shorthands } from '@fluentui/react-components';
import { memo, useState, useRef, useEffect } from 'react';
import { useWindowContext, SnapRegion } from '../../contexts/WindowContext';
import { useTheme } from '../../contexts/ThemeContext';

interface WindowProps {
  id: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
}

const useStyles = makeStyles({
  window: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--window-bg)',
    ...shorthands.borderRadius('8px'),
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    overflow: 'hidden',
    zIndex: 10,
    transition: 'all 0.2s ease',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '32px',
    ...shorthands.padding('0', '4px', '0', '12px'),
    backgroundColor: 'var(--window-titlebar-bg)',
    color: 'var(--text-color)',
    userSelect: 'none',
    cursor: 'move',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  windowIcon: {
    width: '16px',
    height: '16px',
    ...shorthands.margin('0', '4px', '0', '0'),
  },
  windowTitle: {
    fontSize: '13px',
    fontWeight: '400',
  },
  windowControls: {
    display: 'flex',
    height: '100%',
  },
  windowButton: {
    width: '46px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('0'),
    ...shorthands.border('none'),
    backgroundColor: 'transparent',
    color: 'var(--text-color)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--window-button-hover)',
    },
  },
  closeButton: {
    '&:hover': {
      backgroundColor: '#e81123',
      color: 'white',
    },
  },
  windowContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: 'calc(100% - 32px)',
    overflow: 'hidden',
  },
  maximized: {
    top: '0 !important',
    left: '0 !important',
    width: '100vw !important',
    height: 'calc(100vh - 48px) !important', // Adjust for taskbar
    ...shorthands.borderRadius('0'),
  },
  minimized: {
    transform: 'scale(0.1)',
    opacity: 0,
    visibility: 'hidden',
  },
  // Add resize handle styles
  resizeHandle: {
    position: 'absolute',
    zIndex: 100,
  },
  resizeN: {
    top: '-3px',
    left: '0',
    width: '100%',
    height: '6px',
    cursor: 'n-resize',
  },
  resizeE: {
    top: '0',
    right: '-3px',
    width: '6px',
    height: '100%',
    cursor: 'e-resize',
  },
  resizeS: {
    bottom: '-3px',
    left: '0',
    width: '100%',
    height: '6px',
    cursor: 's-resize',
  },
  resizeW: {
    top: '0',
    left: '-3px',
    width: '6px',
    height: '100%',
    cursor: 'w-resize',
  },
  resizeNE: {
    top: '-3px',
    right: '-3px',
    width: '12px',
    height: '12px',
    cursor: 'ne-resize',
  },
  resizeSE: {
    bottom: '-3px',
    right: '-3px',
    width: '12px',
    height: '12px',
    cursor: 'se-resize',
  },
  resizeSW: {
    bottom: '-3px',
    left: '-3px',
    width: '12px',
    height: '12px',
    cursor: 'sw-resize',
  },
  resizeNW: {
    top: '-3px',
    left: '-3px',
    width: '12px',
    height: '12px',
    cursor: 'nw-resize',
  },
});

export const Window = memo(({ id, title, icon, children, initialWidth, initialHeight }: WindowProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { 
    windows, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    restoreWindow, 
    bringToFront,
    updateWindowPosition,
    updateWindowSize,
    getSnapRegionFromPosition,
    snapWindow
  } = useWindowContext();
  
  const windowRef = useRef<HTMLDivElement>(null);
  const titleBarRef = useRef<HTMLDivElement>(null);
  
  // Get the window state from context
  const windowState = windows.find(w => w.id === id);
  
  // Dragging functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // State for resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const [resizeStartPosition, setResizeStartPosition] = useState({ x: 0, y: 0 });
  
  // State for checking snap regions during drag
  const [snapPreviewActive, setSnapPreviewActive] = useState(false);
  
  // Handle maximize/restore click action
  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (windowState) {
      if (windowState.isMaximized) {
        restoreWindow(id);
      } else {
        maximizeWindow(id);
      }
    }
  };
  
  // Use initialWidth and initialHeight for window size if provided
  useEffect(() => {
    if (windowState && initialWidth && initialHeight && !windowState.isMaximized) {
      updateWindowPosition(
        id,
        windowState.position.x,
        windowState.position.y,
        initialWidth,
        initialHeight
      );
    }
  }, [id, initialWidth, initialHeight, updateWindowPosition, windowState]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowState && !windowState.isMaximized) {
        // Update window position
        updateWindowPosition(
          id,
          e.clientX - dragOffset.x,
          e.clientY - dragOffset.y
        );
        
        // Check for snap regions
        const snapRegion = getSnapRegionFromPosition(e.clientX, e.clientY);
        if (snapRegion !== 'none') {
          setSnapPreviewActive(true);
          
          // Dispatch custom event for FolderWindow to show snap layout
          const event = new CustomEvent('window-snap-preview', { 
            detail: { windowId: id, x: e.clientX, y: e.clientY } 
          });
          globalThis.window.dispatchEvent(event);
        } else {
          setSnapPreviewActive(false);
          
          // Dispatch event to hide snap layout
          const event = new CustomEvent('window-snap-preview-end', { 
            detail: { windowId: id } 
          });
          globalThis.window.dispatchEvent(event);
        }
      } else if (isResizing && windowState && !windowState.isMaximized) {
        // Handle window resizing
        e.preventDefault();
        
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;
        
        let newWidth = resizeStartSize.width;
        let newHeight = resizeStartSize.height;
        let newX = resizeStartPosition.x;
        let newY = resizeStartPosition.y;
        
        // Apply resize based on direction
        switch (resizeDirection) {
          case 'n':
            newHeight = Math.max(200, resizeStartSize.height - deltaY);
            newY = resizeStartPosition.y + resizeStartSize.height - newHeight;
            break;
          case 'e':
            newWidth = Math.max(300, resizeStartSize.width + deltaX);
            break;
          case 's':
            newHeight = Math.max(200, resizeStartSize.height + deltaY);
            break;
          case 'w':
            newWidth = Math.max(300, resizeStartSize.width - deltaX);
            newX = resizeStartPosition.x + resizeStartSize.width - newWidth;
            break;
          case 'ne':
            newWidth = Math.max(300, resizeStartSize.width + deltaX);
            newHeight = Math.max(200, resizeStartSize.height - deltaY);
            newY = resizeStartPosition.y + resizeStartSize.height - newHeight;
            break;
          case 'se':
            newWidth = Math.max(300, resizeStartSize.width + deltaX);
            newHeight = Math.max(200, resizeStartSize.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(300, resizeStartSize.width - deltaX);
            newHeight = Math.max(200, resizeStartSize.height + deltaY);
            newX = resizeStartPosition.x + resizeStartSize.width - newWidth;
            break;
          case 'nw':
            newWidth = Math.max(300, resizeStartSize.width - deltaX);
            newHeight = Math.max(200, resizeStartSize.height - deltaY);
            newX = resizeStartPosition.x + resizeStartSize.width - newWidth;
            newY = resizeStartPosition.y + resizeStartSize.height - newHeight;
            break;
        }
        
        // Update window position and size
        updateWindowPosition(id, newX, newY, newWidth, newHeight);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        setIsDragging(false);
        
        // Check if we should snap the window
        const snapRegion = getSnapRegionFromPosition(e.clientX, e.clientY);
        if (snapRegion !== 'none') {
          snapWindow(id, snapRegion);
        }
        
        // Clear snap preview
        setSnapPreviewActive(false);
        
        // Dispatch event to hide snap layout
        const event = new CustomEvent('window-snap-preview-end', { 
          detail: { windowId: id } 
        });
        globalThis.window.dispatchEvent(event);
      }
      
      if (isResizing) {
        setIsResizing(false);
        setResizeDirection(null);
      }
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging, 
    dragOffset, 
    id, 
    updateWindowPosition, 
    windowState, 
    getSnapRegionFromPosition, 
    snapWindow,
    isResizing,
    resizeDirection,
    resizeStartPos,
    resizeStartSize,
    resizeStartPosition
  ]);
  
  useEffect(() => {
    // Handle keyboard shortcuts for window snapping
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only apply to the active window (the one with highest z-index)
      if (!windowState || windows.some(w => w.zIndex > windowState.zIndex)) {
        return;
      }

      // Check for Option key (Mac) or Alt key (Windows) for window snapping
      const modifierKey = e.altKey || e.metaKey;

      if (modifierKey) {
        switch (e.key) {
          case 'ArrowLeft':
            // Snap to left half
            snapWindow(id, SnapRegion.LEFT);
            e.preventDefault();
            break;
          case 'ArrowRight':
            // Snap to right half
            snapWindow(id, SnapRegion.RIGHT);
            e.preventDefault();
            break;
          case 'ArrowUp':
            // Maximize window
            maximizeWindow(id);
            e.preventDefault();
            break;
          case 'ArrowDown':
            if (windowState.isMaximized) {
              // Restore window if maximized
              restoreWindow(id);
            } else {
              // Minimize window
              minimizeWindow(id);
            }
            e.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, windowState, windows, maximizeWindow, minimizeWindow, restoreWindow, snapWindow]);
  
  // If window doesn't exist or is not open, don't render
  if (!windowState || !windowState.isOpen) return null;
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    
    // Only allow dragging from the title bar
    if (titleBarRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      bringToFront(id);
      
      // Calculate offset from the top-left corner of the window
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  // Double click on title bar to maximize/restore
  const handleTitleBarDoubleClick = () => {
    if (windowState.isMaximized) {
      restoreWindow(id);
    } else {
      maximizeWindow(id);
    }
  };
  
  // Add mouseover handler for the maximize button to show snap layouts
  const handleMaximizeButtonMouseOver = () => {
    if (!windowState || windowState.isMinimized) return;
    
    // Dispatch event to show snap layout
    const event = new CustomEvent('window-snap-preview', { 
      detail: { windowId: id, x: window.innerWidth / 2, y: 10 } 
    });
    window.dispatchEvent(event);
  };

  const handleMaximizeButtonMouseOut = () => {
    if (!windowState) return;
    
    // Dispatch event to hide snap layout
    const event = new CustomEvent('window-snap-preview-end', { 
      detail: { windowId: id } 
    });
    window.dispatchEvent(event);
  };
  
  // Handle resize from window edges
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    if (windowState?.isMaximized) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ 
      width: windowState?.size.width || 800,
      height: windowState?.size.height || 600
    });
    setResizeStartPosition({ 
      x: windowState?.position.x || 0,
      y: windowState?.position.y || 0
    });
    
    bringToFront(id);
  };
  
  return (
    <div
      ref={windowRef}
      className={`${styles.window} ${windowState.isMaximized ? styles.maximized : ''} ${windowState.isMinimized ? styles.minimized : ''}`}
      style={{
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => bringToFront(id)}
    >
      <div 
        ref={titleBarRef}
        className={styles.titleBar}
        onDoubleClick={handleTitleBarDoubleClick}
      >
        <div className={styles.titleSection}>
          {icon && <img src={icon} alt={title} className={styles.windowIcon} />}
          <span className={styles.windowTitle}>{title}</span>
        </div>
        <div className={styles.windowControls}>
          <button 
            className={styles.windowButton} 
            onClick={() => minimizeWindow(id)}
            aria-label="Minimize"
          >
            <span>_</span>
          </button>
          <button 
            className={styles.windowButton}
            onClick={handleMaximizeClick}
            aria-label={windowState.isMaximized ? "Restore" : "Maximize"}
            onMouseOver={handleMaximizeButtonMouseOver}
            onMouseOut={handleMaximizeButtonMouseOut}
          >
            <span>□</span>
          </button>
          <button 
            className={`${styles.windowButton} ${styles.closeButton}`}
            onClick={() => closeWindow(id)}
            aria-label="Close"
          >
            <span>×</span>
          </button>
        </div>
      </div>
      <div className={styles.windowContent}>
        {children}
      </div>
      
      {/* Resize handles - only show when window is not maximized */}
      {!windowState.isMaximized && (
        <>
          <div
            className={`${styles.resizeHandle} ${styles.resizeN}`}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeE}`}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeS}`}
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeW}`}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeNE}`}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeSE}`}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeSW}`}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className={`${styles.resizeHandle} ${styles.resizeNW}`}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
        </>
      )}
    </div>
  );
}); 