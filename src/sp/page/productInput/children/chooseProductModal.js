/**
 * Created by Administrator on 2018/8/16.
 */
import CommonModal from '../../../../component/commonModal2/commonModal2';
import $ from "jquery";

import YsModel from '../../../../component/ysModel/ysModel';
import doRequest from '../../../../util/lib/doRequest';
import message from '../../../../component/message/message';
import { imgPath, imgViewer } from '../../common/public';
import AutoComplete from '../../../../component/autoComplete/autoComplete';

const MODAL_ID = 'chooseProductModal';
export default class ChooseProductModal extends CommonModal {
    constructor({
        title = '导入类似商品', confirmFn = () => {
    }
    }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('AccountModal param confirmFn must be a function');

        this.data = {};

        this._init();
    }

    _reset =()=> {
        this.modal.find('input[type="text"],input[type="number"]').val('');
        this.model.reset();
        this.modal.find('.detail-c').hide();
        this.modal.find('.confirm-btn').hide();
    };

    setData =({fn})=>{
        this.setConfirmFn(fn);
        this._reset();
        return this;
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:50px;width: 500px;left:50px'
            }));
        }
        this.modal = $('#' + this.id);
        this.model = new YsModel({ controller:'product' });
        this.ac = new AutoComplete({
            input:this.modal.find('[name="product-no"]'),
            getData:(val)=>{
                return doRequest({
                    url:'product/getProductNoHint',
                    type:'post',
                    contentType:'application/json;charset=utf-8',
                    data:val
                })
            },
            formatList:data=>data.data || [],
            keyTigger:false,
            renderLi:row=>row,
            onSelect:current=>{
                this._getProduct(current)
            }
        })
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="flexbox aic" style="margin-bottom: 20px;margin-top: 40px">
        <div style="width: 5em;text-align: right;margin-right: 20px;color: #999">商品编码</div>
        <div class="flex1"><input class="form-control" name="product-no" placeholder="输入商品编码" /></div>
        <button style="margin-left: 20px" class="btn btn-ys-default search-btn"><i class="fa fa-search"></i>查询</button>
    </div>
    <div class="result-c" style="text-align: center;color: red"></div>
    <div class="detail-c" style="margin-top: 20px" ys-controller="product">
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px; text-align: right;color: #999">商品名称</div><div ys-bind="name"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">品牌</div><div ys-bind="brand"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">款式编码</div><div ys-bind="styleCode"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">类目</div><div ys-bind="categoryName"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">规格型号</div><div ys-bind="specification"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">尺码</div><div ys-bind="size"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">年份</div><div ys-bind="productYear"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">季节</div><div ys-bind="season"></div>
        </div>
        <div class="flexbox aifs">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">图片</div><div class="img-c"></div>
        </div>
    </div>
</div>`;
    }

    _checkData =()=> {

        return true;
    };

    _bindEvent() {
        const that = this;
        this.modal.on('click', '.confirm-btn', function () {
            that._checkData() && that.confirmFn(that.data);
        }).on('click','.search-btn',function () {
            const cn = that.modal.find('input[name="product-no"]').val().trim();
            if(!cn){
                return message({
                    msg:'请输入商品编码后再搜索'
                })
            }
            that._getProduct(cn);
        }).on('click','.view-img',function () {
            let imgs = that.data.imagePaths[0].split(',');
            if(_DEV_==='dev'){
                imgs = imgs.map(v=> imgPath+v);
            }
            if(imgs.length){
                imgViewer.show(imgs,$(this).data('index'));
            }
        });
    }

    _getProduct =(cn)=> {
        doRequest({
            url:'product/getBasicByProductNo',
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:cn,
            success:data=>{
                if(data.success){
                    this.modal.find('.result-c').text('');
                    this.modal.find('.detail-c').show();
                    this.data = data.data;
                    this.model.setData(data.data);
                    this.modal.find('.confirm-btn').show();
                    this.modal.find('.img-c').html(this.data.imagePaths[0]?this.data.imagePaths[0].split(',').map((v,i)=>{
                        return `<img class="view-img" data-index="${i}" src="${ imgPath + v}" style="width: 100px;height: 100px;margin-right: 10px" />`
                    }):'')
                }else {
                    this.modal.find('.detail-c').hide();
                    this.modal.find('.result-c').text('未找到商品信息，请重新查询');
                }
            }
        })
    };

    _init() {
        this._renderHtml();

        this._bindEvent();
    }
}