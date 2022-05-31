import { ParseResult, State } from "./parser.model";

export function updateState<T>(
   state: State<T>, index: number, result: T): State<T> {
   return { ...state, index,  result }
};

export function updateResult<R = ParseResult>(
   state: State, result: R): State<R> {
   return { ...state, result };
}

export function updateError<R = ParseResult>(
   state: State<R>, error: string): State<R> {
   return {  ...state, isError: true,  error};
}