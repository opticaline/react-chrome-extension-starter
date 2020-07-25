import React from "react";
import { Layout, Breadcrumb } from 'antd';
import CommonOption from "./CommonOption";
const { Content } = Layout;

class SearchView extends React.Component {
    render() {
        return <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Search setting</Breadcrumb.Item>
            </Breadcrumb>
            <CommonOption />
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                Bill is a cat.
            </div>
        </Content>
    }
}

export default SearchView