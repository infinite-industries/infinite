import {isNullOrUndefined} from "./is-null-or-undefined";

export default function isNotNullOrUndefined(val: unknown): boolean {
    return !isNullOrUndefined(val)
}
