import responseTime from 'response-time';

const IgnoreLog = /^((?!\/(js|css|images|fonts|locales)\/|health).)*?$/;


export default () => {
    return responseTime((req: any, res: any, time: any) => {
        if (IgnoreLog.test(req.path)) {
            console.info({ req }, `HTTP:[${req.method}(${res.statusCode})]:${req.originalUrl} - ${time.toFixed(3)}ms`);
        }
    });
};
