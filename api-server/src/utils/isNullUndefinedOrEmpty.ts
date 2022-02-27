import isEmptyObject from "./is-empty-object";

export default function isNullUndefinedOrEmpty(val: unknown): boolean {
    if (typeof val === 'number') {
        return false;
    } else if (!val) {
        return true;
    } else {
        return isEmptyObject(val);
    }
}
