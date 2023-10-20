import { Router } from 'express';
import Render from '../render.js';



export default (config: any) => {
    let routes = Router();
    
    // add middleware here
    
    // add routes here
    routes.get('/', async (req: any, res: any) => {
        const render = new Render(req, 'admin');

        res.send(await render.render());
    });
    
    return routes;
}