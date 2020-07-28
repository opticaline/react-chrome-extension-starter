const services = {
    "register_searcher": function (args, sender, sendResponse) {
        if (Object.keys(args).length > 0) {
            createMenuItem(args.groupName, args.name, args.info);
            // add to storage
            chrome.storage.sync.set({ "searcher": coordinator });
        }
        return false;
    },
    "unregister_searcher": function (args, sender, sendResponse) {
        if (Object.keys(args).length > 0) {
            removeMenuItem(args.groupName, args.name);
            // del to storage
            chrome.storage.sync.set({ "searcher": coordinator });
        }
        return false;
    },
    "load_searcher": function (args, sender, sendResponse) {
        getRegisterdSearcher((v) => sendResponse(v));
        return true;
    },
    "load_custom": function (args, sender, sendResponse) {
        getCustom((values) => sendResponse(values));
        return true;
    },
    "custom_create": function (args, sender, sendResponse) {
        chrome.storage.sync.get("custom", function (items) {
            const temp = items.custom || {};
            const form = args[0];
            temp[form.name] = { enabled: true, ...form };
            createMenuItem("Custom", form.name, form);
            chrome.storage.sync.set({ "custom": temp });
        });
        return false;
    },
    "custom_delete": function (args, sender, sendResponse) {
        chrome.storage.sync.get("custom", function (items) {
            const temp = items.custom || {};
            const name = args[0];
            delete temp[name];
            removeMenuItem("Custom", name);
            chrome.storage.sync.set({ "custom": temp });
        });
        return false;
    },
    "custom_enable": function (args, sender, sendResponse) {
        chrome.storage.sync.get("custom", function (items) {
            const temp = items.custom || {};
            const names = args[0];
            names.forEach(name => {
                if (name in temp) {
                    temp[name].enabled = true;
                    createMenuItem("Custom", name, temp[name]);
                }
            });
            chrome.storage.sync.set({ "custom": temp });
        });
        return false;
    },
    "custom_disable": function (args, sender, sendResponse) {
        chrome.storage.sync.get("custom", function (items) {
            const temp = items.custom || {};
            const names = args[0];
            names.forEach(name => {
                if (name in temp) {
                    temp[name].enabled = false;
                    removeMenuItem("Custom", name);
                    chrome.storage.sync.set({ "custom": temp });
                }
            });
        });
        return false;
    },
};

const coordinator = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (const key in request) {
        if (request.hasOwnProperty(key)) {
            if (key in services) {
                const args = request[key];
                return services[key](args, sender, sendResponse);
            } else {
                console.error("Can't found service!", key);
            }
        }
    }
});

function openSearchWebsite(info, tab) {
    const tmp = info["menuItemId"].split("/");
    const options = coordinator[tmp[0]][tmp[1]];
    const word = info["selectionText"];
    const link = options["link"].replace("{word}", word);
    chrome.tabs.create({ url: link });
};

chrome.contextMenus.onClicked.addListener(openSearchWebsite);

function getCustom(callback) {
    chrome.storage.sync.get("custom", function (items) {
        const temp = items.custom || {};
        callback({
            customSearchers: Object.keys(temp).map((k) => { return { name: k, ...temp[k] } }),
            enabled: Object.keys(temp).filter((k) => temp[k].enabled).map((k) => k),
        });
    });
}

function getRegisterdSearcher(callback) {
    chrome.storage.sync.get("searcher", function (items) {
        callback(items.searcher || {});
    });
}

function createMenuItem(groupName, name, info) {
    if (!(groupName in coordinator)) {
        chrome.contextMenus.create({
            "title": groupName, "contexts": ["selection"],
            "id": groupName
        });
        coordinator[groupName] = {};
    }
    if (!(name in coordinator[groupName])) {
        chrome.contextMenus.create({
            "title": name, "contexts": ["selection"],
            "parentId": groupName, "id": groupName + "/" + name,
        });
        coordinator[groupName][name] = info;
    }
}

function removeMenuItem(groupName, name) {
    chrome.contextMenus.remove(groupName + "/" + name);
    delete coordinator[groupName][name];
    if (Object.keys(coordinator[groupName]).length == 0) {
        chrome.contextMenus.remove(groupName);
        delete coordinator[groupName];
    }
}

chrome.runtime.onInstalled.addListener(function () {
    getRegisterdSearcher((searcher) => {
        for (const groupName in searcher) {
            if (searcher.hasOwnProperty(groupName)) {
                const group = searcher[groupName];
                for (const name in group) {
                    if (group.hasOwnProperty(name)) {
                        const info = group[name];
                        createMenuItem(groupName, name, info);
                    }
                }
            }
        }
    });
    // get custom
    chrome.storage.sync.get("custom", function (items) {
        const temp = items.custom || {};
        Object.keys(temp).filter((k) => temp[k].enabled).forEach((k) => {
            createMenuItem("Custom", k, temp[k]);
        });
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
    chrome.runtime.openOptionsPage();
});
