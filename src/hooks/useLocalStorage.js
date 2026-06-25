import { useState, useEffect } from "react";

/**
 * Custom hook to manage state synchronized with localStorage.
 * This ensures configuration values persist between browser sessions.
 * 
 * @param {string} key - The key under which the data is stored in localStorage.
 * @param {any} initialValue - The fallback value if no data exists in localStorage.
 */
export default function useLocalStorage(key, initialValue) {
  // Read initial value from localStorage if available, otherwise use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Fallback in case of storage failure (e.g., private browsing mode restrictions)
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep localStorage in sync with react state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
