import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '../prisma/generated';
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({});


export const builder = new SchemaBuilder<{ PrismaTypes: PrismaTypes }>({
    plugins: [PrismaPlugin],
    prisma: {
        client: prisma,
    },
});