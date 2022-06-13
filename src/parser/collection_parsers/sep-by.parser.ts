import { ERR_RESULT, Parser, State } from "../models/parser.model";
import { Cardinal } from "../models/result-type.model";

/**
 * Create the parser that will match values between a specified parsed value
 * @param separator The parser that will match the separator value(s)
 * @returns 
 */
export function sepBy<T = string, S = string, R = string>(separator: Parser<T,S>) { 
   return (value: Parser<T,R>) => new Parser<T,R>(
      (state: State<T>): State<R> => { 
         const results: R[] = [];
         let nextState = state;

         while(true) {
            const thingWeWantState = value
               .parserStateTransfromerFn(nextState);
            
            if (thingWeWantState.result.resType === ERR_RESULT) 
               break;

            if (thingWeWantState.result.result.resType === Cardinal.One)
               results.push(thingWeWantState.result.result.value);
            else
               results.push(...thingWeWantState.result.result.value);

            nextState = {...thingWeWantState, result: null};

            const separatorState = separator
               .parserStateTransfromerFn({...nextState});

            if (separatorState.result.resType === ERR_RESULT) 
               break;

            nextState = { ...separatorState, result: null };
         }

         return {
            ...nextState, 
            result: {
               resType: 'ok',
               result: { resType: Cardinal.Many, value: results}
            }
         };
      }
   );
}