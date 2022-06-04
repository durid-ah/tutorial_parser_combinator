import { Parser, Result, State } from "./parser.model";
import { updateResult } from "./parsers.helper";

export const sepBy = (separator: Parser<string>) => 
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

         return updateResult(nextState, results);
      });