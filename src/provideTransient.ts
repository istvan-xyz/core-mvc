import { fluentProvide } from 'inversify-binding-decorators';

export const provideTransient = (identifier: any) => {
    return fluentProvide(identifier).inTransientScope().done();
};

export default provideTransient;
