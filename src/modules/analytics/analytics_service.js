import prisma from '../../config/db.js'

async function getScanCount(){
    const scanCount = await prisma.QrScan.count()
    return scanCount
}

export default {getScanCount}