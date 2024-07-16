import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ChangeEvent,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with commas as thousands separators.
 * Hides a single zero.
 *
 * @param {number} number - The number to format.
 * @returns {string} - The formatted number or an empty string if the number is zero.
 */

// interface debounceProps {
//   func: (...args: any) => void;
//   delay: number;
// }

// export const debounce = ({ func, delay }: debounceProps) => {
//   let timeoutId;

//   return function debounced(...args) {
//     const context = this;

//     clearTimeout(timeoutId);

//     timeoutId = setTimeout(() => {
//       func.apply(context, args);
//     }, delay);
//   };
// };

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp");
};

const formatNumber = (number: number): string => {
  if (number === 0) return "";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Custom hook for managing a formatted number input.
 *
 * @param {number} initialValue - The initial value of the number.
 * @returns {Array} - The formatted value, the original value, and the change handler.
 */
export const useFormattedNumber = (
  initialValue: number
): [string, number, (e: ChangeEvent<HTMLInputElement>) => void] => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Remove commas before converting back to number
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(rawValue))) {
      setValue(Number(rawValue));
    }
  };

  return [formatNumber(value), value, handleChange];
};

export const useLocalStorageState = <T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } else {
      return initialValue;
    }
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state, isHydrated]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null && !isEqual(state, JSON.parse(storedValue))) {
        setState(JSON.parse(storedValue));
      } else if (storedValue === null) {
        setState(initialValue);
      }
      setIsHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, initialValue]); // This useEffect should run only once on mount

  return [state, setState];
};

// Helper function to compare objects deeply
const isEqual = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
