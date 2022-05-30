import { Parser, ParserState } from "./parser.model";
import { updateError } from "./parsers.helper";

export const choice = (parsers: Parser[]) => 
   new Parser(
      (state: ParserState): ParserState => {
         if (state.isError) return state;
         let next = state;

         for (let parser of parsers) {
            next = parser.parserStateTransfromerFn(next);
            if (!next.isError) return next;
         }

         return updateError(
            next, 
            `choice: Unable to match with any parser at index ${next.index}`);
      });