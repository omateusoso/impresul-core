import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className={styles.container}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={`
            ${styles.input}
            ${error ? styles.hasError : ''}
            ${className || ''}
          `}
                    {...props}
                />
                {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
                {error && <p className={styles.errorText}>{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
