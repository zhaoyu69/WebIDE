import React from 'react';
import {observer} from "mobx-react";
import styles from './index.less';
import {Button} from 'antd';
import Settings from 'components/settings/index';

@observer
class Output extends React.Component {
    render() {
        const {activeTitle, output, getOutput, clearOutput} = this.props.store;
        return (
            <div className={styles.output}>
                <div>
                    <h3 className={styles.title}>{activeTitle}</h3>
                    <div className={styles.btnGroup}>
                        <Settings>
                            <Button type="primary">参数配置</Button>&nbsp;
                        </Settings>
                        <Button type="primary" onClick={getOutput}>保存</Button>&nbsp;
                        <Button type="primary" onClick={clearOutput}>清空</Button>
                    </div>
                </div>
                <div className={styles.content}>{output}</div>
            </div>
        );
    }
}

export default Output;
