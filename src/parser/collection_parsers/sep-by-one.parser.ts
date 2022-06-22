import { Parser } from "..";
import { Cardinal } from "../models/result-cardinal.model";
import { mapErr, newErr, ResultType } from "../models/result.model";
import { State } from "../models/state.model";

/**
 * Create a parser that matches values between a separator
 * @typeparam `S` the separator type
 * @typeparam `R2` the type of the value that will run the separator
 * @typeparam `R1` the type of the previous state
 * @typeparam `T` the type of the target
 * @param separator the parser of the separator value
 */
export function SepByOne<R1, R2, T, S>(separator: Parser<R1, S, T>) { 
   (value: Parser<R1,R2,T>) => new Parser<R1,R2,T>(
      (state: State<R1, string, T>): State<R2, string, T> => {
         if (state.result.resType === ResultType.Error)
            return mapErr(state);

         const results: R2[] = [];
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