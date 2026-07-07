import authService from './auth_service.js'
import helper from '../../utils/helper.js'

async function adminLoginController(req, res, next){
    try{
        const {username, password} = req.body

        const user = await authService.getAdminByName(username)

        if (!user) return res.status(401).json({ message: "User not found" });

        const isMatch = await helper.compareHash(password, user.passwordHash)

        if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

        const token = helper.generateAdminToken(user, '1d');
        res.cookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
    })
    res.json({message: "Successfully logged in!", user: user.username});
  } catch (err) {
    next(err);
  }
}

async function logoutController(req, res, next) {
    try {
        res.clearCookie('admin_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })
        res.json({ message: 'Logged out successfully' })
    } catch (err) {
        next(err)
    }
}

export default {adminLoginController, logoutController}
