/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './product.html';
import SinglePage from '../../../component/SinglePage/SinglePage';
import store, { getCategoryDic,getLabelDic } from '../common/store';
import doRequest from '../../../util/lib/doRequest';
import Table from '../../../component/table/table';
import AutoSearch from '../../../component/autoSearch/autoSearch';
import DropDown from '../../../component/dropDown/dropdown';
import message from '../../../component/message/message';
import CheckDrop from '../../../component/checkDrop/checkDrop';
import toHtmlStr from '../../../util/lib/toHtmlStr';
import format from '../../../util/lib/format';
import { emitter ,imgPath, imgViewer, formatPrice } from '../../page/common/public';
import Pagination from '../../../component/pagination/pagination';

import './product.less';

const colors = [ '#ffa9a570','#4a8afa54','#77cb5254' ];

const PAGESIZE = 10;
export default class ProductPage extends SinglePage{
    constructor(){
        super();
        this.id = 'ProductPage';
        this.docTitle = '商品管理';
        this.html = htmlStr;

        this.condition = {
            productName:'',
            productCode:'',
            styleCode:'',
            purchasePriceBegin:'',
            purchasePriceEnd:'',
            channelName:'',
            brandName:'',
            categoryId:'',
            labelFilters:[]
        };

        this.pageNum = 1;
    }

    _reset =()=> {
        this.condition = {
            productName:'',
            productCode:'',
            styleCode:'',
            purchasePriceBegin:'',
            purchasePriceEnd:'',
            channelName:'',
            brandName:'',
            categoryId:'',
            labelFilters:[]
        };
    };

    _init =()=>{
        this.privilegePromise.then(()=>{
            this._getList(1);
        });
        if(!store.getCategoryPromise){
            store.getCategoryPromise = getCategoryDic();
        }
        if(!store.getLabelPromise){
            store.getLabelPromise = getLabelDic();
        }
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.show-more',function () {
            $(this).toggleClass('open');
            const _open = $(this).hasClass('open');
            const _p = that.pager.find('.condition-toggle').toggleClass('open',_open);
            if(_open){
                setTimeout(()=>{
                    _p.addClass('not-hidden');
                },300)
            }else {
                _p.removeClass('not-hidden');
            }
        }).on('click','.search-btn',function () {
            that.condition.styleCode = that.pager.find('input[name="styleCode"]').val().trim();
            that.condition.purchasePriceBegin = that.pager.find('input[name="purchasePriceBegin"]').val().trim();
            that.condition.purchasePriceEnd = that.pager.find('input[name="purchasePriceEnd"]').val().trim();
            that.condition.channelName = that.pager.find('input[name="channelName"]').val().trim();
            that.condition.brandName = that.pager.find('input[name="brandName"]').val().trim();
            that._getList(1,'reset');
        }).on('blur','input[name="purchasePriceBegin"]',function () {
            const val = $(this).val();
            const n_val = that.pager.find('input[name="purchasePriceEnd"]').val();
            if(val && val<0){
                message({ msg:'起始价格不能小于0' });
                $(this).val('').focus()
            }
            if(n_val && val && val-0 > n_val-0){
                message({ msg:'起始价格不能大于结束价格' });
                $(this).val('').focus()
            }
        }).on('blur','input[name="purchasePriceEnd"]',function () {
            const val = $(this).val();
            const p_val = that.pager.find('input[name="purchasePriceBegin"]').val();
            if(val && val<0){
                message({ msg:'结束价格不能小于0' });
                $(this).val('').focus()
            }
            if(p_val && val && val-0 < p_val-0){
                message({ msg:'结束价格不能小于其实价格' });
                $(this).val('').focus()
            }
        }).on('click','.reset-btn',function () {
            that._reset();
            that.categorySelect.reset(false);
            that.labelCheck.reset();
            that.pager.find('input').val('');
            that._getList(1,'reset');
        }).on('click','.to-detail',function () {
            const row = that.table.getRowData($(this).data('index'));
            that.router.push({
                page:'product-info',
                state:{
                    id:row.productBasicInfo.id
                }
            })
        }).on('click','.view-img',function () {
            const row = that.table.getRowData($(this).data('index'));
            let imgs = row.productBasicInfo.images?row.productBasicInfo.images.split(','):[];
            if(_DEV_==='dev'){
                imgs = imgs.map(v=> imgPath+v);
            }
            if(imgs.length){
                imgViewer.show(imgs);
            }
        })
    };

    _getList =(current)=>{
        doRequest({
            url:`product/listAllInfo`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                ...this.condition,
                searchPage:{
                    pageIndex:current-1,
                    pageSize:PAGESIZE
                },
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    const list = (data.data.searchPage.pageData || []).map(v=>{
                        v.suggestSalePrice = v.suggestSalePrice || {};
                        v.rankPriceList = v.rankPriceList.sort((a,b)=>{
                            return a.rankAmount - b.rankAmount
                        });
                        return v;
                    });
                    this.table.setData({
                        dataSource:list
                    });
                    this.pagination.setPageData({
                        current,
                        total:data.data.searchPage.totalRecord
                    })
                }else {
                    this.table.setData({
                        dataSource:[]
                    });
                }
            }
        })
    };

    _initComponent =()=> {
        new AutoSearch({
            input:this.pager.find('input[name="name"]'),
            fn:val=>{
                this.condition.productName = val;
                this._getList(1,'reset');
            }
        });
        new AutoSearch({
            input:this.pager.find('input[name="productNo"]'),
            fn:val=>{
                this.condition.productCode = val;
                this._getList(1,'reset');
            }
        });

        this.categorySelect = new DropDown({
            obj:this.pager.find('.category-select'),
            renderLi:row=>row.name,
            placeholder:'选择类目',
            list:store.categoryDic?[{ name:'不限',id:'' },...store.categoryDic]:[],
            onSelectChange:current=>{
                this.condition.categoryId = current?current.id:'';
            },
            hasSearch:true,
            hasReset:true
        });
        emitter.on('categoryDicChange',list=> {
            this.categorySelect.renderList([{ name:'不限',id:'' },...list]);
        });

        this.labelCheck = new CheckDrop({
            obj:this.pager.find('.label-check'),
            renderLi:row=>row.name,
            placeholder:'选择标签',
            list:store.labelDic?store.labelDic:[],
            onSelectChange:indexs=>{
                this.condition.labelFilters = indexs.map(v=>store.labelDic[v].name);
            }
        });
        emitter.on('labelDicChange',list=> {
            this.labelCheck.renderList(list);
        });

        this.privilegePromise = new window.Promise(res=>{
            if(store.privilege){
                res();
            }else {
                emitter.on('privilege',function () {
                    res();
                })
            }
        });

        this.privilegePromise.then(()=>{
            const privilege = store.privilege;
            this.priceType = privilege.indexOf('ALL_PRICE')>-1?'ALL_PRICE':(privilege.indexOf('SALE_PRICE')>-1?'SALE_PRICE':'PURCHASE_PRICE');

            this.table = new Table({
                outer:this.pager.find('.product-table'),
                renderHeader:()=>{
                    return `<tr><th rowspan="2" width="55">序号</th><th rowspan="2" width="150">类目</th><th rowspan="2" width="60">图片</th><th rowspan="2" width="110">商品编码</th><th rowspan="2" width="220">商品名称</th>
<th rowspan="2" width="80">款式编码</th><th rowspan="2" width="80">规格型号</th><th rowspan="2" width="70">尺寸</th><th rowspan="2" width="140">品牌</th>
${ this.priceType !== 'SALE_PRICE'?'<th width="880" colspan="9" style="text-align: center">最近三次采购价格</th>':'' }
${ this.priceType !== 'PURCHASE_PRICE'?`<th rowspan="2" width="80">建议售价</th>`:'' }
${ this.priceType !== 'PURCHASE_PRICE'?'<th width="560" colspan="6" style="text-align: center">售货区间及建议销售价格</th>':'' }
${ this.priceType !== 'PURCHASE_PRICE'?'<th width="880" colspan="9" style="text-align: center">入库时间及折扣价格</th>':'' }
<th rowspan="2" width="80">审批价格</th><th rowspan="2" width="80">库存</th>
</tr>
<tr>${ this.priceType !== 'SALE_PRICE'?new Array(3).fill(1).map((v,i)=>{
    return `<th style="background-color:${ colors[i] }">采购时间</th><th style="background-color:${ colors[i] }">采购价</th><th style="background-color:${ colors[i] }">入库日期</th>`
                        }).join(''):'' }
${ this.priceType !== 'PURCHASE_PRICE'?new Array(3).fill(1).map((v,i)=>{
                            return `<th style="background-color:${ colors[i] }">售货区间</th><th style="background-color:${ colors[i] }">售价</th>`
                        }).join(''):'' }
${ this.priceType !== 'PURCHASE_PRICE'?new Array(3).fill(1).map((v,i)=>{
                            return `<th style="background-color:${ colors[i] }">入库日期</th><th style="background-color:${ colors[i] }">折扣</th><th style="background-color:${ colors[i] }">折扣价</th>`
                        }).join(''):'' }</tr>`
                },
                renderTrs:[
                    (row,index)=>PAGESIZE*(this.pageNum-1)+(index+1),
                    {
                        renderTd:row=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.productBasicInfo.categoryName)}</td>`
                    },
                    {
                        renderTd:(row,index)=>{
                            const imgs = row.productBasicInfo.images?row.productBasicInfo.images.split(','):[];
                            return `<td style="padding: 2px 5px 2px 15px">${imgs[0]? `<img class="view-img" data-index="${index}" style="width: 30px;height: 30px" src="${imgPath + imgs[0]}" >`:''}</td>`
                        }
                    },
                    row=>toHtmlStr(row.productBasicInfo.productNo),
                    {
                        renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px"><a class="btn btn-link to-detail" data-index="${index}">${toHtmlStr(row.productBasicInfo.name)}</a></td>`
                    },
                    row=>toHtmlStr(row.productBasicInfo.styleCode),
                    row=>toHtmlStr(row.productBasicInfo.specification),
                    row=>toHtmlStr(row.productBasicInfo.size),
                    {
                        renderTd:row=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.productBasicInfo.brand)}</td>`
                    },
                    ...(()=> {
                        if(this.priceType !== 'SALE_PRICE'){
                            return (()=>{
                                return new Array(3).fill(1).map((v2,i2)=>{
                                    return [
                                        row=>{
                                            const latestPurchasePriceList = row.latestPurchasePriceList || [];
                                            const _row = latestPurchasePriceList[i2] || {};
                                            return format(_row.purchaseDate)
                                        },
                                        {
                                            renderTd:row=>{
                                                const latestPurchasePriceList = row.latestPurchasePriceList || [];
                                                const _row = latestPurchasePriceList[i2] || {};
                                                return `<td style="text-align: right;padding-right: 10px">${ formatPrice(_row.purchasePrice) }</td>`
                                            }
                                        },
                                        row=>{
                                            const latestPurchasePriceList = row.latestPurchasePriceList || [];
                                            const _row = latestPurchasePriceList[i2] || {};
                                            return format(_row.instoreDate)
                                        },
                                    ];
                                }).reduce((o,v)=>{
                                    o = [...o,...v];
                                    return o;
                                },[])
                            })()
                        }else {
                            return []
                        }
                    })(),
                    ...(()=> {
                        if(this.priceType !== 'PURCHASE_PRICE'){
                            return [
                                {
                                    renderTd:row=>{
                                        return `<td style="text-align: right;padding-right: 10px">${ formatPrice(row.suggestSalePrice.suggestPrice) }</td>`
                                    }
                                }
                            ]
                        }else {
                            return []
                        }
                    })(),
                    ...(()=> {
                        if(this.priceType !== 'PURCHASE_PRICE'){
                            return (()=>{
                                return new Array(3).fill(1).map((v2,i2)=>{
                                    return [
                                        {
                                            renderTd:row=>{
                                                const rankPriceList = row.rankPriceList || [];
                                                const _row = rankPriceList[i2] || {};
                                                return `<td style="text-align: right;padding-right: 10px">${ this._getRank(rankPriceList,i2) }</td>`
                                            }
                                        },
                                        {
                                            renderTd:row=>{
                                                const rankPriceList = row.rankPriceList || [];
                                                const _row = rankPriceList[i2] || {};
                                                return `<td style="text-align: right;padding-right: 10px">${ formatPrice(_row.rankPrice) }</td>`
                                            }
                                        }
                                    ];
                                }).reduce((o,v)=>{
                                    o = [...o,...v];
                                    return o;
                                },[])
                            })()
                        }else {
                            return []
                        }
                    })(),
                    ...(()=> {
                        if(this.priceType !== 'PURCHASE_PRICE'){
                            return (()=>{
                                return new Array(3).fill(1).map((v2,i2)=>{
                                    return [
                                        row=>{
                                            const discountPriceList = row.discountPriceList || [];
                                            const _row = discountPriceList[i2] || {};
                                            return format(_row.instoreDate)
                                        },
                                        {
                                            renderTd:row=>{
                                                const discountPriceList = row.discountPriceList || [];
                                                const _row = discountPriceList[i2] || {};
                                                return `<td style="text-align: right;padding-right: 10px">${ this._getDiscount(_row.discountRate) }</td>`
                                            }
                                        },
                                        {
                                            renderTd:row=>{
                                                const discountPriceList = row.discountPriceList || [];
                                                const _row = discountPriceList[i2] || {};
                                                const _price = row.suggestSalePrice.suggestPrice*_row.discountRate;
                                                return `<td style="text-align: right;padding-right: 10px">${ formatPrice(_price) }</td>`
                                            }
                                        }
                                    ];
                                }).reduce((o,v)=>{
                                    o = [...o,...v];
                                    return o;
                                },[])
                            })()
                        }else {
                            return []
                        }
                    })(),
                    {
                        renderTd:row=>{
                            return `<td style="text-align: right;padding-right: 10px">${ formatPrice(row.suggestSalePrice.auditPrice) }</td>`
                        }
                    },
                    {
                        renderTd:row=>{
                            return `<td style="text-align: right;padding-right: 10px">${ toHtmlStr(row.productBasicInfo.storageSize) }</td>`
                        }
                    }
                ],
                storage:true
            })
        });

        this.pagination = new Pagination({
            outer:this.pager.find('.pagination-outer'),
            current:this.pageNum,
            pageSize:PAGESIZE,
            isJump:true,
            loading:true,
            onChange:({ current })=>{
                this.pagination.toggleLoading();
                this.pageNum = current;
                this._getList(current);
            }
        })

    };

    _getRank =(row,index)=>{
        const p = row[index-1];
        const c = row[index];
        if(!c) return '';
        if(index === 0){
            return c.rankAmount+'以下'
        }
        if(index === row.length){
            return c.rankAmount+'以上'
        }
        return p.rankAmount+'-'+c.rankAmount
    };

    _getDiscount =(num)=>{
        if(num === undefined || num === null || num === '') return '';
        const _num = Math.round(num*1000)/100;
        if(isNaN(_num)) return '';
        return _num+'折';
    }
}