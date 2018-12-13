/**
 * Created by Administrator on 2018/8/12.
 */
import FloatModal from '../../../component/floatModal/floatModal';
import ConfirmModal from '../../../component/confirmModal2/confirmModal2';
import MutiImgViewer from '../../../component/mutiImgViewer/mutiImgViewer';
import * as DataParse from '../../../util/lib/dataParse';

import EventEmitter from 'events';

export const emitter = new EventEmitter();

export const floatModal =  new FloatModal({ noInput:true });

export const confirmModal = new ConfirmModal({});

// export const requestServer =  _DEV_?'http://47.74.129.24':'';
export const requestServer =  _DEV_?'':'';
export const imgPath = _DEV_ === 'dev'?'/api':'';

export const labelStatusList = [ { name:'不限',id:-1,value:'all' },{ name:'启用',id:1,value:'enable' },{ name:'停用',id:0,value:'disable' } ];

export const pageTail = _DEV_ === 'dev'?'':'.html';

const sy = new Date().getFullYear()+10;
export const yearList = new Array(15).fill(1).map((v,i)=>{
    return {
        name:sy-i+'年',
        year:sy-i
    }
});

export const editerDefault = `<p>请在此编辑商品详情</p>`;

export const imgViewer = new MutiImgViewer();

export const formatPrice =(num)=>{
    if(isNaN(num)) return '';
    return DataParse.toFixed(num,2);
};
