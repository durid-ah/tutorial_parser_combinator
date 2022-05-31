import { updateError, updateResult } from "./parsers.helper";

export type ParserFn<R = ParseResult> = (state: ParserState<any>) => ParserState<R>;

export type ParseResult = string | string[]; 

export type ParserState<R = ParseResult> = {
   target: string, 
   result: R,
   index: number,
   error?: string
   isError: boolean
}

export class Parser<T = ParseResult> {
   constructor(public parserStateTransfromerFn: ParserFn<T>) {}

   run(target: string) {
      const initial = { target, index: 0, result: null, isError: false };
      return this.parserStateTransfromerFn(initial);
   }

   /**
    * Chain a new parser to the exisiting one 
    * @param fn a method that takes in the previous state's result value
    * @returns a new parser
    */
   chain<R = ParseResult>(fn: (res: T) => Parser<R>): Parser<R> {
      
      return new Parser<R>((state: ParserState<any>): ParserState<R> => {
         // Before we chain we need to run the current parser for a result
         const next: ParserState<T> = this.parserStateTransfromerFn(state); // TODO: Fix the any type
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
   map<R = ParseResult>(fn: (res: T) => R): Parser<R> {
      
      return new Parser<R>((state: ParserState<any>): ParserState<R> => {
         // TODO: Fix the any type
         const next: any = this.parserStateTransfromerFn(state);
         if (next.isError) return next; 

         return updateResult<R>(next, fn(next.result));
      });
   }

   mapError(fn: (err: string, idx: number) => string) {
      return new Parser((state: ParserState) => {
         const next = this.parserStateTransfromerFn(state);
         if (!next.isError) return next;

         return updateError(next, fn(next.error, next.index));
      });
   }
}