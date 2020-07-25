const services = {
    "register_searcher": function (args, sender, sendResponse) {
        if (Object.keys(args).length > 0) {
            createMenuItem(args.groupName, args.name, args.info);
            // add to storage
            chrome.storage.sync.set({ "searcher": coordinator });
        }
    },
    "unregister_searcher": function (args, sender, sendResponse) {
        if (Object.keys(args).length > 0) {
            removeMenuItem(args.groupName, args.name);
            // del to storage
            chrome.storage.sync.set({ "searcher": coordinator });
        }
    },
    "load_searcher": function (args, sender, sendResponse) {
        sendResponse(coordinator);
    }
};

const coordinator = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (const key in request) {
        if (request.hasOwnProperty(key)) {
            if (key in services) {
                const args = request[key];
                services[key](args, sender, sendResponse);
                return true;
            } else {
                sendResponse({ "error": "[Service not found] " + key });
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
    })
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
