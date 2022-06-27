import { SequenceOf } from "../collection_parsers/sequence-of.parser";
import { newOne } from "../models/result-cardinal.model";
import { newOk } from "../models/result.model";
import { Bit } from "./bit.parser";


export function Int(bitCount: number) {
   if (bitCount < 1)
   throw new Error(`UInt: n must be larger than 0, but we got ${bitCount}`);

   if (bitCount > 32)
      throw new Error(`UInt: n must be less than 32, but we got ${bitCount}`);

   return SequenceOf(Array.from({length: bitCount}, () => Bit()))
      .map<number>(bits => {

         if (bits[0] === 0) {
            const mappedResult = (bits.result.value as number[])
               .reduce((acc, bit, i) => acc + Number(BigInt(bit) << BigInt(bitCount - 1 -i)), 0);
            
            return newOk(newOne(mappedResult));
         }

         else {
            const mappedResult = -(1 + (bits.result.value as number[])
            .reduce((acc, bit, i) => acc + Number(BigInt(bit === 0? 1: 0) << BigInt(bitCount - 1 -i)), 0));
         
            return newOk(newOne(mappedResult));
         }

   });
}