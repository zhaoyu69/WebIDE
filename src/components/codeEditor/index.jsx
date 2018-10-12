import React, { Component } from 'react';
import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import CodeMirror from 'react-codemirror';
// 编辑器样式
import 'codemirror/lib/codemirror.css';
// 语言类型 (C)
import 'codemirror/mode/clike/clike';
// 提示功能
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
// 提示语言类型
import 'codemirror/addon/hint/anyword-hint';
// 主题样式
import 'codemirror/theme/darcula.css';
// 全屏功能
import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

import {Tabs} from 'antd';
const TabPane = Tabs.TabPane;

@observer
class CodeEditor extends Component {
    onEdit=(targetKey, action)=>{
        this[action](targetKey);
    };

    add=()=>{
        console.log("add");
    };

    remove=(targetKey)=>{
        console.log("remove");
        this.props.store.removeTab(targetKey);
    };

    render() {
        const {store} = this.props;
        const tabs = toJS(store.tabs);
        const activeKey = toJS(store.activeKey);
        const options = {
            // 行号
            lineNumbers: true,
            // 语言类型
            mode: {name: "text/x-csrc"},
            // 提示功能热键
            extraKeys: {
                "Ctrl": "autocomplete",
            },
            // 主题
            theme: "darcula",
        };
        return (
            <div className="codeEditor">
                <Tabs
                    type="editable-card"
                    // hideAdd
                    tabBarStyle={{margin:"0"}}
                    onEdit={this.onEdit}
                    activeKey={activeKey}
                    onTabClick={store.setActiveKey}
                >
                    {tabs.map(tab =>{
                        const {key, title, code} = tab;
                        return (
                            <TabPane tab={title} key={key} closable={true}>
                                <CodeMirror options={options} onChange={(code)=>store.codeChange(tab, code)} value={code}/>
                            </TabPane>
                        )}
                    )}
                </Tabs>
            </div>
        );
    }
}

export default CodeEditor;
