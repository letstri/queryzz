import IQuery from '../interfaces/IQuery';
interface IOptions {
    link?: string;
    arrays?: string[];
    parse?: boolean;
}
declare function getQuery(options: IOptions & {
    parse: false;
}): IQuery<string>;
declare function getQuery(options?: string | IOptions): IQuery;
export default getQuery;
