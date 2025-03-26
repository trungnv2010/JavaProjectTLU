import { isValidJSON } from "@/lib/utils";

export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

export const nextLocalStorage = (): Storage | void => {
  if (isBrowser()) {
    return window.localStorage;
  }
};

export class LocalStorage {
  getLocalStorage(key: string): string {
    if (!nextLocalStorage()) {
      return "";
    }
    return nextLocalStorage()?.getItem(key) || "";
  }

  setLocalStorage(key: string, value: string): void {
    if (!nextLocalStorage()) {
      return;
    }
    nextLocalStorage()?.setItem(key, value);
  }

  getObjectFromKey<T>(key: string): T | Record<string, unknown> {
    const jsonString = this.getLocalStorage(key);
    if (isValidJSON(jsonString)) {
      return JSON.parse(jsonString) as T;
    }
    return {};
  }
}

export const storage = new LocalStorage();
