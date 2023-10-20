import { Router } from 'express';
import adminRoutes from './admin/index.js';
import homeRoutes from './home/index.js';
import apiRoutes from './api/index.js';
import errorHandler from './errorHandler.js';


export default (config) => {
    let routes = Router();
    
    routes.use('/v1', apiRoutes(config));
    routes.use('/admin', adminRoutes(config));
    routes.use('/', homeRoutes(config));

    routes.use(errorHandler.ajaxError);
    routes.use(errorHandler.serverError);
    
    return routes;
}