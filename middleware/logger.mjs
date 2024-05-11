const logger = ( req, res, next ) => {
    //req.user = `${nodeUrl}`
    const message =  `${req.method} ${req.originalUrl} - 
    ${new Date().toLocaleDateString("sv-SE")} 
    ${new Date().toLocaleTimeString("sv-SE")}
    }`;
    console.log(message);

    next();
};

export default logger;