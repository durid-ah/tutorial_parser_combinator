import { Parser, State } from "./parser.model";
import { updateResult } from "./parsers.helper";

/** Match zero or more instances of the parser */
export function many<T>(parser: Parser<T>) {
   return new Parser<T[]>(
      (state: State<any>): State<T[]> => {
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
      }
   );
}