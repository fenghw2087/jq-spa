/**
 * Created by Administrator on 2018/7/30.
 */
import CommonModal from '../../../component/commonModal2/commonModal2';
import $ from "jquery";
import message from '../../../component/message/message';

import Radio from '../../../component/radio/radio';
import doRequest from '../../../util/lib/doRequest';

import DropDown from '../../../component/dropDown/dropdown';
import CheckDrop from '../../../component/checkDrop/checkDrop';

import { emitter } from '../common/public';
import store, { getCategoryDic } from '../common/store';

const MODAL_ID = 'accountModal';
export default class AccountModal extends CommonModal {
    constructor({
        title = '添加用户', confirmFn = () => {
    }
    }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('AccountModal param confirmFn must be a function');

        this.data = {};

        this.categoryCheckObj = {};

        this._init();
    }

    setData =({ type='add',fn, data={} })=>{
        if(!store.getCategoryPromise){
            store.getCategoryPromise = getCategoryDic();
        }
        this.setTitle( type === 'add'?'新增用户':'编辑用户' );
        this.setConfirmFn(fn);
        this._reset();
        if(type === 'add'){

        }else {
            doRequest({
                url:`admin/user/get/${data.id}`,
                success:data=>{
                    if(data.success){
                        this.data = data.data;
                        this.modal.find('input[name="username"]').val(this.data.username).attr('disabled',true);
                        this.modal.find('input[name="password"]').val('******');
                        this.modal.find('input[name="name"]').val(this.data.name);
                        this.modal.find('input[name="phone"]').val(this.data.phone-0);
                        this.modal.find('input[name="qq"]').val(this.data.qq-0);
                        this.modal.find('input[name="email"]').val(this.data.email);
                        this.modal.find('input[name="wechat"]').val(this.data.wechat);
                        this.enableRadio.setChecked(this.data.enable?0:1);
                        this.roleSelect.setValue(this.data.roleName);
                        store.roleDicPromise.then(list=>{
                            const current = list.find(v=>v.id === this.data.roleId);
                            const _categoryType = current.privileges.filter(v=>v.code.indexOf('_CATEGORY')>-1)[0].code;
                            if(_categoryType === 'ALL_CATEGORY'){
                                this.modal.find('.category-c').hide();
                            }else {
                                this.modal.find('.category-c').show();
                            }
                            this.data.categoryType = _categoryType;
                            store.getCategoryPromise.then(list=>{
                                this.categoryCheckObj = this.data.categoryList.reduce((o,v)=>{
                                    const pid = v.parentCategoryId;
                                    const parent = list.find(v2=>v2.id === pid);
                                    if(!o[pid]){
                                        o[pid] = {
                                            parent,
                                            items:[]
                                        }
                                    }
                                    o[pid].items.push(v);
                                    return o;
                                },{});
                                Object.keys(this.categoryCheckObj).forEach(v=>{
                                    this._updateCategory(this.categoryCheckObj[v].parent);
                                })
                            });
                        })
                    }
                }
            });
        }
        return this;
    };

    _reset =()=> {
        this.modal.find('input[type="text"],input[type="number"]').val('');
        this.modal.find('input[name="username"]').attr('disabled',false);
        this.modal.find('input[name="password"]').val('123456');
        this.enableRadio.reset();
        this.roleSelect.reset();
        this.modal.find('.category-outer').empty();
        this.modal.find('.category-c').hide();
        this.categoryCheckObj = {};
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
        this.enableRadio = new Radio({
            obj:this.modal.find('.enable-radio'),
            list:[ { name:'启用',id:true },{ name:'禁用',id:false } ],
            onChange:index=>{
                this.data.enable = index === 0;
            }
        });
        this.roleSelect = new DropDown({
            obj:this.modal.find('.role-select'),
            renderLi:row=>row.name,
            list:store.roleDic || [],
            onSelectChange:current=>{
                this.data.roleId = current?current.id:'';
                if(current){
                    const _categoryType = current.privileges.filter(v=>v.code.indexOf('_CATEGORY')>-1)[0].code;
                    if(_categoryType === 'ALL_CATEGORY'){
                        this.modal.find('.category-c').hide();
                    }else {
                        this.modal.find('.category-c').show();
                    }
                    this.data.categoryType = _categoryType;
                }else {

                }
            }
        });
        emitter.on('roleDicChange',list=> {
            this.roleSelect.renderList(list);
        });
        this.categorySelect = new DropDown({
            obj:this.modal.find('.category-select'),
            renderLi:row=>row.name,
            list:store.categoryDic || [],
            onSelectChange:current=>{
                if(current){
                    this._getCategoryChildren(current.id)
                }
            },
            hasSearch:true
        });
        emitter.on('categoryDicChange',list=> {
            this.categorySelect.renderList(list);
        });

        this.categoryChecks = new CheckDrop({
            obj:this.modal.find('.category-checks'),
            renderLi:row=>row.name,
            onSelectChange:(a,items)=>{
                const p = this.categorySelect.getData().current;
                if(!p) return;
                if(items.length){
                    this.categoryCheckObj[p.id] = {
                        parent:p,
                        items
                    };
                    this._updateCategory(p);
                }else {
                    delete this.categoryCheckObj[p.id];
                    this._removeCategory(p);
                }
            },
            pickAll:true
        })
    }

    _updateCategory =(p)=>{
        const outer = this.modal.find('.category-outer');
        if(!outer.find(`[data-pid="${p.id}"]`).length){
            outer.prepend( this._getCategoryHtml(p) );
        }
        const p_outer = outer.find(`[data-pid="${p.id}"]`).find('.cate-c');
        p_outer.html( this.categoryCheckObj[p.id].items.map((v,i)=>{
            return `<div class="cate-i">${ v.name }<i data-id="${ p.id+'-'+i }" title="移除这个二级类目" class="fa fa-times remove-cate"></i></div>`
        }) )
    };

    _removeCategory =(p)=> {
        this.modal.find('.category-outer').find(`[data-pid="${p.id}"]`).remove();
    };

    _getCategoryHtml=(p)=>{
        return `<div class="category-i-c" data-pid="${ p.id }">
    <div class="cate-i-t">${ p.name }</div>
    <div class="cate-close" data-id="${ p.id }" title="移除这个一级类目"><i class="fa fa-times"></i></div>
    <div class="cate-c"></div>
</div>`
    };

    _getCategoryChildren=(id)=>{
        doRequest({
            url:`category/listChildren/${id}`,
            data:{
                ts:Date.now()
            },
            success:data=>{
                if(data.success){
                    const list = data.data || [];
                    this.categoryChecks.renderList(list).reset();
                }
            }
        })
    };

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">用户名：</div>
            <div class="modal-c-i-c"><input name="username" type="text" placeholder="以英文字母开头，仅能包含字母和数字" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">初始密码：</div>
            <div class="modal-c-i-c"><input name="password" type="text" readonly value="123456" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">姓名：</div>
            <div class="modal-c-i-c"><input name="name" type="text" placeholder="输入用户真实姓名" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">手机号：</div>
            <div class="modal-c-i-c"><input name="phone" type="number" placeholder="输入用户手机号" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">账号状态：</div>
            <div class="modal-c-i-c enable-radio"></div>
        </div>
        <div class="modal-c-i" style="max-width: 265px">
            <div class="modal-c-i-t is-must">用户角色：</div>
            <div class="modal-c-i-c"><div class="role-select"></div></div>
        </div>
    </div>
    <div class="category-c">
        <div class="modal-c-i-o">
            <div class="modal-c-i">
                <div class="modal-c-i-t is-must">负责类目：</div>
                <div class="modal-c-i-c flexbox aic">
                    <div class="category-select flex1" style="margin-right: 30px"></div>
                    <div class="category-checks flex1"></div>
                </div>
            </div>
        </div>
        <div class="modal-c-i-o">
            <div class="modal-c-i">
                <div class="modal-c-i-c category-outer"></div>
            </div>
        </div>
    </div>
    
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t">微信：</div>
            <div class="modal-c-i-c"><input name="wechat" type="text" placeholder="输入用户微信号" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t">QQ：</div>
            <div class="modal-c-i-c"><input name="qq" type="number" placeholder="输入用户QQ号" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t">邮箱：</div>
            <div class="modal-c-i-c"><input name="email" type="text" placeholder="输入用户邮箱" /></div>
        </div>
        <div class="modal-c-i">
        </div>
    </div>
</div>`;
    }

    _checkData =()=> {
        this.data.username = this.modal.find('input[name="username"]').val().trim();
        if(!this.data.username){
            message({
                msg:'请输入用户名'
            });
            return false;
        }
        this.data.password = '123456';
        this.data.name = this.modal.find('input[name="name"]').val().trim();
        if(!this.data.name){
            message({
                msg:'请输入用户姓名'
            });
            return false;
        }
        this.data.phone = this.modal.find('input[name="phone"]').val().trim();
        if(!this.data.phone){
            message({
                msg:'请输入用户姓名'
            });
            return false;
        }
        if(this.data.enable === undefined || this.data.enable === ''){
            message({
                msg:'请选择用户状态'
            });
            return false;
        }
        if(!this.data.roleId){
            message({
                msg:'请选择用户角色'
            });
            return false;
        }
        if(this.data.categoryType !== 'ALL_CATEGORY'){
            this.data.categoryList = Object.keys(this.categoryCheckObj).reduce((o,v)=>{
                o = [...o, ...this.categoryCheckObj[v].items];
                return o;
            },[]).map(v=>{
                return {
                    id:v.id
                }
            });
            if(!this.data.categoryList.length){
                message({
                    msg:'请选择用户负责类目'
                });
                return false;
            }
        }else {
            this.data.categoryList = [];
        }

        this.data.email = this.modal.find('input[name="email"]').val().trim();
        this.data.wechat = this.modal.find('input[name="wechat"]').val().trim();
        this.data.qq = this.modal.find('input[name="qq"]').val().trim();
        return true;
    };

    _bindEvent() {
        const that = this;
        this.modal.on('click', '.confirm-btn', function () {
            that._checkData() && that.confirmFn(that.data);
        }).on('click','.cate-close',function () {
            const id = $(this).data('id');
            $(this).parents('.category-i-c').remove();
            delete that.categoryCheckObj[id];
        }).on('click','.remove-cate',function () {
            const ids = $(this).data('id').split('-');
            const [ pid, index ] = ids;
            $(this).parent().remove();
            that.categoryCheckObj[pid].items.splice(index,1);
            if(!that.categoryCheckObj[pid].items.length){
                that.modal.find(`[data-pid="${pid}"]`).remove();
                delete that.categoryCheckObj[pid];
            }
        });
    }

    _init() {
        this._renderHtml();

        this._bindEvent();
    }
}