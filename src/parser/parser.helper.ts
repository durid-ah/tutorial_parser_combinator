import { ParseResult, ParserState } from "./parser.model";

export const updateState = (
   state: ParserState, 
   index: number, 
   result: ParseResult
): ParserState => ({
   ...state,
   index,
   result
});

export const updateError = (
   state: ParserState, 
   error: string
): ParserState => ({
   ...state,
   isError: true,
   error
});