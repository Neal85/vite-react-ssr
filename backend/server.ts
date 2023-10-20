import http from 'http';
import yargs from 'yargs';
import cluster from './lib/cluster.js';
import log from './lib/log.js';
import createApp from './app.js';
import createConfig from './config/index.js';

declare global {
    namespace NodeJS {
        interface Global {
            config: any;
        }
    }
}


const argv = yargs(process.argv.slice(2)).options({
    env: {
        alias: 'e',
        describe: 'Environment',
        default: 'dev',
        choices: ['dev', 'int', 'stg', 'prd']
    }
}).argv;


(async () => {
    const config = await createConfig(argv['env']);    
    global.config = config;
    
    const {
        env,
        port,
        cluster: {
            enable: clusterEnable,
            workers: clusterWorkers
        }
    } = config;

    log.init(config.log);


    const app = await createApp(config);
    const server = http.createServer(app);
    server.keepAliveTimeout = 65 * 1000;
    
    if (clusterEnable) {
        cluster(server, clusterWorkers);

    } else {
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port} in ${env} mode`);
        });
    }
})()