import { observable, computed, toJS } from "mobx";

export default class GlobalStore{
    @observable output = "";
    @observable tabs = [];
    @observable activeKey = "";

    addToTabs=(treenode)=>{
        // console.log(treenode);
        const key = treenode.eventKey;
        const {title, code} = treenode;
        this.activeKey = key;
        if(treenode.children) {
            return;
        }
        const isExist = _.findIndex(toJS(this.tabs), (o) => o.key === treenode.eventKey) !== -1;
        if(!isExist) {
            this.tabs.push({key, title, code});
        }
        this.clearOutput();
    };

    removeTab=(targetKey)=>{
        this.tabs = this.tabs.filter(tab => tab.key !== targetKey);
        if(this.activeKey === targetKey) {
            this.activeKey = this.tabs.length?this.tabs[0].key:"";
        }
    };

    codeChange=(tab, code)=>{
        const index = _.findIndex(this.tabs, (o) => o.key === tab.key);
        this.tabs[index].code = code;
    };

    setActiveKey=(activeKey)=>{
        this.activeKey = activeKey;
        this.clearOutput();
    };

    @computed get activeTitle(){
        const tab = this.tabs.find(tab => tab.key === this.activeKey);
        return tab && tab.title || "";
    }

    @computed get activeCode(){
        const tab = this.tabs.find(tab => tab.key === this.activeKey);
        return tab && tab.code || "";
    }

    getOutput=()=>{
        this.output = this.activeCode;
    };

    clearOutput=()=>{
        this.output = "";
    };
}

export const globalStore = new GlobalStore();