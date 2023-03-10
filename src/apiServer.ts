import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import gql from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { mergeTypeDefs } from '@graphql-tools/merge';
import {
    renderPlaygroundPage,
    RenderPageOptions as PlaygroundRenderPageOptions,
} from '@apollographql/graphql-playground-html';
import { getResolvers, getTypeDefinitions } from './runtime/gqlDefinitions';
import decodeToken from './jwt/decodeToken';
import { userFromTokenData } from './jwt/userDataFromToken';
import { json } from 'express';

export class ApiServer<T> {
    constructor(private readonly userClass: { new (): T }) {}

    start() {
        const server = express();

        server.disable('x-powered-by');

        server.use(
            cors({
                exposedHeaders: ['Link'],
            })
        );

        server.use(express.urlencoded({ extended: true }));
        server.use(express.json());

        server.use(cookieParser());

        const port = 11111;
        const host = '0.0.0.0';

        const schema = [
            gql`
                type Query {
                    version: String
                }
            `,
            ...getTypeDefinitions(),
        ];
        const resolvers = [
            {
                Query: {},
            },
            ...getResolvers(),
        ];

        server.use((request, _, next) => {
            const accessToken =
                request.cookies['access-token'] ||
                request.cookies.accessToken ||
                request.headers['x-access-token'];
            if (accessToken) {
                try {
                    (request as any).user = userFromTokenData(
                        this.userClass,
                        decodeToken<{ user: Partial<{}> }>(accessToken).user
                    );
                } catch (error) {
                    console.error(error);
                }
            }
            next();
        });

        server.get('/', (request, result) => {
            const playgroundRenderPageOptions: PlaygroundRenderPageOptions = {
                endpoint: '/',
                cdnUrl: '/cdn',
            };
            result.setHeader('Content-Type', 'text/html');
            const playground = renderPlaygroundPage(
                playgroundRenderPageOptions
            );
            result.write(playground);
            result.end();
        });

        server.use(
            '/cdn/@apollographql/graphql-playground-react',
            express.static('./node_modules/apollo-playground-static-files/')
        );

        (async () => {
            const apolloServer = new ApolloServer({
                typeDefs: mergeTypeDefs(schema, {}),
                resolvers,
                rootValue: global,
            });

            await apolloServer.start();

            server.use(
                '/',
                cors<cors.CorsRequest>(),
                json(),
                expressMiddleware(server as unknown as ApolloServer, {
                    context: async ({ req, res }) => ({
                        req,
                        res,
                    }),
                })
            );

            server.listen(port, host, () => {
                console.log(`Server listening ${host}:${port}`);
            });
        })().catch(error => {
            throw error;
        });
    }
}
