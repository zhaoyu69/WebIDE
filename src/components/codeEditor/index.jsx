import React, { Component } from 'react';
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

@observer
class CodeEditor extends Component {
    render() {
        const {code, fullScreen, codeChange} = this.props.store;
        const options = {
            // 行号
            lineNumbers: true,
            // 语言类型
            mode: {name: "text/x-csrc"},
            // 提示功能热键
            extraKeys: {
                "Ctrl": "autocomplete",
                // "F11": fullScreenToggle,
                // "Esc": fullScreenExit
            },
            // 主题
            theme: "darcula",
            // 全屏
            fullScreen,
        };
        return (
            <div>
                <CodeMirror options={options} onChange={codeChange} value={code}/>
            </div>
        );
    }
}

export default CodeEditor;
