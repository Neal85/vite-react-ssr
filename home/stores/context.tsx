import React from "react";
import AppStore from './app';


interface IAppContext {
    appStore: AppStore;
    [propName: string]: any;
}

const AppContext = React.createContext<IAppContext>({ appStore: new AppStore() });


export const Provider = ({ children, ...stores }) => {
    const parent = React.useContext(AppContext);
    const mutableRef = React.useRef({ ...parent, ...stores });
    const value = mutableRef.current;

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
Provider.displayName = 'StoreProvider';


export const useStores = () => {
    const stores = React.useContext(AppContext);
    if (!stores) {
        throw new Error('useStores must be used within a StoreProvider.');
    }
    return stores;
}
