import { updateError } from "..";
import { mapErr, mapOk, newOk, ResError, ResOk, Result, ResultType } from "./result.model";

/**
 * @param T1 - previous result type
 * @param T2 - current result type
 * @param E1 - error type
 * @param E2 - new error type
 */
export class Parser<T1 = string, T2 = string, E1 = string> {
   constructor(public parserStateTransfromerFn?: ParserFn<T1, T2, E1>) {}

   /**
    * Execute the parser against a specific string
    * @param target the string you want to run the parser against
    * @returns the state of the executed parser
    */
   run(target: string): State<T2, E1> {
      const initial = { target, index: 0, result: newOk<T1>(null) };
      return this.parserStateTransfromerFn(initial);
   }

   /**
    * Chain a new parser to the exisiting one
    * @typeparam `<S = string>` the result type of the chained parser
    * @param fn a method that takes in the previous state's result value
    * @returns a new parser
    */
   chain<S = string>(fn: ChainFn<T2, S, E1>): Parser<T1, S, E1> {
      
      return new Parser<T1,S, E1>((state: State<T1, E1>): State<S, E1> => {
         // Before we chain we need to run the current parser for a result
         const next: State<T2, E1> = this.parserStateTransfromerFn(state); 
         
         // If there is an error prevent the chaining from running
         if (next.result.resType === ResultType.Error) {
            next.result = null;
            return (next as unknown as State<S, E1>);
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
   map<S = string>(fn: (res: ResOk<T2>) => ResOk<S>): Parser<T1, S, E1> {
      
      return new Parser<T1, S, E1>((state: State<T1, E1>): State<S, E1> => {
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
   mapError<E2 = string>(fn: (err: ResError<E1>, idx: number) => ResError<E2>): Parser<T1, T2, E2> {
      
      return new Parser<T1,T2,E2>((state: State<T1, E2>): State<T2, E2> => {
         const next = this.parserStateTransfromerFn(
            { index: state.index, target: state.target, result: null });

         if (next.result.resType !== ResultType.Error) return mapOk(next);

         return updateError<T2, E1, E2>(next, fn(next.result, next.index));
      });
   }
}

/**
 * The parser's state
 * @param R - result value type
 * @param E - error value type
 */
 export type State<R = string, E = string> = {
   index: number,
   target: string, 
   result: Result<R, E>
}

/**
 * The method used to chain a parser to the next one
 * @param T - previous type
 * @param R - current type
 * @param E - error type
 */
export type ChainFn<T, R, E> = (res: Result<T, E>) => Parser<T, R, E>

/** A function type to lazy create a parser */
export type Thunk<T, R, E> = () => Parser<T, R, E>;
export type ParserFn<T1 = string, T2 = string, E1 = string> = (state: State<T1, E1>) => State<T2, E1>;
