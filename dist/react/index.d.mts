import * as react from 'react';
import { V as Value } from '../shared/queryzz.c9af6ff2.mjs';

interface Options {
    parse?: boolean;
    array?: boolean;
}
declare function useQuery<T extends Value>(key: string, options?: Options): [T | undefined, react.Dispatch<react.SetStateAction<T | undefined>>];

export { useQuery };
