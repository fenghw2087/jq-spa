/**
 * Created by Administrator on 2018/7/28.
 */
import CommonModal from '../../../component/commonModal2/commonModal2';
import $ from "jquery";
import message from '../../../component/message/message';
import hasChinese from '../../../util/lib/hasChinese';

import Radio from '../../../component/radio/radio';
import onlyChinese from '../../../util/lib/onlyChinese';

import { labelStatusList } from '../common/public';

const MODAL_ID = 'tagModal';
export default class TagModal extends CommonModal {
    constructor({
        title = '添加标签', confirmFn = () => {
    }
    }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('TagModal param confirmFn must be a function');

        this.data = {};

        this._init();
    }

    setData =({ type='add',fn, data={} })=>{
        this.setTitle( type === 'add'?'新增标签':'编辑标签' );
        this.setConfirmFn(fn);
        if(type === 'add'){
            this._reset();
        }else {
            this.data = data;
            this.modal.find('input[name="name"]').val(this.data.name);
            this.modal.find('input[name="tagNo"]').val(this.data.labelNo);
            this.radio.setChecked(labelStatusList.findIndex(v=>v.id === this.data.enable)-1);
        }
        return this;
    };

    init =(type)=> {
        this.type = type;
        this.tplList = [];
        this._getTplData(true);

        this._getTplList();
    };

    _reset =()=> {
        this.modal.find('input[name="name"]').val('');
        this.modal.find('input[name="tagNo"]').val('');
        this.radio.reset();
        this.data = {};
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:100px;width: 600px;'
            }));
        }
        this.modal = $('#' + this.id);

        this.radio = new Radio({
            obj:this.modal.find('.status-radio'),
            list:labelStatusList.slice(1),
            onChange:(index,row)=>{
                this.data.enable = row.id;
            }
        });
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">标签名称：</div>
            <div class="modal-c-i-c"><input name="name" type="text" placeholder="输入4～6个汉字" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">标签编码：</div>
            <div class="modal-c-i-c"><input name="tagNo" type="text" placeholder="输入标签编码" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">标签状态：</div>
            <div class="modal-c-i-c status-radio"></div>
        </div>
    </div>
</div>`;
    }

    _checkData =()=> {
        this.data.name = this.modal.find('input[name="name"]').val().trim();
        if(!this.data.name){
            message({
                msg:'请输入标签名称'
            });
            return false;
        }
        // if(!onlyChinese(this.data.name) || this.data.name.length<4 || this.data.name.length>6 ){
        //     message({
        //         msg:'标签名称必须为4-6长度的汉字'
        //     });
        //     return false;
        // }
        this.data.labelNo = this.modal.find('input[name="tagNo"]').val().trim();
        if(!this.data.labelNo){
            message({
                msg:'请输入标签编号'
            });
            return false;
        }
        if( hasChinese(this.data.labelNo)){
            message({
                msg:'标签编号不能包含汉字'
            });
            return false;
        }
        if(this.data.enable < 0){
            message({
                msg:'请选择标签状态'
            });
            return false;
        }
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