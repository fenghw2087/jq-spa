/**
 * Created by Administrator on 2018/8/9.
 */
import './index.less';
import sliderHtml from './page/common/slider.html';
import loginHtml from './page/login/login.html';
import { renderNav, nav } from './page/common/nav';
import YsRouter from '../component/ysRouter/ysRouter';
import Nav from '../component/nav/nav';

import doRequest from '../util/lib/doRequest';

import LoginPage from './page/login/login';

import ProductPage from './page/product/product';
import ProductInputPage from './page/productInput/productInput';
import ProductPrice from './page/productInput/children/productPrice';
import ProductDetail from './page/productInput/children/productDetail';
import ProsuctInfo from './page/productInput/children/productInfo';
import ChannelPage from './page/channel/channel';
import CategoryPage from './page/category/category';
import LabelPage from './page/label/label';
import RolePage from './page/role/role';
import UsersPage from './page/users/users';
import UserCenterPage from './page/userCenter/userCenter';
import PageErrorPage from './page/pageError/pageError';
import BasicInfoPage from './page/productInput/children/basicInfo';


import { emitter, pageTail } from './page/common/public';
import store from './page/common/store';

const _ISLGON = window.localStorage.getItem('islogin') === 'login' || window.isLogin;

class IndexPage {
    constructor(){
        this.id = 'root';
        this.outer = $('#'+this.id);
        this.routerConfig = [
            {
                name:'product',
                code:'PRODUCT_QUERY',
                path:`${window.basePath}index${pageTail}`,
                page:new ProductPage()
            },
            {
                name:'product-input',
                path:`${window.basePath}product-input${pageTail}`,
                page:new ProductInputPage(),
                code:'PRODUCT_MANAGE'
            },
            {
                name:'product-info',
                path:`${window.basePath}product-info${pageTail}`,
                page:new ProsuctInfo(),
                parent:'product'
            },
            {
                name:'product-input-basic',
                path:`${window.basePath}product-input-basic${pageTail}`,
                page:new BasicInfoPage(),
                code:'PRODUCT_MANAGE',
                parent:'product-input'
            },
            {
                name:'product-price',
                path:`${window.basePath}product-price${pageTail}`,
                page:new ProductPrice(),
                code:'PRODUCT_MANAGE',
                parent:'product-input'
            },
            {
                name:'product-detail',
                path:`${window.basePath}product-detail${pageTail}`,
                page:new ProductDetail(),
                code:'PRODUCT_MANAGE',
                parent:'product-input'
            },
            {
                name:'channel',
                path:`${window.basePath}channel${pageTail}`,
                page:new ChannelPage(),
                code:'CHANNEL_MANAGE',
            },
            {
                name:'category',
                path:`${window.basePath}category${pageTail}`,
                page:new CategoryPage(),
                code:'CATEGORY_MANAGE',
            },
            {
                name:'label',
                path:`${window.basePath}label${pageTail}`,
                page:new LabelPage(),
                code:'LABEL_MANAGE',
            },
            {
                name:'role',
                path:`${window.basePath}users-role${pageTail}`,
                page:new RolePage(),
                code:'USER_MANAGE',
            },
            {
                name:'users',
                path:`${window.basePath}users-account${pageTail}`,
                page:new UsersPage(),
                code:'USER_MANAGE',
            },
            {
                name:'userCenter',
                path:`${window.basePath}userCenter${pageTail}`,
                page:new UserCenterPage(),
            },
            {
                name:'error',
                path:`${window.basePath}error${pageTail}`,
                page:new PageErrorPage()
            }
        ];

        this._init();
    }

    init =()=> {
    };

    _renderHtml =()=> {
        this.outer.html(sliderHtml);
    };

    _bindEvent =()=> {
         const that = this;
         this.outer.on('click','#currentUserNameC',function () {
            that.router.replace({ page:'userCenter' })
         })
    };

    _init =()=> {
        if(_ISLGON){
            new window.Promise(res=>{
                const privilegeStr = localStorage.getItem('privilege');
                const privilege = privilegeStr?JSON.parse(privilegeStr):[];
                if(privilegeStr){
                    res(privilege);
                }else {
                    doRequest({
                        url:'user/getPrivileges',
                        type:'post',
                        success:data=>{
                            if(data.success){
                                const _privilege = data.data.privilegeCodeSet;
                                localStorage.setItem('privilege',JSON.stringify(_privilege));
                                res(_privilege)
                            }else {
                                res();
                            }
                        }
                    });
                }
            }).then(privilege=>{
                store.privilege = privilege;
                emitter.emit('privilege',privilege);
                this.routerConfig = this.routerConfig.map(v=>{
                    if(v.code && privilege.indexOf(v.code) === -1){
                        v.reject = true;
                    }
                    return v;
                });
                const portal = this.routerConfig.find(v=>{
                    return !v.reject
                });
                portal.path = window.basePath;
                this.routerConfig = this.routerConfig.reduce((o,v)=>{
                    v.reject?o.push(v):o.unshift(v);
                    return o;
                },[]);
                this._renderHtml();
                const _nav = nav.map(v=>{
                    if(v.code && privilege.indexOf(v.code) === -1){
                        v.reject = true;
                    }
                    return v;
                });
                setTimeout(()=>{
                    this.pageOuter = $('#pageOuter');
                    const portalNav = _nav.find(v=>{
                        return !v.reject
                    });
                    portalNav.url = window.basePath;
                    renderNav(_nav);
                    this.router = new YsRouter({
                        router:this.routerConfig,
                        outer:this.pageOuter
                    });
                    new Nav({
                        navs:$('.nav-list-c').find('a'),
                        router:this.router
                    });
                    this.router.initCurrent();

                    this._bindEvent();
                },0);
            });
        }else {
            this.outer.html(loginHtml);
            setTimeout(()=>{
                new LoginPage().init();
            },0)
        }

    }
}

new IndexPage();