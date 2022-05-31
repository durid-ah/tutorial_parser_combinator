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