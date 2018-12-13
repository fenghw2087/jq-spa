/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './channel.html';
import SinglePage from '../../../component/SinglePage/SinglePage';
import Table from '../../../component/table/table';
import AutoSearch from '../../../component/autoSearch/autoSearch';
import toHtmlStr from '../../../util/lib/toHtmlStr';
import format from '../../../util/lib/format';
import doRequest from '../../../util/lib/doRequest';
import message from '../../../component/message/message';
import DropDown from '../../../component/dropDown/dropdown';
import notification from '../../../component/notification/notification';

import { floatModal, emitter } from '../common/public';
import store, { getChannelManagerList } from '../common/store';

import ChannelModal from './channelModal';

const PAGESIZE = 10;
export default class ChannelPage extends SinglePage{
    constructor(){
        super();
        this.id = 'channelPage';
        this.docTitle = '渠道管理';
        this.html = htmlStr;

        this.condition = {
            channelName:'',
            contactorName:'',
            channelManagerId:''
        };
    }

    _init =()=>{
        if(!store.getChannelManagerPromise){
            store.getChannelManagerPromise = getChannelManagerList();
        }
        this._getList(1);
    };

    _addOrEdit =(row)=> {
        doRequest({
            url:`channel/${row.id?'modify':'add'}`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                ...row,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    this.modal.modalHide();
                    notification({
                        type:'success',
                        title:`${ row.id?'编辑':'添加' }渠道成功`,
                        msg:`已成功${ row.id?'编辑':'添加' }渠道：${row.name}`
                    });
                    this._getList(1,'refresh');
                }else {
                    message({
                        msg:row.errorMsg || `渠道${ row.id?'编辑':'添加' }失败，请重试！`
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
        doRequest({
            url:`channel/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:current-1,
                    pageSize:PAGESIZE,
                },
                ...this.condition,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success && data.data && data.data.searchPage){
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

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.add-channel',function () {
            that.modal.setData({
                fn:data=>{
                    that._addOrEdit(data);
                }
            }).modalShow();
        }).on('click','.edit-item',function () {
            const row = that.table.getRowData($(this).data('index'));
            that.modal.setData({
                type:'edit',
                data:row,
                fn:data=>{
                    that._addOrEdit({ id:row.id, ...data });
                }
            }).modalShow();
        })
    };

    _initComponent =()=> {
        this.table = new Table({
            outer:this.pager.find('.channel-table'),
            headers:[
                { name:'序号',width:60 },
                { name:'渠道编码',width:120 },
                { name:'渠道名称',width:100 },
                { name:'联络人',width:90 },
                { name:'电话',width:100 },
                { name:'邮箱',width:120 },
                { name:'QQ',width:90 },
                { name:'微信',width:100 },
                { name:'地址',width:150 },
                { name:'操作',width:80 }
            ],
            renderTrs:[
                (row,index,pagination)=>pagination.pageSize*(pagination.current-1)+(index+1),
                row=>toHtmlStr(row.channelNo),
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.name)}</td>`
                },
                row=>toHtmlStr(row.contactorName),
                row=>toHtmlStr(row.contactorPhone),
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.contactorEmail)}</td>`
                },
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.contactorQq)}</td>`
                },
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.contactorWechat)}</td>`
                },
                {
                    renderTd:(row,index)=>`<td style="text-align: left;padding-left: 15px">${toHtmlStr(row.contactorAddress)}</td>`
                },
                (row,index)=>`<a data-index="${index}" class="btn btn-link edit-item" style="margin-right: 20px"><i class="fa fa-pencil-square-o"></i>编辑</a>`
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
            emptyMsg:'没有符合条件的渠道信息'
        });

        new AutoSearch({
            input:this.pager.find('input[name="channelName"]'),
            fn:val=>{
                this.condition.channelName = val;
                this._getList(1,'search');
            }
        });

        new AutoSearch({
            input:this.pager.find('input[name="contactorName"]'),
            fn:val=>{
                this.condition.contactorName = val;
                this._getList(1,'search');
            }
        });

        this.jlSelect = new DropDown({
            obj:this.pager.find('.jl-select'),
            renderLi:row=>row.name,
            onSelectChange:current=>{
                this.condition.channelManagerId = current? current.id:'';
                this._getList(1,'search');
            },
            list:store.channelManagerDic || [],
            hasReset:true,
            placeholder:'不限'
        });
        emitter.on('channelManagerChange',list=>{
            this.jlSelect.renderList(list);
        });

        this.modal = new ChannelModal({});

    }

}