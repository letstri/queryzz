export type QueryItem<T = string | number | boolean | null> = T;

export default interface IQuery<T = QueryItem> {
  [key: string]: QueryItem<T> | QueryItem<T>[];
}
