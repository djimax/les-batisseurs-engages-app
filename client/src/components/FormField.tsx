/**
 * Reusable form field component with error handling
 */

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component for form fields with label, error, and hint
 */
export function FormField({
  label,
  error,
  required,
  hint,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <Label className={required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <div className="flex items-center space-x-1 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Text input field with validation
 */
export function TextField({
  label,
  error,
  required,
  hint,
  className = "",
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input
        {...props}
        className={error ? "border-destructive" : ""}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.name}-error` : undefined}
      />
    </FormField>
  );
}

/**
 * Number input field for monetary amounts
 */
export function MoneyField({
  label,
  error,
  required,
  hint,
  currency = "F",
  className = "",
  ...props
}: FormFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    currency?: string;
  }) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <div className="relative">
        <Input
          type="number"
          step="0.01"
          min="0"
          {...props}
          className={`pr-8 ${error ? "border-destructive" : ""}`}
          aria-invalid={!!error}
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {currency}
        </span>
      </div>
    </FormField>
  );
}

/**
 * Date input field
 */
export function DateField({
  label,
  error,
  required,
  hint,
  className = "",
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input
        type="date"
        {...props}
        className={error ? "border-destructive" : ""}
        aria-invalid={!!error}
      />
    </FormField>
  );
}

/**
 * Email input field
 */
export function EmailField({
  label,
  error,
  required,
  hint,
  className = "",
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <Input
        type="email"
        {...props}
        className={error ? "border-destructive" : ""}
        aria-invalid={!!error}
      />
    </FormField>
  );
}

/**
 * Textarea field
 */
export function TextareaField({
  label,
  error,
  required,
  hint,
  className = "",
  ...props
}: FormFieldProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <textarea
        {...props}
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-destructive" : ""
        } ${className}`}
        aria-invalid={!!error}
      />
    </FormField>
  );
}

/**
 * Select field
 */
export function SelectField({
  label,
  error,
  required,
  hint,
  options,
  className = "",
  ...props
}: FormFieldProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<{ value: string; label: string }>;
  }) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <select
        {...props}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-destructive" : ""
        } ${className}`}
        aria-invalid={!!error}
      >
        <option value="">Sélectionner...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

/**
 * Checkbox field
 */
export function CheckboxField({
  label,
  error,
  hint,
  className = "",
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField label={label} error={error} hint={hint}>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...props}
          className={`h-4 w-4 rounded border border-input ${error ? "border-destructive" : ""}`}
          aria-invalid={!!error}
        />
        {label && <label className="text-sm font-medium cursor-pointer">{label}</label>}
      </div>
    </FormField>
  );
}
