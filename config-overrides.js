const path = require('path');
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

/* module.exports = function override(config, env) {
    console.log(config);
    config.entry = {
        'pupop': './src/index.js',
    };
    // config.output = {
    //     path: path.resolve(__dirname, 'public'),
    //     filename: '[name].js'
    // }
    return config;
} */