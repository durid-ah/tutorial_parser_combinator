import { ParseResult, ParserState } from "./parser.model";

export function updateState(
   state: ParserState, index: number, result: ParseResult): ParserState {
   return { ...state, index,  result }
};

export function updateResult(
   state: ParserState, result: ParseResult): ParserState {
   return { ...state, result };
}

export function updateError(
   state: ParserState, error: string): ParserState {
   return {  ...state, isError: true,  error};
}