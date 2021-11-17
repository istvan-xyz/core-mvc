import { Container } from 'inversify';
import controllerRegistry from './controllerRegistry';
import gqlHandler from './gqlHandler';

export const initializeControllers = (container: Container) => {
    for (const controller of controllerRegistry) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instance: any = container.get(controller.constructor);
        for (const name of Reflect.ownKeys(controller)) {
            gqlHandler(controller, instance, name);
        }
    }
};
