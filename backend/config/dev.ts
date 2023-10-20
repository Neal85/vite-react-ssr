export default {
    env: 'dev',  // dev, prd:production
  
    cluster: {
        enable: false
    },

    log: {
        level: 'info',
        path: 'logs/',
        format: 'sample', // json | sample
    },

    cookie: {
        secure: false,
        secret: process.env.SESSION_SECRET || 'random_cookie_secret',
        domain: null,
    },

    headers: {
        enable: true,
        items: [
            {
                pattern: /^.*?$/,
                field: 'X-Frame-Options',
                value: 'DENY',
            },
        ],
    },

    csp: {
        enable: false
    },

    geoip: {
        enable: false,
        dbPath: 'public/GeoLite2-Country.mmdb',
        skipRules: [
            {
                pattern: /^\/health.*?$/,
            }
        ]
    },
}