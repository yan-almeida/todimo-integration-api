export type BuilderFunction<T> = (fieldValue: T) => void;

export class QueryBuilder {
  static withFilter<T>(field: T, fnc: BuilderFunction<T>) {
    if (
      (field !== undefined && field !== null) ||
      (Array.isArray(field) && field.length > 0)
    ) {
      fnc(field);
    }
  }

  static withOrderBy<T>(field: T, value: T, fnc: BuilderFunction<T>) {
    if (field && field === value) {
      fnc(value);
    }
  }

  static getAsArray<T>(value: T | T[]): T[] | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value;
    }
    return [value];
  }

  static createLike(value: string) {
    return `%${value}%`;
  }
}
