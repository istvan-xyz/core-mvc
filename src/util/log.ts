/* eslint-disable consistent-return */
export const createCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: string, value: unknown) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

export interface LogEvent {
    event?: string;
    [key: string]: unknown;
}

/* eslint-disable no-console */

export const log = (event: LogEvent) => {
    console.log(JSON.stringify(event, createCircularReplacer()));
};
