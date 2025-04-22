import { makeStyles } from '@fluentui/react';
import { DesktopIcon } from '../molecules/DesktopIcon';
import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { useDesktopContext } from '../../contexts/DesktopContext';
import { useTheme } from '../../contexts/ThemeContext';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { INITIAL_DESKTOP_STATE } from '../../utils/constants';
import { DndContext, DragEndEvent, useSensors, KeyboardSensor, PointerSensor, useSensor, Modifier, DragMoveEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { debounce, throttle } from 'lodash';
import { restrictToGridArea, throttleDrag } from '../../utils/helpers';
// Grid constants
const GRID_SIZE = 80; // Size of each grid cell
const GRID_GUTTER = 10; // Space between grid cells


interface AppTile {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
}


const useStyles = makeStyles({
  desktop: {
    width: '100vw',
    height: 'calc(100vh)', /* Adjust for taskbar height */
    background: 'url("/backgrounds/windows11.jpg") no-repeat center/cover',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'var(--wallpaper)',
  },
});




export const Desktop = memo(() => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [tiles, setTiles] = useState<AppTile[]>(INITIAL_DESKTOP_STATE.icons);


  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const saveTiles = useCallback(
    debounce((tiles: AppTile[]) => {
      localStorage.setItem('tiles', JSON.stringify(tiles));
    }, 500),
    []
  );

  

  

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      setTiles((prevTiles) => {
        const tileIndex = prevTiles.findIndex((tile) => tile.id === active.id);
        if (tileIndex === -1) return prevTiles;
        const newTiles = [...prevTiles];
        newTiles[tileIndex] = {
          ...newTiles[tileIndex],
          x: newTiles[tileIndex].x + delta.x,
          y: newTiles[tileIndex].y + delta.y,
        };
        saveTiles(newTiles);
        return newTiles;
      });
    },
    [saveTiles, tiles]
  );
  



  return (
    <DndContext onDragEnd={handleDragEnd}  modifiers={[restrictToWindowEdges, throttleDrag(16)]}>
      {/* <SortableContext items={tiles.map((tile) => tile.id)} strategy={rectSortingStrategy}> */}
        <div className={styles.desktop}>
          {/* <div className={styles.gridContainer}> */}
          {tiles.map(icon => (
            <DesktopIcon
              key={icon.id}
              icon={icon}
            />
          ))}
          {/* </div> */}
        </div>
      {/* </SortableContext> */}
    </DndContext>
  );
});