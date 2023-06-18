import { isNullOrUndefined } from "./is-null-or-undefined";

export function isEmptyString(value: string | null | undefined) {
  return isNullOrUndefined(value) || value.trim().length === 0;
}

export function isNotEmptyString(value: string | null | undefined) {
  return !isEmptyString(value);
}
