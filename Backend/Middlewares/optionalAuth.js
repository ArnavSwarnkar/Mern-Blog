const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
        // If token exists, verify it
        getAccessToRoute(req, res, next);
    } else {
        // If no token, continue without user
        req.user = null;
        next();
    }
};
