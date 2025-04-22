import { makeStyles, shorthands, Text, mergeClasses } from '@fluentui/react-components';
import { Icon } from '../atoms/Icon';
import { DesktopIcon as IconType } from '../../types';
import { memo, useRef, useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useWindowContext } from '../../contexts/WindowContext';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const useStyles = makeStyles({
  container: {
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
    // backdropFilter: 'blur(10px)',
    position: 'absolute',
    transition: 'transform 0.2s ease',
    // willChange: 'transform',
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
      transform: 'scale(1.05)',
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
}

export const DesktopIcon = memo(({ icon }: DesktopIconProps) => {
  const styles = useStyles();
  const [isSelected, setIsSelected] = useState(false);
  const { openWindow } = useWindowContext();


  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: icon.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: `${icon.x}px`,
    top: `${icon.y}px`,
  };
  
  // Listen to desktop background clicks to deselect the icon
 

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
      className={styles.container}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      onDoubleClick={handleDoubleClick}
    >
      <Icon src={icon.icon} alt={icon.name} size='40px' />
      <Text className={styles.text}>{icon.name}</Text>
    </div>
  );
});