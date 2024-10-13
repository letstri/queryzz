type Value = string | number | boolean | null;
type Query = Record<string, Value | Value[]>;
type StringQuery = Record<string, string | string[]>;

export type { Query as Q, StringQuery as S, Value as V };
