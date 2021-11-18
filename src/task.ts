import taskRegistry from './runtime/taskRegistry';
import { taskPropertySymbol } from './runtime/taskSymbols';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const task = (taskName?: string) => (target: any, name: string) => {
    Reflect.defineMetadata(taskPropertySymbol, taskName || name, target, name);
    taskRegistry.add(target);
};
