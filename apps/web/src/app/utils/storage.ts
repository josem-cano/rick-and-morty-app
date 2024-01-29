export const getStorageObject = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (item !== null) return JSON.parse(item) as T;
  return null;
};

export const setStorageObject = <T>(key: string, object: T) => {
  localStorage.setItem(key, JSON.stringify(object));
};

export const deleteStorageObject = (key: string) => {
  localStorage.removeItem(key);
};
