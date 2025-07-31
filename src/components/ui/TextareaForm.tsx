import React from "react";
import { cn } from "../../lib/utils";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  classLabel?: string;
  className?: string;
  classGroup?: string;
  register?: any;
  name?: string;
  readonly?: boolean;
  value?: string;
  error?: any;
  icon?: string;
  disabled?: boolean;
  id?: string;
  horizontal?: boolean;
  validate?: string;
  msgTooltip?: boolean;
  description?: string;
  hasicon?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  cols?: number;
}

const TextareaForm: React.FC<TextareaProps> = ({
  label,
  placeholder = "Digite aqui...",
  classLabel = "form-label",
  className = "",
  classGroup = "",
  register,
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  msgTooltip,
  description,
  hasicon,
  onChange,
  rows = 3,
  cols,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "fromGroup",
        { "input-group-vertical": !horizontal },
        classGroup
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className={cn(
            classLabel,
            {
              "inline-block mb-2": !horizontal,
              "flex-0 mr-6 md:w-[100px] w-[60px] break-words": horizontal,
            }
          )}
        >
          {label}
          {validate && (
            <span className="text-danger-500 text-sm">*</span>
          )}
        </label>
      )}
      <div className={cn("relative", { "flex-1": horizontal })}>
        {name && register ? (
          <textarea
            className={cn(
              "form-control py-2",
              {
                "pl-10": hasicon,
              },
              className
            )}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            rows={rows}
            cols={cols}
            {...register(name)}
            {...rest}
          />
        ) : (
          <textarea
            className={cn(
              "form-control py-2",
              {
                "pl-10": hasicon,
              },
              className
            )}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            value={value}
            onChange={onChange}
            id={id}
            rows={rows}
            cols={cols}
            {...rest}
          />
        )}
        {/* icon */}
        {hasicon && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <span className="text-base text-slate-400">
              <iconify-icon icon={icon}></iconify-icon>
            </span>
          </div>
        )}
      </div>
      {/* error and success message*/}
      {error && (
        <div
          className={cn("mt-2", {
            "text-danger-500 block text-sm": error,
          })}
        >
          {error.message}
        </div>
      )}
      {/* description */}
      {description && <span className="input-description">{description}</span>}
    </div>
  );
};

export default TextareaForm;