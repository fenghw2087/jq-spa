import './less/nav.less';
import setLocalStorage from "../../../util/lib/setLocalStorage";


//当前页面路径
const path = window.location.pathname;

/**
 * 导出导航数据
 * @type {*[]}
 */
export const nav = [
    {
        name:'商品管理',
        icon:'fa-shopping-bag',
        url:`${window.basePath}goodsList`,
        active:`${window.basePath}goodsList` === path,
    },{
        name:'商品录入',
        icon:'fa-share-square',
        url:`${window.basePath}goodsInput`,
        active:`${window.basePath}goodsInput` === path,
    },{
        name:'渠道管理',//导航名称
        icon:'fa-shopping-cart',//导航小图标
        url:`${window.basePath}supplier`,
        active:`${window.basePath}supplier` === path,
    },{
        name:'类目管理',
        icon:'fa-sitemap',
        url:`${window.basePath}category/index`,
        active:path.indexOf('category')>-1,
    },{
        name:'标签管理',
        icon:'fa-tags',
        url:`${window.basePath}tag/index`,
        active:path.indexOf('tag')>-1,
    },{
        name:'用户权限',
        icon:'fa-user-secret',
        url:`${window.basePath}users/account`,
        active:path.indexOf('users')>-1,
        children:[
            {
                name:'用户管理',
                icon:'fa-users',
                url:`${window.basePath}users/account`,
                active:`${window.basePath}users/account` === path
            },{
                name:'角色管理',
                icon:'fa-user',
                url:`${window.basePath}users/role`,
                active:`${window.basePath}users/role` === path
            }
        ]
    },{
        name:'个人中心',
        icon:'fa-user-circle-o',
        url:`${window.basePath}userInfo`,
        active:`${window.basePath}userInfo` === path
    }
];

//导出用户是否具有监控权限
export const hasMonitor = !!nav[4].url;
if(!hasMonitor){
    //移除监控消息相关
    $('.monitor-type').remove();
}

const $body = $('body');
$body.on('click','.toggle-slider',function () {
    $body.toggleClass('active');
    if($body.hasClass('active')){
        setLocalStorage('slider',2)
    }else {
        setLocalStorage('slider',1)
    }
}).on('click','.l-t-logo',function () {
    window.location.href = window.basePath + nav[0].url;
}).on('click','a.has-sec',function () {
    $(this).addClass('show-sec').siblings().removeClass('show-sec');
    return false;
});

//渲染左侧导航
$('.nav-list-c').html(nav.map(v=>{
    return v.url?`<a class="${v.active?'active show-sec':''}${(v.children && v.children.length)?' has-sec':''}" href="${v.url}"><div class="nav-icon-c"><i class="fa fa-fw ${v.icon}"></i></div>${v.name}</a>${getChildrenNav(v)}`:''
}));

function getChildrenNav(v) {
    const children = v.children || [];
    if(!children.length) return '';
    return `<div class="sec-nav-c">${children.map(v2=>{
        return `<a class="sec-nav-a${v2.active?' active':''}" href="${v2.url}"><i class="fa fa-fw ${v2.icon}"></i>${v2.name}</a>`
    }).join('')}</div>`
}
