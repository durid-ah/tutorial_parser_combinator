
/** Result type discriminated union */
export type ResultCardinal<T = string> = One<T> | Many<T>;

export type One<T> = {
   resType: Cardinal.One,
   value: T
}

export type Many<T> = {
   resType: Cardinal.Many,
   value: T[]
}

export enum Cardinal {
   One,
   Many
}

export function newOne<T>(val: T): One<T> {
   return { resType: Cardinal.One, value: val}
}

export function newMany<T>(val: T[]): Many<T> {
   return { resType: Cardinal.Many, value: val}
}