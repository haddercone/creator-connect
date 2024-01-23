export function getNextAllowedQuestionTimeStamp(minutesToAdd: number): string {
  const currentTime: Date = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + minutesToAdd);
  const hours: number = currentTime.getHours() % 12 || 12;
  const minutes: number = currentTime.getMinutes();
  const ampm: string = currentTime.getHours() >= 12 ? "PM" : "AM";
  const formattedTime: string = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;

  return formattedTime;
}
