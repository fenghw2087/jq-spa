//不允许手动修改该文件的mode项和hashChunks项,仅允许修改filePath
        
module.exports = {
    mode:'dev',
    hashChunks:{},
    devConfig:{
        filePath:'http://127.0.0.1:10111/'
    },
    prodConfig:{
        filePath:'/'
    }
};