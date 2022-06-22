import { SequenceOf } from "../collection_parsers/sequence-of.parser";
import { newOne } from "../models/result-cardinal.model";
import { newOk } from "../models/result.model";
import { Bit } from "./bit.parser";


export function UInt(bitCount: number) {
   return SequenceOf(Array.from({length: bitCount}, () => Bit()))
      .map<number>(bits => {
         const mappedResult = (bits.result.value as number[])
            .reduce((acc, bit, i) => acc + (bit << (bitCount - 1 -i)), 0);
         
         return newOk(newOne(mappedResult));
      });
}