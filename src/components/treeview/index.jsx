import React from 'react';
import {observer} from "mobx-react";
import { Tree } from 'antd';
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
import treenodes from 'utils/treenode';

@observer
class TreeView extends React.Component {
    onSelect = (selectKeys, e) => {
        // console.log(selectKeys, e);
        this.props.store.addToTabs(e.node.props);
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    render() {
        return (
            <DirectoryTree
                multiple
                defaultExpandAll
                onSelect={this.onSelect}
                onExpand={this.onExpand}
            >
                <TreeNode title="Project" key="0-0">
                    {treenodes.map(treenode =>{
                        const {title, key, code} = treenode;
                        return <TreeNode title={title} key={key} code={code} isLeaf />
                    })}
                </TreeNode>
            </DirectoryTree>
        );
    }
}

export default TreeView;
