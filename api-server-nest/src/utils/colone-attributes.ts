export default function cloneAttributes<T>(from: T, to: T): void {
    Object.keys(from).forEach((key: string) => {
        const value = from[key]

        if (Array.isArray(value)) {
            to[key] = [...value]
        } else if (typeof value === 'object') {
            to[key] = { ...value }
        } else {
            to[key] = value
        }
    })
}
