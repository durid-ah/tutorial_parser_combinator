import { updateError, updateResult } from "./parser.helper";

export type ParserFn = (state: ParserState) => ParserState

export type ParseResult = string | string[]; 

export type ParserState = {
   target: string, 
   result: ParseResult,
   index: number,
   error?: string
   isError: boolean
}

export class Parser {
   constructor(public parserStateTransfromerFn: ParserFn) {}

   run(target: string) {
      const initial = { target, index: 0, result: null, isError: false };

      return this.parserStateTransfromerFn(initial);
   }

   map(fn: (res: ParseResult) => ParseResult): Parser {
      return new Parser((state: ParserState): ParserState => {
         const next = this.parserStateTransfromerFn(state);
         if (next.isError) return next;

         return updateResult(next, fn(next.result));
      });
   }

   mapError(fn: (err: string, idx: number) => string) {
      return new Parser((state: ParserState) => {
         const next = this.parserStateTransfromerFn(state);
         if (!next.isError) return next;

         return updateError(next, fn(next.error, next.index));
      })
   }
}