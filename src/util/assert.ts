export function assert<T>(
    condition: T,
    msg: string | { toString(): string } | Error
): asserts condition {
    if (!condition) {
        if (typeof msg === 'string') {
            throw new Error(msg);
        } else {
            throw msg;
        }
    }
}

export default assert;
