import React, { Component } from 'react';
import CodeEditor from "./codeEditor";
import TreeView from "./treeview";
import Output from "./output";

class App extends Component {
    render() {
        return (
            <div>
                <TreeView/>
                <CodeEditor/>
                <Output/>
            </div>
        );
    }

}

export default App;
