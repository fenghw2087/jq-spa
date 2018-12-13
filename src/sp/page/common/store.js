/**
 * Created by Administrator on 2018/8/12.
 */
import doRequest from '../../../util/lib/doRequest';
import { emitter } from './public';

const store = {
    roleDic:null,
    channelManagerDic:null,
    categoryDic:null,
    labelDic:null
};

export const getRoleList =()=> {
    return new window.Promise(res=>{
        doRequest({
            url:'role/list',
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                pageIndex:0,
                pageSize:-1
            }),
            success:(data)=> {
                if(data.success){
                    store.roleDic = data.data.searchPage.pageData || [];
                    res(store.roleDic);
                    emitter.emit('roleDicChange',store.roleDic);
                }
            }
        })
    });
};

export const getChannelManagerList =()=> {
    return new window.Promise(res=>{
        doRequest({
            url:'user/listChannelManager',
            type:'post',
            success:data=>{
                store.channelManagerDic = [{ name:'不限',id:'' },...(data.data || [])];
                res(store.channelManagerDic);
                emitter.emit('channelManagerChange',store.channelManagerDic);
            }
        });
    });
};

export const getCategoryDic =()=> {
    return new window.Promise(res=>{
        doRequest({
            url:`category/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:0,
                    pageSize:-1,
                },
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    store.categoryDic = data.data.searchPage.pageData;
                    res(store.categoryDic);
                    emitter.emit('categoryDicChange',store.categoryDic);
                }
            }
        })
    });
};

export const getLabelDic =()=> {
    return new window.Promise(res=>{
        doRequest({
            url:`label/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:0,
                    pageSize:-1,
                },
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    store.labelDic = data.data.searchPage.pageData;
                    res(store.labelDic);
                    emitter.emit('labelDicChange',store.labelDic);
                }
            }
        })
    });
};

export default store;