import { makeStyles, shorthands, mergeClasses } from '@fluentui/react-components';
import { ChevronRight16Regular } from '@fluentui/react-icons';
import { useState, useRef, useEffect } from 'react';

interface PathBarProps {
  path: string;
  onNavigate: (path: string) => void;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--window-addressbar-bg)',
    height: '40px',
    ...shorthands.padding('0', '12px'),
    ...shorthands.borderBottom('1px', 'solid', 'var(--window-border)'),
    whiteSpace: 'nowrap',
    fontSize: '14px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  crumbSegment: {
    ...shorthands.padding('4px', '8px'),
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--window-item-hover-bg)',
    },
    transition: 'background-color 0.1s ease',
    display: 'flex',
    alignItems: 'center',
    height: '28px',
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('4px', '8px'),
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--window-item-hover-bg)',
    },
    transition: 'background-color 0.1s ease',
    height: '28px',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-color-secondary)',
    ...shorthands.padding('0', '2px'),
    flexShrink: 0,
  },
  folderIcon: {
    width: '16px',
    height: '16px',
    marginRight: '6px',
  },
  active: {
    backgroundColor: 'var(--icon-hover-bg)',
    fontWeight: '500',
  }
});

export const PathBar = ({ path, onNavigate }: PathBarProps) => {
  const styles = useStyles();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse the path into segments
  const segments = path ? path.split('/').filter(Boolean) : [];
  
  // Add "This PC" as the root when path is empty or at the root level
  const effectiveSegments = segments.length === 0 ? ['This PC'] : ['This PC', ...segments];
  
  // Handle click on a path segment
  const handleClick = (index: number) => {
    if (index === 0) {
      // Handle clicking on "This PC"
      onNavigate('This PC');
      return;
    }
    
    // Calculate the path up to the clicked segment
    const targetPath = segments.slice(0, index).join('/');
    onNavigate(targetPath);
  };
  
  // Check if container needs to be collapsed due to overflow
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setIsCollapsed(isOverflowing);
    }
  }, [path]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Root (This PC) */}
      <div 
        className={mergeClasses(
          styles.root,
          effectiveSegments.length === 1 && styles.active
        )}
        onClick={() => handleClick(0)}
      >
        <img src="/src/assets/icons/thispc.svg" alt="This PC" className={styles.folderIcon} />
        {effectiveSegments[0]}
      </div>
      
      {/* Path segments */}
      {effectiveSegments.slice(1).map((segment, index) => {
        // Actual index in the effectiveSegments array
        const segmentIndex = index + 1;
        const isLast = segmentIndex === effectiveSegments.length - 1;
        
        return (
          <div className={styles.breadcrumb} key={`segment-${index}`}>
            <div className={styles.separator}>
              <ChevronRight16Regular />
            </div>
            <div 
              className={mergeClasses(
                styles.crumbSegment,
                isLast && styles.active
              )}
              onClick={() => handleClick(segmentIndex)}
            >
              <img src="/src/assets/icons/folders.svg" alt="Folder" className={styles.folderIcon} />
              {segment}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 