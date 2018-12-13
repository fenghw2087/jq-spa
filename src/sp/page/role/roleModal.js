/**
 * Created by Administrator on 2018/7/30.
 */
import CommonModal from '../../../component/commonModal2/commonModal2';
import $ from "jquery";
import message from '../../../component/message/message';

import Radio from '../../../component/radio/radio';
import Checks from '../../../component/checks/checks';

import doRequest from '../../../util/lib/doRequest';

const MODAL_ID = 'roleModal';
export default class RoleModal extends CommonModal {
    constructor({
        title = '添加角色', confirmFn = () => {
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
        this.setTitle( type === 'add'?'新增角色':'编辑角色' );
        this.setConfirmFn(fn);
        if(type === 'add'){
            this._reset();
        }else {
            this.data = data;
            this.modal.find('input[name="name"]').val(this.data.name);
            const _goodsType = this._getQX(data.privileges,'CATEGORY');
            this.data.goodsType = _goodsType[0]?_goodsType[0].id:'';
            if(this.data.goodsType){
                this.goodsRadio.setChecked(this.dic['商品权限'].findIndex(v=>v.id === this.data.goodsType));
            }

            const _priceType = this._getQX(data.privileges,'PRICE');
            this.data.priceType = _priceType[0]?_priceType[0].id:'';
            if(this.data.priceType){
                this.priceRadio.setChecked(this.dic['价格权限'].findIndex(v=>v.id === this.data.priceType));
            }

            this.data.pageType = this._getQX(data.privileges,'MANAGE','QUERY');
            this.pageCheck.setData(this.data.pageType.map(v=>v.id).join(','));
        }
        return this;
    };

    _getQX =(list,type, type2=121212)=> {
        return list.filter(v=>{
            return v.code.indexOf(`_${type}`)>-1 || v.code.indexOf(`_${type2}`)>-1
        });
    };

    _reset =()=> {
        this.modal.find('input[name="name"]').val('');
        this.goodsRadio.reset();
        this.priceRadio.reset();
        this.pageCheck.reset();
        this.data = {};
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:50px;width: 600px;'
            }));
        }
        this.modal = $('#' + this.id);

        this.goodsRadio = new Radio({
            obj:this.modal.find('.goods-radio'),
            onChange:(index,row)=>{
                this.data.goodsType = row.id;
            },
            renderLi:row=>row.displayName
        });
        this.priceRadio = new Radio({
            obj:this.modal.find('.price-radio'),
            onChange:(index,row)=>{
                this.data.priceType = row.id;
            },
            renderLi:row=>row.displayName
        });
        this.pageCheck = new Checks({
            obj:this.modal.find('.page-check'),
            renderLi:row=>row.displayName
        });
        this._getDic();
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">角色名称：</div>
            <div class="modal-c-i-c"><input name="name" type="text" placeholder="输入角色名称" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">商品权限：</div>
            <div class="modal-c-i-c goods-radio"></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">商品权限：</div>
            <div class="modal-c-i-c price-radio"></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">功能权限：</div>
            <div class="modal-c-i-c page-check"></div>
        </div>
    </div>
</div>`;
    }

    _checkData =()=> {
        this.data.name = this.modal.find('input[name="name"]').val().trim();
        if(!this.data.name){
            message({
                msg:'请输入角色名称'
            });
            return false;
        }
        if(!this.data.goodsType){
            message({
                msg:'请选择商品权限'
            });
            return false;
        }
        if(!this.data.priceType){
            message({
                msg:'请选择价格权限'
            });
            return false;
        }
        this.data.pageType = this.pageCheck.getItems().map(v=>v.id).join(',');
        if(!this.data.pageType){
            message({
                msg:'请至少选择一个功能权限'
            });
            return false;
        }
        return true;
    };

    _getDic=()=> {
        doRequest({
            url:`role/getAllPrivileges`,
            data:{
                ts:Date.now()
            },
            success:data=>{
                if(data.success){
                    this.dic = data.data.reduce((o,v)=>{
                        o[v.privilegeCategory.name] = v.privileges.sort((a,b)=>a.displayOrder - b.displayOrder);
                        return o;
                    },{});
                    this.goodsRadio.setList(this.dic['商品权限']);
                    this.priceRadio.setList(this.dic['价格权限']);
                    this.pageCheck.setList(this.dic['功能权限']);
                }
            }
        })
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