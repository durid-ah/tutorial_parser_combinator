
import type { ResError, ResOk, Result } from "./result.model";
import type { State } from "..";

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

export function updateError<T = string, E1 = string, E2 = E1>(state: State<T, E1>, error: ResError<E2>): State<T, E2> {
   return {  ...state, result: error};
}
