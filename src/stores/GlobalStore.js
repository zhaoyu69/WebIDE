import { observable, computed, toJS } from "mobx";

export default class GlobalStore{
    @observable output = "";
    @observable tabs = [];
    @observable activeKey = "";
    @observable params = [];

    getParams=()=>{
        this.params = [
            {
                name:"参数1",
                value:"1",
                key:1
            },
            {
                name:"参数2",
                value:"2",
                key:2
            }
        ];
    };

    // 参数数量
    @computed get paramsCount(){
        return this.params.length;
    }

    // 保存所有参数
    saveParams=()=>{
        console.log("params:", toJS(this.params));
    };

    // 删除参数
    removeParam=(key)=>{
        this.params = this.params.filter(param => param.key !== key);
    };

    // 添加新参数
    addParam=()=>{
        const newParam = {
            key: this.paramsCount + 1,
            name: '新的参数名',
            value: '新的参数值',
        };
        this.params.push(newParam);
    };

    // 单个参数修改
    saveParam=(row)=>{
        const index = this.params.findIndex(item => row.key === item.key);
        const item = this.params[index];
        this.params.splice(index, 1, {
            ...item,
            ...row,
        });
    };

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