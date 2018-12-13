/**
 * Created by Administrator on 2018/8/26.
 */
import htmlStr from './productInfo.html';
import SinglePage from '../../../../component/SinglePage/SinglePage';

import Table from '../../../../component/table/table';
import format from '../../../../util/lib/format';
import doRequest from '../../../../util/lib/doRequest';
import YsModel from '../../../../component/ysModel/ysModel';
import { imgPath , imgViewer } from '../../common/public';


export default class ProductInfoPage extends SinglePage{
    constructor(){
        super();
        this.id = 'productInfoPage';
        this.docTitle = '商品预览';
        this.html = htmlStr;

        this.data = {};
    }

    _init =()=>{
        this._reset();
        this._getDetail();
    };

    _reset =()=> {
        this.model.reset();
        this.data = {};
        this.pager.find('.label-c').html('');
        this.pager.find('.basic-img-c').html('');
        this.pager.find('.channel-c').empty();
        this.rankTable.setData({
            dataSource:[]
        });
        this.discountTable.setData({
            dataSource:[]
        });
        this.pager.find('td[data-name="suggestPrice"]').text('');
        this.pager.find('td[data-name="auditPrice"]').text('');
    };

    _getDetail =()=> {
        doRequest({
            url:`product/getAllInfo/${ this.state.id }`,
            type:'post',
            success:data=>{
                if(data.success){
                    //进货价格回填
                    this.data.productPurchasePriceList = data.data.latestPurchasePriceList;
                    //渲染基本信息
                    this.model.setData(data.data.productBasicInfo);
                    this.data.productBasicInfo = data.data.productBasicInfo;
                    this.pager.find('.label-c').html(data.data.productBasicInfo.labels?data.data.productBasicInfo.labels.split(',').map(v=>{
                            return `<div class="label-tag">${ v }</div>`
                        }):'');

                    this.pager.find('.basic-img-c').html( data.data.productBasicInfo.images?data.data.productBasicInfo.images.split(',').map((v,i)=>{
                        return `<img class="view-img" data-index="${i}" src="${ imgPath + v }" />`
                    }):'' );

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
                    if(Object.keys(obj).length){
                        Object.keys(obj).forEach(v=>{
                            this._addChannel(obj[v].channel,obj[v].list);

                        });
                    }else {
                        this.pager.find('.channel-c').html(`<div class="flexbox aic jcc" style="color:#999">还未录入进货价格</div>`);
                    }

                    //售价回填
                    this.data.productDiscountPriceList = data.data.discountPriceList || [];
                    this.data.productSalePrice = data.data.suggestSalePrice || {};
                    this.data.productRankPriceList = data.data.rankPriceList || [];
                    this.rankTable.setData({
                        dataSource:this.data.productRankPriceList
                    });
                    this.discountTable.setData({
                        dataSource:this.data.productDiscountPriceList
                    });
                    this.pager.find('td[data-name="suggestPrice"]').text(this.data.productSalePrice.suggestPrice);
                    this.pager.find('td[data-name="auditPrice"]').text(this.data.productSalePrice.auditPrice);
                }
            }
        });
        doRequest({
            url:`product/detail/getByProductId/${ this.state.id }`,
            type:'post',
            success:data=>{
                if(data.success){
                    this.data.detail = data.data.detailInfo;
                    this.pager.find('.product-detail').html(data.data.detailInfo)
                }else {
                    this.pager.find('.product-detail').html(`<div class="flexbox aic jcc" style="color:#999">还未录入商品详细信息</div>`)
                }
            }
        })
    };

    _addChannel =(channel,list)=> {
        if(!this.data.productPurchasePriceObj){
            this.data.productPurchasePriceObj = {};
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
                list
            };
            this.pager.find('.channel-c').append( this._getChannelHtml(channel) );
            this.data.productPurchasePriceObj[channel.id].table = new Table({
                outer:this.pager.find(`[data-cid="${ channel.id }"] .channel-price-table`),
                headers:[
                    { name:'序号',width:100 },
                    { name:'采购价格（元）',width:200 },
                    { name:'进货日期',width:200 },
                    { name:'入库日期',width:200 }
                ],
                dataSource:this.data.productPurchasePriceObj[channel.id].list,
                renderEmpty:()=>'',
                renderTrs:[
                    (row,index)=>index+1,
                    row=>row.purchasePrice,
                    row=>format(row.purchaseDate),
                    row=>format(row.instoreDate)
                ]
            });
            setTimeout(()=>{
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
</div>`
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.jump-to-basic',function () {
            that.router.push({
                page:'product-input-basic'
            })
        }).on('click','.ys-back-btn, cancel-btn',function () {
            that.router.pop();
        }).on('click','.view-img',function () {
            let imgs = that.data.productBasicInfo.images?that.data.productBasicInfo.images.split(','):[];
            if(_DEV_==='dev'){
                imgs = imgs.map(v=> imgPath+v);
            }
            if(imgs.length){
                imgViewer.show(imgs,$(this).data('index'));
            }
        })
    };

    _initComponent =()=> {
        this.model = new YsModel({ controller:'basic2' });

        this.rankTable = new Table({
            outer:this.pager.find(`.rank-table`),
            headers:[
                { name:'序号',width:100 },
                { name:'分段数量',width:300 },
                { name:'分段售价（元）',width:300 }
            ],
            dataSource:this.data.productRankPriceList || [],
            renderEmpty:()=>`<div class="flexbox aic jcc" style="color:#999">还未录入分段价格</div>`,
            renderTrs:[
                (row,index)=>index+1,
                row=>row.rankAmount,
                row=>row.rankPrice
            ]
        });

        this.discountTable = new Table({
            outer:this.pager.find(`.discount-table`),
            headers:[
                { name:'序号',width:100 },
                { name:'入库时间',width:300 },
                { name:'折扣',width:300 }
            ],
            dataSource:this.data.productDiscountPriceList || [],
            renderEmpty:()=>`<div class="flexbox aic jcc" style="color:#999">还未录入折扣价格</div>`,
            renderTrs:[
                (row,index)=>index+1,
                row=>format(row.instoreDate),
                row=>row.discountRate
            ]
        });
    }

}