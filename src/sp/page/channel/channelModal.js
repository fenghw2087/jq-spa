/**
 * Created by Administrator on 2018/7/30.
 */
import CommonModal from '../../../component/commonModal2/commonModal2';
import $ from "jquery";
import message from '../../../component/message/message';

import DropDown from '../../../component/dropDown/dropdown';

import * as DataCheck from '../../../util/lib/check';

import { emitter } from '../common/public';
import store, { getChannelManagerList } from '../common/store';

const MODAL_ID = 'channelModal';
export default class ChannelModal extends CommonModal {
    constructor({
        title = '添加渠道', confirmFn = () => {
    }
    }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('ChannelModal param confirmFn must be a function');

        this.data = {};

        this._init();
    }

    setData =({ type='add',fn, data={} })=>{
        if(!store.getChannelManagerPromise){
            store.getChannelManagerPromise = getChannelManagerList();
        }
        this.setTitle( type === 'add'?'新增渠道':'编辑渠道' );
        this.setConfirmFn(fn);
        if(type === 'add'){
            this._reset();
        }else {
            this.modal.find('input[name="name"]').val(data.name);
            this.modal.find('input[name="channelNo"]').val(data.channelNo);
            this.modal.find('input[name="contactorName"]').val(data.contactorName);
            this.modal.find('input[name="contactorPhone"]').val(data.contactorPhone);
            this.modal.find('input[name="contactorAddress"]').val(data.contactorAddress);
            this.modal.find('input[name="contactorQq"]').val(data.contactorQq);
            this.modal.find('input[name="contactorWechat"]').val(data.contactorWechat);
            this.modal.find('input[name="contactorEmail"]').val(data.contactorEmail);
            const _index = this.jlSelect.getList().findIndex(v=>v.id === data.channelManagerId);
            this.data = data;
            this.jlSelect.setData(_index);
        }
        return this;
    };

    _reset =()=> {
        this.modal.find('input[type="text"],input[type="number"]').val('');
        this.jlSelect.reset();
        this.data = {};
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:20px;width: 600px;'
            }));
        }
        this.modal = $('#' + this.id);
        this.jlSelect = new DropDown({
            obj:this.modal.find('.jl-select'),
            renderLi:row=>row.name,
            onSelectChange:current=>{
                this.data.channelManagerId = current?current.id:'';
            },
            list:store.channelManagerDic || [],
            placeholder:'不限',
            dropup:true
        });
        emitter.on('channelManagerChange',list=>{
            this.jlSelect.renderList(list.slice(1));
        });
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">渠道名称：</div>
            <div class="modal-c-i-c"><input name="name" type="text" placeholder="请输入渠道名称" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">渠道编码：</div>
            <div class="modal-c-i-c"><input name="channelNo" type="text" placeholder="请输入渠道编码" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">联络人：</div>
            <div class="modal-c-i-c"><input name="contactorName" type="text" placeholder="输入联络人姓名" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">电话：</div>
            <div class="modal-c-i-c"><input name="contactorPhone" type="number" placeholder="输入联络人电话" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">地址：</div>
            <div class="modal-c-i-c"><input name="contactorAddress" type="text" placeholder="输入联络人地址" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t">QQ：</div>
            <div class="modal-c-i-c"><input name="contactorQq" type="number" placeholder="输入联络人QQ" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t">邮箱：</div>
            <div class="modal-c-i-c"><input name="contactorEmail" type="email" placeholder="输入联络人微信" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t">微信：</div>
            <div class="modal-c-i-c"><input name="contactorWechat" type="text" placeholder="输入联络人微信" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">渠道经理：</div>
            <div class="modal-c-i-c jl-select" style="max-width: 250px"></div>
        </div>
    </div>
    
</div>`;
    }

    _checkData =()=> {
        this.data.name = this.modal.find('input[name="name"]').val().trim();
        if(!this.data.name){
            message({
                msg:'渠道名称不能为空'
            });
            return false;
        }
        this.data.channelNo = this.modal.find('input[name="channelNo"]').val().trim();
        if(!this.data.channelNo){
            message({
                msg:'渠道编码不能为空'
            });
            return false;
        }
        this.data.contactorName = this.modal.find('input[name="contactorName"]').val().trim();
        if(!this.data.contactorName){
            message({
                msg:'联络人名称不能为空'
            });
            return false;
        }
        this.data.contactorPhone = this.modal.find('input[name="contactorPhone"]').val().trim();
        if(!this.data.contactorPhone){
            message({
                msg:'联络人电话不能为空'
            });
            return false;
        }
        if(!DataCheck.checkPhone(this.data.contactorPhone) && !DataCheck.checkTelPhone(this.data.contactorPhone)){
            message({
                msg:'请输入正确的手机号或电话'
            });
            return false;
        }
        this.data.contactorAddress = this.modal.find('input[name="contactorAddress"]').val().trim();
        if(!this.data.contactorAddress){
            message({
                msg:'联络人地址不能为空'
            });
            return false;
        }

        if(!this.data.channelManagerId){
            message({
                msg:'请选择渠道经理'
            });
            return false;
        }

        this.data.contactorQq = this.modal.find('input[name="contactorQq"]').val().trim();
        this.data.contactorWechat = this.modal.find('input[name="contactorWechat"]').val().trim();
        this.data.contactorEmail = this.modal.find('input[name="contactorEmail"]').val().trim();
        return true;
    };

    _bindEvent() {
        const that = this;
        this.modal.on('click', '.confirm-btn', function () {
            that._checkData() && that.confirmFn(that.data);
        });
    }

    _init() {
        this._renderHtml();

        this._bindEvent();
    }
}