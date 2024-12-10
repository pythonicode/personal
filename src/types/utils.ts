/**
 * a type that errors if `T` is not never.
 * the resultant type is irrelevant and should not be used.
 *
 * useful for asserting every case is handled when switching on a value,
 *  but also defining a default case on the switch just in case.
 *
 * @example
 * ```ts
 * switch (status) {
 *   case 'pending': { ... }
 *   case 'success': { ... }
 *   case 'error'  : { ... }
 *   default: {
 *     // this will be a type error if not every case for `status` is handled.
 *     type _EveryConditionHandled = ExpectNever<typeof status>;
 *   }
 * }
 * ```
 */
export type ExpectNever<T> = [T] extends [never] ? never : ExpectNever<T>

/**
 * a type that errors if `T` is not true.
 * the resultant type is irrelevant and should not be used.
 *
 * @example
 * ```ts
 * type T = whatever_foobar;
 * type U = whatever_bazqux;
 * type _typecheckTExtendsU = Expect<T extends U ? true : false>;
 * ```
 */
export type Expect<T extends true> =
  // error on `never`
  [T] extends [never]
    ? Expect<T>
    : // error on `any` and `unknown`
      unknown extends T
      ? Expect<T>
      : never

export type Primitive = string | number | bigint | symbol | boolean | null | undefined

export type Builtin = Primitive | Function | Date | RegExp | Error

/**
 * assert that A extends B,
 *  returning back A (but asserted TypeScript that A does in fact extend B),
 *  or B if A does not actually extend B.
 */
export type Satisfies<A, B> = A extends B ? A : B

/**
 * "resolves" a type, expanding type aliases and resolving intersections.
 *
 * functionally doesn't affect the type, but can make it much easier to read.
 */
export type Resolve<T, Builtins = never> = T extends null | undefined
  ? T
  : T extends Exclude<Builtin | Builtins, null | undefined>
    ? T & {}
    : unknown extends T
      ? T
      : { [K in keyof T]: T[K] }

/**
 * "resolves" a type, expanding type aliases and resolving intersections.
 *
 * functionally doesn't affect the type, but can make it much easier to read.
 *
 * @see {@link Resolve}
 */
export type DeepResolve<T, Builtins = never> = T extends null | undefined
  ? T
  : T extends Exclude<Builtin | Builtins, null | undefined>
    ? T & {}
    : unknown extends T
      ? T
      : { [K in keyof T]: DeepResolve<T[K]> }

export type ValueOf<T> = T[keyof T]
export type ElementOf<T extends readonly any[]> = T[number]

export type JSON = {
  [key: string]: JSON | string | number | boolean | null | JSON[] | string[] | number[] | boolean[]
}

export type Serializable =
  | JSON
  | string
  | number
  | boolean
  | null
  | JSON[]
  | string[]
  | number[]
  | boolean[]
