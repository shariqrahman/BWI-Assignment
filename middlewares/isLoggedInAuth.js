const isLoggedInAuth = async (req, res, next) => {
    try {
        if(!req.session.isLoggedIn) {
            return res.status(401).json({ message: 'Login Again'})
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = isLoggedInAuth;