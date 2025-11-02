export const getStorageItem = <T>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.warn(`Error reading from localStorage key “${key}”:`, error);
    return null;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key “${key}”:`, error);
  }
};
