import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  leftIcon,
  fullWidth = true,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={clsx(styles.container, fullWidth && styles.fullWidth)}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={clsx(styles.selectWrapper, error && styles.hasError)}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <select
          id={selectId}
          ref={ref}
          className={clsx(
            styles.select,
            leftIcon && styles.withLeftIcon,
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>
          <ChevronDown size={18} />
        </span>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
