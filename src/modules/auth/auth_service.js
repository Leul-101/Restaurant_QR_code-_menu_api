import prisma from '../../config/db.js'

async function getAllAdmins() {
    const admins = await prisma.admin.findMany()
    return admins
}
async function getAdminByName(name) {
    const admin = await prisma.admin.findFirst({
        where: {
            username: name
        }
    })
    return admin
}

export default {getAllAdmins, getAdminByName}