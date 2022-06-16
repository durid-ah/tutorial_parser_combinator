import { Parser } from "./parser.model";
import { Result } from "./result.model";

/**
 * The method used to chain a parser to the next one
 * @typeparam `T1` - previous type
 * @typeparam `T2` - current type
 * @typeparam `T3` - type of target to be parsed
 * @typeparam `E` - error type
 */
 export type ChainFn<T1, T2, T3, E> = (res: Result<T1, E>) => Parser<T1, T2, T3, E>