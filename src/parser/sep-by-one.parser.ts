import { Parser, State, updateError, updateResult } from ".";

export const sepByOne = (separator: Parser<string>) => 
   (value: Parser) => new Parser(
      (state: State<any>) => { 
         const results = [];
         let nextState = state;

         while(true) {
            const thingWeWantState = value.parserStateTransfromerFn(nextState);
            if (thingWeWantState.isError) break;

            results.push(thingWeWantState.result);
            nextState = thingWeWantState;

            const separatorState = separator.parserStateTransfromerFn(nextState);
            if (separatorState.isError) break;

            nextState = separatorState;
         }

         if (results.length === 0) {
            return updateError(
               state, 
               `sepByOne: Unable to capture any results at index ${state.index}`)
         }

         return updateResult(nextState, results);
      });