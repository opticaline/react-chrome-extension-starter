import React from "react";
import { List, Card, Checkbox } from 'antd';
import { search_website } from '../common_data.json';
import { addSearcher, delSearcher, loadSearcher } from './operator';

const CheckboxGroup = Checkbox.Group;


class CheckGroup extends React.Component {
    constructor(props) {
        super(props);
        this.plainOptions = props.plainOptions;
        this.addChecked = props.addChecked || function () { console.log(arguments); };
        this.delChecked = props.delChecked || function () { console.log(arguments); };
        this.state = {
            checkedList: props.checkedList || [],
            indeterminate: true,
            checkAll: false,
        };
    }

    componentDidMount = () => {
        this.onChange(this.state.checkedList);
    }

    onChange = checkedList => {
        this.difference(checkedList);
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && checkedList.length !== 0 && checkedList.length < this.plainOptions.length,
            checkAll: checkedList.length === this.plainOptions.length,
        });
    };

    onCheckAllChange = e => {
        const checkedList = e.target.checked ? this.plainOptions : [];
        this.difference(checkedList);
        this.setState({
            checkedList,
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    difference = checkedList => {
        // add
        let temp = checkedList.filter(x => !this.state.checkedList.includes(x));
        if (temp.length > 0) {
            this.addChecked(this.props.name, temp);
        }
        // remove
        temp = this.state.checkedList.filter(x => !checkedList.includes(x));
        if (temp.length > 0) {
            this.delChecked(this.props.name, temp);
        }
    }

    render() {
        return (
            <>
                <div className="site-checkbox-all-wrapper">
                    <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}>全选</Checkbox>
                </div>
                <CheckboxGroup
                    options={this.plainOptions}
                    value={this.state.checkedList}
                    onChange={this.onChange} />
            </>
        );
    }
}

class CommonOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searcher: null
        }
    }

    componentWillMount = () => {
        loadSearcher((searcher) => {
            this.setState({ searcher });
        });
    }

    addChecked = (groupName, add) => {
        add.forEach(name => {
            addSearcher(groupName, name, search_website[groupName][name]);
        });
    }

    delChecked = (groupName, del) => {
        del.forEach(name => {
            delSearcher(groupName, name);
        });
    }

    render() {
        return (
            <>
                {this.state.searcher === null ?
                    <div>Loading</div>
                    :
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={Object.keys(search_website)}
                        renderItem={item => (
                            <List.Item>
                                <Card title={item}>
                                    <CheckGroup
                                        plainOptions={Object.keys(search_website[item])}
                                        name={item}
                                        addChecked={this.addChecked}
                                        delChecked={this.delChecked}
                                        checkedList={item in this.state.searcher ? Object.keys(this.state.searcher[item]) : []} />
                                </Card>
                            </List.Item>
                        )}
                    />
                }
            </>
        );
    }
};

export default CommonOption;