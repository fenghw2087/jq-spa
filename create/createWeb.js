const pages = require('../config/web-file');

const createPage = require('./lib/createPage');

pages.forEach((v)=>{
    const _params = 'web/'+v;
    console.log(`----start create ${_params} page----`);
    createPage(_params);
});