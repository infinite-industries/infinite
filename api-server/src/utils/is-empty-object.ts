import {isNullOrUndefined} from "./is-null-or-undefined";

export default function isEmptyObject(val: unknown): boolean {
    if (isNullOrUndefined(val)) {
        return false;
    } else {
        return Object.keys(val).length === 0;
    }
}
