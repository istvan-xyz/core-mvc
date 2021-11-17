import { AsyncContainerModule, Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { initializeControllers } from './runtime/lifecycle';

export class Application {
    private containerModules: AsyncContainerModule[] = [];

    addContainerModule(containerModule: AsyncContainerModule) {
        this.containerModules.push(containerModule);
    }

    async start() {
        const container = new Container();
        for (const containerModule of this.containerModules) {
            await container.loadAsync(containerModule);
        }
        container.load(buildProviderModule());
        initializeControllers(container);
    }
}
