/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './users.html';
import SinglePage from '../../../component/SinglePage/SinglePage';

import Table from '../../../component/table/table';
import AutoSearch from '../../../component/autoSearch/autoSearch';
import toHtmlStr from '../../../util/lib/toHtmlStr';
import doRequest from '../../../util/lib/doRequest';
import message from '../../../component/message/message';
import notification from '../../../component/notification/notification';
import DropDown from '../../../component/dropDown/dropdown';
import AccountModal from './accountModal';
import ResetPsdModal from './resetPsdModal';

import { floatModal, emitter } from '../common/public';
import store, { getRoleList } from '../common/store';

import './users.less';

const PAGESIZE = 10;
export default class UsersPage extends SinglePage{
    constructor(){
        super();
        this.id = 'usersPage';
        this.docTitle = '账户管理';
        this.html = htmlStr;
        this.condition = {
            keyword:'',
            roleId:''
        };
    }

    _init =()=>{
        if(!store.roleDicPromise){
            store.roleDicPromise = getRoleList();
        }
        this._getList(1);
    };

    _addOrEdit =({ id, name, username, password, phone, enable, roleId, qq, email, wechat, categoryList })=> {
        doRequest({
            url:`admin/user/${ id?'update':'add' }`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                name, username, password, phone, enable, roleId, qq, email, wechat,id, categoryList,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    this.modal.modalHide();
                    notification({
                        type:'success',
                        title:`${ id?'编辑':'添加' }用户成功`,
                        msg:`已成功${ id?'编辑':'添加' }用户：${name}`
                    });
                    this._getList(1,'refresh');
                    store.getChannelManagerPromise = null;
                }else {
                    message({
                        msg:data.errorMsg || `用户${ id?'编辑':'添加' }失败，请重试！`
                    })
                }
            }
        })
    };

    _getList =(current=1,type)=>{
        if(type === 'search'){
            current = 1;
        }
        if(type === 'refresh'){
            current = this.table.getPagination().current;
        }
        if(type === 'delete'){
            current = this.table.getPagination().current;
            if(this.table.getDataSource().length === 1){
                current--;
            }
            current = current || 1;
        }
        if(type !== 'delete'){
            this.condition.activeId = '';
        }
        doRequest({
            url:`admin/user/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:current-1,
                    pageSize:PAGESIZE,
                },
                username:this.condition.keyword,
                roleIdFilter:this.condition.roleId,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    let list = data.data.searchPage.pageData || [];
                    this.table.setData({
                        dataSource:list,
                        pagination:{
                            current,
                            total:data.data.searchPage.totalRecord
                        },
                        conditionChange:!!type
                    })
                }else {
                    this.table.setData({
                        dataSource:[]
                    })
                }
            }
        });
    };

    _restPsd =({ username, roleId, password })=>{
        doRequest({
            url:'admin/user/changePassword',
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                username, roleId, password
            }),
            success:data=>{
                if(data.success){
                    this.modal2.modalHide();
                    message({ type:'success',msg:'密码重置成功！' })
                }else {
                    message({ msg:data.errorMsg || '密码重置失败！' })
                }
            }
        })
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.add-account',function () {
            that.modal.setData({
                fn:({ name, username, password, phone, enable, roleId, qq, email, wechat, categoryList })=>{
                    that._addOrEdit({ name, username, phone, password, enable, roleId, qq, email, wechat, categoryList });
                }
            }).modalShow();
        }).on('click','.edit-item',function () {
            const rowData = that.table.getRowData($(this).data('index'));
            that.modal.setData({
                fn:({ name, username, password, phone, enable, roleId, qq, email, wechat, categoryList })=>{
                    that._addOrEdit({ id:rowData.id, name, username, password, phone, enable, roleId, qq, email, wechat, categoryList });
                },
                data:rowData,
                type:'edit'
            }).modalShow();
        }).on('click','.reset-password',function () {
            const rowData = that.table.getRowData($(this).data('index'));
            that.modal2.setData({
                fn:({  password })=>{
                    that._restPsd({ username:rowData.username, roleId:rowData.roleId, password });
                },
            }).modalShow();
        })
    };

    _initComponent =()=> {
        this.table = new Table({
            outer:this.pager.find('.user-table'),
            headers:[
                { name:'序号',width:60 },
                { name:'用户名称',width:120 },
                { name:'姓名',width:100 },
                { name:'手机号',width:100 },
                { name:'角色',width:110 },
                { name:'状态',width:100 },
                { name:'操作',width:120 }
            ],
            renderTrs:[
                (row,index,pagination)=>pagination.pageSize*(pagination.current-1)+(index+1),
                {
                    renderTd:row=>`<td style="padding-left: 35px;text-align: left">${toHtmlStr(row.username)}</td>`
                },
                {
                    renderTd:row=>`<td style="padding-left: 35px;text-align: left">${toHtmlStr(row.name)}</td>`
                },
                row=>toHtmlStr(row.phone),
                row=>toHtmlStr(row.roleName),
                row=>`<span style="color: ${row.enable?'green':'red'}">${row.enable?'启用':'禁用'}</span>`,
                (row,index)=>`<a data-index="${index}" class="btn btn-link edit-item" style="margin-right: 20px"><i class="fa fa-pencil-square-o"></i>编辑</a><a data-index="${index}" class="btn btn-link delete-btn reset-password"><i class="fa fa-unlock-alt"></i>重置密码</a>`
            ],
            pagination:{
                pageSize:PAGESIZE,
                show:true,
                current:1,
                onChange:({current})=>{
                    this._getList(current)
                },
                isJump:true
            },
            storage:true
        });

        new AutoSearch({
            input:this.pager.find('.keyword-c'),
            fn:val=>{
                this.condition.keyword = val;
                this._getList(1,'search');
            }
        });

        this.roleSelect = new DropDown({
            obj:this.pager.find('.role-select'),
            renderLi:row=>row.name,
            list:[{ name:'不限',id:'' }, ...(store.roleDic || [])],
            onSelectChange:current=>{
                this.condition.roleId = current?current.id:'';
                this._getList(1,'search');
            },
            hasReset:true
        });

        emitter.on('roleDicChange',list=>{
            this.roleSelect.renderList([{ name:'不限',id:'' }, ...list]);
        });

        this.modal = new AccountModal({});
        this.modal2 = new ResetPsdModal({});
    }

}