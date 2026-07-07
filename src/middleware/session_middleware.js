import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import prisma from '../config/db.js'
import helper from '../utils/helper.js'

const sessionMiddleware = async (req, res, next)=>{
    const existingToken = req.cookies?.visitor_token

    if (existingToken) {
        try {
          const payload = jwt.verify(existingToken, process.env.JWT_VISITOR_SECRET)

          // Double-check: reject if someone sends an admin token here
          if (payload.type !== 'visitor') {
            return await issueNewVisitorToken(req, res, next)
          }

          req.visitor = payload   // attach to request, available downstream
          await recordQrScan(req, res)
          return next()
        } catch (err) {
          // Token expired or tampered — just issue a fresh one
          return await issueNewVisitorToken(req, res, next)
        }
    }
    await issueNewVisitorToken(req, res, next)
}

const issueNewVisitorToken = async (req, res, next)=>{
    try{
        const session = await createVisitorSession(req, res)

        const payload = {
            type: 'visitor',
            ip: session.ipHash,
            agent: session.userAgent,
            id: session.id
        }
    
        const token = jwt.sign(payload, process.env.JWT_VISITOR_SECRET, {
            expiresIn: '6h',
        })
    
        res.cookie('visitor_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 6 * 60 * 60 * 1000   // 6 hours in ms
        })
    
        req.visitor = payload
        await recordQrScan(req, res)
        next()
    }catch(err){
        next(err)
    }

}

const createVisitorSession = async (req, res)=>{
    const ip = req.ip ?? "unknown"
    const agent = req.headers["user-agent"] ?? "unknown"
    const futureDate = new Date();

    futureDate.setHours(futureDate.getHours() + 6);

    const session = await prisma.session.create({
        data: {
            id: crypto.randomUUID(),
            expiresAt: futureDate,
            ipHash: ip,
            userAgent: agent
        }
    })

    return session
}

const recordQrScan = async (req, res)=>{
    if(req.path !== '/'){
        return {message: "Path  that is not /menu, will not be recorded"}
    }
    const tableNumber = Number(req.query.table) || 0
    let table = undefined

    if (tableNumber !== 0){
        table = await prisma.restaurantTable.findFirst({
            where: {
                tableNumber: tableNumber
            }
        })
        if (!table){
            return {message: "Table doesn't exist"}
        }
    }else{
        table = await prisma.restaurantTable.findFirst({
            where: {
                tableNumber: 0
            }
        })

        if(!table){
            const fullUrl = req.protocol + '://' + req.get('host') + req.path + '?table=0';

            table = await prisma.restaurantTable.create({
                data: {
                    tableNumber: 0,
                }
            })
            await helper.generateQrCode({
                    URL: url,
                    tableNumber: 0,
                    darkColor: '#000000',
                    correction: 'H',
                    width: 500,
                    margin: 2
                })
        }
    }
    const qrScan = await prisma.qrScan.create({
        data : {
            tableId: table.id,
            sessionId: req.visitor.id,
            ipHash: req.visitor.ip,
            userAgent: req.visitor.agent
        }
    })

    return qrScan
}

export default sessionMiddleware