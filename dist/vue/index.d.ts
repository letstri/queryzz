import { V as Value } from '../shared/queryzz.c9af6ff2.js';
import { Ref } from 'vue';

interface Options {
    parse?: boolean;
    array?: boolean;
}
declare function useQuery<T extends Value>(key: string): Ref<T | undefined>;
declare function useQuery(key: string, options: Options & {
    parse: false;
}): Ref<string | undefined>;
declare function useQuery<T extends Value>(key: string, options: Options & {
    array: true;
}): Ref<T[]>;
declare function useQuery(key: string, options: Options & {
    array: true;
    parse: false;
}): Ref<string[]>;

export { useQuery };
