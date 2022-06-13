import { Parser, State } from "..";
import { Cardinal } from "../models/result-cardinal.model";
import { newErr, ResultType } from "../models/result.model";

/**
 * Create a parser that matches values between a separator
 * @typeparam S the separator type
 * @typeparam R the type of the value that will run the separator
 * @param separator the parser of the separator value
 */
export function sepByOne<T = string, S = string, R = string>(separator: Parser<T, S>) { 
   (value: Parser<T,R>) => new Parser<T,R>(
      (state: State<T>): State<R> => {
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
               .parserStateTransfromerFn(nextState);
            
            if (separatorState.result.resType === ResultType.Error) 
               break;

               nextState = { ...separatorState, result: null };
         }

         if (results.length === 0) {
            const err = newErr(`sepByOne: Unable to capture any results at index ${state.index}`);
            return {...state, result: err};
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