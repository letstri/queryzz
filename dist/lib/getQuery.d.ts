import type { Query, StringQuery } from '../interfaces/Query';
interface Options {
    link?: string;
    arrays?: string[];
    parse?: boolean;
}
declare function getQuery<T = StringQuery>(options: Options & {
    parse: false;
}): T;
declare function getQuery<T = Query>(options?: string | Options): T;
export default getQuery;
