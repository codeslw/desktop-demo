import { makeStyles, shorthands, mergeClasses } from '@fluentui/react-components';
import { memo, useRef, useEffect } from 'react';

// Create separate types for menu items and dividers
export type ContextMenuDivider = {
  id: string;
  divider: true;
};

export type ContextMenuAction = {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  divider?: false; 
};

export type ContextMenuItem = ContextMenuAction | ContextMenuDivider;

interface ContextMenuProps {
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose: () => void;
}

// Function to check if item is a divider
const isDivider = (item: ContextMenuItem): item is ContextMenuDivider => {
  return 'divider' in item && item.divider === true;
};

const useStyles = makeStyles({
  contextMenu: {
    position: 'fixed',
    backgroundColor: 'var(--window-bg)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    ...shorthands.padding('4px'),
    minWidth: '220px',
    maxWidth: '320px',
    zIndex: 1000,
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.borderRadius('4px'),
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '400',
    color: 'var(--text-color)',
    justifyContent: 'space-between',
    userSelect: 'none',
    '&:hover:not(.disabled)': {
      backgroundColor: 'var(--window-item-hover-bg)',
    },
  },
  itemLeftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  itemIcon: {
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemShortcut: {
    fontSize: '12px',
    color: 'var(--text-color-secondary)',
    marginLeft: '8px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--window-border)',
    ...shorthands.margin('4px', '0'),
  },
  disabled: {
    opacity: 0.5,
    cursor: 'default',
  },
  danger: {
    color: '#e81123',
  },
});

export const ContextMenu = memo(({ items, x, y, onClose }: ContextMenuProps) => {
  const styles = useStyles();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to ensure menu is within viewport
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const { width, height } = rect;
      
      // Adjust x if menu would go outside right edge
      let adjustedX = x;
      if (x + width > window.innerWidth) {
        adjustedX = window.innerWidth - width - 10;
      }
      
      // Adjust y if menu would go outside bottom edge
      let adjustedY = y;
      if (y + height > window.innerHeight) {
        adjustedY = window.innerHeight - height - 10;
      }
      
      if (menuRef.current) {
        menuRef.current.style.left = `${adjustedX}px`;
        menuRef.current.style.top = `${adjustedY}px`;
      }
    }
  }, [x, y]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (isDivider(item)) return;
    if (item.disabled) return;
    if (item.onClick) item.onClick();
    onClose();
  };

  return (
    <div 
      ref={menuRef} 
      className={styles.contextMenu}
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => (
        isDivider(item) ? (
          <div key={`divider-${item.id || index}`} className={styles.divider} />
        ) : (
          <div
            key={item.id}
            className={mergeClasses(
              styles.menuItem,
              item.disabled && styles.disabled,
              item.danger && styles.danger
            )}
            onClick={() => handleItemClick(item)}
          >
            <div className={styles.itemLeftSection}>
              {item.icon && (
                <div className={styles.itemIcon}>
                  <img src={item.icon} alt="" width="16" height="16" />
                </div>
              )}
              <span>{item.label}</span>
            </div>
            {item.shortcut && (
              <div className={styles.itemShortcut}>{item.shortcut}</div>
            )}
          </div>
        )
      ))}
    </div>
  );
}); 