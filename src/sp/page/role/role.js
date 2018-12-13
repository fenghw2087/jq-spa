/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './role.html';
import SinglePage from '../../../component/SinglePage/SinglePage';

import { floatModal } from '../common/public';
import store from '../common/store';

import Table from '../../../component/table/table';
import AutoSearch from '../../../component/autoSearch/autoSearch';
import toHtmlStr from '../../../util/lib/toHtmlStr';
import doRequest from '../../../util/lib/doRequest';
import message from '../../../component/message/message';
import notification from '../../../component/notification/notification';

import RoleModal from './roleModal';

const PAGESIZE = 10;
export default class RolePage extends SinglePage{
    constructor(){
        super();
        this.id = 'rolePage';
        this.docTitle = '角色管理';
        this.html = htmlStr;
        this.condition = {
            keyword:''
        };
    }

    _init =()=>{
        this._getList(1);
    };

    _addOrEdit =({ id, name, goodsType, priceType, pageType })=> {
        const params = {
            name,
            privileges:[ goodsType, priceType, ...pageType.split(',') ].map(v=>{
                return {
                    id:v
                }
            })
        };
        if(id) params.id = id;
        doRequest({
            url:`role/${ id?'modify':'add' }`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify(params),
            success:data=>{
                if(data.success){
                    this.modal.modalHide();
                    notification({
                        type:'success',
                        title:`${ id?'编辑':'添加' }角色成功`,
                        msg:`已成功${ id?'编辑':'添加' }角色：${name}`
                    });
                    this._getList(1,'search');
                    store.roleDicPromise = null;
                }else {
                    message({
                        msg:data.errorMsg || `角色${ id?'编辑':'添加' }失败，请重试！`
                    })
                }
            }
        })
    };

    _deleteRole =(row)=>{
        doRequest({
            url:`role/delete/${row.id}`,
            success:data=>{
                floatModal.hide();
                if(data.success){
                    notification({
                        type:'success',
                        title:`删除角色成功`,
                        msg:`已成功删除角色：${row.name}`
                    });
                    this._getList(1,'delete');
                    store.roleDicPromise = null;
                }else {
                    message({
                        msg:data.errorMsg || `角色删除失败，请重试！`
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
            url:`role/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                roleName:this.condition.keyword,
                searchPage:{
                    pageIndex:current-1,
                    pageSize:PAGESIZE
                },
                ts:Date.now()
            }),
            success:data=>{
                if(data.success && data.data && data.data.searchPage){
                    let list = data.data.searchPage.pageData || [];
                    this.table.setData({
                        dataSource:list,
                        pagination:{
                            current,
                            total:data.data.totalRecord
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

    _getQX =(list,type,type2=1212212)=> {
        return list.filter(v=>{
            return v.code.indexOf(`_${type}`)>-1 || v.code.indexOf(`_${type2}`)>-1
        }).map(v=>v.displayName).join(',');
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.add-role',function () {
            that.modal.setData({
                fn:data=>{
                    that._addOrEdit(data);
                }
            }).modalShow();
        }).on('click','.edit-item',function () {
            const rowData = that.table.getRowData($(this).data('index'));
            that.modal.setData({
                fn:data=>{
                    that._addOrEdit(data);
                },
                data:rowData,
                type:'edit'
            }).modalShow();
        }).on('click','.delete-item',function () {
            const rowData = that.table.getRowData($(this).data('index'));
            floatModal.show({
                obj:$(this),
                side:3,
                title:'确认删除本角色？',
                fn:()=>{
                    that._deleteRole(rowData);
                }
            })
        })
    };

    _initComponent =()=> {
        this.table = new Table({
            outer:this.pager.find('.role-table'),
            headers:[
                { name:'序号',width:60 },
                { name:'角色名称',width:120 },
                { name:'查看商品权限',width:100 },
                { name:'查看价格权限',width:100 },
                { name:'功能权限',width:250 },
                { name:'操作',width:120 }
            ],
            renderTrs:[
                (row,index,pagination)=>pagination.pageSize*(pagination.current-1)+(index+1),
                row=>toHtmlStr(row.name),
                row=>this._getQX(row.privileges,'CATEGORY'),
                row=>this._getQX(row.privileges,'PRICE'),
                {
                    renderTd:row=>`<td style="padding-left: 35px;text-align: left">${this._getQX(row.privileges,'MANAGE','QUERY')}</td>`
                },
                (row,index)=>`<a data-index="${index}" class="btn btn-link edit-item" style="margin-right: 20px"><i class="fa fa-pencil-square-o"></i>编辑</a><a data-index="${index}" class="btn btn-link delete-btn delete-item"><i class="fa fa-trash-o"></i>删除</a>`
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

        this.modal = new RoleModal({});
    }

}