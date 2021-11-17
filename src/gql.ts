import type { DocumentNode } from 'graphql';
import { define } from './runtime/gqlDefinitions';
import controllerRegistry from './runtime/controllerRegistry';
import { gqlFieldResolverSymbol } from './runtime/gqlSymbols';

export interface ResolverRequest<P = { [key: string]: unknown }, R = {}> {
    params: P;
    parent: R;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fieldQuery = (fullPath: string) => (target: any, name: string) => {
    const existingMetadata: string[] =
        Reflect.getMetadata(gqlFieldResolverSymbol, target, name) || [];
    Reflect.defineMetadata(
        gqlFieldResolverSymbol,
        [...existingMetadata, fullPath],
        target,
        name
    );
    controllerRegistry.add(target);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = (path?: string) => (target: any, name: string) =>
    fieldQuery(`Query.${path || name}`)(target, name);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mutation = (path?: string) => (target: any, name: string) =>
    fieldQuery(`Mutation.${path || name}`)(target, name);

export const typeDefs = (types?: DocumentNode) => {
    define({ typeDefs: types });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    return (_target: any, _name?: string) => {};
};

export class Result {
    data: unknown;

    cookies?: { [key: string]: string };

    constructor({
        data,
        cookies,
    }: {
        data: unknown;
        cookies?: { [key: string]: string };
    }) {
        this.data = data;
        this.cookies = cookies;
    }
}
