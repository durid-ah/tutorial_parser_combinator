import { Parser, ParserState } from "./parser.model";
import { updateResult } from "./parsers.helper";

/** Match zero or more instances of the parser */
export const many = (parser: Parser) => new Parser((state: ParserState): ParserState => {
   if (state.isError) return state;
   
   let next = state;
   const results = [];
   let done = false;

   while(!done) {
      next = parser.parserStateTransfromerFn(next);
      if (!next.isError) {
         results.push(next.result);
      } else {
         done = true;
      }
   }

   return updateResult(next, results);
})