import { ERR_RESULT, OK_RESULT } from "./parser.model";

import type { State } from "./parser.model";
import type { ResultType } from "./result-type.model";

/** 
 * Result discriminated union of `ResOk` and `ResError` 
 **/
export type Result<R = string, E = string> = ResOk<R> | ResError<E>;

/** data of a successful parser state */
export type ResOk<R> = {
   resType: 'ok',
   result: ResultType<R>
}

/** data of an error state */
export type ResError<E> = {
   resType: 'error',
   error: E
}

export function mapOk<T, E1, E2>(state: State<T, E1>): State<T, E2> {
      
   if (state.result.resType === OK_RESULT) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}

export function mapErr<T1, T2, E>(state: State<T1, E>): State<T2, E> {
      
   if (state.result.resType === ERR_RESULT) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}