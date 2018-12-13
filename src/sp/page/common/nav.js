/**
 * Created by Administrator on 2018/8/9.
 */
//当前页面路径
const path = window.location.pathname;

import doRequest from '../../../util/lib/doRequest';
import { pageTail } from '../common/public';

/**
 * 导出导航数据
 * @type {*[]}
 */
export const nav = [
    {
        name:'商品查询',
        icon:'fa-shopping-bag',
        url:`${window.basePath}index${pageTail}`,
        active:`${window.basePath}index${pageTail}` === path || path === window.basePath,
        code:'PRODUCT_QUERY'
    },{
        name:'商品录入',
        icon:'fa-share-square',
        url:`${window.basePath}product-input${pageTail}`,
        active:path.indexOf('product-input')>-1,
        code:'PRODUCT_MANAGE'
    },{
        name:'渠道管理',//导航名称
        icon:'fa-shopping-cart',//导航小图标
        url:`${window.basePath}channel${pageTail}`,
        active:`${window.basePath}channel${pageTail}` === path,
        code:'CHANNEL_MANAGE',
    },{
        name:'类目管理',
        icon:'fa-sitemap',
        url:`${window.basePath}category${pageTail}`,
        active:path.indexOf('category')>-1,
        code:'CATEGORY_MANAGE',
    },{
        name:'标签管理',
        icon:'fa-tags',
        url:`${window.basePath}label${pageTail}`,
        active:path.indexOf('label')>-1,
        code:'LABEL_MANAGE',
    },{
        name:'用户权限',
        icon:'fa-user-secret',
        active:path.indexOf('users')>-1,
        code:'USER_MANAGE',
        children:[
            {
                name:'用户管理',
                icon:'fa-users',
                url:`${window.basePath}users-account${pageTail}`,
                active:`${window.basePath}users-account${pageTail}` === path
            },{
                name:'角色管理',
                icon:'fa-user',
                url:`${window.basePath}users-role${pageTail}`,
                active:`${window.basePath}users-role${pageTail}` === path
            }
        ]
    },{
        name:'个人中心',
        icon:'fa-user-circle-o',
        url:`${window.basePath}userCenter${pageTail}`,
        active:`${window.basePath}userCenter${pageTail}` === path
    }
];

const $body = $('body');
$body.on('click','.l-t-logo',function () {
    window.location.href = window.basePath + nav[0].url;
}).on('click','a.has-sec',function () {
    $(this).toggleClass('show-sec').siblings().removeClass('show-sec');
    return false;
}).on('click','.logout-btn',function () {
    doRequest({
        url:'logout',
        type:'post',
        success:data=>{
            if(data.success){
                window.localStorage.removeItem('islogin');
                window.localStorage.removeItem('privilege');
                window.location.href = window.basePath;
            }
        }
    });
    return false;
});

//渲染左侧导航
export const renderNav =(nav)=> {
    $('.nav-list-c').html(nav.map(v=>{
        if(v.reject) return '';
        return `<a class="${v.active?'active show-sec':''}${(v.children && v.children.length)?' has-sec':''}" ${ v.url?`href="${v.url}"`:''}><div class="nav-icon-c"><i class="fa fa-fw ${v.icon}"></i></div>${v.name}</a>${getChildrenNav(v)}`
    }));
    $('#currentUserNameC').text(window.currentNickUser);
};

function getChildrenNav(v) {
    const children = v.children || [];
    if(!children.length) return '';
    return `<div class="sec-nav-c">${children.map(v2=>{
        return `<a class="sec-nav-a${v2.active?' active':''}" href="${v2.url}"><i class="fa fa-fw ${v2.icon}"></i>${v2.name}</a>`
    }).join('')}</div>`
}