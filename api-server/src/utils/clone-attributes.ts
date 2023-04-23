export default function cloneAttributes<T>(from: Partial<T>, to: T): void {
  Object.keys(from).forEach((key: string) => {
    const value = from[key];

    if (value === undefined) {
      return; // skip
    }

    if (value === null) {
      to[key] = null;
    } else if (Array.isArray(value)) {
      to[key] = [...value];
    } else if (typeof value === 'object') {
      to[key] = { ...value };
    } else {
      to[key] = value;
    }
  });
}
