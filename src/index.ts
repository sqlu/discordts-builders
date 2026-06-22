if (typeof Bun === 'undefined') {
  throw new Error(
    '@buncord/builders requires the Bun runtime. Please run your application using "bun run".'
  );
}

export * from './enums.ts';
export * from './types.ts';

export type {
  IsLessThanOrEqual,
  StringLength,
  CheckMaxLength,
  CheckMinLength,
  CheckArrayLength,
  WithId,
  CheckUrl,
  AllowedSelectMenuRange,
  FileUploadRange,
  ExtractCustomIdsByType,
  ExtractAllCustomIds,
  ExtractButtonIds,
  ExtractSelectMenuIds,
  ExtractTextInputIds,
  ExtractCheckboxIds,
  ExtractCheckboxGroupIds,
  ExtractRadioGroupIds,
  ExtractFileUploadIds,
} from './utils/guards.ts';

export * from './builders/index.ts';
