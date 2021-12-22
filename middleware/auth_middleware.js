const jwt = require('jsonwebtoken')

async function authenticate(req,res,next){
    try{
        const token = await req.header('authenticate')
        
        if(!token){
            return res.status(422).send({Error: "Invalid Token"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(422).send({Error: "Unauthorized Access"})
        }
        req.user = decoded
        next()

    }catch(e){
        console.log(e)
        return res.status(422).send({Error: e})
    }
}

module.exports=authenticate
