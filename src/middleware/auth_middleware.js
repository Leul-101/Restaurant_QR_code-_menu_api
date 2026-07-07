import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import prisma from '../config/db.js'


const cookieExtractor = (req)=>{
  let token = null
  if(req && req.cookies){
    token = req.cookies['admin_token']
  }
  return token
}
const jwtOption = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_ADMIN_SECRET
}

const jwtStrategy = new JwtStrategy(jwtOption, async (jwtPayload, done)=>{
    try{
        const user = await prisma.admin.findFirst({
            where: {
                id: jwtPayload.id
            }
        })

        if(!user) return done(null, false)
        return done(null, user)
    }catch(err){
        return done(err)
    }
})

const isAdmin = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(403).json({ 
    message: 'Access Denied: Administrator privileges required.' 
  });
};
export default { jwtStrategy, isAdmin } 