import fs from 'fs';
import path from 'path';
import { Reader } from '@maxmind/geoip2-node';
import http from '../lib/http.js';

const RegionCookie = 'cc';
const RegionKeyInHeader = 'x-region';


export default (config: any) => {
    const {
        root,
        geoip: {
            enable,
            dbPath,
            skipRules
        }
    } = config;

    const reader = Reader.openBuffer(fs.readFileSync(path.join(root, dbPath)));


    return (req: any, res: any, next) => {

        req.region = 'US';
        
        if (!enable) {
            return next();
        }

        const isSkip = skipRules.findIndex(x => {
            const { methods, pattern } = x;
            
            if (methods && pattern && methods.test(req.method) && pattern.test(req.path)) {
                return true;

            } else if (!methods && pattern && pattern.test(req.path)) {
                return true;
            }

            return false;

        }) !== -1;

        if (isSkip) {
            return next();
        }


        const headerRegion = req.get(RegionKeyInHeader);  // from load balancer
        if (headerRegion && headerRegion !== '') {
            req.region = headerRegion;
        } 
        else 
        {
            let countryCode = req.cookies[RegionCookie];
            if (countryCode) {
                req.region = countryCode;
            } 
            else 
            {
                try {
                    const ip = http.getRawIP(req);
                    const ret = reader.country(ip);
                    countryCode = ret?.country?.isoCode;

                    if (countryCode) {
                        req.region = countryCode;
                    }
                } catch (err) {
                    console.warn({req, err}, 'GeoIP: get ip from geo db failed.');
                }
            }
        }
        
        if (req.region) {
            http.setCookie(res, RegionCookie, req.region, false);
        }

        next();
    };
}