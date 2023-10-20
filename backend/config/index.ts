import DefaultConfig from './default.js';
import DevConfig from './dev.js';
import ProdConfig from './prod.js';
import utils from '../lib/utils.js';


function buildWithInsteadCSP(config: any) {
    const cspDef = config.csp['Content-Security-Policy'];

    let rules: string[] = [];
    for (let key in cspDef) {
        rules.push(`${key} ${cspDef[key].join(' ')}`);
    }

    config.csp.rules = rules.join(';');
}


export default (env: 'dev' | 'prd' = 'dev') => {

    let config = {};
    
    switch (env) {
        case 'dev':
            config = DevConfig;
            break;
        case 'prd':
            config = ProdConfig;
            break;
        default:
            config = DevConfig;
            break;
    }

    config = utils.merge(config, DefaultConfig);

    buildWithInsteadCSP(config);

    return config;
}