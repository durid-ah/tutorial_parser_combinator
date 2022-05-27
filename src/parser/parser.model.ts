export type ParserFn = (state: ParserState) => ParserState

export type ParseResult = string | string[]; 

export type ParserState = {
   target: string, 
   result: ParseResult,
   index: number,
   error?: string
   isError: boolean
}