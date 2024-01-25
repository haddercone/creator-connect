import { CreatorsProp } from "./types";

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
