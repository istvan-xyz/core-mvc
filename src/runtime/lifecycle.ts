import { Container } from 'inversify';
import controllerRegistry from './controllerRegistry';
import gqlHandler from './gqlHandler';
import taskRegistry from './taskRegistry';
import { taskPropertySymbol } from './taskSymbols';

export const initializeControllers = (container: Container) => {
    for (const controller of controllerRegistry) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instance: any = container.get(controller.constructor);
        for (const name of Reflect.ownKeys(controller)) {
            gqlHandler(controller, instance, name);
        }
    }
};

export const retrieveTasks = (container: Container) => {
    const result = [];
    for (const controller of taskRegistry) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instance: any = container.get(controller.constructor);
        for (const name of Reflect.ownKeys(controller)) {
            const taskName: string | undefined = Reflect.getMetadata(
                taskPropertySymbol,
                controller,
                name
            );
            if (taskName) {
                result.push({
                    name,
                    run: (...args: unknown[]) => instance[name](...args),
                    controller,
                    instance,
                });
            }
        }
    }
    return result;
};
