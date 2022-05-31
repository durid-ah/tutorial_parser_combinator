import { Parser, ParserState } from "./parser.model";
import { updateError } from "./parsers.helper";

export const choice = (parsers: Parser[]) => 
   new Parser(
      (state: ParserState): ParserState => {
         if (state.isError) return state;

         for (let parser of parsers) {
            const next = parser.parserStateTransfromerFn(state);
            if (!next.isError) return next;
         }

         return updateError(
            state, 
            `choice: Unable to match with any parser at index ${state.index}`);
      });