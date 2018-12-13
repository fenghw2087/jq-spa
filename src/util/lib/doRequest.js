import $ from 'jquery';

/**
 * 请求
 * @param options
 * @returns {*}
 */
const doRequest = (options) => {
    if(_DEV_ === 'dev' && options.url && options.url[0] !== '/' && options.url.indexOf('http')){
        options.url = `/api/${options.url}`
    }
    if(options.url && options.url[0] !== '/' && options.url.indexOf('http')) options.url = window.basePath+options.url;;
    return $.ajax({
        ...options,
        success:data=>{
            if(data.errorCode === 10002002){
                localStorage.removeItem('islogin');
                if(!localStorage.getItem('relogin')){
                    window.location.href = window.basePath;
                    localStorage.setItem('relogin',1);
                }
            }else {
                localStorage.removeItem('relogin');
                window.localStorage.removeItem('privilege');
            }
            typeof options.success === 'function' && options.success(data);
        }
    });
};

export default doRequest;
