import React from 'react';
import { message, Form, Col, Row, Input, Button, Table, Space, Tag, Empty } from 'antd';
import { custom } from './operator';

class CustomSearcher extends React.Component {
    formRef = React.createRef();
    state = {
        selectedRowKeys: this.props.enabled,
        data: this.props.customSearchers,
    };

    onSelectChange = selectedRowKeys => {
        // add
        let temp = selectedRowKeys.filter(x => !this.state.selectedRowKeys.includes(x));
        if (temp.length > 0) {
            this.enable(temp);
        }
        // remove
        temp = this.state.selectedRowKeys.filter(x => !selectedRowKeys.includes(x));
        if (temp.length > 0) {
            this.disable(temp);
        }
        this.setState({ selectedRowKeys });
    };

    enable = (list) => custom.enable(list);

    disable = (list) => custom.disable(list);


    onFinish = values => {
        this.setState({
            data: [...this.state.data, values],
            selectedRowKeys: [...this.state.selectedRowKeys, values.name]
        })
        custom.create(values);
        this.enable([values.name]);
        this.formRef.current.resetFields();
        message.success("创建成功");
    };

    del = name => {
        const data = [...this.state.data];
        for (let i = 0; i < data.length; i++) {
            const e = data[i];
            if (e.name === name) {
                data.splice(i, 1);
                const temp = this.state.selectedRowKeys;
                if (temp.indexOf(name) >= 0) {
                    temp.splice(temp.indexOf(name), 1);
                }
                this.disable([name]);
                custom.delete(name);
                this.setState({ data, selectedRowKeys: temp });
                break;
            }
        }
    };

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <>
                <h4>自定义搜索列表</h4>
                {this.state.data === null ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                    <Table rowKey="name" rowSelection={rowSelection}
                        dataSource={this.state.data} size="middle"
                        columns={[
                            {
                                title: '名称',
                                key: 'name',
                                dataIndex: 'name',
                            },
                            {
                                title: '链接',
                                key: 'link',
                                dataIndex: 'link',
                                render: link => (
                                    <>
                                        {
                                            /^(.*?)(\{\w+\})(.*?)$/mg.exec(link).slice(1).map(function (tagName) {
                                                if (tagName.startsWith('{') && tagName.endsWith('}')) {
                                                    return <Tag color="geekblue" key={tagName.slice(1, -1)}>
                                                        {tagName.slice(1, -1)}
                                                    </Tag>;
                                                } else {
                                                    return tagName;
                                                }
                                            })
                                        }
                                    </>
                                ),
                            },
                            {
                                title: 'Action',
                                key: 'name',
                                render: (text, record) => (
                                    <Space size="middle">
                                        <Button disabled>编辑</Button>
                                        <Button onClick={() => this.del(record.name)} danger>删除</Button>
                                    </Space>
                                ),
                            },
                        ]} />
                }
                <h4>自定义搜索</h4>
                <Form layout="vertical" ref={this.formRef} onFinish={this.onFinish}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="名称" name="name" rules={[
                                {
                                    required: true,
                                    message: '请输入搜索名称!',
                                },
                            ]}>
                                <Input placeholder="搜索名称" />
                            </Form.Item>
                        </Col>
                        <Col span={18}>
                            <Form.Item label="链接" name="link" rules={[
                                {
                                    required: true,
                                    message: '请输入搜索链接!',
                                },
                                {
                                    pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
                                    message: '请输入正确的 URL 链接格式!',
                                },
                                () => ({
                                    validator(rule, value) {
                                        if (value && value.indexOf("{word}") >= 0) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('链接中需要包含 {word} 用以替代搜索词！');
                                    },
                                })
                            ]}>
                                <Input placeholder="搜索链接" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">添加</Button>
                    </Form.Item>
                </Form>
            </>
        );
    }
};

export default CustomSearcher;