/**
 * Created by Administrator on 2018/8/25.
 */
import CommonModal from '../../../../component/commonModal2/commonModal2';
import $ from "jquery";

import message from '../../../../component/message/message';
import DatePicker from '../../../../component/datePicker/datePicker';

const MODAL_ID = 'addPriceModal';
export default class AddPriceModal extends CommonModal {
    constructor({
        title = '添加进货记录', confirmFn = () => {
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

    setData =({fn})=> {
        this.setConfirmFn(fn);
        this._reset();
        return this;
    };

    _reset =()=> {
        this.modal.find('[name="purchasePrice"]').val('');
        this.purchaseDate.reset();
        this.instoreDate.reset();
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
        this.purchaseDate = new DatePicker({
            input:this.modal.find('[name="purchaseDate"]'),
            onDateChange:date=>{
                this.data.purchaseDate = date;
                this.instoreDate.setStartDate(date);
            }
        });
        this.instoreDate = new DatePicker({
            input:this.modal.find('[name="instoreDate"]'),
            onDateChange:date=>{
                this.data.instoreDate = date;
                this.purchaseDate.setEndDate(date);
            },
            dropUp:true
        })
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">采购价格（元）：</div>
            <div class="modal-c-i-c"><input class="form-control" name="purchasePrice" type="number" placeholder="采购价格" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">进货日期：</div>
            <div class="modal-c-i-c"><input class="form-control" name="purchaseDate" type="text" placeholder="选择进货日期" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">入库日期：</div>
            <div class="modal-c-i-c"><input class="form-control" name="instoreDate" type="text" placeholder="选择入库日期" /></div>
        </div>
    </div>
</div>`;
    }

    _checkData =()=> {
        this.data.purchasePrice = this.modal.find('[name="purchasePrice"]').val();
        if(this.data.purchasePrice <=0){
            message({ msg:'进货价格必须为正数' });
            return false;
        }
        if(!this.data.purchaseDate){
            message({ msg:'请选择进货日期' });
            return false;
        }
        if(!this.data.instoreDate){
            message({ msg:'请选择入库日期' });
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