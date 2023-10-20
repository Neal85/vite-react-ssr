import Render from '../render.js';
import AppStore from '../../../home/stores/app.js';


async function home(req: any, res: any) {
    const render = new Render(req, 'home');
    const appStore = new AppStore(
        {
            config: {
                title: 'Home Page'
            }
        }
    );
    render.setStore('appStore', appStore);

    res.send(await render.render());
}



async function about(req: any, res: any) {
    const render = new Render(req, 'about');
    const appStore = new AppStore(
        {
            config: {
                title: 'About App'
            }
        }
    );
    render.setStore('appStore', appStore);

    res.send(await render.render());
}


async function signin(req: any, res: any) {
    const render = new Render(req, 'account');

    res.send(await render.render());
}


async function signup(req: any, res: any) {
    const render = new Render(req, 'account');

    res.send(await render.render());
}


export default {
    home,
    about,
    signin,
    signup
}