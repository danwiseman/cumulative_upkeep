import { builder } from './builder'
import { prisma } from './builder'

builder.prismaObject('WeatherCard', {
    fields: (t) => ({
            id: t.exposeString('id'),
            sf_id: t.exposeString('sf_id'),
            card_name: t.exposeString('card_name'),
            weather_tags: t.exposeStringList('weather_tags'),
    }
    ),
});

const DEFAULT_PAGE_SIZE = 10;

builder.queryType({
    fields: (t) => ({
        weatherCard: t.prismaField({
            type: 'WeatherCard',
            nullable: true,
            args: {
                id: t.arg.id({required: true}),
            },
            resolve: (query, root, args) =>
                prisma.weatherCard.findUnique({
                    ...query,
                    where: {id: String(args.id)},
                }),
        }),

        weatherCards: t.prismaField({
            type: ['WeatherCard'],
            args: {
                take: t.arg.int(),
                skip: t.arg.int(),
            },
            resolve: (query, root, args) =>
                prisma.weatherCard.findMany({
                    ...query,
                    take: args.take ?? DEFAULT_PAGE_SIZE,
                    skip: args.skip ?? 0,
                }),
        }),
    }),
});

export const schema = builder.toSchema();

