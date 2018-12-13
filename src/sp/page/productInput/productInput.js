/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './productInput.html';
import SinglePage from '../../../component/SinglePage/SinglePage';

import Table from '../../../component/table/table';
import AutoSearch from '../../../component/autoSearch/autoSearch';
import toHtmlStr from '../../../util/lib/toHtmlStr';
import doRequest from '../../../util/lib/doRequest';
import message from '../../../component/message/message';
import DropDown from '../../../component/dropDown/dropdown';
import notification from '../../../component/notification/notification';
import UploadFileModal from '../../../component/uploadFileModal/uploadFileModal';
import { imgPath, floatModal, imgViewer } from '../common/public';

import uploadFile from '../../../util/lib/uploadFile';

import './productInput.less';

const PAGESIZE = 10;
export default class ProductInputPage extends SinglePage{
    constructor(){
        super();
        this.id = 'productInputPage';
        this.docTitle = '价格录入';
        this.html = htmlStr;

        this.condition = {
            searchCode:'',
            hasPriceFilter:'all',
            hasDetailFilter:'all'
        };
    }

    _init =()=>{
        this._getList(1);
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.jump-to-basic',function () {
            that.router.push({
                page:'product-input-basic'
            })
        }).on('click','.upload-excel',function () {
            doRequest({
                url:'product/lastTaskStatus?t='+Date.now(),
                type:'post',
                success:data=>{
                    if(data.success && data.data.serviceEnable){
                        that.uploadFileModal.setData({
                            fn:({fd})=>{
                                uploadFile({
                                    url:'product/upload',
                                    fd,
                                    success:data=>{
                                        if(data.success){
                                            that.uploadFileModal.modalHide();
                                            notification({
                                                title:'批量导入成功',
                                                msg:'基本价格信息批量导入成功'
                                            })
                                        }else {
                                            message({
                                                msg:data.errorMsg || '文件上传失败，请稍后重试！'
                                            })
                                        }
                                    }
                                })
                            }
                        }).modalShow();
                    }else {
                        message({
                            type:'warning',
                            msg:'服务器当前正在处理一个批量文件，请耐心等待处理完成后再导入'
                        })
                    }
                }
            });
        }).on('click','.price-btn',function () {
            that.router.push({
                page:'product-price'
            })
        }).on('click','.detail-btn',function () {
            that.router.push({
                page:'product-detail'
            })
        }).on('click','.edit-item',function () {
            const row = that.table.getRowData($(this).data('index'));
            that.router.push({
                page:'product-input-basic',
                state:{
                    id:row.id
                }
            });
        }).on('click','.add-price',function () {
            const row = that.table.getRowData($(this).data('index'));
            that.router.push({
                page:'product-price',
                state:{
                    id:row.id
                }
            })
        }).on('click','.add-detail',function () {
            const row = that.table.getRowData($(this).data('index'));
            that.router.push({
                page:'product-detail',
                state:{
                    id:row.id
                }
            })
        }).on('click','.delete-item',function () {
            const row = that.table.getRowData($(this).data('index'));
            floatModal.show({
                obj:$(this),
                side:3,
                title:'确认删除该商品？',
                fn:()=>{
                    doRequest({
                        url:`product/deleteProduct/${row.id}`,
                        type:'post',
                        success:data=>{
                            if(data.success){
                                notification({
                                    title:'删除成功',
                                    msg:`${row.name} 商品成功删除`
                                })
                            }else {
                                message({
                                    msg:data.errorMsg || '商品删除失败'
                                })
                            }
                        }
                    })
                }
            });

        }).on('click','.to-detail',function () {
            const row = that.table.getRowData($(this).data('index'));
            that.router.push({
                page:'product-info',
                state:{
                    id:row.id
                }
            })
        }).on('click','.view-img',function () {
            const row = that.table.getRowData($(this).data('index'));
            let imgs = row.imagePaths[0]?row.imagePaths[0].split(','):[];
            if(_DEV_==='dev'){
                imgs = imgs.map(v=> imgPath+v);
            }
            if(imgs.length){
                imgViewer.show(imgs);
            }
        })
    };

    _getList =(current=1,type)=>{
        if(type === 'search'){
            current = 1;
        }
        if(type === 'refresh'){
            current = this.table.getPagination().current;
        }
        if(type === 'delete'){
            current = this.table.getPagination().current;
            if(this.table.getDataSource().length === 1){
                current--;
            }
            current = current || 1;
        }
        doRequest({
            url:`product/listProductBasic`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:current-1,
                    pageSize:PAGESIZE,
                },
                ...this.condition,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success && data.data && data.data.searchPage){
                    let list = data.data.searchPage.pageData || [];
                    this.table.setData({
                        dataSource:list,
                        pagination:{
                            current,
                            total:data.data.searchPage.totalRecord
                        },
                        conditionChange:!!type
                    })
                }else {
                    this.table.setData({
                        dataSource:[]
                    })
                }
            }
        });
    };

    _initComponent =()=> {
        new AutoSearch({
            input:this.pager.find('.keyword-c'),
            fn:val=>{
                this.condition.searchCode = val;
                this._getList(1,'search');
            }
        });

        this.priceSelect = new DropDown({
            obj:this.pager.find('.price-select'),
            renderLi:row=>row.name,
            list:[ { name:'不限',id:'all' },{ name:'已录入商品价格',id:'yes' },{ name:'未录入商品价格',id:'no' } ],
            onSelectChange:current=>{
                this.condition.hasPriceFilter = current?current.id:'all';
                this._getList(1,'search');
            },
            placeholder:'是否已录入商品价格',
            hasReset:true
        });

        this.detailSelect = new DropDown({
            obj:this.pager.find('.detail-select'),
            renderLi:row=>row.name,
            list:[ { name:'不限',id:'all' },{ name:'已录入详细介绍',id:'yes' },{ name:'未录入详细介绍',id:'no' } ],
            onSelectChange:current=>{
                this.condition.hasDetailFilter = current?current.id:'all';
                this._getList(1,'search');
            },
            placeholder:'是否已录入详细介绍',
            hasReset:true
        });
        this.table = new Table({
            outer:this.pager.find('.product-table2'),
            headers:[
                { name:'序号',width:55 },
                { name:'商品编码',width:100 },
                { name:'商品名称',width:190 },
                { name:'商品图片',width:80 },
                { name:'款式编码',width:80 },
                { name:'品牌',width:110 },
                { name:'类目',width:110 },
                { name:'规格型号',width:80 },
                { name:'尺寸',width:60 },
                { name:'库存',width:60 },
                { name:'季节',width:60 },
                { name:'年份',width:60 },
                { name:'是否录入价格',width:110 },
                { name:'是否录入详情',width:110 },
                { name:'操作',width:130 }
            ],
            renderTrs:[
                (row,index,pagination)=>pagination.pageSize*(pagination.current-1)+(index+1),
                row=>toHtmlStr(row.productNo),
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px"><a class="btn btn-link to-detail" data-index="${index}">${toHtmlStr(row.name)}</a></td>`
                },
                {
                    renderTd:(row,index)=>`<td style="padding: 0">${row.imagePaths.length? `<img class="view-img" data-index="${index}" style="width: 32px;height: 32px" src="${imgPath + row.imagePaths[0]}" >`:''}</td>`
                },
                row=>toHtmlStr(row.styleCode),
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.brand)}</td>`
                },
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.categoryName)}</td>`
                },
                row=>toHtmlStr(row.specification),
                row=>toHtmlStr(row.size),
                {
                    renderTd:row=>{
                        return `<td style="padding-right: 10px;text-align: right">${toHtmlStr(row.storageSize)}</td>`
                    }
                },
                row=>toHtmlStr(row.season),
                row=>toHtmlStr(row.productYear),
                (row,index)=>`<a data-index="${index}" class="btn btn-link add-price" style="color: ${row.hasPrices === 1?'#00b793':'#d42740'}">${row.hasPrices === 1?'已录入':'未录入'}</a>`,
                (row,index)=>`<a data-index="${index}" class="btn btn-link add-detail" style="color: ${row.hasDetail === 1?'#00b793':'#d42740'}">${row.hasDetail === 1?'已录入':'未录入'}</a>`,
                (row,index)=>`<a data-index="${index}" class="btn btn-link edit-item" style="margin-right: 5px"><i class="fa fa-pencil-square-o"></i>编辑</a><a data-index="${index}" class="btn btn-link delete-btn delete-item"><i class="fa fa-trash-o"></i>删除</a>`
            ],
            pagination:{
                pageSize:PAGESIZE,
                show:true,
                current:1,
                onChange:({current})=>{
                    this._getList(current)
                },
                isJump:true
            },
            emptyMsg:'没有符合条件的商品'
        });

        this.uploadFileModal = new UploadFileModal({
            title:'基本信息批量导入',
            fileName:'upload'
        })

    }

}