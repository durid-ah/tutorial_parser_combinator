import type { State } from "./parser.model";
import type { ResultCardinal } from "./result-cardinal.model";

/** 
 * Result discriminated union of `ResOk` and `ResError` 
 **/
export type Result<R = string, E = string> = ResOk<R> | ResError<E>;

/** data of a successful parser state */
export type ResOk<R> = {
   resType: ResultType.Ok,
   result: ResultCardinal<R>
}

/** data of an error state */
export type ResError<E> = {
   resType: ResultType.Error,
   error: E
}

export enum ResultType {
   Ok,
   Error
}

export function newOk<R>(ok: ResultCardinal<R>): ResOk<R> {
   return { resType: ResultType.Ok, result: ok }
}

export function newErr<E>(err: E): ResError<E> {
   return { resType: ResultType.Error, error: err }
}

export function mapOk<T, E1, E2>(state: State<T, E1>): State<T, E2> {
      
   if (state.result.resType === ResultType.Ok) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}

export function mapErr<T1, T2, E>(state: State<T1, E>): State<T2, E> {
      
   if (state.result.resType === ResultType.Error) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}