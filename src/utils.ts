import { QueryItem } from './interfaces/Query';

export const tryToParse = (value: string): QueryItem => {
  try {
    const parsed = JSON.parse(value);

    return typeof parsed === 'number' ||
      typeof parsed === 'boolean' ||
      parsed === undefined ||
      parsed === null
      ? parsed
      : value;
  } catch (err) {
    return value;
  }
};
