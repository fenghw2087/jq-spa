/**
 * Created by Administrator on 2018/8/18.
 */
import htmlStr from './productPrice.html';
import SinglePage from '../../../../component/SinglePage/SinglePage';

import doRequest from '../../../../util/lib/doRequest';
import format from '../../../../util/lib/format';
import message from '../../../../component/message/message';
import DatePicker from '../../../../component/datePicker/datePicker';
import Table from '../../../../component/table/table';
import notification from '../../../../component/notification/notification';
import YsModel from '../../../../component/ysModel/ysModel';

import { imgPath, floatModal, confirmModal, imgViewer, formatPrice } from '../../common/public';
import ChooseChannelModal from './chooseChannelModal';
import AddPriceModal from './addPriceModal';
import { chooseModal } from './common';

export default class ProductPricePage extends SinglePage{
    constructor(){
        super();
        this.id = 'productPricePage';
        this.docTitle = '基本信息录入';
        this.html = htmlStr;

        this.data = {};
    }

    _init =()=>{
        this._reset();
        if(this.state.id){
            this.data.productId = this.state.id;
            this.pager.find('.open-product-modal').hide();
            this._changeSection(1);
            this._getDetail();
        }else {
            this._changeSection(1);
        }
    };

    _changeSection =(n)=> {
        this.pager.find('.step-item').removeClass('current').eq(n-1).addClass('current');
        this.pager.find('.step-section').removeClass('current').eq(n-1).addClass('current')
    };

    _reset =()=> {
        this.pager.find('.open-product-modal').show();
        this.pager.find('.basic-table').hide();
        this.pager.find('.btn-group1').hide();
        this.pager.find('.basic-img-c').empty();
        this.pager.find('.channel-c').empty();
        this.data = {};
    };

    _checkData =()=> {

        return true;
    };

    _getDetail =()=> {
        doRequest({
            url:`product/getAllInfo/${ this.data.productId }`,
            type:'post',
            success:data=>{
                if(data.success){
                    //进货价格回填
                    this.data.productPurchasePriceList = data.data.latestPurchasePriceList;
                    //如果有id，从详情中拿基本信息
                    if(this.state.id){
                        this.currentImgs = data.data.productBasicInfo.images?data.data.productBasicInfo.images.split(','):[];
                        this.model.setData(data.data.productBasicInfo);
                        this.pager.find('.basic-img-c').html( data.data.productBasicInfo.images.split(',').map((v,i)=>{
                            return `<img class="view-img" data-index="${ i }" src="${ imgPath + v }" />`
                        }) );
                        this.pager.find('.basic-table').show();
                        this.pager.find('.btn-group1').show();
                    }
                    const obj = data.data.latestPurchasePriceList.reduce((o,v)=>{
                        const channel = {
                            id:v.channelId,
                            name:v.channelName
                        };
                        if(!o[channel.id]) o[channel.id] = {
                            channel,
                            list:[]
                        };
                        o[channel.id].list.push(v);
                        return o;
                    },{});
                    Object.keys(obj).forEach(v=>{
                        this._addChannel(obj[v].channel,obj[v].list,true);
                    });

                    //售价回填
                    this.data.productDiscountPriceList = data.data.discountPriceList;
                    this.data.productSalePrice = data.data.suggestSalePrice;
                    this.data.productRankPriceList = data.data.rankPriceList;
                }
            }
        });
    };

    _addChannel =(channel,list=[],flag)=> {
        if(!this.data.productPurchasePriceObj){
            this.data.productPurchasePriceObj = {};
        }
        if(this.data.productPurchasePriceObj[channel.id]){
            return message({
                msg:'重复添加相同渠道'
            })
        }
        new window.Promise(res=>{
            if(channel.name){
                res()
            }else {
                doRequest({
                    url:`channel/get/${channel.id}`,
                    type:'post',
                    success:data=>{
                        if(data.success){
                            channel = data.data;
                            res()
                        }
                    }
                })
            }
        }).then(()=>{
            this.data.productPurchasePriceObj[channel.id] = {
                channel,
                list:list
            };
            this.pager.find('.channel-c').append( this._getChannelHtml(channel) );
            this.data.productPurchasePriceObj[channel.id].table = new Table({
                outer:this.pager.find(`[data-cid="${ channel.id }"] .channel-price-table`),
                headers:[
                    { name:'序号',width:100 },
                    { name:'采购价格（元）',width:200 },
                    { name:'进货日期',width:200 },
                    { name:'入库日期',width:200 },
                    { name:'操作',width:200 }
                ],
                dataSource:this.data.productPurchasePriceObj[channel.id].list,
                renderEmpty:()=>'',
                renderTrs:[
                    (row,index)=>index+1,
                    row=>formatPrice(row.purchasePrice),
                    row=>format(row.purchaseDate),
                    row=>format(row.instoreDate),
                    (row,index)=>`<a class="btn btn-link remove-price" data-id="${ channel.id+'-'+index }">移除此条价格</a>`
                ]
            });
            this.pager.find('.to-step3').toggle(!!Object.keys(this.data.productPurchasePriceObj).length);
            flag && setTimeout(()=>{
                this.data.productPurchasePriceObj[channel.id].list = list;
                this.data.productPurchasePriceObj[channel.id].table.setData({
                    dataSource:this.data.productPurchasePriceObj[channel.id].list
                })
            },0)
        });
    };

    _getChannelHtml =(channel)=>{
        return `<div class="channel-i-c" data-cid="${ channel.id }">
    <div class="flexbox aic channel-header">
        <div class="channel-index">${ Object.keys(this.data.productPurchasePriceObj).length }</div>
        <div class="channel-name flex1">${ channel.name }</div>
        <button class="btn btn-link remove-channel">移除该渠道</button>
    </div>
    <div class="flexbox aic channel-d-c">
        <div class="channel-item"><div class="channel-t">联络人:</div><div class="channel-v">${ channel.contactorName }</div></div>
        <div class="channel-item"><div class="channel-t">手机:</div><div class="channel-v">${ channel.contactorPhone }</div></div>
        <div class="channel-item"><div class="channel-t">QQ</div><div class="channel-v">${ channel.contactorQq }</div></div>
    </div>
    <div class="flexbox aic channel-d-c">
        <div class="channel-item"><div class="channel-t">微信:</div><div class="channel-v">${ channel.contactorWechat }</div></div>
        <div class="channel-item"><div class="channel-t">邮箱:</div><div class="channel-v">${ channel.contactorEmail }</div></div>
        <div class="channel-item"><div class="channel-t">地址:</div><div class="channel-v">${ channel.contactorAddress }</div></div>
    </div>
    <div class="channel-price-table" style="padding: 0 20px;margin: 20px 0 10px"></div>
    <button class="btn btn-ys-default add-new-price">添加一条采购记录</button>
</div>`
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.ys-back-btn,.cancel-btn',function () {
            if(that.data.productPurchasePriceObj ){
                confirmModal.setData({
                    title:'确认返回',
                    msg:'你有填写的信息未保存，是否返回？',
                    confirmFn:()=>{
                        confirmModal.modalHide();
                        that.router.pop()
                    }
                }).modalShow();
            }else {
                that.router.pop();
            }
        }).on('click','.back-step1',function () {
            if(that.data.productPurchasePriceObj ){
                confirmModal.setData({
                    title:'返回上一步',
                    msg:'你有填写的信息未保存，是否返回上一步？',
                    confirmFn:()=>{
                        confirmModal.modalHide();
                        that._changeSection(1);
                        delete that.data.productPurchasePriceList;
                        delete that.data.productPurchasePriceObj;
                        that.pager.find('.open-product-modal').toggle(!that.state.id);
                        that.pager.find('.btn-group1').show();
                        that.pager.find('.channel-c').empty();
                    }
                }).modalShow();
            }else {
                delete that.data.productPurchasePriceList;
                delete that.data.productPurchasePriceObj;
                that.pager.find('.open-product-modal').show();
                that.pager.find('.btn-group1').show();
                that.pager.find('.channel-c').empty();
                that._changeSection(1);
            }
        }).on('click','.to-step2',function () {
            that._changeSection(2);
            that.pager.find('.open-product-modal').hide();
            that.pager.find('.btn-group1').hide();
            //选择商品后，点击下一步请求详情
            !that.state.id && that._getDetail();
        }).on('click','.open-product-modal',function () {
            //选择商品
            chooseModal.setData({
                fn:data=>{
                    chooseModal.modalHide();
                    that.data.productId = data.id;
                    that.model.setData(data);
                    that.currentImgs = data.imagePaths[0]?data.imagePaths[0].split(','):[];
                    that.pager.find('.basic-img-c').html( data.imagePaths[0]?data.imagePaths[0].split(',').map((v,i)=>{
                        return `<img class="view-img" data-index="${i}" src="${ imgPath + v }" />`
                    }):'' );
                    that.pager.find('.basic-table').show();
                    that.pager.find('.btn-group1').show();
                }
            }).modalShow();
        }).on('click','.open-channel-modal',function () {
            that.chooseChannel.setData({
                fn:data=>{
                    that.chooseChannel.modalHide();
                    that._addChannel(data);
                }
            }).modalShow();
        }).on('click','.remove-price',function () {
            const indexs = $(this).data('id').split('-');
            const [ cid, index ] = indexs;
            that.data.productPurchasePriceObj[cid].list.splice(index,1);
            that.data.productPurchasePriceObj[cid].table.setData({
                dataSource:that.data.productPurchasePriceObj[cid].list
            })
        }).on('click','.add-new-price',function () {
            const cid = $(this).parents('.channel-i-c').data('cid');
            that.addPriceModal.setData({
                fn:data=>{
                    that.addPriceModal.modalHide();
                    that.data.productPurchasePriceObj[cid].list.push({...data});
                    that.data.productPurchasePriceObj[cid].table.setData({
                        dataSource:that.data.productPurchasePriceObj[cid].list
                    })
                }
            }).modalShow();
        }).on('click','.to-step3',function () {
            const obj = JSON.parse(JSON.stringify(that.data.productPurchasePriceObj));
            that.data.productPurchasePriceList = Object.keys(obj).reduce((o,v)=>{
                obj[v].list = obj[v].list.map(v2=>{
                    v2.channelId = obj[v].channel.id;
                    v2.productId = that.data.productId;
                    return v2;
                });
                return [...o, ...obj[v].list];
            },[]);
            if(!that.data.productPurchasePriceList.length){
                return message({
                    msg:'请至少添加一条进货记录'
                })
            }
            that._changeSection(3);
            //售价回填
            if(that.data.productSalePrice){
                that.pager.find('[name="auditPrice"]').val(that.data.productSalePrice.auditPrice);
                that.pager.find('[name="suggestPrice"]').val(that.data.productSalePrice.suggestPrice)
            }
            that.rankTable.setData({
                dataSource:that.data.productRankPriceList
            });
            that.discountTable.setData({
                dataSource:that.data.productDiscountPriceList
            });
        }).on('click','.remove-channel',function () {
            const parent = $(this).parents('.channel-i-c');
            const cid = parent.data('cid');
            floatModal.show({
                obj:$(this),
                side:3,
                title:'确认移除该渠道信息？',
                fn:()=>{
                    parent.remove();
                    delete that.data.productPurchasePriceObj[cid];
                    floatModal.hide();
                    that.pager.find('.to-step3').toggle(!!Object.keys(that.data.productPurchasePriceObj).length);
                }
            })
        }).on('click','.get-detail',function () {
            that._getDetail();
        }).on('click','.add-new-rank',function () {
            const rankAmountC = that.pager.find('[name="rankAmount"]');
            const rankPriceC = that.pager.find('[name="rankPrice"]');
            const rankAmount = parseInt(rankAmountC.val().trim());
            const rankPrice = rankPriceC.val().trim();
            if(rankAmount <= 0){
                return message({
                    msg:'分段数量必须为正整数'
                })
            }
            if(rankPrice<=0){
                return message({
                    msg:'分段售价必须为正数'
                })
            }
            if(!that.data.productRankPriceList) that.data.productRankPriceList = [];
            if(that.data.productRankPriceList.some(v=>v.rankAmount === rankAmount)){
                return message({
                    msg:'已有此数量的分段价格'
                })
            }
            that.data.productRankPriceList.push({
                rankAmount,rankPrice,productId:that.data.productId
            });
            that.data.productRankPriceList = that.data.productRankPriceList.sort((a,b)=>{
                return a.rankAmount - b.rankAmount
            });
            that.rankTable.setData({
                dataSource:that.data.productRankPriceList
            });
            rankAmountC.val('');
            rankPriceC.val('');
        }).on('click','.remove-rank',function () {
            const index = $(this).data('index');
            that.data.productRankPriceList.splice(index,1);
            that.rankTable.setData({
                dataSource:that.data.productRankPriceList
            });
        }).on('click','.add-discount',function () {
            const discountRateC = that.pager.find('[name="discountRate"]');
            const discountRate = discountRateC.val().trim();
            if(!that.data.discountInstoreDate){
                return message({
                    msg:'请选择入库时间'
                })
            }
            if(discountRate<=0 || discountRate>1){
                return message({
                    msg:'折扣必须为0-1之间的小数'
                })
            }
            if(!that.data.productDiscountPriceList) that.data.productDiscountPriceList = [];
            if(that.data.productDiscountPriceList.some(v=>v.instoreDate === that.data.discountInstoreDate)){
                return message({
                    msg:'已有该日期段的折扣价格'
                })
            }
            that.data.productDiscountPriceList.push({
                instoreDate:that.data.discountInstoreDate,discountRate,productId:that.data.productId
            });
            that.data.productDiscountPriceList = that.data.productDiscountPriceList.sort((a,b)=>{
                return new Date(a.instoreDate).getTime() - new Date(b.instoreDate).getTime()
            });
            that.discountTable.setData({
                dataSource:that.data.productDiscountPriceList
            });
            discountRateC.val('');
            that.instoreDatePicker.reset();
        }).on('click','.remove-discount',function () {
            const index = $(this).data('index');
            that.data.productDiscountPriceList.splice(index,1);
            that.discountTable.setData({
                dataSource:that.data.productDiscountPriceList
            });
        }).on('click','.back-step2',function () {
            that.data.productSalePrice = {
                auditPrice: that.pager.find('[name="auditPrice"]').val(),
                productId:that.data.productId,
                suggestPrice: that.pager.find('[name="suggestPrice"]').val()
            };
            if(that.data.productSalePrice.auditPrice || that.data.productSalePrice.suggestPrice || that.data.productDiscountPriceList || that.data.productRankPriceList){
                confirmModal.setData({
                    title:'返回上一步',
                    msg:'你有填写的信息未保存，是否返回上一步？',
                    confirmFn:()=>{
                        confirmModal.modalHide();
                        that._changeSection(2);
                        delete that.data.productSalePrice;
                        delete that.data.productDiscountPriceList;
                        delete that.data.productRankPriceList;
                    }
                }).modalShow();
            }else {
                that._changeSection(2);
                delete that.data.productSalePrice;
                delete that.data.productDiscountPriceList;
                delete that.data.productRankPriceList;
            }
        }).on('click','.save-all',function () {
            that.data.productSalePrice = {
                auditPrice: that.pager.find('[name="auditPrice"]').val(),
                productId:that.data.productId,
                suggestPrice: that.pager.find('[name="suggestPrice"]').val()
            };
            if(that.data.productSalePrice.suggestPrice <= 0){
                return message({
                    msg:'建议售价不能为空'
                })
            }
            const _data = {
                productId:that.data.productId,
                //折扣价格
                productDiscountPriceList: that.data.productDiscountPriceList || [],
                //采购价格
                productPurchasePriceList: that.data.productPurchasePriceList,
                productRankPriceList: that.data.productRankPriceList || [],
                productSalePrice: that.data.productSalePrice
            };
            doRequest({
                url:'product/price/add',
                type:'post',
                contentType:'application/json;charset=utf-8',
                data: JSON.stringify(_data),
                success:function (data) {
                    if(data.success){
                        notification({
                            title:'录入成功',
                            msg:'商品价格信息录入成功'
                        });
                        that.router.pop();
                    }else {
                        message({ msg:data.errorMsg || '商品价格信息录入失败' })
                    }
                }
            })
        }).on('click','.view-img',function () {
            let imgs = that.currentImgs;
            if(_DEV_==='dev'){
                imgs = imgs.map(v=> imgPath+v);
            }
            if(imgs.length){
                imgViewer.show(imgs,$(this).data('index'));
            }
        })
    };


    _initComponent =()=> {
        this.model = new YsModel({ controller:'basic' });
        this.chooseChannel = new ChooseChannelModal({});
        this.addPriceModal = new AddPriceModal({});

        this.rankTable = new Table({
            outer:this.pager.find(`.rank-table`),
            headers:[
                { name:'序号',width:100 },
                { name:'分段数量',width:300 },
                { name:'分段售价（元）',width:300 },
                { name:'操作',width:200 }
            ],
            dataSource:this.data.productRankPriceList || [],
            renderEmpty:()=>'',
            renderTrs:[
                (row,index)=>index+1,
                row=>row.rankAmount,
                row=>formatPrice(row.rankPrice),
                (row,index)=>`<a class="btn btn-link remove-rank" data-id="${ index }">移除此条分段价格</a>`
            ]
        });

        this.discountTable = new Table({
            outer:this.pager.find(`.discount-table`),
            headers:[
                { name:'序号',width:100 },
                { name:'入库时间',width:300 },
                { name:'折扣',width:300 },
                { name:'操作',width:200 }
            ],
            dataSource:this.data.productDiscountPriceList || [],
            renderEmpty:()=>'',
            renderTrs:[
                (row,index)=>index+1,
                row=>format(row.instoreDate),
                row=>row.discountRate,
                (row,index)=>`<a class="btn btn-link remove-discount" data-id="${ index }">移除此条折扣</a>`
            ]
        });

        this.instoreDatePicker = new DatePicker({
            input:this.pager.find('[name="instoreDate"]'),
            dropUp:true,
            onDateChange:date=>{
                this.data.discountInstoreDate = date;
            }
        })
    }

}