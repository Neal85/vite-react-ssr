import { Router } from 'express';
import homeRouter from './home.js';
import commonRouter from './common.js';
import errorHandler from '../errorHandler.js';



export default (config: any) => {
    let routes = Router();
    
    routes.get('/', homeRouter.home);
    routes.get('/about', homeRouter.about);
    routes.get('/signin', homeRouter.signin);
    routes.get('/signup', homeRouter.signup);

    routes.get('/health', commonRouter.health);
    routes.get('/error', errorHandler.error);

    routes.use(errorHandler.notFound);
    
    return routes;
}