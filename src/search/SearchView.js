import React from "react";
import { Layout, Breadcrumb } from 'antd';
import CommonOption from "./CommonOption";
import CustomSearcher from './CustomSearcher';
import { loadCustom } from './operator';
const { Content } = Layout;

class SearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customSearchers: null,
            enabled: null,
        }
    }

    componentWillMount = () => {
        loadCustom((searchers, enabled) => {
            this.setState({ customSearchers: searchers, enabled });
        });
    }

    render() {
        return <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>搜索设置</Breadcrumb.Item>
            </Breadcrumb>
            <CommonOption />
            {!this.state.customSearchers ? <></> :
                <CustomSearcher customSearchers={this.state.customSearchers} enabled={this.state.enabled} />}
        </Content>
    }
}

export default SearchView