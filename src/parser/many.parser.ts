import { Parser, State } from "./parser.model";
import { updateResult } from "./parsers.helper";

/** Match zero or more instances of the parser */
export const many = (parser: Parser) => new Parser((state: State): State => {
   if (state.isError) return state;
   
   let next = state;
   const results = [];
   let done = false;

   while(!done) {
      let testState = parser.parserStateTransfromerFn(next);
      if (!next.isError) {
         results.push(next.result);
         next = testState;
      } else {
         done = true;
      }
   }

   return updateResult(next, results);
})