import { ForbiddenError } from 'apollo-server-core';
import { define } from './gqlDefinitions';
import { ResolverRequest, Result } from '../gql';
import { gqlFieldResolverSymbol } from './gqlSymbols';
import { shouldDenyAccess } from './securityHandler';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildResolverObject = (fullPath: string, value: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resolvers: any = {};
    let current = resolvers;
    const keys = fullPath.split('.');

    for (const key of keys.slice(0, -1)) {
        current[key] = {};
        current = current[key];
    }

    current[keys.slice(-1)[0]] = value;

    return resolvers;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gqlHandler = (controller: any, instance: any, name: string | symbol) => {
    const fullPaths: string[] | undefined = Reflect.getMetadata(
        gqlFieldResolverSymbol,
        controller,
        name
    );

    if (fullPaths) {
        for (const fullPath of fullPaths) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const resolvers = buildResolverObject(
                fullPath,
                async (...args: any[]) => {
                    // const rawContext: GraphQLResolverContext = args[2];
                    const resolverRequest: ResolverRequest = {
                        params: args[1],
                        parent: args[0],
                        user: args[2].req.user,
                    };

                    if (shouldDenyAccess(controller, name, args[2])) {
                        throw new ForbiddenError(`Not authorized to do this`);
                    }

                    const response = await instance[name](resolverRequest);
                    if (response instanceof Result) {
                        const { cookies } = response;
                        if (cookies) {
                            for (const [cookieName, value] of Object.entries(
                                cookies
                            )) {
                                args[2].res.cookie(cookieName, value);
                            }
                        }

                        return response.data;
                    }

                    return response;
                }
            );
            define({
                resolvers,
            });
        }
    }
};

export default gqlHandler;
