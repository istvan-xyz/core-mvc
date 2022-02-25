import { AsyncContainerModule, Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { initializeControllers } from './runtime/lifecycle';

export class Application {
    private containerModules: AsyncContainerModule[] = [];

    addContainerModule(containerModule: AsyncContainerModule) {
        this.containerModules.push(containerModule);
    }

    async start({
        container = new Container(),
    }: {
        /**
         * Useful for migrating large apps that initialize their own container.
         *
         * Do not use in new projects.
         *
         * @deprecated
         */
        container?: Container;
    } = {}) {
        for (const containerModule of this.containerModules) {
            await container.loadAsync(containerModule);
        }
        container.load(buildProviderModule());
        initializeControllers(container);

        return { container };
    }
}
