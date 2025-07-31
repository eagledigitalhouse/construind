import React, { Fragment } from "react";
import Icon from "./Icon";
import { cn } from "../../lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFormProps {
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
  description?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[] | string[];
  defaultValue?: string;
  size?: number;
  multiple?: boolean;
  children?: React.ReactNode;
}

const SelectForm: React.FC<SelectFormProps> = ({
  label,
  placeholder = "Selecione uma opção",
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
  description,
  onChange,
  options = [],
  defaultValue,
  size,
  multiple,
  children,
  ...rest
}) => {
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
          <select
            onChange={onChange}
            {...register(name)}
            {...rest}
            multiple={multiple}
            className={cn(
              "text-control py-2 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white",
              {
                "is-error border-red-500": error,
                "pr-10": true,
              },
              className
            )}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            value={value}
            size={size}
            defaultValue={defaultValue}
          >
            {children ? (
              children
            ) : (
              <Fragment>
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((option, i) => (
                  <Fragment key={i}>
                    {typeof option === 'object' && option.value && option.label ? (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ) : (
                      <option key={i} value={option as string}>
                        {option as string}
                      </option>
                    )}
                  </Fragment>
                ))}
              </Fragment>
            )}
          </select>
        ) : (
          <select
            onChange={onChange}
            multiple={multiple}
            className={cn(
              "text-control py-2 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white",
              {
                "is-error border-red-500": error,
                "pr-10": true,
              },
              className
            )}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            value={value}
            size={size}
            defaultValue={defaultValue}
            {...rest}
          >
            {children ? (
              children
            ) : (
              <Fragment>
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((option, i) => (
                  <Fragment key={i}>
                    {typeof option === 'object' && option.value && option.label ? (
                      <option key={i} value={option.value}>
                        {option.label}
                      </option>
                    ) : (
                      <option key={i} value={option as string}>
                        {option as string}
                      </option>
                    )}
                  </Fragment>
                ))}
              </Fragment>
            )}
          </select>
        )}

        {/* icon */}
        <div className="flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
          <span className="relative -right-2 inline-block text-gray-900 dark:text-gray-300 pointer-events-none">
            <Icon icon="heroicons:chevron-down" />
          </span>
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
        <div className="mt-2 text-red-600 block text-sm">{error.message}</div>
      )}
      {/* validated and success message*/}
      {validate && (
        <div className="mt-2 text-green-600 block text-sm">{validate}</div>
      )}
      {/* only description */}
      {description && <span className="input-help text-sm text-gray-500 mt-1 block">{description}</span>}
    </div>
  );
};

export default SelectForm;