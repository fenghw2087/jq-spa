/**
 * Created by Administrator on 2018/8/9.
 */
import htmlStr from './label.html';
import SinglePage from '../../../component/SinglePage/SinglePage';
import Table from '../../../component/table/table';
import AutoSearch from '../../../component/autoSearch/autoSearch';
import toHtmlStr from '../../../util/lib/toHtmlStr';
import format from '../../../util/lib/format';
import doRequest from '../../../util/lib/doRequest';
import message from '../../../component/message/message';
import DropDown from '../../../component/dropDown/dropdown';
import notification from '../../../component/notification/notification';

import LabelModal from './labelModal';
import { labelStatusList, floatModal } from '../common/public';
import store from '../common/store';

const PAGESIZE = 10;
export default class LabelPage extends SinglePage{
    constructor(){
        super();
        this.id = 'labelPage';
        this.docTitle = '标签管理';
        this.html = htmlStr;

        this.condition = {
            keyword:'',
            status:labelStatusList[0].id
        };
    }

    _init =()=>{
       this._getList(1);
    };

    _addOrEdit =({ id, name, labelNo, enable })=> {
        doRequest({
            url:`label/${id?'modify':'add'}`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                id, name, labelNo, enable,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    this.modal.modalHide();
                    notification({
                        type:'success',
                        title:`${ id?'编辑':'添加' }标签成功`,
                        msg:`已成功${ id?'编辑':'添加' }标签：${name}`
                    });
                    this._getList(1,'refresh');
                    store.getLabelPromise = null;
                }else {
                    message({
                        msg:data.errorMsg || `标签${ id?'编辑':'添加' }失败，请重试！`
                    })
                }
            }
        })
    };

    _deleteItem =(row)=> {
        doRequest({
            url:`label/delete/${row.id}`,
            data:{
                ts:Date.now()
            },
            success:data=>{
                floatModal.hide();
                if(data.success){
                    message({
                        msg:'删除标签成功',
                        type:'success'
                    });
                    this._getList(1,'delete');
                    store.getLabelPromise = null;
                }else {
                    message({
                        msg:data.errorMsg || '删除标签失败'
                    })
                }
            },
            error:()=>{
                floatModal.hide();
                message({
                    msg:'删除标签失败'
                })
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
            url:`label/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:current-1,
                    pageSize:PAGESIZE,
                },
                searchLabelName:this.condition.keyword,
                enableFilter:this.condition.status,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success && data.data && data.data.searchPage){
                    let list = data.data.searchPage.pageData || [];
                    this.table.setData({
                        dataSource:list.map((v,i)=>{
                            v.index = i+1+current*PAGESIZE-PAGESIZE;
                            return v;
                        }),
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

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.add-tag',function () {
            that.modal.setData({
                fn:data=>{
                    that._addOrEdit(data);
                }
            }).modalShow();
        }).on('click','.delete-item',function () {
            const row = that.table.getRowData($(this).data('index'));
            floatModal.show({
                title:'是否删除该标签？',
                obj:$(this),
                side:3,
                fn:()=>{
                    that._deleteItem(row);
                }
            })
        }).on('click','.edit-item',function () {
            const row = that.table.getRowData($(this).data('index'));
            that.modal.setData({
                type:'edit',
                data:row,
                fn:data=>{
                    that._addOrEdit({ id:row.id, ...data });
                }
            }).modalShow();
        });
    };

    _initComponent =()=> {
        this.table = new Table({
            outer:this.pager.find('.label-table'),
            headers:[
                { name:'序号',width:70 },
                { name:'标签名称',width:180 },
                { name:'标签编码',width:150 },
                { name:'创建时间',width:110 },
                { name:'标签状态',width:100 },
                { name:'操作',width:110 }
            ],
            renderTrs:[
                (row,index,pagination)=>pagination.pageSize*(pagination.current-1)+(index+1),
                row=>toHtmlStr(row.name),
                row=>toHtmlStr(row.labelNo),
                row=>format(row.createTime),
                row=>`<span style="color: ${row.enable?'green':'red'}">${row.enable?'启用':'停用'}</span>`,
                (row,index)=>`<a data-index="${index}" class="btn btn-link edit-item" style="margin-right: 20px"><i class="fa fa-pencil-square-o"></i>编辑</a><a data-index="${index}" class="btn btn-link delete-btn delete-item"><i class="fa fa-trash-o"></i>删除</a>`
            ],
            placeholder:'暂无符合条件的标签信息',
            pagination:{
                pageSize:PAGESIZE,
                show:true,
                current:1,
                onChange:({current})=>{
                    this._getList(current)
                },
                isJump:true
            }
        });

        new AutoSearch({
            input:this.pager.find('.keyword-c'),
            fn:val=>{
                this.condition.keyword = val;
                this._getList(1,'search');
            }
        });

        this.statusSelect = new DropDown({
            obj:this.pager.find('.status-select'),
            list:labelStatusList,
            renderLi:row=>row.name,
            onSelectChange:current=>{
                this.condition.status = current.value;
                this._getList(1,'search');
            },
            activeIndex:0
        });

        this.modal = new LabelModal({});
    }

}