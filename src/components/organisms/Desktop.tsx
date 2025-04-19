import { makeStyles } from '@fluentui/react';
import { DesktopIcon } from '../molecules/DesktopIcon';
import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { useDesktopContext } from '../../contexts/DesktopContext';
import { useTheme } from '../../contexts/ThemeContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Grid constants
const GRID_SIZE = 80; // Size of each grid cell
const GRID_GUTTER = 10; // Space between grid cells

const useStyles = makeStyles({
  desktop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundImage: 'var(--wallpaper)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
    userSelect: 'none'
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, ${GRID_SIZE}px)`,
    gridTemplateRows: `repeat(auto-fill, ${GRID_SIZE}px)`,
    gridGap: `${GRID_GUTTER}px`,
    padding: `${GRID_GUTTER}px`,
    boxSizing: 'border-box',
    // For debugging the grid (uncomment to see)
    // '& > .grid-cell': {
    //   border: '1px dashed rgba(255,255,255,0.1)'
    // }
  },
  gridCell: {
    width: `${GRID_SIZE}px`,
    height: `${GRID_SIZE}px`,
    position: 'relative'
  }
});

export const Desktop = memo(() => {
  const styles = useStyles();
  const { desktopState, updateIconPosition } = useDesktopContext();
  const { theme } = useTheme();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ columns: 0, rows: 0 });
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  // Calculate the grid dimensions based on viewport size
  useEffect(() => {
    const calculateGrid = () => {
      if (!desktopRef.current) return;
      
      const desktopWidth = window.innerWidth;
      const desktopHeight = window.innerHeight - 60; // Subtract taskbar height
      
      const columns = Math.floor((desktopWidth - GRID_GUTTER) / (GRID_SIZE + GRID_GUTTER));
      const rows = Math.floor((desktopHeight - GRID_GUTTER) / (GRID_SIZE + GRID_GUTTER));
      
      setGridSize({ columns, rows });
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    
    return () => {
      window.removeEventListener('resize', calculateGrid);
    };
  }, []);

  // Function to snap position to grid
  const snapToGrid = useCallback((x: number, y: number) => {
    const cellWidth = GRID_SIZE + GRID_GUTTER;
    const cellHeight = GRID_SIZE + GRID_GUTTER;
    
    const col = Math.round(x / cellWidth);
    const row = Math.round(y / cellHeight);
    
    // Ensure we don't go outside the grid boundaries
    const boundedCol = Math.max(0, Math.min(col, gridSize.columns - 1));
    const boundedRow = Math.max(0, Math.min(row, gridSize.rows - 1));
    
    return {
      x: boundedCol * cellWidth + GRID_GUTTER,
      y: boundedRow * cellHeight + GRID_GUTTER
    };
  }, [gridSize]);

  // Function to handle icon drop
  const handleIconDrop = useCallback((id: string, x: number, y: number) => {
    const snappedPosition = snapToGrid(x, y);
    
    // Check if another icon already occupies this position
    const isPositionTaken = desktopState.icons.some(icon => 
      icon.id !== id && 
      icon.position.x === snappedPosition.x && 
      icon.position.y === snappedPosition.y
    );
    
    // If position is taken, find the nearest available position
    if (isPositionTaken) {
      // Simple algorithm: spiral outwards from the target position
      const directions = [
        [0, -1], // up
        [1, 0],  // right
        [0, 1],  // down
        [-1, 0]  // left
      ];
      
      let found = false;
      let distance = 1;
      let spiral = 0;
      let dir = 0;
      let col = Math.round(snappedPosition.x / (GRID_SIZE + GRID_GUTTER));
      let row = Math.round(snappedPosition.y / (GRID_SIZE + GRID_GUTTER));
      
      while (!found && distance < Math.max(gridSize.columns, gridSize.rows)) {
        col += directions[dir][0];
        row += directions[dir][1];
        
        spiral++;
        if (spiral === distance) {
          spiral = 0;
          dir = (dir + 1) % 4;
          if (dir % 2 === 0) {
            distance++;
          }
        }
        
        // Check if this position is within bounds and available
        if (
          col >= 0 && col < gridSize.columns &&
          row >= 0 && row < gridSize.rows
        ) {
          const newX = col * (GRID_SIZE + GRID_GUTTER) + GRID_GUTTER;
          const newY = row * (GRID_SIZE + GRID_GUTTER) + GRID_GUTTER;
          
          const isTaken = desktopState.icons.some(icon => 
            icon.id !== id && 
            icon.position.x === newX && 
            icon.position.y === newY
          );
          
          if (!isTaken) {
            updateIconPosition(id, newX, newY);
            found = true;
          }
        }
      }
      
      // If we couldn't find a free spot, use the original position anyway
      if (!found) {
        updateIconPosition(id, snappedPosition.x, snappedPosition.y);
      }
    } else {
      // If position is free, use it
      updateIconPosition(id, snappedPosition.x, snappedPosition.y);
    }
  }, [desktopState.icons, gridSize, snapToGrid, updateIconPosition]);

  // Handle click on the desktop (outside icons)
  const handleDesktopClick = useCallback(() => {
    setSelectedIconId(null);
    // Deselect any icons by sending a custom event that the icons can listen for
    window.dispatchEvent(new CustomEvent('desktop-background-click'));
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.desktop} ref={desktopRef} onClick={handleDesktopClick}>
        <div className={styles.gridContainer}>
          {desktopState.icons.map(icon => (
            <DesktopIcon 
              key={icon.id} 
              icon={icon} 
              onDrop={handleIconDrop}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
});