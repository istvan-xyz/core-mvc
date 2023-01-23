import { test, vi, expect, afterEach } from 'vitest';
import { instrumented } from '../../instrumented';
import { log } from '../../util/log';
import sleep from '../../util/sleep';

vi.mock('../../util/log', () => ({
    log: vi.fn(),
}));

afterEach(() => {
    vi.restoreAllMocks();
});

test('instrumented', async () => {
    class MyClass {
        private value1: number;

        private value2: number;

        constructor() {
            this.value1 = 42;
            this.value2 = 43;
        }

        @instrumented()
        syncMethod() {
            return this.value1;
        }

        @instrumented({
            argumentFormat: id => id,
        })
        syncMethodWithArgumentFormatter(id: number) {
            return this.value1;
        }

        @instrumented({
            singleArgument: true,
        })
        syncMethodWithSingleArgument(id: number) {
            return this.value1;
        }

        @instrumented()
        async asyncMethod() {
            await sleep(5);
            return this.value2;
        }

        @instrumented()
        async asyncMethodWithArgument(id: number) {
            await sleep(5);
            return this.value2;
        }

        @instrumented({
            argumentFormat: id => ({ id }),
        })
        async asyncMethodWithArgumentFormat(id: number, _: {}) {
            await sleep(5);
            return this.value2;
        }

        @instrumented({
            argumentFormat: id => ({ id }),
            includeResult: true,
        })
        async asyncMethodWithArgumentFormatAndResult(id: number, _: {}) {
            await sleep(5);
            return this.value2;
        }
    }

    const object = new MyClass();

    expect(object.syncMethod()).toBe(42);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'syncMethod',
        args: [],
        duration: expect.any(Number),
    });

    expect(object.syncMethodWithArgumentFormatter(6)).toBe(42);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'syncMethodWithArgumentFormatter',
        args: 6,
        duration: expect.any(Number),
    });

    expect(object.syncMethodWithSingleArgument(6)).toBe(42);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'syncMethodWithSingleArgument',
        args: 6,
        duration: expect.any(Number),
    });

    expect(await object.asyncMethod()).toBe(43);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'asyncMethod',
        args: [],
        duration: expect.any(Number),
    });

    expect(await object.asyncMethodWithArgument(2)).toBe(43);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'asyncMethodWithArgument',
        args: [2],
        duration: expect.any(Number),
    });

    expect(await object.asyncMethodWithArgumentFormat(3, {})).toBe(43);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'asyncMethodWithArgumentFormat',
        args: { id: 3 },
        duration: expect.any(Number),
    });

    expect(await object.asyncMethodWithArgumentFormatAndResult(3, {})).toBe(43);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'asyncMethodWithArgumentFormatAndResult',
        args: { id: 3 },
        result: 43,
        duration: expect.any(Number),
    });
});

test('minDuration no log', async () => {
    class MyClass {
        private value2: number;

        constructor() {
            this.value2 = 43;
        }

        @instrumented({
            minDuration: 5,
        })
        async asyncMethodThatRunsFor20Mills() {
            await sleep(20);
            return this.value2;
        }

        @instrumented({
            minDuration: 5,
        })
        async asyncMethodThatRunsFor0Mills() {
            return this.value2;
        }
    }

    const object = new MyClass();

    expect(await object.asyncMethodThatRunsFor20Mills()).toBe(43);

    expect(log).not.toHaveBeenCalled();

    expect(await object.asyncMethodThatRunsFor0Mills()).toBe(43);

    expect(log).not.toHaveBeenCalled();
});

test('minDuration log', async () => {
    class MyClass {
        private value2: number;

        constructor() {
            this.value2 = 43;
        }

        @instrumented({
            minDuration: 0.001,
        })
        async asyncMethodThatRunsFor20Mills() {
            await sleep(20);
            return this.value2;
        }
    }

    const object = new MyClass();

    expect(await object.asyncMethodThatRunsFor20Mills()).toBe(43);

    expect(log).toBeCalledWith({
        source: 'MyClass',
        event: 'asyncMethodThatRunsFor20Mills',
        args: [],
        duration: expect.any(Number),
    });
});
