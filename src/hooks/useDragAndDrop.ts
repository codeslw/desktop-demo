import { useDrag, useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { DesktopIcon } from '../types';
import { GRID_SIZE } from '../utils/constants';
import { useDesktopContext } from '../contexts/DesktopContext';

interface DragItem {
  id: string;
  type: string;
}

export const useDragAndDrop = (icon: DesktopIcon) => {
  const { updateIconPosition, deleteIcon } = useDesktopContext();

  const [, drag] = useDrag(() => ({
    type: 'icon',
    item: { id: icon.id }
  }));

  const [, drop] = useDrop(() => ({
    accept: ['icon', 'trash'],
    drop: (item: DragItem, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const newX = Math.round((icon.position.x + delta.x) / GRID_SIZE) * GRID_SIZE;
      const newY = Math.round((icon.position.y + delta.y) / GRID_SIZE) * GRID_SIZE;

      updateIconPosition(icon.id, newX, newY);
    }
  }));

  const [, trashDrop] = useDrop(() => ({
    accept: 'icon',
    drop: (item: DragItem) => {
      deleteIcon(item.id);
    }
  }));

  return { drag, drop, trashDrop };
};