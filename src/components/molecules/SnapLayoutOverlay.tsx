import { makeStyles, shorthands, mergeClasses } from '@fluentui/react-components';
import { memo, useEffect, useState } from 'react';
import { SnapRegion } from '../../contexts/WindowContext';

interface SnapLayoutOverlayProps {
  isVisible: boolean;
  onSnapSelect: (region: SnapRegion) => void;
}

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 48px)', // Adjust for taskbar
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.2s, visibility 0.2s',
    pointerEvents: 'none',
  },
  visible: {
    opacity: 1,
    visibility: 'visible',
    pointerEvents: 'all',
  },
  layoutGrid: {
    display: 'grid',
    width: '80%',
    height: '70%',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '15px',
    padding: '20px',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  layoutOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.border('2px', 'solid', 'rgba(255, 255, 255, 0.2)'),
    ...shorthands.borderRadius('8px'),
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      ...shorthands.borderColor('rgba(0, 120, 212, 0.8)'),
      boxShadow: '0 0 15px rgba(0, 120, 212, 0.5)',
      transform: 'scale(1.03)',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    userSelect: 'none',
  },
  layoutLeft: {
    gridColumn: '1 / span 2',
    gridRow: '1 / span 2',
  },
  layoutRight: {
    gridColumn: '3 / span 2',
    gridRow: '1 / span 2',
  },
  layoutTopLeft: {
    gridColumn: '1 / span 2',
    gridRow: '1',
  },
  layoutTopRight: {
    gridColumn: '3 / span 2',
    gridRow: '1',
  },
  layoutBottomLeft: {
    gridColumn: '1 / span 2',
    gridRow: '2',
  },
  layoutBottomRight: {
    gridColumn: '3 / span 2',
    gridRow: '2',
  },
  layoutQuad1: {
    gridColumn: '1 / span 1',
    gridRow: '1 / span 1',
  },
  layoutQuad2: {
    gridColumn: '2 / span 1',
    gridRow: '1 / span 1',
  },
  layoutQuad3: {
    gridColumn: '3 / span 1',
    gridRow: '1 / span 1',
  },
  layoutQuad4: {
    gridColumn: '4 / span 1',
    gridRow: '1 / span 1',
  },
  layoutQuad5: {
    gridColumn: '1 / span 1',
    gridRow: '2 / span 1',
  },
  layoutQuad6: {
    gridColumn: '2 / span 1',
    gridRow: '2 / span 1',
  },
  layoutQuad7: {
    gridColumn: '3 / span 1',
    gridRow: '2 / span 1',
  },
  layoutQuad8: {
    gridColumn: '4 / span 1',
    gridRow: '2 / span 1',
  },
});

// Layout options for each type
const layoutTypes = {
  twoUp: [
    { label: 'Left', region: SnapRegion.LEFT, className: 'layoutLeft' },
    { label: 'Right', region: SnapRegion.RIGHT, className: 'layoutRight' },
  ],
  fourUp: [
    { label: 'Top Left', region: SnapRegion.TOP_LEFT, className: 'layoutTopLeft' },
    { label: 'Top Right', region: SnapRegion.TOP_RIGHT, className: 'layoutTopRight' },
    { label: 'Bottom Left', region: SnapRegion.BOTTOM_LEFT, className: 'layoutBottomLeft' },
    { label: 'Bottom Right', region: SnapRegion.BOTTOM_RIGHT, className: 'layoutBottomRight' },
  ],
  threeBottom: [
    { label: 'Top', region: SnapRegion.TOP, className: 'layoutTop' },
    { label: 'Bottom Left', region: SnapRegion.BOTTOM_LEFT, className: 'layoutBottomLeft' },
    { label: 'Bottom Right', region: SnapRegion.BOTTOM_RIGHT, className: 'layoutBottomRight' },
  ],
  threeLeft: [
    { label: 'Left', region: SnapRegion.LEFT, className: 'layoutLeft' },
    { label: 'Top Right', region: SnapRegion.TOP_RIGHT, className: 'layoutTopRight' },
    { label: 'Bottom Right', region: SnapRegion.BOTTOM_RIGHT, className: 'layoutBottomRight' },
  ],
};

export const SnapLayoutOverlay = memo(({ isVisible, onSnapSelect }: SnapLayoutOverlayProps) => {
  const styles = useStyles();
  const [activeLayout, setActiveLayout] = useState<keyof typeof layoutTypes>('twoUp');
  
  // Close the overlay when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onSnapSelect(SnapRegion.NONE);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onSnapSelect]);
  
  // Switch between layouts
  const cycleLayouts = () => {
    const layouts: (keyof typeof layoutTypes)[] = ['twoUp', 'fourUp', 'threeBottom', 'threeLeft'];
    const currentIndex = layouts.indexOf(activeLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setActiveLayout(layouts[nextIndex]);
  };
  
  return (
    <div 
      className={mergeClasses(
        styles.overlay,
        isVisible && styles.visible
      )}
      onClick={() => onSnapSelect(SnapRegion.NONE)}
    >
      <div className={styles.layoutGrid} onClick={(e) => e.stopPropagation()}>
        {layoutTypes[activeLayout].map((option) => (
          <div 
            key={option.region}
            className={mergeClasses(
              styles.layoutOption,
              styles[option.className as keyof typeof styles]
            )}
            onClick={() => onSnapSelect(option.region)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}); 