import prisma from './db.js'
import helper from '../utils/helper.js'

async function main(){
    console.log('start seeding db')
    const table = await prisma.restaurantTable.create({
        data: {
            tableNumber: 1
        }
    })

    console.log()
}
main().catch(console.error).finally(()=>prisma.$disconnect())