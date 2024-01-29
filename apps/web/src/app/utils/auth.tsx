import type { UserSession } from "@repo/domain";
import {
  deleteStorageObject,
  getStorageObject,
  setStorageObject,
} from "./storage.ts";

export const getUserToken = (): string | undefined => {
  const session = getUserSession();
  return session?.token;
};

export const getUserSession = (): UserSession | null => {
  return getStorageObject<UserSession>("user-session");
};

export const setUserSession = (sessionData: UserSession) => {
  setStorageObject("user-session", sessionData);
};

export const removeSession = () => {
  deleteStorageObject("user-session");
};
