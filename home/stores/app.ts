import { makeAutoObservable, runInAction } from 'mobx';


export default class AppStore {

    config = {
        title: 'React App',
        version: '1.0.0',
    };

    constructor(initData?: any) {
        if (initData) {
            this.config = initData.config;
        }

        makeAutoObservable(this);
    }

}