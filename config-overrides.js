const multipleEntry = require('react-app-rewire-multiple-entry')([
    {
        entry: 'src/popup/index.js',
        outPath: '/popup.html'
    }
]);

module.exports = {
    webpack: function (config, env) {
        multipleEntry.addMultiEntry(config);
        return config;
    }
};