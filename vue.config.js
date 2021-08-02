module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/guileless-ui/',
    outputDir: process.env.NODE_ENV === 'production'
        ? __dirname+'/lib'
        : __dirname+'/demo',
    css: {
        extract: true
    },
};
