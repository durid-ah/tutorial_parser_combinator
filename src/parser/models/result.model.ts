import type { ResultCardinal } from "./result-cardinal.model";
import { State } from "./state.model";

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

export function mapOk<T1, T2, E1, E2>(state: State<T1, E1, T2>): State<T1, E2, T2> {
      
   if (state.result.resType === ResultType.Ok) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}

export function mapErr<R1, R2, T, E>(state: State<R1, E, T>): State<R2, E, T> {
      
   if (state.result.resType === ResultType.Error) {
      return {...state, result: state.result}
   } else {
      throw new Error('Tried to map `Ok` type but instead got `Error`');
   }
}