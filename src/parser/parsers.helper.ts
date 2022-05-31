import { ParseResult, ParserState } from "./parser.model";

export function updateState<T>(
   state: ParserState<T>, index: number, result: T): ParserState<T> {
   return { ...state, index,  result }
};

export function updateResult<R = ParseResult>(
   state: ParserState, result: R): ParserState<R> {
   return { ...state, result };
}

export function updateError<R = ParseResult>(
   state: ParserState<R>, error: string): ParserState<R> {
   return {  ...state, isError: true,  error};
}