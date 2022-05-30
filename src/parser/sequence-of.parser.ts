import { Parser, ParserState } from "./parser.model";
import { updateResult } from "./parsers.helper";

export const sequenceOf = (parsers: Parser[]) => 
new Parser(
   (state: ParserState): ParserState => {
      if (state.isError) return state;
      const results = [];
      let next = state;
      for (let parser of parsers) {
         next = parser.parserStateTransfromerFn(next);
         results.push(next.result)
      }

      return updateResult(next, results);
   });
