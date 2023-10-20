import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './assets/scss/global.scss';

import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ErrorPage from './pages/Error';
import { Provider } from './stores/context';
import { appStore } from './stores';

const initStores = {
    appStore
};


export default function App() {
    return (
        <Provider {...initStores}>
            <BrowserRouter>
                <Routes>
                    <Route key='home' path='/' element={<HomePage />}></Route>
                    <Route key='about' path='/about' element={<AboutPage />}></Route>
                    <Route key='error' path='/error' element={<ErrorPage />}></Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}