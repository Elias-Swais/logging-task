const {sign, verify} = require('jsonwebtoken');

const createTokens = (user) => {
    const accessToken = sign({name: user.name, id: user.id}, "jwtsecret", {
        expiresIn: '24h'
    })
    return accessToken;
}

const validateToken = (req,res,next) =>{
        const accessToken = req.cookies['token']

        if(!accessToken) return res.status(400).json({error: "User not authenticated"})
    
        try{
            const validToken = verify(accessToken,"jwtsecret")
            if(validToken){
                req.authenticated = true 
                return next()
            }
        } catch(err){
            return res.status(400).json({error: err})
        }

    }



module.exports = {createTokens, validateToken};