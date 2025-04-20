import { makeStyles, shorthands } from '@fluentui/react-components';
import { memo, ReactNode } from 'react';

interface ToolbarProps {
  children: ReactNode;
}

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    height: '46px',
    backgroundColor: 'var(--window-toolbar-bg)',
    ...shorthands.borderBottom('1px', 'solid', 'var(--window-border)'),
    ...shorthands.padding('0', '12px'),
    gap: '4px',
  },
  toolbarButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('6px', '10px'),
    ...shorthands.borderRadius('4px'),
    ...shorthands.margin('0', '2px'),
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    color: 'var(--text-color)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
    },
    transition: 'background-color 0.15s ease',
    fontSize: '13px',
    gap: '6px',
    height: '34px',
  },
  toolbarSeparator: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--window-border)',
    ...shorthands.margin('0', '8px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-color-secondary)',
    opacity: 0.5,
  }
});

export const Toolbar = memo(({ children }: ToolbarProps) => {
  const styles = useStyles();
  return <div className={styles.toolbar}>{children}</div>;
}); 