import util from 'util';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

interface ILogOptions {
    level: string;
    path: string;
    format: string;
}

/*
    1. From npm package
    console.[log|info|warn|error] ('string %s', ...params);

    2. System
    console.[log|info|warn|error] ('string message');
    console.[log|info|warn|error] ({req, err}, message);
    console.[log|info|warn|error] ({ defined msg obj: api_http_log });
*/
const suppressConsole = (logger: any) => {
    ['log', 'info', 'warn', 'error'].forEach(x => {
        console[x] = (function (fnName: string) {
            return function (...args) {
                logger[fnName](getRecodJson(...args));
            };
        })(x === 'log' ? 'info' : x);
    });
};


const init = (options: ILogOptions) => {
    const { level, path, format } = options;

    const consoleFormatter = winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(info => {
            const { timestamp, level, message, ...other } = info;
            return `${timestamp} ${level.toUpperCase()}: ${message}`;
        })
    );

    const jsonFormatter = winston.format.combine(
        winston.format.json(),
        winston.format.printf(info => {
            if (info) {
                if (info.time) info.time = undefined;
                if (info.timestamp) info.timestamp = undefined;
            }

            return JSON.stringify(info);
        })
    );

    const transports = [
        new winston.transports.Console({ handleExceptions: true }),

        new DailyRotateFile({
            dirname: path,
            filename: 'main-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
        }),

        new DailyRotateFile({
            level: 'error',
            dirname: path,
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            handleExceptions: true,
        }),
    ];

    const logger = winston.createLogger({
        level,
        format: format === 'json' ? jsonFormatter : consoleFormatter,
        transports,
    });

    suppressConsole(logger);

    return logger;
};

const buildLogRecord = () => {
    const { env } = global.config;

    return {
        pid: process.pid,
        env,
        time: new Date()
    };
};

// express request
const buildRequest = (req: any) => {
    if (!req) {
        return null;
    }

    const { method, path, originalUrl, connection, locale } = req;
    const userAgent = req.headers['user-agent'];

    return {
        region: req.header['x-region'] || req.region,
        locale,
        method,
        path,
        originalUrl,
        referer: req.get('referer'),
        ip: req.headers['x-forwarded-for'] || connection?.remoteAddress,
        userAgent: userAgent,
    };
};

const buildError = (err: any) => {
    if (!err) {
        return null;
    }

    const { code, message, stack } = err;

    return {
        err: {
            code,
            message,
            stack,
        },
    };
};

const buildSession = (req: any) => {
    if (!req || !req.session) {
        return undefined;
    }

    const { session } = req;
    const { requestId, sid, userIP, userId } = session;

    return {
        requestId,
        sid,
        userIP,
        userId,
    };
};


const buildHttp = (req: any, res: any, elapsedTime: number) => {
    const { method, path, originalUrl, connection, locale } = req;

    const userAgent = req.headers['user-agent'];
    const referer = req.header('referer');
    const location = res.get('Location');
    const { statusCode } = res;
    const baseRecord = buildLogRecord();

    const httpd = {
        ...baseRecord,
        locale,
        method,
        path,
        originalUrl,
        statusCode,
        referer,
        location,
        ip: connection?.remoteAddress,
        userAgent: userAgent,
        elapsedTime: `${elapsedTime.toFixed(3)}ms`,
        session: buildSession(req),
        message: `HTTP:[${method}(${statusCode})]:${originalUrl} - ${elapsedTime.toFixed(3)}ms`
    };

    return httpd;
};


function getRecodJson(...args) {
    let record = {
        ...buildLogRecord(),
        message: '',
    };

    if (args.length === 1) {
        const opt = args[0];
        if (typeof opt === 'string') {
            record.message = opt;
        } 
        else 
        {
            record = {
                ...record,
                ...args,
                message: (<any>opt).message || (<any>opt).msg,
            };
        }
    } 
    else 
    {
        if (args.length === 2 
            && args[0] && args[0] instanceof Object 
            && typeof args[1] === typeof '') 
        {
            // console.[log|info|warn|error] ({req, err}, message)
            const { req, err, ...other } = args[0];
            const message = args[1];

            record = {
                ...record,
                ...buildRequest(req),
                ...buildError(err),
                session: buildSession(req),
                message: message || (err ? err.message : ''),
                ...other,
            };

        } else if (typeof args[0] === typeof '') {
            record.message = util.format(args[0], ...args.slice(1));

        } else {
            record.message = new String(args).toString();
        }
    }

    return record;
}


const httpLog = (req: any, res: any, elapsedTime: number) => console.info(buildHttp(req, res, elapsedTime));


export default {
    init,
    httpLog,
    buildLogRecord,
    buildRequest,
    buildError,
    buildSession,
    buildHttp
};
