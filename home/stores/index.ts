import _AppStore from './app';
export const AppStore = _AppStore;


let initStores = null;
if (typeof window !== 'undefined') {
    initStores = (<any>window)._init_state_;
}

export const appStore = new _AppStore(initStores?.appStore);

