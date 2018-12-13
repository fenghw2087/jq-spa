/**
 * Created by Administrator on 2018/8/25.
 */
import CommonModal from '../../../../component/commonModal2/commonModal2';
import $ from "jquery";

import YsModel from '../../../../component/ysModel/ysModel';
import doRequest from '../../../../util/lib/doRequest';
import message from '../../../../component/message/message';
import AutoComplete from '../../../../component/autoComplete/autoComplete';

const MODAL_ID = 'chooseChannelModal';
export default class ChooseChannelModal extends CommonModal {
    constructor({
        title = '选择进货渠道', confirmFn = () => {
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
        this.model = new YsModel({ controller:'channel' });
        this.ac = new AutoComplete({
            input:this.modal.find('[name="channel-no"]'),
            getData:(val)=>{
                return doRequest({
                    url:'channel/getChannelNoHint',
                    type:'post',
                    contentType:'application/json;charset=utf-8',
                    data:val
                })
            },
            formatList:data=>data.data || [],
            keyTigger:false,
            renderLi:row=>row,
            onSelect:current=>{
                this._getChannel(current)
            }
        })
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="flexbox aic" style="margin-bottom: 20px;margin-top: 40px">
        <div style="width: 5em;text-align: right;margin-right: 20px;color: #999">渠道编码</div>
        <div class="flex1"><input class="form-control" name="channel-no" placeholder="输入渠道编码" /></div>
        <button style="margin-left: 20px" class="btn btn-ys-default search-btn"><i class="fa fa-search"></i>查询</button>
    </div>
    <div class="result-c" style="text-align: center;color: red"></div>
    <div class="detail-c" style="margin-top: 20px" ys-controller="channel">
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px; text-align: right;color: #999">渠道名称</div><div ys-bind="name"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">联络人</div><div ys-bind="contactorName"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">手机</div><div ys-bind="contactorPhone"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">微信</div><div ys-bind="contactorWechat"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">QQ</div><div ys-bind="contactorQq"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">邮箱</div><div ys-bind="contactorEmail"></div>
        </div>
        <div class="flexbox aic" style="margin-bottom: 15px">
            <div style="width: 5em;margin-right: 20px;text-align: right;color: #999">地址</div><div ys-bind="contactorAddress"></div>
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
            const cn = that.modal.find('input[name="channel-no"]').val().trim();
            if(!cn){
                return message({
                    msg:'请输入渠道编码后再搜索'
                })
            }
            that._getChannel(cn);
        });
    }

    _getChannel=(cn)=>{
        doRequest({
            url:'channel/get',
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