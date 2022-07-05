import { SequenceOf } from "../collection_parsers/sequence-of.parser";
import { Fail } from "../fail.parser";
import { ResultType } from "../models/result.model";
import { Succeed } from "../models/succeed.parser";
import { UInt } from "./uint.parser";


export function RawString<R>(s: string) {

   if (s.length < 1)
      throw new Error('RawString: s must be at least 1 character long');

   const bytes = s.split('')
      .map(c => c.charCodeAt(0))
      .map(n => {
         return UInt(8).chain(res => {
            if (res.resType === ResultType.Error)
               return Fail(res.error)
            else if (res.result.value === n)
               return Succeed(res.result)
            else
               return Fail(`RawString: Expected character ${String.fromCharCode(n)}, but got ${ res.result.value }`)
         })
      });

   return SequenceOf(bytes);
}