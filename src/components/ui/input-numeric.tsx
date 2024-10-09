import { forwardRef, useRef } from "react";

const _renderNumeric = (value, maxFractionDigits = 0) => {
  const number = Number(value);
  return number?.toLocaleString("id-ID", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  });
};

const handleNegativeValue = (rawText, numberText) => {
  let result = numberText;

  if (rawText.includes("-")) {
    result = `-${result}`;
  }

  if (
    rawText.includes("-0") ||
    rawText.includes("-0-") ||
    rawText.includes("0-")
  ) {
    result = "-1"; // Handling "-0" cases
  }

  if (isNaN(result) || result === "" || result == null) {
    result = "0"; // Default to 0 if invalid number
  }

  return result;
};

// Using forwardRef to receive inputRef from parent
export const InputNumeric = forwardRef(
  ({ value = 0, onChange, className, allowNegative = false, ...props }, ref) => {
    const hiddenInputRef = useRef();

    const handleChange = (e) => {
      const rawText = e.target.value;
      let numberText = rawText.replace(/\D/g, ""); // Removing non-digit characters
      let result = numberText;

      if (allowNegative) {
        result = handleNegativeValue(rawText, numberText);
      }

      onChange(Number(result));
    };

    return (
      <div>
        {/* Input to show formatted value */}
        <input
          className={`${className}`}
          value={_renderNumeric(value)}
          onChange={handleChange}
          onClick={() => hiddenInputRef?.current?.click()}
          onFocus={() => hiddenInputRef?.current?.focus()}
          ref={ref} // Forwarded ref from parent
          {...props}
        />

        {/* Hidden input to store the raw numeric value */}
        <input
          ref={hiddenInputRef}
          hidden
          value={value}
          onChange={() => { }} // No operation for hidden input
        />
      </div>
    );
  }
);
