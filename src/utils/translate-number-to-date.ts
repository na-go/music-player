
const translateTimer = (minute: number, second: number): string => {
  if (minute < 10 && second < 10) {
    return `0${minute}:0${second}`;
    } else if (second < 10) {
      return `${minute}:0${second}`;
    } else if (minute < 10) {
      return `0${minute}:${second}`;
    }

    return `${minute}:${second}`;
}

export const translateNumberToDate = (number: number): string => {
  const hour = Math.floor(number / 3600);
  const minute = Math.floor((number % 3600) / 60);
  const second = Math.floor((number % 3600) % 60);
  if (hour === 0) {
    return translateTimer(minute, second);
  }

  return `${hour}:${translateTimer(minute, second)}`;
}