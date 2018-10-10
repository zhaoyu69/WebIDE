import React from 'react';
import {observer} from "mobx-react";
import { Tree } from 'antd';
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
import styles from './index.less';

@observer
class TreeView extends React.Component {
    onSelect = () => {
        console.log('Trigger Select');
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    render() {
        return (
            <div className={styles.treeview}>
                <h3>Project</h3>
                <DirectoryTree
                    multiple
                    defaultExpandAll
                    onSelect={this.onSelect}
                    onExpand={this.onExpand}
                >
                    <TreeNode title="parent 0" key="0-0">
                        <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
                        <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
                    </TreeNode>
                    <TreeNode title="parent 1" key="0-1">
                        <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
                        <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
                    </TreeNode>
                </DirectoryTree>
            </div>
        );
    }
}

export default TreeView;
