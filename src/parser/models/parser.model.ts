import { updateError } from "..";
import { ChainFn } from "./chain-fn.model";
import { mapErr, mapOk, newOk, ResError, ResOk, Result, ResultType } from "./result.model";
import { State } from "./state.model";

/**
 * @typeparam T1 - previous result type
 * @typeparam T2 - current result type
 * @typeparam `T3 = string` type of the target that will be parsed
 * @typeparam E1 - error type
 * @typeparam E2 - new error type
 */
export class Parser<T1 = string, T2 = string, T3 = string, E1 = string> {
   constructor(public parserStateTransfromerFn?: ParserFn<T1, T2, T3, E1>) {}

   /**
    * Execute the parser against a specific string
    * @param target the string you want to run the parser against
    * @returns the state of the executed parser
    */
   run(target: T3): State<T2, E1, T3> {
      const initial = { target, index: 0, result: newOk<T1>(null) };
      return this.parserStateTransfromerFn(initial);
   }

   /**
    * Chain a new parser to the exisiting one
    * @typeparam `<S = string>` the result type of the chained parser
    * @param fn a method that takes in the previous state's result value
    * @returns a new parser
    */
   chain<S = string>(fn: ChainFn<T2, S, T3, E1>): Parser<T1, S, T3, E1> {
      
      return new Parser<T1, S, T3, E1>((state: State<T1, E1, T3>): State<S, E1, T3> => {
         // Before we chain we need to run the current parser for a result
         const next: State<T2, E1, T3> = this.parserStateTransfromerFn(state); 
         
         // If there is an error prevent the chaining from running
         if (next.result.resType === ResultType.Error) {
            next.result = null;
            return (next as unknown as State<S, E1, T3>);
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
   map<S = string>(fn: (res: ResOk<T2>) => ResOk<S>): Parser<T1, S, T3, E1> {
      
      return new Parser<T1, S, T3, E1>((state: State<T1, E1, T3>): State<S, E1, T3> => {
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
   mapError<E2 = string>(fn: (err: ResError<E1>, idx: number) => ResError<E2>): Parser<T1, T2, T3, E2> {
      
      return new Parser<T1,T2, T3, E2>((state: State<T1, E2, T3>): State<T2, E2, T3> => {
         const next = this.parserStateTransfromerFn(
            { index: state.index, target: state.target, result: null });

         if (next.result.resType !== ResultType.Error) return mapOk(next);

         return updateError<T2, T3, E1, E2>(next, fn(next.result, next.index));
      });
   }
}





/** A function type to lazy create a parser */
export type Thunk<T1, R, T3, E> = () => Parser<T1, R, T3, E>;

/**
 * Type of the transformer function in the parser
 * @typeparam `T1 = string` type of the initial state 
 * @typeparam `T2 = string` type of the resulting state
 * @typeparam `T3 = string` type of the target that will be parsed
 * @typeparam `E1 = string` type of the error
 */
export type ParserFn<T1 = string, T2 = string, T3 = string, E1 = string> = (state: State<T1, E1, T3>) => State<T2, E1, T3>;
