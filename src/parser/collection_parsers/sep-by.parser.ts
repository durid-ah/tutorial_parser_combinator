import { Parser } from "../models/parser.model";
import { Cardinal } from "../models/result-cardinal.model";
import { mapErr, ResultType } from "../models/result.model";
import { State } from "../models/state.model";

/**
 * Create the parser that will match values between a specified parsed value
 * @typeparam `I` type of initial state
 * @typeparam `S` type of separator state
 * @typeparam `R` type of the state that is separated by
 * @typeparam `T` type of the target value
 * @typeparam `E` type of the error state
 * @param separator The parser that will match the separator value(s)
 * @returns 
 */
export function sepBy<I, S, R, T, E>(separator: Parser<I, S, T, E>) { 
   return (value: Parser<I, R, T, E>) => new Parser<I, R, T, E>(
      (state: State<I, E, T>): State<R, E, T> => {
         if (state.result.resType === ResultType.Error)
            return mapErr(state);
         
         const results: R[] = [];
         let nextState = state;

         while(true) {
            const thingWeWantState = value
               .parserStateTransfromerFn(nextState);
            
            if (thingWeWantState.result.resType === ResultType.Error) 
               break;

            if (thingWeWantState.result.result.resType === Cardinal.One)
               results.push(thingWeWantState.result.result.value);
            else
               results.push(...thingWeWantState.result.result.value);

            nextState = {...thingWeWantState, result: null};

            const separatorState = separator
               .parserStateTransfromerFn({...nextState});

            if (separatorState.result.resType === ResultType.Error) 
               break;

            nextState = { ...separatorState, result: null };
         }

         return {
            ...nextState, 
            result: {
               resType: ResultType.Ok,
               result: { resType: Cardinal.Many, value: results}
            }
         };
      }
   );
}