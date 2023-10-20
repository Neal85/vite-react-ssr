import { InternalServerError } from '../lib/errors.js';
import http from '../lib/http.js';
import Render from './render.js';


function ajaxError(err: any, req: any, res: any, next: any) {

    if (http.isAjax(req)) {
        console.error({req, err}, `AJAX ERROR: ${err.message}`);

        if (err && err.statusCode) 
            res.status(err.statusCode || 500).json(err.toJson());
        else
            res.status(500).json(new InternalServerError().toJson());

        return;
    }

    next(err);
}


function notFound(req: any, res: any) {
    console.error({req}, `NOT FOUND: ${req.originalUrl}`);

    res.status(404).send(`Not found`);
}


function serverError(err: any, req: any, res: any, next: any) {
    console.error({ req, err }, `SERVER ERROR: ${err.message}`);

    res.redirect('/error');
}


async function error(req: any, res: any) {
    const render = new Render(req, 'error');
    
    res.end(await render.render());
}



export default {
    ajaxError,
    notFound,
    serverError,
    error
}
