import cluster from 'cluster';
cluster.schedulingPolicy = cluster.SCHED_RR;
import os from 'os';


const MinCPUS = 2;

let cpus = os.cpus().length;
let terminating = false;


const terminate = () => {
    if (terminating) return;
    terminating = true;

    console.info('Terminate, kill workers.');

    cluster.removeAllListeners('exit');
    for (const id in cluster.workers) {
        const worker = cluster.workers[id];
        worker && worker.kill('SIGTERM');
    }
}


export default (fn: any, workers: number) => {
    // Always leave a process to the system.
    cpus = workers || cpus - 1;
    cpus = cpus > MinCPUS ? cpus : MinCPUS;

    if (cluster.isPrimary) {
        console.info(`Master(${process.pid}) is running.`);

        for (let i = 0; i < cpus; i++) cluster.fork();

        cluster.on('listening', (worker, address) => {
            console.info(`Worker(${worker.process.pid}) listening on port ${address.port}.`);
        });

        cluster.on('exit', (worker, code, signal) => {
            console.warn(`Worker(${worker.process.pid}) exit(${signal || code}).`);
            cluster.fork();
        });

        process.on('SIGTERM', terminate);
        process.on('SIGQUIT', terminate);
    } 
    else
        fn();
}
