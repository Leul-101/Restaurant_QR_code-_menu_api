import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import QRCode from 'qrcode'

function generateAdminToken(user, expire){
    return jwt.sign(
        {id: user.id, username: user.username, type: 'admin'},
        process.env.JWT_ADMIN_SECRET,
        {expiresIn: expire}
    )
}

async function hashPassword(password){
    const hash = await(bcrypt.hash(password, 10))
    return hash
}

async function compareHash(password, hashedPassword){
    const match = await bcrypt.compare(password, hashedPassword)
    return match
}

async function generateQrCode({
    URL,
    tableNumber,
    darkColor,
    correction,
    width,
    margin
}){
    try{

        await QRCode.toFile(
            `./uploads/table-${tableNumber}.png`,
            `${URL}?table=${tableNumber}`,
            {
                color: {
                    dark: darkColor
                },
                width: width,
                margin: margin,
                errorCorrectionLevel: 'H'
            }
        )
    }catch(err){
        throw(err)
    }
}

export default {generateAdminToken, hashPassword, compareHash, generateQrCode}