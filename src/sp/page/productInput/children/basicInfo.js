/**
 * Created by Administrator on 2018/8/15.
 */
import htmlStr from './basicInfo.html';
import SinglePage from '../../../../component/SinglePage/SinglePage';

import doRequest from '../../../../util/lib/doRequest';
import message from '../../../../component/message/message';
import DropDown from '../../../../component/dropDown/dropdown';
import notification from '../../../../component/notification/notification';
import CheckDrop from '../../../../component/checkDrop/checkDrop';
import DragUpload from '../../../../component/dragUpload/dragUpload';

import store, { getLabelDic, getCategoryDic } from '../../common/store';
import { yearList, requestServer, imgPath, emitter } from '../../common/public';
import { chooseModal } from './common';

export default class BasicInfoPage extends SinglePage{
    constructor(){
        super();
        this.id = 'basicInfoPage';
        this.docTitle = '基本信息录入';
        this.html = htmlStr;

        this.seasonList = [ { name:'春',id:1 }, { name:'夏',id:2 }, { name:'秋',id:3 }, { name:'冬',id:4 } ];

        this.data = {};
    }

    _init =()=>{
        this._reset();
        if(!store.getLabelPromise){
            store.getLabelPromise = getLabelDic();
        }
        if(!store.getCategoryPromise){
            store.getCategoryPromise = getCategoryDic();
        }
        if(this.state.id){
            doRequest({
                url:`product/getBasic/${this.state.id}`,
                type:'post',
                success:data=>{
                    if(data.success){
                        this._setData(data.data);
                    }
                }
            })
        }
        this.pager.find('.open-product-modal,.reset-btn').toggle(!this.state.id);
    };

    _reset =()=> {
        this.data = {};
        this.pager.find('input[type="text"],input[type="number"]').val('');
        this.categorySelect.reset(false);
        this.pager.find('.category-select2').hide();
        this.labelCheck.reset();
        this.yearSelect.reset(false);
        this.seasonSelect.reset(false);
        this.uploadImgs.setImgs([]);
    };

    _setData =(data)=> {
        this.data = data;
        this.pager.find('input[name="name"]').val(data.name);
        this.pager.find('input[name="productNo"]').val(data.productNo);
        this.pager.find('input[name="brand"]').val(data.brand);
        this.pager.find('input[name="styleCode"]').val(data.styleCode);
        this.pager.find('input[name="specification"]').val(data.specification);
        this.pager.find('input[name="size"]').val(data.size);
        this.pager.find('input[name="storageSize"]').val(data.storageSize);
        this.yearSelect.setValue(data.productYear+'年');
        this.seasonSelect.setData(this.seasonList.findIndex(v=>v.name === data.season));
        data.imagePaths = data.imagePaths[0]?data.imagePaths[0].split(','):[];
        this.uploadImgs.setImgs(data.imagePaths);
        this.categorySelect.setValue(data.categoryName.split('>')[0]);
        this.categorySelect2.setValue(data.categoryName.split('>')[1]);
        this.pager.find('.category-select2').show();
        store.getLabelPromise.then(list=>{
            this.labels = data.labels[0].split(',');
            const labelIndex = this.labels.map(v=>{
                return list.findIndex(v2=>v2.name === v)
            }).filter(v=>v!==-1);
            this.labelCheck.setIndex(labelIndex);
        });
    };

    _modifyProduct =()=> {
        doRequest({
            url:'product/modifyBasic',
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify(this.data),
            success:data=>{
                if(data.success){
                    notification({
                        title:'编辑成功',
                        msg:this.data.name+ ' 商品基本信息编辑成功'
                    });
                    this.router.pop();
                }else {
                    message({ msg:data.errorMsg })
                }
            }
        })
    };

    _addProduct =()=> {
        doRequest({
            url:'product/addBasic',
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify(this.data),
            success:data=>{
                if(data.success){
                    notification({
                        title:'录入成功',
                        msg:this.data.name+ ' 商品基本信息录入成功'
                    });
                    this.router.pop();
                }else {
                    message({ msg:data.errorMsg })
                }
            }
        })
    };

    _checkData =()=> {
        this.data.name = this.pager.find('input[name="name"]').val().trim();
        if(!this.data.name){
            message({
                msg:'商品名称不能为空'
            });
            return false;
        }
        this.data.productNo = this.pager.find('input[name="productNo"]').val().trim();
        if(!this.data.productNo){
            message({
                msg:'商品编号不能为空'
            });
            return false;
        }
        this.data.size = this.pager.find('input[name="size"]').val().trim();
        this.data.brand = this.pager.find('input[name="brand"]').val().trim();
        if(!this.data.brand){
            message({
                msg:'商品品牌不能为空'
            });
            return false;
        }
        this.data.styleCode = this.pager.find('input[name="styleCode"]').val().trim();
        if(!this.data.id && !this.data.parentCategoryId){
            message({
                msg:'请选择一级类目'
            });
            return false;
        }
        if(!this.data.categoryId){
            message({
                msg:'请选择二级类目'
            });
            return false;
        }
        this.data.specification = this.pager.find('input[name="specification"]').val().trim();
        if(!this.data.specification){
            message({
                msg:'规格型号不能为空'
            });
            return false;
        }
        this.data.storageSize = parseInt(this.pager.find('input[name="storageSize"]').val().trim());
        if(!(this.data.storageSize === 0 || this.data.storageSize>0)){
            message({
                msg:'库存必须为非负整数'
            });
            return false;
        }
        this.data.imagePaths = this.uploadImgs.getImgs();
        if(!this.data.imagePaths.length){
            message({
                msg:'请上传图片'
            });
            return false;
        }
        return true;
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.ys-back-btn,.cancel-btn',function () {
            that.router.pop()
        }).on('click','.save-btn',function () {
            if(!that._checkData()) return;
            that.state.id ? that._modifyProduct(): that._addProduct();
        }).on('click','.open-product-modal',function () {
            chooseModal.setData({
                fn:data=>{
                    chooseModal.modalHide();
                    that._setData(data);
                }
            }).modalShow();
        }).on('click','.reset-btn',function () {
            that._reset();
        })
    };

    _getCategory=()=>{
        !store.categoryDic && doRequest({
            url:`category/list`,
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:JSON.stringify({
                searchPage:{
                    pageIndex:0,
                    pageSize:-1,
                },
                ts:Date.now()
            }),
            success:data=>{
                if(data.success){
                    store.categoryDic = data.data.searchPage.pageData;
                    this.categorySelect.renderList(store.categoryDic);
                }
            }
        })
    };

    _getCategoryChildren=()=>{
        doRequest({
            url:`category/listChildren/${this.data.parentCategoryId}`,
            data:{
                ts:Date.now()
            },
            success:data=>{
                if(data.success){
                    const list = data.data || [];
                    this.pager.find('.category-select2').toggle(!!list.length);
                    this.categorySelect2.renderList(list).reset();
                }
            }
        })
    };

    _initComponent =()=> {
        this.categorySelect = new DropDown({
            obj:this.pager.find('.category-select'),
            renderLi:row=>row.name,
            placeholder:'选择类目',
            list:store.categoryDic || [],
            onSelectChange:current=>{
                this.data.parentCategoryId = current.id;
                this._getCategoryChildren();
            },
            hasSearch:true
        });
        emitter.on('categoryDicChange',list=> {
            this.categorySelect.renderList(list);
        });

        this.categorySelect2 = new DropDown({
            obj:this.pager.find('.category-select2'),
            renderLi:row=>row.name,
            placeholder:'选择子类目',
            onSelectChange:current=>{
                this.data.categoryId = current?current.id:'';
            },
            hasSearch:true
        });

        this.labelCheck = new CheckDrop({
            obj:this.pager.find('.label-checks'),
            renderLi:row=>row.name,
            placeholder:'选择标签',
            list:store.labelDic || [],
            onSelectChange:indexs=>{
                this.data.labels = indexs.map(v=>store.labelDic[v].name);
            }
        });
        emitter.on('labelDicChange',list=> {
            this.labelCheck.renderList(list);
        });

        this.yearSelect = new DropDown({
            obj:this.pager.find('.year-select'),
            renderLi:row=>row.name,
            placeholder:'选择年份',
            list:yearList,
            onSelectChange:current=>{
                this.data.productYear = current.year;
            }
        });

        this.seasonSelect = new DropDown({
            obj:this.pager.find('.season-select'),
            renderLi:row=>row.name,
            placeholder:'选择季节',
            list:this.seasonList,
            onSelectChange:current=>{
                this.data.season = current?current.name:'';
            }
        });

        this.uploadImgs = new DragUpload({
            outer:this.pager.find('.upload-imgs'),
            url:`image/category/upload`,
            fileName:'uploadFile',
            getImgPathByRequest:data=>{
                if(data.success){
                    return `${requestServer}${data.data}`
                }
            },
            maxImgs:5,
            compress:false
        });
    }

}