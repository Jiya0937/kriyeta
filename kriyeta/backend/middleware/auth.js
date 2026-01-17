module.exports = function (req, res, next) {
    // ----------------------------------------------------
    // TEMPORARY DEV AUTH MIDDLEWARE
    // ----------------------------------------------------
    // This middleware currently allows ALL requests to pass.
    // Use this strictly for development or non-critical routes.
    // 
    // TODO: Replace this with real JWT verification logic
    // when ready for production authentication.
    // ----------------------------------------------------

    // Pass execution to the next handler
    next();
};
