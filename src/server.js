import app from './app.js'
import config from './config/env.js'

app.listen(config.PORT, '0.0.0.0', (err)=>{
    if(err){
        console.log('Server failed to start do to:', err)
        throw(err)
    }
    console.log('Server listening at ', config.PORT)
})