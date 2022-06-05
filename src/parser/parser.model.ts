import { updateError, updateResult } from ".";

export class Parser<T = Result> {
   constructor(public parserStateTransfromerFn: ParserFn<T>) {}

   /**
    * Execute the parser against a specific string
    * @param target the string you want to run the parser against
    * @returns 
    */
   run(target: string) {
      const initial = { target, index: 0, result: null, isError: false };
      return this.parserStateTransfromerFn(initial);
   }

   /**
    * Chain a new parser to the exisiting one 
    * @param fn a method that takes in the previous state's result value
    * @returns a new parser
    */
   chain<R = Result>(fn: (res: T) => Parser<R>): Parser<R> {
      
      return new Parser<R>((state: State<any>): State<R> => {
         // Before we chain we need to run the current parser for a result
         const next: State<T> = this.parserStateTransfromerFn(state); // TODO: Fix the any type
         // If there is an error prevent the chaining from running
         if (next.isError) return (next as any); 

         const nextParser = fn(next.result);
         return nextParser.parserStateTransfromerFn(next)
      });
   }

   /**
    * Map the result from the previous parser to a new one
    * @param fn a function that takes in the previous result
    * @returns return a parser with the new result
    */
   map<R = Result>(fn: (res: T) => R): Parser<R> {
      
      return new Parser<R>((state: State<any>): State<R> => {
         // TODO: Fix the any type
         const next: any = this.parserStateTransfromerFn(state);
         if (next.isError) return next; 

         return updateResult<R>(next, fn(next.result));
      });
   }

   /**
    * Map the error from one string value to another
    * @param fn the mapping function
    * @returns a parser with the specified error in case it fails
    */
   mapError(fn: (err: string, idx: number) => string): Parser<T> {
      return new Parser((state: State) => {
         const next = this.parserStateTransfromerFn(state);
         if (!next.isError) return next;

         return updateError(next, fn(next.error, next.index));
      });
   }
}

export type ParserFn<R = Result> = (state: State<any>) => State<R>;

export type Thunk<R = Result> = () => Parser<R>;
export type Result = string | string[];
export type State<R = Result> = {
   target: string, 
   result: R,
   index: number,
   error?: string
   isError: boolean
}
