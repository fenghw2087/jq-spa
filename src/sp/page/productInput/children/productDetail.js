/**
 * Created by Administrator on 2018/8/18.
 */
import htmlStr from './productDetail.html';
import SinglePage from '../../../../component/SinglePage/SinglePage';

import doRequest from '../../../../util/lib/doRequest';
import toHtmlStr from '../../../../util/lib/toHtmlStr';
import message from '../../../../component/message/message';
import notification from '../../../../component/notification/notification';
import Table from '../../../../component/table/table';

import { imgPath, editerDefault, confirmModal, imgViewer }  from '../../common/public';
import { chooseModal } from './common';

export default class ProductDetailPage extends SinglePage{
    constructor(){
        super();
        this.id = 'productDetailPage';
        this.docTitle = '商品详情录入';
        this.html = htmlStr;

        this.data = {
            productList:[]
        };
    }

    _init =()=>{
        this._reset();
        if(this.state.id){
            this._getBasic();
            this._getDetail(this.state.id);
        }
    };

    _getBasic =()=> {
        doRequest({
            url:`product/getBasic/${this.state.id}`,
            type:'post',
            success:data=>{
                if(data.success){
                    this.data.productList.push(data.data);
                    this.productTable.setData({
                        dataSource:this.data.productList
                    })
                }
            }
        })
    };

    _reset =()=> {
        this.data = {
            productList:[]
        };
        this.productTable.setData({
            dataSource:[]
        });
        this.editor && this.editor.setData(editerDefault)
    };

    _checkData =()=> {

        return true;
    };

    _getDetail =(id)=> {
        if(!this.data.detail){
            doRequest({
                url:`product/detail/getByProductId/${ id || this.data.productList[0].id}`,
                type:'post',
                success:data=>{
                    if(data.success){
                        this.data.detail = data.data.detailInfo;
                        this.editor.setData(this.data.detail)
                    }
                }
            })
        }
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.ys-back-btn,.cancel-btn',function () {
            if(that.data.detail){
                confirmModal.setData({
                    title:'取消编辑',
                    msg:'你有信息未保存，是否返回列表页？',
                    confirmFn:()=>{
                        confirmModal.modalHide();
                        that.router.pop()
                    }
                }).modalShow();
            }else {
                that.router.pop()
            }
        }).on('click','.save-content',function () {
            const productIdList = that.data.productList.map(v=>v.id);
            if(!productIdList.length){
                return message({
                    msg:'请至少选择一条商品信息'
                })
            }
            const _content = that.editor.getData();
            if( _content === editerDefault ){
                return message({
                    msg:'请输入详情内容'
                })
            }
            doRequest({
                url:'product/details/addOrModify',
                type:'post',
                contentType:'application/json;charset=utf-8',
                data: JSON.stringify({
                    detailInfo:_content,
                    productIdList
                }),
                success:data=>{
                    if(data.success){
                        notification({
                            title:'编辑成功',
                            msg:'商品详情编辑成功'
                        });
                        that.router.pop();
                    }else {
                        message({
                            msg:data.errorMsg || '商品详情编辑失败'
                        })
                    }
                }
            })
        }).on('click','.open-product-modal',function () {
            //选择商品
            chooseModal.setData({
                fn:data=>{
                    chooseModal.modalHide();
                    if(that.data.productList.some(v=>v.id === data.id)){
                        return message({ msg:'该商品已添加到列表中' })
                    }
                    that.data.productList.push(data);
                    that.productTable.setData({
                        dataSource:that.data.productList
                    });
                    that._getDetail();
                }
            }).modalShow();
        }).on('click','.remove-product',function () {
            const index = $(this).data('index');
            that.data.productList.splice(index,1);
            that.productTable.setData({
                dataSource:that.data.productList
            });
        }).on('click','.view-img',function () {
            const row = that.productTable.getRowData($(this).data('index'));
            let imgs = row.imagePaths[0]?row.imagePaths[0].split(','):[];
            if(_DEV_==='dev'){
                imgs = imgs.map(v=> imgPath+v);
            }
            if(imgs.length){
                imgViewer.show(imgs);
            }
        })
    };


    _initComponent =()=> {
        window.DecoupledEditor
            .create( document.querySelector( '#editor' ), {
                language: 'zh-cn',
                ckfinder: {
                    uploadUrl: "/image/ckeditor/upload",
                },
                fontFamily: {
                    options: [
                        '默认, default',
                        '华文细黑,STXihei,SimHei',
                        '华文楷体,STKaiti,KaiTi',
                        '华文宋体,STSong,SimSun',
                        '华文仿宋,STFangsong,FangSong',
                        '苹方,PingFang SC',
                    ]
                },
            })
            .then( editor => {
                const toolbarContainer = document.querySelector( '#toolbar-container' );
                toolbarContainer.appendChild( editor.ui.view.toolbar.element );
                this.editor = editor;
            } )
            .catch( error => {
                console.error( error );
            } );

        this.productTable = new Table({
            outer:this.pager.find('.product-table3'),
            headers:[
                { name:'序号',width:45 },
                { name:'商品编码',width:90 },
                { name:'商品名称',width:170 },
                { name:'商品图片',width:80 },
                { name:'款式编码',width:80 },
                { name:'品牌',width:90 },
                { name:'类目',width:100 },
                { name:'规格型号',width:80 },
                { name:'尺寸',width:45 },
                { name:'库存',width:45 },
                { name:'操作',width:60 }
            ],
            dataSource:[],
            renderTrs:[
                (row,index)=>(index+1),
                row=>toHtmlStr(row.productNo),
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.name)}</td>`
                },
                {
                    renderTd:(row,index)=>`<td style="padding: 0">${row.imagePaths.length? `<img class="view-img" data-index="${index}" style="width: 32px;height: 32px" src="${imgPath + row.imagePaths[0].split(',')[0]}" >`:''}</td>`
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
                    renderTd:(row,index)=>`<td style="text-align: right;padding-right: 15px">${toHtmlStr(row.storageSize)}</td>`
                },
                (row,index)=>`<a data-index="${index}" class="btn btn-link remove-product">移除</a>`
            ],
            renderEmpty:()=>''
        })
    }

}