import React from 'react';
import clsx from 'clsx';

export const Button = ({ children, variant = 'primary', className, ...props }) => {
    return (
        <button
            className={clsx('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary', className)}
            {...props}
        >
            {children}
        </button>
    );
};
