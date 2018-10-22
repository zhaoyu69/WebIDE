import React from 'react';
import {observer} from "mobx-react";
import styles from './index.less';
import {Button, Spin} from 'antd';
import Settings from 'components/settings/index';
import {toJS} from "mobx";

@observer
class Output extends React.Component {
    render() {
        let {activeFilename, output, downloadFile, clearOutput, compile, flash, activeTab, deviceid} = this.props.store;
        activeTab = toJS(activeTab);
        // console.log(activeTab);
        let isActived=false, isSaved=false, isCompiled=false, isLoading=false;
        if(deviceid) {
            isActived = !!activeTab;
            isSaved = activeTab?activeTab.isSaved:isActived;
            isCompiled = activeTab?activeTab.isCompiled:isActived;
            isLoading = activeTab?activeTab.isLoading:isActived;
        }
        return (
            <div className={styles.output}>
                <header>
                    <h3 className={styles.title}>{activeFilename}</h3>
                    <div className={styles.btnProcess}>
                        <Spin spinning={!!isLoading}>
                            <Button type="primary" onClick={downloadFile} disabled={!isActived} >保存</Button>&nbsp;
                            <Button type="primary" onClick={compile} disabled={!isSaved} >编译</Button>&nbsp;
                            <Button type="primary" onClick={flash} disabled={!isCompiled} >运行</Button>&nbsp;
                        </Spin>
                    </div>
                </header>
                <div className={styles.content}>{output}</div>
                <footer>
                    <Settings>
                        <Button type="primary">参数配置</Button>&nbsp;
                    </Settings>
                    <Button type="primary" onClick={clearOutput}>清空</Button>
                </footer>
            </div>
        );
    }
}

export default Output;
