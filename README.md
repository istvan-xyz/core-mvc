# Setup

Getting a fully operational system:

```sh
npm install core-mvc
```

server.ts

```ts
import 'reflect-metadata';
import { Application } from 'core-mvc/application';
import { ApiServer } from 'core-mvc/apiServer';
import typeorm from 'core-mvc/typeorm';
import User from '../user/entities/User';
import './controllers';

(async () => {
    const application = new Application();
    application.addContainerModule(typeorm);
    const { container } = await application.start();

    const server = new ApiServer(User);
    server.start();
})().catch(error => {
    throw error;
});
```
