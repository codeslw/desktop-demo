import { makeStyles, shorthands, Text, mergeClasses } from '@fluentui/react-components';
import { Icon } from '../atoms/Icon';
import { DesktopIcon as IconType } from '../../types';
import { useDrag } from 'react-dnd';
import { memo, useRef, useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useWindowContext } from '../../contexts/WindowContext';

const useStyles = makeStyles({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    ...shorthands.padding('8px'),
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    transition: 'transform 0.05s, background-color 0.2s',
    zIndex: 1,
    userSelect: 'none',
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
    },
    '&:active': {
      transform: 'scale(0.97)',
    }
  },
  selected: {
    backgroundColor: 'var(--icon-selected-bg)',
    '&:hover': {
      backgroundColor: 'var(--icon-selected-hover-bg)',
    }
  },
  dragging: {
    opacity: 0.99,
    zIndex: 10
  },
  text: {
    color: 'var(--desktop-icon-text)',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '400',
    ...shorthands.margin('8px', 0, 0),
    // textShadow: '0 0 3px rgba(0,0,0,0.7)',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});

interface DesktopIconProps {
  icon: IconType;
  onDrop: (id: string, x: number, y: number) => void;
}

export const DesktopIcon = memo(({ icon, onDrop }: DesktopIconProps) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);
  const { openWindow } = useWindowContext();
  
  // Listen to desktop background clicks to deselect the icon
  useEffect(() => {
    const handleBackgroundClick = () => {
      setIsSelected(false);
    };
    
    window.addEventListener('desktop-background-click', handleBackgroundClick);
    
    return () => {
      window.removeEventListener('desktop-background-click', handleBackgroundClick);
    };
  }, []);
  
  // Define drag configuration
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'DESKTOP_ICON',
    item: () => ({ id: icon.id, x: icon.position.x, y: icon.position.y }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      
      if (!didDrop) {
        // If dropped outside of a drop target, get the delta from the initial position
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          const newX = Math.max(0, icon.position.x + delta.x);
          const newY = Math.max(0, icon.position.y + delta.y);
          onDrop(icon.id, newX, newY);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [icon.id, icon.position.x, icon.position.y, onDrop]);

  // Apply the ref to the component
  drag(iconRef);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the desktop's click handler from being called
    setIsSelected(true);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (icon.id === 'thispc') {
      openWindow('thispc', 'This PC');
    } else if (icon.id === 'report') {
      openWindow('reports', 'Tax Reports', {
        type: 'reports',
        isMaximized: true
      });
    } else if (icon.id === 'settings') {
      console.log('Opening Settings window...');
      openWindow('settings', 'Settings');
    } else {
      console.log(`Open ${icon.name}`);
    }
    
    setIsSelected(false);
  };

  return (
    <div
      ref={iconRef}
      className={mergeClasses(
        styles.container,
        isSelected && styles.selected,
        isDragging && styles.dragging
      )}
      style={{ 
        left: icon.position.x, 
        top: icon.position.y,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Icon src={icon.icon} alt={icon.name} size='40px' />
      <Text className={styles.text}>{icon.name}</Text>
    </div>
  );
});