export const save = (key, val) => window?.localStorage.setItem(key, val);

export const get = (key) => window?.localStorage.getItem(key);
