/* global chrome */
const addSearcher = (groupName, name, info) => {
    chrome.runtime.sendMessage({
        register_searcher: {
            groupName: groupName, name: name, info: info
        }
    }, function (response) {
        console.log(response);
    });
};

const delSearcher = (groupName, name) => {
    chrome.runtime.sendMessage({
        unregister_searcher: {
            groupName: groupName, name: name
        }
    }, function (response) {
        console.log(response);
    });
};

const loadSearcher = (f) => {
    chrome.runtime.sendMessage({
        load_searcher: {}
    }, f);
};

export { addSearcher, delSearcher, loadSearcher };