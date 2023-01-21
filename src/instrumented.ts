import { log } from './util/log';

const isPromise = (value: unknown): value is Promise<unknown> => {
    const { then } = value as { then?: unknown };

    if (!then) {
        return false;
    }

    return typeof then === 'function';
};

export const instrumented =
    ({
        argumentFormat,
        includeResult,
        singleArgument,
    }: {
        includeResult?: boolean;
        singleArgument?: boolean;
        argumentFormat?: (...args: any[]) => unknown;
    } = {}) =>
    (
        target: Object,
        propertyName: string,
        propertyDescriptor: PropertyDescriptor
    ): PropertyDescriptor => {
        // propertyName === "doSomething"
        // propertyDescriptor === Object.getOwnPropertyDescriptor(MyClass.prototype, "doSomething")
        const method = propertyDescriptor.value;

        const source = target.constructor.name;

        propertyDescriptor.value = function (...args: any[]) {
            const startTime = Date.now();

            const result = method.apply(this, args);

            const argValue = singleArgument
                ? args[0]
                : argumentFormat
                ? argumentFormat(...args)
                : args;

            if (isPromise(result)) {
                return result.then(value => {
                    log({
                        event: propertyName,
                        source,
                        args: argValue,
                        result: includeResult ? value : undefined,
                        duration: (Date.now() - startTime) / 1000,
                    });
                    return value;
                });
            }

            log({
                event: propertyName,
                source,
                args: argValue,
                result: includeResult ? result : undefined,
                duration: (Date.now() - startTime) / 1000,
            });

            return result;
        };

        return propertyDescriptor;
    };
