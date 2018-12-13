/**
 * Created by Administrator on 2018/8/22.
 */
import CommonModal from '../../../component/commonModal2/commonModal2';
import $ from "jquery";
import message from '../../../component/message/message';


const MODAL_ID = 'changePsdModal';
export default class ChangePsdModal extends CommonModal {
    constructor({
        title = '修改密码', confirmFn = () => {
    }
    }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('ChangePsdModal param confirmFn must be a function');

        this.data = {};

        this._init();
    }

    setData =({ fn })=>{
        this.setConfirmFn(fn);
        this._reset();
        return this;
    };

    _reset =()=> {
        this.modal.find('input[name="originalPassword"]').val('');
        this.modal.find('input[name="password"]').val('');
        this.modal.find('input[name="password2"]').val('');
        this.data = {};
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:100px;width: 400px;left:100px'
            }));
        }
        this.modal = $('#' + this.id);
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">输入旧密码：</div>
            <div class="modal-c-i-c"><input name="originalPassword" type="password" placeholder="旧密码" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">输入新密码：</div>
            <div class="modal-c-i-c"><input name="password" type="password" placeholder="新密码" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">确认新密码：</div>
            <div class="modal-c-i-c"><input name="password2" type="password" placeholder="确认新密码" /></div>
        </div>
    </div>
</div>`;
    }

    _checkData =()=> {
        this.data.originalPassword = this.modal.find('input[name="originalPassword"]').val().trim();
        if(!this.data.originalPassword){
            message({
                msg:'请输入旧密码'
            });
            return false;
        }
        this.data.password = this.modal.find('input[name="password"]').val().trim();
        if(!this.data.password){
            message({
                msg:'请输入新密码'
            });
            return false;
        }
        this.data.password2 = this.modal.find('input[name="password2"]').val().trim();
        if(!this.data.password2){
            message({
                msg:'请再次输入新密码'
            });
            return false;
        }
        if(this.data.password !== this.data.password2){
            message({
                msg:'两次输入密码不一致'
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