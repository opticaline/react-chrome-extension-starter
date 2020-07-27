/* global chrome */
const addSearcher = (groupName, name, info) => {
    chrome.runtime.sendMessage({
        register_searcher: {
            groupName: groupName, name: name, info: info
        }
    });
};

const delSearcher = (groupName, name) => {
    chrome.runtime.sendMessage({
        unregister_searcher: {
            groupName: groupName, name: name
        }
    });
};

const loadSearcher = (f) => {
    chrome.runtime.sendMessage({
        load_searcher: {}
    }, f);
};

const loadCustom = (f) => {
    chrome.runtime.sendMessage({
        load_custom: {}
    }, (values) => f(values.customSearchers || [], values.enabled || []));
};

const custom = {
    create: function () {
        chrome.runtime.sendMessage({ custom_create: arguments });
    },
    delete: function () {
        chrome.runtime.sendMessage({ custom_delete: arguments });
    },
    enable: function () {
        chrome.runtime.sendMessage({ custom_enable: arguments });
    },
    disable: function () {
        chrome.runtime.sendMessage({ custom_disable: arguments });
    },
};

export { addSearcher, delSearcher, loadSearcher, loadCustom, custom };