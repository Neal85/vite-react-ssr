import * as uuid from 'uuid';
import http from '../lib/http.js';

const UTMCookies = [
    'source',
    'campaign',
    'medium'
];


export default (config: any) => {
    return function (req: any, res: any, next: any) {

        req.config = config;

        req.requestId = uuid.v4();
        req.userIP = http.getRawIP(req);

        const { cookie: { domain } } = req.config;

        if (req.session && !req.session.sid) {
            req.session.sid = `sid_${uuid.v4()}`;
        }

        let queryName = '';
        for (const name of UTMCookies) {
            queryName = `utm_${name}`;
            if (req.query[queryName]) 
            {
                res.cookie(
                    name,
                    req.query[queryName],
                    {
                        domain,
                        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
                    }
                );
            }
        }

        next();
    };
}