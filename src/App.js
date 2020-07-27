import React from "react";
import { Layout, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import "./App.css";
import SearchView from "./search/SearchView";

const { Footer, Sider } = Layout;

class App extends React.Component {
    state = {
        collapsed: false,
        view: <SearchView />
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<SearchOutlined />} onClick={() => this.setState({ view: <SearchView /> })} >
                            搜索设置
            </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
                    {this.state.view}
                    <Footer style={{ textAlign: 'center' }}>Quicker! @2020</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default App