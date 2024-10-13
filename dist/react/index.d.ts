import { V as Value } from '../shared/queryzz.c9af6ff2.js';
import { Dispatch, SetStateAction } from 'react';

interface Options {
    parse?: boolean;
    array?: boolean;
}
type UseState<T> = [T, Dispatch<SetStateAction<T>>];
declare function useQuery<T extends Value>(key: string): UseState<T | undefined>;
declare function useQuery(key: string, options: Options & {
    parse: false;
}): UseState<string | undefined>;
declare function useQuery<T extends Value>(key: string, options: Options & {
    array: true;
}): UseState<T[]>;
declare function useQuery(key: string, options: Options & {
    array: true;
    parse: false;
}): UseState<string[]>;
declare function useQuery<T extends Value>(key: string, options: Options): UseState<T | undefined>;

export { useQuery };
