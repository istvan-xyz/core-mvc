/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DocumentNode, GraphQLResolveInfo } from 'graphql';
// import { GraphQLResolverContext } from '../util/graphql';

interface GraphQLResolverContext {}

type Resolver<P = any, T = any, R = any> = (
    parent: R,
    args: P,
    context: GraphQLResolverContext,
    info: GraphQLResolveInfo
) => Promise<T>;

interface ResolverObject<P = any, T = any, R = any> {
    [topLevelKey: string]: {
        [resolverKey: string]: Resolver<P, T, R> | ResolverObject<P, T, R>;
    };
}

const resolverList: ResolverObject[] = [];

const typeDefList: DocumentNode[] = [];

export const define = ({
    typeDefs,
    resolvers,
}: {
    typeDefs?: DocumentNode;
    resolvers?: ResolverObject;
}) => {
    if (typeDefs) {
        typeDefList.push(typeDefs);
    }
    if (resolvers) {
        resolverList.push(resolvers);
    }
};

export const getTypeDefinitions = () => typeDefList;

export const getResolvers = () => resolverList;
