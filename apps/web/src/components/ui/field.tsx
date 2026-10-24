import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { Calendar, ChevronDown, Eye, EyeOff, Lock, Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, InputGroup } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * The form system. `icon` is required on every field, so a bare input is a type
 * error rather than an oversight. See DESIGN.md section 8 for the icon vocabulary.
 */

type FieldShellProps = {
  label: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  required?: boolean;
  id?: string;
  className?: string;
  labelAction?: ReactNode;
};

function FieldLabel({
  htmlFor,
  children,
  required,
  action,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground">
        {children}
        {required && (
          <span className="ms-0.5 text-danger-text" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {action}
    </div>
  );
}

function FieldMessages({
  error,
  hint,
  errorId,
  hintId,
}: {
  error?: string;
  hint?: string;
  errorId: string;
  hintId: string;
}) {
  if (error) {
    return (
      <p id={errorId} role="alert" className="text-xs font-medium text-danger-text">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={hintId} className="text-xs text-muted-foreground">
        {hint}
      </p>
    );
  }
  return null;
}

function useFieldIds(idProp?: string) {
  const generated = useId();
  const id = idProp ?? generated;
  return { id, errorId: `${id}-error`, hintId: `${id}-hint` };
}

function describedBy(error?: string, hint?: string, errorId?: string, hintId?: string) {
  const ids = [error ? errorId : null, !error && hint ? hintId : null].filter(
    Boolean,
  );
  return ids.length ? ids.join(" ") : undefined;
}

type ControlProps = {
  id?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

/**
 * Wraps a single control with a label, an affixed icon, and accessible
 * error and hint wiring.
 */
export function Field({
  label,
  icon,
  error,
  hint,
  required,
  id: idProp,
  className,
  labelAction,
  iconAlign = "center",
  endAdornment,
  children,
}: FieldShellProps & {
  iconAlign?: "center" | "top";
  endAdornment?: ReactNode;
  children: ReactElement<ControlProps>;
}) {
  const { id, errorId, hintId } = useFieldIds(idProp);

  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy(error, hint, errorId, hintId),
        className: cn(
          "ps-10",
          endAdornment && "pe-11",
          children.props.className,
        ),
      })
    : children;

  return (
    <div className={cn("space-y-1.5", className)}>
      <FieldLabel htmlFor={id} required={required} action={labelAction}>
        {label}
      </FieldLabel>
      <InputGroup
        startIcon={icon}
        iconAlign={iconAlign}
        invalid={Boolean(error)}
        endAdornment={endAdornment}>
        {control}
      </InputGroup>
      <FieldMessages
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
      />
    </div>
  );
}

/** Lock icon plus an eye toggle. Replaces the divergent per-page implementations. */
export function PasswordField({
  label,
  icon = Lock,
  error,
  hint,
  required,
  id: idProp,
  className,
  labelAction,
  ...inputProps
}: Omit<FieldShellProps, "icon"> & { icon?: LucideIcon } & ComponentProps<"input">) {
  const { id, errorId, hintId } = useFieldIds(idProp);
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("space-y-1.5", className)}>
      <FieldLabel htmlFor={id} required={required} action={labelAction}>
        {label}
      </FieldLabel>
      <InputGroup
        startIcon={icon}
        invalid={Boolean(error)}
        endAdornment={
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            {visible ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        }>
        <Input
          {...inputProps}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className="ps-10 pe-11"
        />
      </InputGroup>
      <FieldMessages
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
      />
    </div>
  );
}

/** Leading semantic icon plus a chevron. */
export function SelectField({
  label,
  icon,
  error,
  hint,
  required,
  id: idProp,
  className,
  labelAction,
  children,
  ...selectProps
}: FieldShellProps & ComponentProps<"select">) {
  const { id, errorId, hintId } = useFieldIds(idProp);

  return (
    <div className={cn("space-y-1.5", className)}>
      <FieldLabel htmlFor={id} required={required} action={labelAction}>
        {label}
      </FieldLabel>
      <InputGroup
        startIcon={icon}
        endIcon={ChevronDown}
        invalid={Boolean(error)}>
        <select
          {...selectProps}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className="h-10 w-full appearance-none rounded-xl border border-input bg-surface-raised ps-10 pe-10 text-sm text-foreground shadow-e1 transition-[color,box-shadow,border-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30">
          {children}
        </select>
      </InputGroup>
      <FieldMessages
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
      />
    </div>
  );
}

/** Icon pinned to the first line. */
export function TextareaField({
  label,
  icon,
  error,
  hint,
  required,
  id: idProp,
  className,
  labelAction,
  rows = 4,
  ...textareaProps
}: FieldShellProps & ComponentProps<"textarea">) {
  const { id, errorId, hintId } = useFieldIds(idProp);

  return (
    <div className={cn("space-y-1.5", className)}>
      <FieldLabel htmlFor={id} required={required} action={labelAction}>
        {label}
      </FieldLabel>
      <InputGroup startIcon={icon} iconAlign="top" invalid={Boolean(error)}>
        <textarea
          {...textareaProps}
          id={id}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className="w-full resize-y rounded-xl border border-input bg-surface-raised px-3 py-2.5 ps-10 text-sm text-foreground shadow-e1 transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
        />
      </InputGroup>
      <FieldMessages
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
      />
    </div>
  );
}

/** Calendar icon plus a native date control. */
export function DateField({
  label,
  icon = Calendar,
  error,
  hint,
  required,
  id: idProp,
  className,
  labelAction,
  ...inputProps
}: Omit<FieldShellProps, "icon"> & { icon?: LucideIcon } & ComponentProps<"input">) {
  const { id, errorId, hintId } = useFieldIds(idProp);

  return (
    <div className={cn("space-y-1.5", className)}>
      <FieldLabel htmlFor={id} required={required} action={labelAction}>
        {label}
      </FieldLabel>
      <InputGroup startIcon={icon} invalid={Boolean(error)}>
        <Input
          {...inputProps}
          id={id}
          type="date"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className="ps-10"
        />
      </InputGroup>
      <FieldMessages
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
      />
    </div>
  );
}

/** Search box with a clear affordance. Used by admin list filters. */
export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search",
  className,
  label,
  ...inputProps
}: Omit<ComponentProps<"input">, "onChange" | "value"> & {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name, since this control has no visible label. */
  label: string;
}) {
  return (
    <InputGroup
      startIcon={Search}
      className={className}
      endAdornment={
        value ? (
          <button
            type="button"
            onClick={() => onValueChange("")}
            aria-label="Clear search"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : undefined
      }>
      <Input
        {...inputProps}
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn("ps-10", value && "pe-11")}
      />
    </InputGroup>
  );
}

/** Icon-affixed checkbox for agreements and confirmations. */
export function CheckboxField({
  label,
  icon: Icon,
  error,
  hint,
  required,
  id: idProp,
  className,
  checked,
  onCheckedChange,
}: Omit<FieldShellProps, "label"> & {
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const { id, errorId, hintId } = useFieldIds(idProp);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border border-input bg-surface-raised p-3.5 shadow-e1",
          error && "border-destructive",
        )}>
        {Icon && (
          <Icon
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
        )}
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error, hint, errorId, hintId)}
          className="mt-0.5"
          required={required}
        />
        <div className="min-w-0 flex-1 text-sm leading-snug text-foreground">
          <label htmlFor={id} className="cursor-pointer">
            {label}
            {required && (
              <span className="ms-0.5 text-danger-text" aria-hidden="true">
                *
              </span>
            )}
          </label>
        </div>
      </div>
      <FieldMessages
        error={error}
        hint={hint}
        errorId={errorId}
        hintId={hintId}
      />
    </div>
  );
}
