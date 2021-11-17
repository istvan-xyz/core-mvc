import { accessSymbol } from './runtime/accessSymbol';

export const access =
    () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target: any, name: string) => {
        Reflect.defineMetadata(accessSymbol, true, target, name);
    };
