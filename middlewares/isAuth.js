const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {

        const tokenHeader = req.header('Authorization');

        if(!tokenHeader) {
            return res.status(401).json({ message: 'Missing authentication token in request' });
        }

        const token = tokenHeader.replace('Bearer ', '');

        if(!token) {
            return res.status(401).json({ message: 'Invalid authentication token format' });
        }

        const decodeToken = jwt.decode(token, process.env.JWT_SECRET);

        console.log(decodeToken)

        if(Date.now() > decodeToken.exp * 1000) {
            return res.status(403).json({ message: 'Token has expired' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if(error) {
                return res.status(403).json({ message: `Invalid Authentication Token` });
            }
            console.log(decoded)
            req.userId = decoded.userId;
            next();
        });
        // const token = req.header('Authorization', 'Bearer Token');

        // if(!token) {
        //     return res.status(401).json({ message: 'Missing authentication token in request' });
        // }

        // let splitToken = token.split(' ')[1];
        // console.log(splitToken)
        // let decodeToken = jwt.decode(splitToken, process.env.JWT_SECRET);
        // console.log(decodeToken)

        // if(Date.now() > (decodeToken.exp) * 1000) {
        //     return res.status(403).json({ message: 'Token has expired' });
        // }

        // jwt.verify(splitToken, process.env.JWT_SECRET, (error, decode) => {
        //     if(error) {
        //         return res.status(403).json({ message: `Invalid authentication token` });
        //     }
        //     req.userId = decode.userId;
        //     next();
        // });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = auth;