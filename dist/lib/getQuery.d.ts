import type { Query, StringQuery } from '../interfaces/Query';
interface Options {
    link?: string;
    arrays?: string[];
    parse?: boolean;
}
declare function getQuery<T = StringQuery>(options: Options & {
    parse: false;
}): Partial<{
    [P in keyof T]: T[P] extends Array<infer _> ? string[] : string;
}>;
declare function getQuery<T = Query>(options?: string | Options): Partial<T>;
export default getQuery;
