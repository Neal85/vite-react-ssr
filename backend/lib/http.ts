const isPrivateIP = (ip: string): boolean => {
    if (!ip) {
        return false;
    }

    const parts = ip.split('.');
    if (parts.length !== 4) {
        return false;
    }

    return !!(
        parts[0] === '10' ||
        parts[0] === '127' ||
        (parts[0] === '192' && parts[1] === '168') ||
        (parts[0] === '172' && parseInt(parts[1], 10) >= 16 && parseInt(parts[1]) <= 31)
    );
};


const isIPv4 = (ip: string): boolean => {
    return !!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ip
    );
};


const getRawIP = (req: any): string => {
    if (req.headers['x-forwarded-for']) {
        const ips = req.headers['x-forwarded-for'].split(',');

        for (let i = 0; i < ips.length; i++) {
            const ip = ips[i];
            if (ip && isIPv4(ip) && !isPrivateIP(ip)) {
                return ip;
            }
        }
    }

    return req.connection?.remoteAddress;
};


const isAjax = (req: any) => {
    return req.headers['x-requested-with'] === 'XMLHttpRequest' || (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') !== -1);
};


const setCookie = (res: any, name: string, value: string, httpOnly = true) => {
    const { cookie: { secure } } = global.config;

    res.cookie(name, value, { secure, httpOnly });
};


export default {
    getRawIP,
    isAjax,
    setCookie
}
