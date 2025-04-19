import { makeStyles, shorthands } from '@fluentui/react-components';
import { Icon } from '../atoms/Icon';
import { memo } from 'react';

export interface TaskbarButtonProps {
    icon: string;
    alt: string;
    size?: "small" | "default"
    onClick?: () => void;
    active?: boolean;
}

const useStyles = makeStyles({
    button: {
        backgroundColor: 'transparent',
        ...shorthands.border('none'),
        ...shorthands.padding('8px'),
        ...shorthands.borderRadius('4px'),
        ...shorthands.margin('0', '2px'),
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ':hover': {
            backgroundColor: 'var(--icon-hover-bg)'
        }
    },
    smallButtonClass: {
        backgroundColor: 'transparent',
        ...shorthands.border('none'),
        ...shorthands.padding('4px'),
        ...shorthands.borderRadius('4px'),
        ...shorthands.margin('0', '0px'),
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        ':hover': {
            backgroundColor: 'var(--icon-hover-bg)'
        }
    },
    activeButton: {
        backgroundColor: 'var(--icon-active-bg)',
        ':after': {
            content: '""',
            position: 'absolute',
            bottom: '4px',
            width: '20px',
            height: '3px',
            backgroundColor: 'var(--text-color)',
            ...shorthands.borderRadius('1.5px')
        }
    }
});

export const TaskbarButton = memo(({ icon, size = "default", alt, onClick, active = false }: TaskbarButtonProps) => {
    const styles = useStyles();
    const buttonClass = active ? `${styles.button} ${styles.activeButton}` : styles.button;


    return (
        <button className={size === "small" ? styles.smallButtonClass : buttonClass} onClick={onClick}>
            <Icon src={icon} alt={alt} size={size === "small" ? "20px" : undefined} />
        </button>
    );
});