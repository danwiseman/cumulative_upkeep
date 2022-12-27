// npm install @apollo/server graphql
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Resolvers } from './generated/graphql.js'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

import { readFileSync } from 'fs';
const typeDefs = readFileSync('./schema/schema.graphql', { encoding: 'utf-8' });

const resolvers: Resolvers = {
    Query: {
        allWeatherCards: () => {
            return prisma.weatherCard.findMany();
        },
        weatherCardsByTag: (_, args) => {
            return prisma.weatherCard.findMany(
                {
                    where: {
                    weather_tags: {
                        has: args.tagsList
                    }
                }
            });

        },
        weatherCardsByTemp: (_, args) => {
            return prisma.weatherCard.findMany(
                {
                    where: {
                        temperature_range: {
                            is: {
                                min: { lte: args.temperature },
                                max: { gte: args.temperature }
                            }
                        }
                    }
                });

        },
        weatherCardsByTagsAndTemp: (_, args) => {
            return prisma.weatherCard.findMany(
                {
                    where: {
                        weather_tags: {
                            has: args.tagsList
                        },
                        temperature_range: {
                            is: {
                                min: { lte: args.temperature },
                                max: { gte: args.temperature }
                            }
                        }
                    }
                });

        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);