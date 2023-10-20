import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

const Markup = '<noscript id="REACT_APP"></noscript>';

/*
    in config
    templates: {
        'home': {
            path: "/",
            ssr: true,
            templateFile: "home.html",
            templateDistFile: "dist/home.html",
            renderSrc: "/home/ssr/home.jsx",
            renderDist: "dist/ssr/home/home.js"
        },
    
        'admin': {
            path: "/admin",
            ssr: false,
            templateFile: "admin.html",
            templateDistFile: "dist/admin.html"
        },
    }

    _RenderCache: {
        home: {
            html: '',
            render: function() {}
        }
    }
*/
const _RenderCache = {};


export default class Render 
{
    req: any;
    config: any;
    vite: any;
    templateKey: string;
    template: any;
    ssr: boolean;

    pageTitle = 'React SSR';
    keywords = '';
    description = '';
    
    initState = {};
    initStateJsonStr = '{}';

    constructor(req: any, templateKey: string) {
        this.req = req;
        this.config = req.config;
        this.vite = req.app.get('vite');
        this.templateKey = templateKey;

        this.template = this.config.templates[templateKey];
        if (!this.template) {
            throw new Error(`Template ${templateKey} not found`);
        }
        this.ssr = !!this.template.ssr;
        this.template.pageTitle && this.setPageTitle(this.template.pageTitle);
        this.template.keywords && this.setKeywords(this.template.keywords);
        this.template.description && this.setDescription(this.template.description);

    }

    setPageTitle(title) {
        this.pageTitle = title;
    }

    setKeywords(keywords) {
        this.keywords = keywords;
    }

    setDescription(description) {
        this.description = description;
    }

    setStore(key, value) {
        this.initState[key] = value;
    }

    isDev() {
        return !!this.vite;
    }


    async render() {
        const { root } = this.config;
        
        let url = this.template.path || this.req.path;

        let html; 
        let render;
        
        if (_RenderCache[this.templateKey]) {
            const c = _RenderCache[this.templateKey];
            html = c.html;
            render = c.render;
        } 
        else 
        {
            if(this.isDev()) {
                html = fs.readFileSync(path.resolve(root, this.template.templateFile), 'utf8');
                html = await this.vite.transformIndexHtml(url, html);
                render = this.ssr ? (await this.vite.ssrLoadModule(this.template.renderSrc)).default : null;
            } 
            else 
            {
                html = fs.readFileSync(path.resolve(root, this.template.templateDistFile), 'utf8');
                render = this.ssr ? (await import(path.resolve(root, this.template.renderDist))).default : null;
            }
        }

        let elHtml = '';
        if (this.ssr) {
            elHtml = await render(url, this);
            _RenderCache[this.templateKey] = { html, render: render };
        }

        this.initStateJsonStr = JSON.stringify(this.initState);
        
        return (await ejs.render(html, this, {delimiter: '?'})).replace(Markup, elHtml);
    }
}