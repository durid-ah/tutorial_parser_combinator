import { SequenceOf } from "../../src/parser";
import { Int } from "../../src/parser/bit_parsers/int.parser";
import { ResOk } from "../../src/parser/models/result.model";


describe('Int Parser Tests', () => {
   const parser = Int(8);

   it('Should parse the first 8 bits in the DataView with overflow', () => {
      const data = new DataView((new Uint8Array([234, 128])).buffer);
      
      const value = (SequenceOf([parser]).run(data).result as ResOk<number>).result.value;
      expect(value).toEqual([-22]);
   });

   it('Should parse the first 8 bits in the DataView to a postive value', () => {
      const data = new DataView((new Uint8Array([127])).buffer);
      
      const value = (SequenceOf([parser]).run(data).result as ResOk<number>).result.value;
      expect(value).toEqual([127]);
   });

   it('Should parse the first 8 bits in the DataView to a negative value', () => {
      const data = new DataView((new Int8Array([-128])).buffer);
      
      const value = (SequenceOf([parser]).run(data).result as ResOk<number>).result.value;
      expect(value).toEqual([-128]);
   });
});