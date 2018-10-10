import React, { Component } from 'react';
import {observer} from "mobx-react";
import CodeEditor from "./codeEditor";
import TreeView from "./treeview";
import Output from "./output";
import {globalStore} from "stores/GlobalStore";
import {Layout, Row, Col} from 'antd';
const { Header, Content, Footer, Sider } = Layout;

@observer
class App extends Component {
    render() {
        return (
            <Layout style={{height:"100vh"}}>
                <Sider style={{background:"#f0f2f5", borderRight:"1px solid #ccc"}}>
                    <TreeView store={globalStore}/>
                </Sider>
                <Content>
                    <Row>
                        <Col md={16}>
                            <CodeEditor store={globalStore}/>
                        </Col>
                        <Col md={8}>
                            <Output store={globalStore}/>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }

}

export default App;
