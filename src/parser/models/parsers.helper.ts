
import type { ResError, ResOk, Result } from "./result.model";
import { State } from "./state.model";

export function updateState<T = string, E = string>(
   state: State<T, E>, 
   index: number, 
   result: Result<T, E>): State<T, E> {
   
      return { ...state, index,  result }
};

export function updateResult<T = string, E = string>(
   state: State<T, E>, 
   result: ResOk<T>): State<T, E> {
      
      return { ...state, result };
}

/**
 * Update a state's error
 * @param state
 * @param error 
 * @returns 
 */
export function updateError<T1 = string, T2 = string, E1 = string, E2 = E1>(state: State<T1, E1, T2>, error: ResError<E2>): State<T1, E2, T2> {
   return {  ...state, result: error};
}
