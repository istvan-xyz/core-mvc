import { accessSymbol } from './accessSymbol';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shouldDenyAccess = (
    target: any,
    name: string | symbol,
    context: { req: { user?: unknown } }
) => {
    const {
        req: { user },
    } = context;
    const role: unknown = Reflect.getMetadata(accessSymbol, target, name);
    if (role) {
        return !user;
    }

    return false;
};
