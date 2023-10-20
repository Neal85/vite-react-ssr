export default {
    env: 'prd',  // dev, prd:production
    
    port: 3000,
    host: 'localhost',
    
    root: process.cwd(),

    cluster: {
        enable: false,
        workers: 0,  // 0: cpu count
    },

    log: {
        level: 'info',
        path: 'logs/',
        format: 'json', // json | sample
    },

    cookie: {
        secure: true,
        secret: process.env.SESSION_SECRET || 'random_cookie_secret',
        domain: '.www.com'
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

    cors: {
        enable: true,
        domains: '*',
    },

    csp: {
        enable: true,
        rules: null,
        'Content-Security-Policy': {
            'default-src': [
                "'self'", 
                'https://*.test.com'
            ],
            'font-src': [
                "'self'", 
                'data:', 'https://*.test.com'
            ],
            'connect-src': [
                "'self'",
                'data:',
                'https://*.test.com',
                'https://www.google-analytics.com',
                'https://storage.googleapis.com/'
            ],
            'child-src': [
                "'self'", 
                'https://*.test.com'
            ],
            'style-src': [
                "'self'",
                "'unsafe-inline'",
                'https://*.test.com'
            ],
            'script-src': [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                'https://*.test.com',
                'https://www.googletagmanager.com'
            ],
            'img-src': [
                "'self'",
                'data:',
                'blob:',
                'https://*.test.com'
            ],
            'frame-src': [
                "'self'",
                'https://*.test.com'
            ],
            'worker-src': [
                "'self'", 
                'blob:'
            ],
            'frame-ancestors': ["'none'"],
        },
    },

    geoip: {
        enable: true,
        dbPath: 'dist/GeoLite2-Country.mmdb',
        skipRules: [
            {
                pattern: /^\/health.*?$/,
            }
        ]
    },

    templates: {
        home: {
            path: '/',
            pageTitle: 'SSR Home page',
            ssr: true,
            templateFile: 'home/home.html',
            templateDistFile: 'dist/home/home.html',
            renderSrc: 'home/ssr/home.tsx',
            renderDist: 'dist/ssr/home/home.js'
        },
        about: {
            path: '/about',
            pageTitle: 'SSR About page',
            ssr: true,
            templateFile: 'home/home.html',
            templateDistFile: 'dist/home/home.html',    
            renderSrc: 'home/ssr/about.tsx',
            renderDist: 'dist/ssr/about/about.js'
        },
        error: {
            path: '/error',
            pageTitle: 'Oops! Something went wrong.',
            ssr: true,
            templateFile: 'home/home.html',
            templateDistFile: 'dist/home/home.html',
            renderSrc: 'home/ssr/error.tsx',
            renderDist: 'dist/ssr/error/error.js'
        },
        account: {
            ssr: false,
            templateFile: 'home/account.html',
            templateDistFile: 'dist/home/account.html'
        },
        admin: {
            path: "/admin",
            ssr: false,
            templateFile: 'admin/admin.html',
            templateDistFile: 'dist/admin/admin.html'
        }
    }
}