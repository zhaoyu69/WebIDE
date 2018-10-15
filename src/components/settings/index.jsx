import React from 'react';
import {observer} from "mobx-react";
import {toJS} from 'mobx';
import {globalStore} from "stores/GlobalStore";
import {Modal, Table, Input, Button, Popconfirm, Form} from 'antd';
const FormItem = Form.Item;
const EditableContext = React.createContext();
// import styles from './index.less';

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@observer
class EditableCell extends React.Component {
    state = {
        editing: false,
    }

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="editable-cell-value-wrap"
                                        style={{ paddingRight: 24 }}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

@observer
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '参数名',
            dataIndex: 'name',
            editable: true,
        }, {
            title: '参数值',
            dataIndex: 'value',
            editable: true,
        }, {
            title: "操作",
            dataIndex: 'operation',
            render: (text, record) => {
                console.log(record);
                return (
                    <Popconfirm title={`确认删除${record.name}?`} onConfirm={() => globalStore.removeParam(record.key)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                );
            }
        }];
        globalStore.getParams();
    }

    render() {
        const params = toJS(globalStore.params);
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: globalStore.saveParam,
                }),
            };
        });
        return (
            <div>
                <Button onClick={globalStore.addParam} type="primary" style={{ marginBottom: 16 }}>
                    添加新参数
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={params}
                    columns={columns}
                />
            </div>
        );
    }
}


@observer
class Settings extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={visible:false};
        globalStore.getParams();
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    saveParams = () => {
        globalStore.saveParams();
        this.hideModal();
    };

    render() {
        const {children} = this.props;
        const {visible} = this.state;
        return (
            <span>
                <span onClick={this.showModal}>{children}</span>
                <Modal
                    title="参数配置"
                    visible={visible}
                    onOk={this.saveParams}
                    onCancel={this.hideModal}
                    okText="保存"
                    cancelText="取消"
                >
                    <EditableTable />
                </Modal>
            </span>
        );
    }
}

export default Settings;
