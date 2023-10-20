import fs from 'fs';
import path from 'path';
import express, { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import clientSessions from 'client-sessions';
import { init, httpd, cors, csp, headers } from './middleware/index.js';
import createRoutes from './routes/index.js';
import { createServer as createViteServer } from 'vite';

const isProd = process.env.NODE_ENV === 'production';


export default async function (config: any) {
    const {
        root,
        cookie: {
            secure,
            secret,
            domain,
        }
    } = config;

    const app = express();

    app.set('isProd', isProd);
    app.set('view engine', 'ejs');
    app.set('view options', { delimiter: '?' });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser(secret));
    app.use(
        clientSessions({
            cookieName: 'session',
            requestKey: 'session',
            secret: secret,
            cookie: {
                secureProxy: secure,
                httpOnly: true,
                ephemeral: true,
                domain: domain || undefined,
            },
        })
    );
    app.use(init(config));
    app.use(httpd());
    app.use(cors(config));
    app.use(csp(config));
    app.use(headers(config));

    if (!isProd) {
        const vite = await createViteServer({
            root: root,
            server: { middlewareMode: true },
            appType: 'custom'
        });

        app.use(vite.middlewares);
        app.set('vite', vite);
    } 
    else 
    {
        app.use(express.static(path.join(root, 'dist')));
    }

    app.use(createRoutes(config));

    return app;
}
