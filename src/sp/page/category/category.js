/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './category.html';
import SinglePage from '../../../component/SinglePage/SinglePage';

import Pagination from '../../../component/pagination/pagination';
import AutoSearch from '../../../component/autoSearch/autoSearch';
import toHtmlStr from '../../../util/lib/toHtmlStr';
import format from '../../../util/lib/format';
import doRequest from '../../../util/lib/doRequest';
import message from '../../../component/message/message';
import CategoryModal from './categoryModal';
import notification from '../../../component/notification/notification';
import { floatModal, imgPath, imgViewer } from '../common/public';
import store from '../common/store';

import './category.less';

const PAGESIZE = 10;
export default class CategoryPage extends SinglePage{
    constructor(){
        super();
        this.id = 'categoryPage';
        this.docTitle = '类目管理';
        this.html = htmlStr;

        this.currentList= [];

        this.condition = {
            keyword:''
        };
    }

    _init =()=>{
        this._getList(1);
    };

    _getList =(current=1,type)=>{
        if(type === 'search'){
            current = 1;
        }
        if(type === 'refresh'){
            current = this.pagination.getPaginationData().current;
        }
        if(type === 'delete'){
            current = this.pagination.getPaginationData().current;
            if(this.currentList.length === 1){
                current--;
            }
            current = current || 1;
        }
        doRequest({
            url:`category/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:current-1,
                    pageSize:PAGESIZE,
                },
                searchCategoryName:this.condition.keyword,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success && data.data && data.data.searchPage){
                    this.currentList = data.data.searchPage.pageData || [];
                    this._renderList(current,data.data.searchPage.totalRecord);
                }else {
                    this._renderEmpty();
                }
            }
        });
    };

    _renderList =(current,total)=> {
        this.tableC.find('tbody').html(this.currentList.map((v,i)=>{
            if(this.condition.keyword){
                v.name = v.name.replace(new RegExp(this.condition.keyword, "g"),`<span style="color: red">${this.condition.keyword}</span>`)
            }
            return `<tr>
    <td>${(current-1)*PAGESIZE+(i+1)}</td>
    ${ v.parentCategoryId === 0?
                `<td style="text-align: left;padding-left: 15px"><div class="category-name pointer" data-index="${i}"><i class="fa fa-fw fa-caret-down"></i><i class="fa fa-fw fa-caret-right"></i>${toHtmlStr(v.name)}</div></td>`
                :`<td style="text-align: left;padding-left: 15px">${toHtmlStr(v.name)}</td>`
            }
    <td style="text-align: left;padding-left: 15px">${toHtmlStr(v.categoryNo)}</td>
    <td style="padding: 0 15px"><img data-index="${i}" class="category-icon view-img" src="${ imgPath + v.image}" /></td>
    <td>${format(v.createTime)}</td>
    <td>${v.showOnApp?'是':'否'}</td>
    <td><a data-index="${i}" class="btn btn-link edit-item" style="margin-right: 20px"><i class="fa fa-pencil-square-o"></i>编辑</a><a data-index="${i}" class="btn btn-link delete-btn delete-item"><i class="fa fa-trash-o"></i>删除</a></td>
</tr>`
        }));
        this.pagination.setPageData({
            current,total
        });
        this._renderLoading(false);
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.category-name',function () {
            const _this = $(this);
            _this.toggleClass('active');
            const _index = _this.data('index');
            const rowData = that.currentList[_index];
            new window.Promise(res=>{
                if(!rowData.hasInit){
                    doRequest({
                        url:`category/listChildren/${rowData.id}`,
                        data:{
                            ts:Date.now()
                        },
                        success:data=>{
                            if(data.success){
                                rowData.children = data.data || [];
                                rowData.hasInit = true;
                                res();
                            }
                        }
                    })
                }else {
                    res();
                }
            }).then(()=>{
                if(_this.hasClass('active')){
                    _this.parents('tr').after(rowData.children.length?rowData.children.map((v,i)=>{
                        const c_index = _this.parents('tr').find('td').eq(0).text();
                        return `<tr data-parent="${_index}">
    <td>${ c_index }</td>
    <td style="text-align: left;padding-left: 35px">${toHtmlStr(v.name)}</td>
    <td style="text-align: left;padding-left: 15px">${toHtmlStr(v.categoryNo)}</td>
    <td style="padding: 0 15px"><img data-index="${_index+'-'+i}" class="category-icon view-img" src="${ imgPath + v.image}" /></td>
    <td>${format(v.createTime)}</td>
    <td>${v.showOnApp?'是':'否'}</td>
    <td><a data-parent="${_index}" data-index="${i}" class="btn btn-link edit-item" style="margin-right: 20px"><i class="fa fa-pencil-square-o"></i>编辑</a><a data-parent="${_index}" data-index="${i}" class="btn btn-link delete-btn delete-item"><i class="fa fa-trash-o"></i>删除</a></td>
</tr>`
                    }):`<tr data-parent="${_index}"><td colspan="7" style="color: #999">没有二级类目</td></tr>`);
                }else {
                    _this.parents('tr').nextAll(`[data-parent="${_index}"]`).remove();
                }

            });

        }).on('click','.add-category',function () {
            that.modal.setData({
                fn:({ name, categoryNo, parentCategoryId, image, showOnApp })=>{
                    that._addOrEdit({ name, categoryNo, parentCategoryId, image, showOnApp });
                }
            }).modalShow();
        }).on('click','.delete-item',function () {
            const p_index = $(this).data('parent');
            const index= $(this).data('index');
            const row = p_index!== undefined?that.currentList[p_index].children[index]:that.currentList[index];
            floatModal.show({
                title:'是否删除该类目？',
                obj:$(this),
                side:3,
                fn:()=>{
                    that._deleteItem(row,p_index!== undefined?$(this):'',p_index!== undefined?that.currentList[p_index]:'');
                }
            })
        }).on('click','.edit-item',function () {
            const p_index = $(this).data('parent');
            const index= $(this).data('index');
            const row = p_index!== undefined?that.currentList[p_index].children[index]:that.currentList[index];
            that.modal.setData({
                fn:({ name, categoryNo, parentCategoryId, image, showOnApp })=>{
                    that._addOrEdit({ id:row.id, name, categoryNo, parentCategoryId, image, showOnApp });
                },
                data:row,
                type:'edit'
            }).modalShow();
        }).on('click','.view-img',function () {
            const [ p_index,index ] = ($(this).data('index')+'').split('-');
            let row;
            if(index !== undefined){
                row = that.currentList[p_index].children[index]
            }else {
                row = that.currentList[p_index]
            }
            let imgs = [ row.image ];
            if(_DEV_==='dev'){
                imgs = imgs.map(v=> imgPath+v);
            }
            if(imgs.length){
                imgViewer.show(imgs);
            }
        })
    };

    _addOrEdit =({ id, name, categoryNo, parentCategoryId, image, showOnApp })=> {
        doRequest({
            url:`category/${ id?'modify':'add' }`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify({
                id, name, categoryNo, parentCategoryId, image, showOnApp,
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    this.modal.modalHide();
                    notification({
                        type:'success',
                        title:`${ id?'编辑':'添加' }类目成功`,
                        msg:`已成功${ id?'编辑':'添加' }类目：${name}`
                    });
                    this._getList(1,'refresh');
                    store.getCategoryPromise = null;
                }else {
                    message({
                        msg:data.errorMsg || `类目${ id?'编辑':'添加' }失败，请重试！`
                    })
                }
            }
        })
    };

    _deleteItem =(row,td,parent)=> {
        doRequest({
            url:`category/delete/${row.id}`,
            data:{
                ts:Date.now()
            },
            success:data=>{
                floatModal.hide();
                if(data.success){
                    message({
                        msg:'删除类目成功',
                        type:'success'
                    });
                    if(row.parentCategoryId === 0){
                        this._getList(1,'delete');
                    }else {
                        td.parents('tr').remove();
                        parent.hasInit = false;
                    }
                    store.getCategoryPromise = null;
                }else {
                    message({
                        msg:data.errorMsg || '删除类目失败'
                    })
                }
            }
        })
    };

    _initComponent =()=> {
        new AutoSearch({
            input:this.pager.find('.keyword-c'),
            fn:val=>{
                this.condition.keyword = val;
                this._getList(1,'search');
            }
        });

        this.tableC = this.pager.find('.category-table');

        this.paginationC = this.pager.find('.pagination-c');
        this.pagination = new Pagination({
            outer:this.paginationC,
            current:1,
            pageSize:PAGESIZE,
            isJump:true,
            loading:true,
            onChange:({ current })=>{
                this.pagination.toggleLoading();
                this._getList(current);
            }
        });
        this.loadingC = this.pager.find('.loading-c');
        this.emptyC = this.pager.find('.empty-c');

        this.modal = new CategoryModal({});

        this._renderLoading(true);
    };

    _renderLoading =(type)=> {
        this.tableC.toggle(!type);
        this.paginationC.toggle(!type);
        this.loadingC.toggle(!!type);
        this.emptyC.hide();
    };

    _renderEmpty =()=> {
        this.emptyC.show();
        this.tableC.toggle(false);
        this.paginationC.toggle(false);
        this.loadingC.toggle(false);
    }
}