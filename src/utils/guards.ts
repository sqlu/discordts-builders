import { ComponentType } from '../enums.ts';

/**
 * Builds a tuple of a given length.
 * Used for compile-time length verification.
 */
type BuildTuple<L extends number, T extends unknown[] = []> =
  T['length'] extends L ? T : BuildTuple<L, [...T, unknown]>;

/**
 * Checks whether A is less than or equal to B at the type level.
 * Works for small positive integers.
 */
export type IsLessThanOrEqual<A extends number, B extends number> =
  [A] extends [never]
  ? true
  : [B] extends [never]
  ? true
  : number extends A
  ? true
  : number extends B
  ? true
  : A extends B
  ? true
  : BuildTuple<A> extends [...BuildTuple<B>, ...unknown[]]
  ? false
  : true;

/**
 * Computes the length of a string literal.
 */
export type StringLength<S extends string, Acc extends unknown[] = []> =
  S extends `${string}${infer Rest}`
  ? StringLength<Rest, [...Acc, unknown]>
  : Acc['length'];

/**
 * Validates that a string literal does not exceed a maximum length.
 * Returns the string if valid, or an error type otherwise.
 */
export type CheckMaxLength<
  S extends string,
  Max extends number,
  Name extends string = 'String',
> =
  [S] extends [never]
  ? never
  : string extends S
  ? S
  : Max extends 512 | 1024 | 4000
  ? S
  : IsLessThanOrEqual<StringLength<S>, Max> extends true
  ? S
  : { readonly error: `${Name} length exceeds maximum of ${Max} characters` };

/**
 * Validates that a string literal is at least a minimum length.
 * Returns the string if valid, or an error type otherwise.
 */
export type CheckMinLength<
  S extends string,
  Min extends number,
  Name extends string = 'String',
> =
  [S] extends [never]
  ? never
  : string extends S
  ? S
  : Min extends 512 | 1024 | 4000
  ? S
  : IsLessThanOrEqual<Min, StringLength<S>> extends true
  ? S
  : { readonly error: `${Name} must have at least ${Min} characters` };

/**
 * Validates an array length between Min and Max inclusive.
 * Returns the array if valid, or an error type otherwise.
 */
export type CheckArrayLength<
  A extends readonly unknown[],
  Min extends number,
  Max extends number,
  Name extends string = 'Array',
> =
  number extends A['length']
  ? A
  : A extends readonly [...BuildTuple<Min>, ...unknown[]]
  ? IsLessThanOrEqual<A['length'], Max> extends true
  ? A
  : { readonly error: `${Name} size exceeds maximum of ${Max} elements` }
  : { readonly error: `${Name} must have at least ${Min} elements` };

/**
 * Validates that a string URL starts with http:// or https://.
 */
export type CheckUrl<Url extends string> =
  [Url] extends [never]
  ? never
  : string extends Url
  ? Url
  : Url extends `http://${string}` | `https://${string}` | `discord://${string}`
  ? Url
  : { readonly error: 'URL must start with http:// or https://' };

/**
 * Validates that a string URL starts with http://, https://, or attachment://.
 */
export type CheckMediaUrl<Url extends string> =
  [Url] extends [never]
  ? never
  : string extends Url
  ? Url
  : Url extends `http://${string}` | `https://${string}` | `attachment://${string}`
  ? Url
  : { readonly error: 'URL must start with http://, https://, or attachment://' };

/**
 * Validates that a string URL starts with attachment://.
 */
export type CheckAttachmentUrl<Url extends string> =
  [Url] extends [never]
  ? never
  : string extends Url
  ? Url
  : Url extends `attachment://${string}`
  ? Url
  : { readonly error: 'URL must start with attachment://' };

/**
 * Valid range of values for select menus (0-25).
 */
export type AllowedSelectMenuRange =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
  | 21 | 22 | 23 | 24 | 25;

/**
 * Valid range of values for file uploads (0-10).
 */
export type FileUploadRange =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Requires at least one of the specified object keys.
 */
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys];

/**
/**
 * Requires exactly one of customId or custom_id to be present.
 */
export type WithId<CustomId extends string = string> =
  | {
      customId: CustomId & CheckMinLength<CustomId, 1, 'customId'> & CheckMaxLength<CustomId, 100, 'customId'>;
      custom_id?: never;
    }
  | {
      custom_id: CustomId & CheckMinLength<CustomId, 1, 'custom_id'> & CheckMaxLength<CustomId, 100, 'custom_id'>;
      customId?: never;
    };


/**
 * Determines if a component is a button.
 */
type IsButtonType<T> = T extends { type: ComponentType.Button } ? true : false;

/**
 * Determines if a component is a select menu.
 */
type IsSelectMenuType<T> = T extends { type: ComponentType.StringSelect | ComponentType.UserSelect | ComponentType.RoleSelect | ComponentType.MentionableSelect | ComponentType.ChannelSelect } ? true : false;

/**
 * Determines if a component is a text input.
 */
type IsTextInputType<T> = T extends { type: ComponentType.TextInput } ? true : false;

/**
 * Checks whether all elements in a tuple are buttons.
 */
type CheckAllButtons<T extends readonly unknown[]> =
  T extends readonly [infer Head, ...infer Tail]
  ? IsButtonType<Head> extends true
  ? CheckAllButtons<Tail>
  : false
  : true;

/**
 * Checks whether all elements in a tuple are select menus.
 */
type CheckAllSelectMenus<T extends readonly unknown[]> =
  T extends readonly [infer Head, ...infer Tail]
  ? IsSelectMenuType<Head> extends true
  ? CheckAllSelectMenus<Tail>
  : false
  : true;

/**
 * Checks whether all elements in a tuple are text inputs.
 */
type CheckAllTextInputs<T extends readonly unknown[]> =
  T extends readonly [infer Head, ...infer Tail]
  ? IsTextInputType<Head> extends true
  ? CheckAllTextInputs<Tail>
  : false
  : true;

/**
 * Validates the components of an ActionRow.
 * Allows only buttons, a single select menu, or a single text input.
 */
export type ValidActionRowComponents<C extends readonly unknown[]> =
  number extends C['length']
  ? C
  : C['length'] extends 0
  ? C
  : CheckAllButtons<C> extends true
  ? C['length'] extends 1 | 2 | 3 | 4 | 5
  ? C
  : { readonly error: 'An ActionRow with buttons can have at most 5 buttons' }
  : CheckAllSelectMenus<C> extends true
  ? C['length'] extends 1
  ? C
  : { readonly error: 'An ActionRow can only contain exactly 1 Select Menu' }
  : CheckAllTextInputs<C> extends true
  ? C['length'] extends 1
  ? C
  : { readonly error: 'An ActionRow can only contain exactly 1 TextInput' }
  : { readonly error: 'ActionRow components cannot be mixed: buttons, select menus, and text inputs must be in separate rows' };


export type ExtractCustomIdsByType<C, Type extends ComponentType> =
  | (C extends { readonly customId: infer Id; readonly type: Type } ? (Id extends string ? Id : never) : never)
  | (C extends { readonly component: infer Comp } ? ExtractCustomIdsByType<Comp, Type> : never)
  | (C extends { readonly components: infer Comps }
      ? Comps extends readonly unknown[]
        ? ExtractCustomIdsByType<Comps[number], Type>
        : never
      : never)
  | (C extends { readonly accessory: infer Acc } ? ExtractCustomIdsByType<Acc, Type> : never);

export type ExtractAllCustomIds<C> =
  | (C extends { readonly customId: infer Id } ? (Id extends string ? Id : never) : never)
  | (C extends { readonly component: infer Comp } ? ExtractAllCustomIds<Comp> : never)
  | (C extends { readonly components: infer Comps }
      ? Comps extends readonly unknown[]
        ? ExtractAllCustomIds<Comps[number]>
        : never
      : never)
  | (C extends { readonly accessory: infer Acc } ? ExtractAllCustomIds<Acc> : never);

export type ExtractButtonIds<C> = ExtractCustomIdsByType<C, ComponentType.Button>;

export type ExtractSelectMenuIds<C> = ExtractCustomIdsByType<C,
  | ComponentType.StringSelect
  | ComponentType.UserSelect
  | ComponentType.RoleSelect
  | ComponentType.MentionableSelect
  | ComponentType.ChannelSelect
>;

export type ExtractTextInputIds<C> = ExtractCustomIdsByType<C, ComponentType.TextInput>;
export type ExtractCheckboxIds<C> = ExtractCustomIdsByType<C, ComponentType.Checkbox>;
export type ExtractCheckboxGroupIds<C> = ExtractCustomIdsByType<C, ComponentType.CheckboxGroup>;
export type ExtractRadioGroupIds<C> = ExtractCustomIdsByType<C, ComponentType.RadioGroup>;
export type ExtractFileUploadIds<C> = ExtractCustomIdsByType<C, ComponentType.FileUpload>;

export type ValidateIdentity<Opts, Name extends string = 'Component'> =
  [Opts] extends [never]
  ? unknown
  : Opts extends { customId: string } | { custom_id: string }
  ? (Opts extends { customId: string; custom_id: string }
      ? { readonly error: `Cannot specify both customId and custom_id on ${Name}` }
      : unknown)
  : { readonly error: `${Name} requires a customId or custom_id property` };

export type ExtractCustomId<Opts> =
  Opts extends { customId: infer Cid }
  ? (Cid extends string ? Cid : string)
  : Opts extends { custom_id: infer Cid }
  ? (Cid extends string ? Cid : string)
  : string;

export type GetLabel<Opts> = Opts extends { label: infer L } ? (L extends string ? L : never) : never;
export type GetUrl<Opts> = Opts extends { url: infer U } ? (U extends string ? U : never) : never;
export type GetCustomIdField<Opts> =
  Opts extends { customId: infer C }
  ? (C extends string ? C : never)
  : Opts extends { custom_id: infer C }
  ? (C extends string ? C : never)
  : never;

export type CheckStringConstraints<Val, Min extends number, Max extends number, Name extends string> =
  [Val] extends [never]
  ? unknown
  : CheckMinLength<Val & string, Min, Name> extends { readonly error: string }
    ? CheckMinLength<Val & string, Min, Name>
    : CheckMaxLength<Val & string, Max, Name> extends { readonly error: string }
      ? CheckMaxLength<Val & string, Max, Name>
      : unknown;

export type CheckUrlConstraints<Val, Max extends number, Name extends string> =
  [Val] extends [never]
  ? unknown
  : CheckUrl<Val & string> extends { readonly error: string }
    ? CheckUrl<Val & string>
    : CheckMaxLength<Val & string, Max, Name> extends { readonly error: string }
      ? CheckMaxLength<Val & string, Max, Name>
      : unknown;

export type ValidateSelectMenuRequired<Opts> =
  Opts extends { minValues: 0 } | { min_values: 0 }
  ? Opts extends { required: false }
    ? unknown
    : { readonly error: 'minValues can only be 0 if required is false' }
  : unknown;

