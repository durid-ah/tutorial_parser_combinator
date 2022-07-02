import { updateError } from "..";
import { ChainFn } from "./chain-fn.model";
import { mapErr, mapOk, newOk, ResError, ResOk, ResultType } from "./result.model";
import { State } from "./state.model";

/**
 * @typeparam `R1` - previous result type
 * @typeparam `R2` - current result type
 * @typeparam `T = string` type of the target that will be parsed
 * @typeparam `E1` - error type
 * @typeparam `E2` - new error type
 */
export class Parser<R1 = string, R2 = string, T = string, E1 = string> {
   constructor(public parserStateTransfromerFn?: ParserFn<R1, R2, T, E1>) {}

   /**
    * Execute the parser against a specific string
    * @param target the string you want to run the parser against
    * @returns the state of the executed parser
    */
   run(target: T): State<R2, E1, T> {
      const initial = { target, index: 0, result: newOk<R1>(null) };
      return this.parserStateTransfromerFn(initial);
   }

   /**
    * Chain a new parser to the exisiting one
    * @typeparam `<S = string>` the result type of the chained parser
    * @param fn a method that takes in the previous state's result value
    * @returns a new parser
    */
   chain<S = string>(fn: ChainFn<R2, S, T, E1>): Parser<R1, S, T, E1> {
      
      return new Parser<R1, S, T, E1>((state: State<R1, E1, T>): State<S, E1, T> => {
         // Before we chain we need to run the current parser for a result
         const next: State<R2, E1, T> = this.parserStateTransfromerFn(state); 
         
         // If there is an error prevent the chaining from running
         if (next.result.resType === ResultType.Error) {
            next.result = null;
            return (next as unknown as State<S, E1, T>);
         }

         const nextParser = fn(next.result);
         return nextParser.parserStateTransfromerFn(next)
      });
   }

   /**
    * Map the result from the previous parser to a new one
    * @typeparam S - the result type of the chained parser
    * @param fn - a function that takes in the previous result
    * @returns a parser with the new result
    */
   map<S = string>(fn: (res: ResOk<R2>) => ResOk<S>): Parser<R1, S, T, E1> {
      
      return new Parser<R1, S, T, E1>((state: State<R1, E1, T>): State<S, E1, T> => {
         const next = this.parserStateTransfromerFn(state);
         if (next.result.resType === ResultType.Error) return mapErr(next);

         return { ...next, result: fn(next.result) };
      });
   }

   /**
    * Map the error from one string value to another
    * @param fn the mapping function
    * @returns a parser with the specified error in case it fails
    */
   mapError<E2 = string>(fn: (err: ResError<E1>, idx: number) => ResError<E2>): Parser<R1, R2, T, E2> {
      
      return new Parser<R1, R2, T, E2>((state: State<R1, E2, T>): State<R2, E2, T> => {
         const next = this.parserStateTransfromerFn(
            { index: state.index, target: state.target, result: null });

         if (next.result.resType !== ResultType.Error) return mapOk(next);

         return updateError<R2, T, E1, E2>(next, fn(next.result, next.index));
      });
   }
}


/**
 * Type of the transformer function in the parser
 * @typeparam `R1 = string` type of the initial state 
 * @typeparam `R2 = string` type of the resulting state
 * @typeparam `T = string` type of the target that will be parsed
 * @typeparam `E1 = string` type of the error
 */
export type ParserFn<R1, R2 = string, T = string, E = string> = (state: State<R1, E, T>) => State<R2, E, T>;
