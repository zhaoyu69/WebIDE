import { observable, action, computed } from "mobx";

export default class GlobalStore{
    @observable fullScreen = false;
    @observable code = "";
    @observable output = "";

    @action fullScreenToggle = (cm) => {
        this.fullScreen = !cm.options.fullScreen;
    };

    @action fullScreenExit = (cm) => {
        this.fullScreen = false;
    };

    @action codeChange = (code) => {
        this.code = code;
    };

    @action getOutput = () => {
        this.output = this.code;
    };

    @action clearOutput = () => {
        this.output = "";
    };
}

export const globalStore = new GlobalStore();