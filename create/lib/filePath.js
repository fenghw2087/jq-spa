const path = require('path');

const pathConfig = {
    'web':{
        template:{
            js:path.join(__dirname, '../template/web/js.template'),
            html:path.join(__dirname, '../template/web/html.template'),
            base:path.join(__dirname, '../template/web/base.jsp.template'),
            less:path.join(__dirname, '../template/web/less.template')
        },
        output: {
            js:path.join(__dirname, '../../src/web/pages'),
            template:'html',
            base:path.join(__dirname, '../../server/config'),
            html:path.join(__dirname, '../../server/views'),
            static:path.join(__dirname, '../../server/public')
        }
    },
    'com':{
        template:{
            js:path.join(__dirname, '../template/component/js.template'),
            less:path.join(__dirname, '../template/component/less.template'),
            html:''
        },
        output: {
            js:path.join(__dirname, '../../src/component')
        }
    }
};

module.exports = pathConfig;