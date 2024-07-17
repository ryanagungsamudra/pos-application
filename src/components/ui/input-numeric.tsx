import { useRef } from "react";

const _renderNumeric = (value, maxFractionDigits = 0) => {
  let number = Number(value);
  return number?.toLocaleString("id-ID", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  });
};

const handleNegativeValue = (rawText, numberText) => {
  let textNumber = numberText;
  let result = textNumber;

  if (rawText.includes("-")) {
    textNumber = `-${textNumber}`;
  }

  if (
    rawText.includes("-0") ||
    rawText.includes("-0-") ||
    rawText.includes("0-")
  ) {
    textNumber = `-1`;
  }

  if (isNaN(textNumber) || textNumber === "" || !textNumber) {
    textNumber = 0;
  }
  result = textNumber;

  return result;
};

export const InputNumeric = ({
  value = 0,
  onChange,
  className,
  allowNegative = true,
  ...props
}) => {
  const inputRef = useRef();

  const handleChange = (e) => {
    let rawText = e.target.value;
    let numberText = rawText.replace(/\D/g, "");
    let result = numberText;

    if (allowNegative) {
      result = handleNegativeValue(rawText, numberText);
    }

    onChange(Number(result));
  };

  return (
    <div>
      <input
        className={`${className}`}
        value={`${_renderNumeric(value)}`}
        onChange={handleChange}
        onClick={() => inputRef?.current?.click()}
        onFocus={() => inputRef?.current?.focus()}
        {...props}
      />

      <input ref={inputRef} hidden value={value} onChange={() => {}} />
    </div>
  );
};
