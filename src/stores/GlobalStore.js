import { observable, action, computed, toJS } from "mobx";
import GlobalService from "services/GlobalService";

export default class GlobalStore{
    @observable output = "";
    @observable tabs = [];
    @observable activeKey = "";
    @observable params = [];
    // 设备信息
    @observable onlinedevices = [];

    @action getParams=()=>{
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
    @action saveParams=()=>{
        console.log("params:", toJS(this.params));
    };

    // 删除参数
    @action removeParam=(key)=>{
        this.params = this.params.filter(param => param.key !== key);
    };

    // 添加新参数
    @action addParam=()=>{
        const newParam = {
            key: this.paramsCount + 1,
            name: '新的参数名',
            value: '新的参数值',
        };
        this.params.push(newParam);
    };

    // 单个参数修改
    @action saveParam=(row)=>{
        const index = this.params.findIndex(item => row.key === item.key);
        const item = this.params[index];
        this.params.splice(index, 1, {
            ...item,
            ...row,
        });
    };

    // 添加到tabs
    @action addToTabs=(treenode)=>{
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

    @computed get activeTab() {
        return this.tabs.find(tab => tab.key === this.activeKey);
    }

    // 删除tab
    @action removeTab=(targetKey)=>{
        this.tabs = this.tabs.filter(tab => tab.key !== targetKey);
        if(this.activeKey === targetKey) {
            this.activeKey = this.tabs.length?this.tabs[0].key:"";
        }
    };

    // 编辑代码
    @action codeChange=(tab, code)=>{
        const index = _.findIndex(this.tabs, (o) => o.key === tab.key);
        this.tabs[index].code = code;
    };

    // 切换正在编辑的文件
    @action setActiveKey=(activeKey)=>{
        this.activeKey = activeKey;
        this.clearOutput();
    };

    // 正在编辑的文件名
    @computed get activeFilename(){
        const tab = this.tabs.find(tab => tab.key === this.activeKey);
        return tab && tab.title || "";
    }

    // 正在编辑的代码
    @computed get activeCode(){
        const tab = this.tabs.find(tab => tab.key === this.activeKey);
        return tab && tab.code || "";
    }

    // 清空
    @action clearOutput=()=>{
        this.output = "";
    };

    // 获取设备信息
    @action getOnlineDevices=async()=>{
        const onlinedevices = await GlobalService.getOnlineDevices();
        console.log(onlinedevices);
        this.onlinedevices = onlinedevices;
    };

    // 暂时定死的设备号
    @computed get deviceid() {
        return this.onlinedevices[0] && this.onlinedevices[0].deviceid;
    }

    // 保存
    @action downloadFile=async()=>{
        this.output = "正在保存...";
        const index = _.findIndex(this.tabs, (tab) => tab.key === this.activeKey);
        this.tabs[index].isLoading = true;
        const res = await GlobalService.downloadFile(this.deviceid, this.activeFilename, this.activeCode);
        if(res) {
            this.tabs[index].isSaved = true;
            this.output = "保存成功!";
        } else {
            this.output = "保存失败!";
        }
        this.tabs[index].isLoading = false;
    };

    // 编译
    @action compile=async()=>{
        this.output = "正在编译...";
        const index = _.findIndex(this.tabs, (tab) => tab.key === this.activeKey);
        this.tabs[index].isLoading = true;
        const res = await GlobalService.compile(this.deviceid);
        if(res) {
            this.tabs[index].isCompiled = true;
            this.output = "编译成功!";
        } else {
            this.output = "编译失败!";
        }
        this.tabs[index].isLoading = false;
    };

    // 烧录
    @action flash=async()=>{
        this.output = "正在烧录...";
        const index = _.findIndex(this.tabs, (tab) => tab.key === this.activeKey);
        this.tabs[index].isLoading = true;
        const res = await GlobalService.flash(this.deviceid);
        if(res) {
            this.output = "烧录成功!";
        } else {
            this.output = "烧录失败!";
        }
        this.tabs[index].isLoading = false;
    };
}

export const globalStore = new GlobalStore();