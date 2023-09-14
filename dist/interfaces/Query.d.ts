export type QueryItem = string | number | boolean | null;
export type Query = Record<string, QueryItem | QueryItem[]>;
export type StringQuery = Record<string, string | string[]>;
