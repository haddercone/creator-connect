import { CreatorsProp, User } from "./types";

export function getLastSuccessfullQuestionsTimeStamp(): string {
  const currentTime: Date = new Date();
  const hours: number = currentTime.getHours() % 12 || 12;
  const minutes: number = currentTime.getMinutes();
  const ampm: string = currentTime.getHours() >= 12 ? "PM" : "AM";
  const formattedTime: string = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;

  return formattedTime;
}

export function filterUsers<T extends CreatorsProp>(data: T, query: string) {
  const filteredUsers : CreatorsProp = data.filter(({ name, username }) => {
    const textToSearch = name + username;
    const hasQuery = textToSearch.toLowerCase().includes(query.toLowerCase());
    if (!hasQuery) return;
    return hasQuery;
  });
  return filteredUsers;
}

export function getUpdatedFields<T extends User>(
  existingUser: User,
  newUser: T
): Partial<T> | null {
  const updatedFields: Partial<T> = {};
  for (const [key, value] of Object.entries(newUser)) {
    if (existingUser.hasOwnProperty(key) && existingUser[key as keyof User] !== value) {
      updatedFields[key as keyof T] = value as T[keyof T];
    }
  }
  return Object.keys(updatedFields).length > 0 ? updatedFields : null;
}
