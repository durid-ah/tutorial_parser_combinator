import { Result, State } from "./parser.model";

export function updateState<T>(state: State<T>, index: number, result: T): State<T> {
   return { ...state, index,  result }
};

export function updateResult<T = Result>
   (state: State<T>, result: T): State<T> {
   return { ...state, result };
}

export function updateError<T = Result>(state: State<T>, error: string): State<T> {
   return {  ...state, isError: true,  error};
}