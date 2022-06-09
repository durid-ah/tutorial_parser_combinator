
/** Result type discriminated union */
export type ResultType<T = string> = One<T> | Many<T>;

export type One<T> = {
   resType: 'one',
   value: T
}

export type Many<T> = {
   resType: 'many',
   value: T[]
}