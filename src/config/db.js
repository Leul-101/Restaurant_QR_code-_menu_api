import { PrismaClient } from "@prisma/client";
import config from "./env.js"

const prismaClientSinglton = ()=>{
    return new PrismaClient({
        log: config.NODE_ENV === "development" ? ['query', 'error', 'warn'] : ['error'],
    })
}

const prisma = global.prismaGlobal || prismaClientSinglton()

export default prisma

if (config.NODE_ENV !== 'production'){
    global.prismaGlobal = prisma
}