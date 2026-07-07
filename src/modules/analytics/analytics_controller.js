import analytics_service from "./analytics_service.js";

async function getScanCountController(req, res, next){
    try{
        const scanCount = await analytics_service.getScanCount()
        res.json({count: scanCount})
    }catch(err){
        next(err)
    }
}

export default {
    getScanCountController
}