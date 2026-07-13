import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ icon, title, subtitle, action }: { icon?: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">{icon}</div>}
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

const inputBase =
  'w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 text-sm px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 placeholder:text-slate-400';

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`${inputBase} ${className}`} {...props} />
  ),
);
TextInput.displayName = 'TextInput';

export const NumberInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} type="number" className={`${inputBase} ${className}`} {...props} />
  ),
);
NumberInput.displayName = 'NumberInput';

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select ref={ref} className={`${inputBase} cursor-pointer ${className}`} {...props}>
      {children}
    </select>
  ),
);
SelectInput.displayName = 'SelectInput';

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type BtnSize = 'sm' | 'md' | 'lg';

export function Button({
  children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  size?: BtnSize;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  const variants: Record<BtnVariant, string> = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50',
    danger: 'bg-error-500 hover:bg-error-600 text-white shadow-sm',
    success: 'bg-success-500 hover:bg-success-600 text-white shadow-sm',
  };
  const sizes: Record<BtnSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, color = 'brand' }: { children: ReactNode; color?: 'brand' | 'green' | 'amber' | 'slate' | 'red' }) {
  const colors = {
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    green: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
    amber: 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    red: 'bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, subtitle, action }: { icon: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
