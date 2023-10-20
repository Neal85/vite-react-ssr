import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from '../stores/context';
import ErrorPage from '../pages/Error';



export default function(url: string, ctx: any) {
    const { initState } = ctx;

    return ReactDOMServer.renderToString(
        <Provider {...initState}>
            <StaticRouter location={url}>
                <ErrorPage/>
            </StaticRouter>
        </Provider>
    )
}