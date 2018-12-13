/**
 * Created by Administrator on 2018/7/28.
 */
import CommonModal from '../../../component/commonModal2/commonModal2';
import $ from "jquery";
import Dropdown from "../../../component/dropDown/dropdown";
import message from '../../../component/message/message';
import hasChinese from '../../../util/lib/hasChinese';

import Radio from '../../../component/radio/radio';
import DragUpload from '../../../component/dragUpload/dragUpload';

import { requestServer , emitter } from '../common/public';
import store, { getCategoryDic } from '../common/store';

const MODAL_ID = 'categoryModal';
export default class CategoryModal extends CommonModal {
    constructor({
        title = '添加类目', confirmFn = () => {
    }
    }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('RoleModal param confirmFn must be a function');

        this.data = {};

        this._init();
    }

    setData =({ type='add',fn, data={} })=>{
        this.setTitle( type === 'add'?'新增类目':'编辑类目' );
        this.setConfirmFn(fn);
        if(!store.getCategoryPromise){
            store.getCategoryPromise = getCategoryDic();
        }
        if(type === 'add'){
            this._reset();
        }else {
            this.data = data;
            this.modal.find('input[name="name"]').val(this.data.name);
            this.modal.find('input[name="categoryNo"]').val(this.data.categoryNo);
            this.modal.find('.parent-select-o').toggle(this.data.parentCategoryId !== 0);
            store.getCategoryPromise().then(list=>{
                const p_index = list.findIndex(v=>v.id === this.data.parentCategoryId);
                p_index>-1?this.parentSelect.setData(p_index):this.parentSelect.reset(false);
            });
            this.radio.setChecked(this.data.parentCategoryId === 0?0:1);
            this.radio2.setChecked(this.data.showOnApp?0:1);
            this.uploadImgs.setImgs([ this.data.image ]);
        }
        return this;
    };

    _reset =()=> {
        this.modal.find('input[name="name"]').val('');
        this.modal.find('input[name="categoryNo"]').val('');
        this.parentSelect.reset(false);
        this.radio.reset();
        this.modal.find('.parent-select-o').hide();
        this.radio2.reset();
        this.uploadImgs.setImgs([]);
        this.data = {
            parentCategoryId:0
        };
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
        this.parentSelectOuter = this.modal.find('.parent-select-o');

        this.parentSelect = new Dropdown({
            obj:this.modal.find('.parent-select'),
            renderLi:row=>row.name,
            list:store.categoryDic||[],
            onSelectChange:current=>{
                this.data.parentCategoryId = current.id || -1;
            },
            hasSearch:true,
            menuStyle:'max-height:200px;overflow-y:auto'
        });
        emitter.on('categoryDicChange',list=> {
            this.parentSelect.renderList(list);
        });

        this.radio =  new Radio({
            obj:this.modal.find('.level-radio'),
            list:[
                { name:'是' },
                { name:'否' }
            ],
            onChange:index=>{
                this.data.parentCategoryId = index?0:-1;
                this.parentSelectOuter.toggle(index===1)
            }
        });

        this.uploadImgs = new DragUpload({
            outer:this.modal.find('.upload-imgs'),
            maxImgs:1,
            url:`image/category/upload`,
            fileName:'uploadFile',
            getImgPathByRequest:data=>{
                if(data.success){
                    return `${requestServer}${data.data}`
                }
            },
            compress:false
        });

        this.radio2 = new Radio({
            obj:this.modal.find('.showonapp-radio'),
            list:[
                { name:'是' },
                { name:'否' }
            ],
            onChange:index=>{
                this.data.showOnApp = index+1;
            }
        });
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">类目名称：</div>
            <div class="modal-c-i-c"><input name="name" type="text" placeholder="输入类目名称" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">类目编码：</div>
            <div class="modal-c-i-c"><input name="categoryNo" type="text" placeholder="输入类目编码" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">是否是一级类目：</div>
            <div class="modal-c-i-c level-radio"></div>
        </div>
        <div class="modal-c-i parent-select-o">
            <div class="modal-c-i-t is-must">选择父类目：</div>
            <div class="modal-c-i-c">
                <div class="parent-select"></div>
            </div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">上传类目图片：</div>
            <div class="modal-c-i-c" style="height: 100px">
                <div class="upload-imgs"></div>
            </div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">是否在APP首页显示：</div>
            <div class="modal-c-i-c showonapp-radio"></div>
        </div>
    </div>
</div>`;
    }

    _checkData =()=> {
        this.data.name = this.modal.find('input[name="name"]').val().trim();
        if(!this.data.name){
            message({
                msg:'请输入类目名称'
            });
            return false;
        }
        this.data.categoryNo = this.modal.find('input[name="categoryNo"]').val().trim();
        if(!this.data.categoryNo){
            message({
                msg:'请输入类目编号'
            });
            return false;
        }
        if( hasChinese(this.data.categoryNo)){
            message({
                msg:'类目编号不能包含汉字'
            });
            return false;
        }
        const _radio = this.radio.getChecked();
        if(_radio === -1){
            message({
                msg:'请选择是否一级类目'
            });
            return false;
        }
        if(_radio === 0){
            this.data.parentCategoryId = 0;
        }else {
            if(this.data.parentCategoryId<=0){
                message({
                    msg:'请选择父级类目'
                });
                return false;
            }
        }
        this.data.image = this.uploadImgs.getImgs()[0];
        if(!this.data.image){
            message({
                msg:'请上传类目图片'
            });
            return false;
        }
        const _radio2 = this.radio2.getChecked();
        if(_radio2 === -1){
            message({
                msg:'请选择是否APP首页显示'
            });
            return false;
        }
        this.data.showOnApp = _radio2 === 0;
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