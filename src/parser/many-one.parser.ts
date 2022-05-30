import { Parser, ParserState } from "./parser.model";
import { updateError, updateResult } from "./parsers.helper";

/** Match one or more instances of the parser */
export const manyOne = (parser: Parser) => new Parser((state: ParserState): ParserState => {
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

   if (results.length === 0) {
      return updateError(
         state, 
         `manyOne: Unable to match any input using parser @ index`);
   }

   return updateResult(next, results);
})