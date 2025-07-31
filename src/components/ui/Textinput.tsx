import React, { useState } from "react";
import Icon from "./Icon";
import { cn } from "../../lib/utils";

interface TextinputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  classLabel?: string;
  className?: string;
  classGroup?: string;
  register?: any;
  name?: string;
  readonly?: boolean;
  error?: any;
  icon?: string;
  disabled?: boolean;
  id?: string;
  horizontal?: boolean;
  validate?: string;
  description?: string;
  hasicon?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  value?: string;
}

const Textinput: React.FC<TextinputProps> = ({
  type = "text",
  label,
  placeholder,
  classLabel = "form-label",
  className = "",
  classGroup = "",
  register,
  name,
  readonly,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  description,
  hasicon,
  onChange,
  onFocus,
  defaultValue,
  value,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div
      className={cn(
        "textfiled-wrapper",
        {
          "is-error": error,
          "flex": horizontal,
          "is-valid": validate,
        },
        classGroup
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "block capitalize",
            classLabel,
            {
              "flex-0 mr-6 md:w-[100px] w-[60px] break-words": horizontal,
            }
          )}
        >
          {label}
          {validate && (
            <span className="text-red-500 text-sm ml-1">*</span>
          )}
        </label>
      )}
      <div className={cn("relative", { "flex-1": horizontal })}>
        {name && register ? (
          <input
            type={type === "password" && open === true ? "text" : type}
            {...register(name)}
            {...rest}
            className={cn(
              "text-control py-[10px] w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              {
                "is-error border-red-500": error,
                "pr-10": hasicon || error || validate,
              },
              className
            )}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            onChange={onChange}
            onFocus={onFocus}
            defaultValue={defaultValue}
            value={value}
          />
        ) : (
          <input
            type={type === "password" && open === true ? "text" : type}
            className={cn(
              "text-control py-[10px] w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              {
                "is-error border-red-500": error,
                "pr-10": hasicon || error || validate,
              },
              className
            )}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            onChange={onChange}
            onFocus={onFocus}
            id={id}
            defaultValue={defaultValue}
            value={value}
            {...rest}
          />
        )}
        
        {/* icon */}
        <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
          {hasicon && type === "password" && (
            <span className="cursor-pointer text-gray-400" onClick={handleOpen}>
              {open ? (
                <Icon icon="heroicons-outline:eye" />
              ) : (
                <Icon icon="heroicons-outline:eye-off" />
              )}
            </span>
          )}

          {error && (
            <span className="text-red-500">
              <Icon icon="ph:info-fill" />
            </span>
          )}
          {validate && (
            <span className="text-green-500">
              <Icon icon="ph:check-circle-fill" />
            </span>
          )}
        </div>
      </div>
      
      {/* error and success message*/}
      {error && (
        <div className="mt-2 text-red-500 block text-sm">{error.message}</div>
      )}
      {/* validated and success message*/}
      {validate && (
        <div className="mt-2 text-green-500 block text-sm">{validate}</div>
      )}
      {/* only description */}
      {description && <span className="input-help text-sm text-gray-500 mt-1 block">{description}</span>}
    </div>
  );
};

export default Textinput;