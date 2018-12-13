/**
 * Created by Administrator on 2018/8/12.
 */
export default ({ id })=> {
    return `<div id="${id}" class="page-outer">
<div class="content-container condition-outer">
    <div class="flexbox aic">
        <div class="section-title">角色管理</div>
    </div>
</div>
<div ys-controller="user" class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="section-header" style="margin-bottom: 10px">账户信息</div>
    <div class="flexbox">
        <div class="c-i-c" style="width: 300px">
            <div class="c-i-t" style="width: 7em;text-align: right">用户名：</div>
            <div class="c-i-d" ys-bind="username"></div>
        </div>
        <div class="c-i-c" style="width: 300px">
            <div class="c-i-t" style="width: 7em;text-align: right">密码：</div>
            <div class="c-i-d">******<i style="margin-left: 10px;color: #0d71ff;cursor: pointer" class="fa fa-pencil-square-o changePsd"></i></div>
        </div>
    </div>
    <div class="section-header" style="margin-bottom: 10px;margin-top: 20px">个人信息<span style="color: red;font-size: 12px;margin-left: 20px">注：个人信息如发生变更，请联系管理员进行信息修改</span></div>
    <div class="flexbox">
        <div class="c-i-c" style="width: 300px">
            <div class="c-i-t" style="width: 7em;text-align: right">真实姓名：</div>
            <div class="c-i-d" ys-bind="name"></div>
        </div>
    </div>
    <div class="flexbox">
        <div class="c-i-c" style="width: 300px">
            <div class="c-i-t" style="width: 7em;text-align: right">联系电话：</div>
            <div class="c-i-d" ys-bind="phone"></div>
        </div>
        <div class="c-i-c" style="width: 300px">
            <div class="c-i-t" style="width: 7em;text-align: right">电子邮箱：</div>
            <div class="c-i-d" ys-bind="email"></div>
        </div>
    </div>
    <div class="flexbox" style="margin-bottom: 50px">
        <div class="c-i-c" style="width: 300px">
            <div class="c-i-t" style="width: 7em;text-align: right">微信：</div>
            <div class="c-i-d" ys-bind="wechat"></div>
        </div>
        <div class="c-i-c" style="width: 300px">
            <div class="c-i-t" style="width: 7em;text-align: right">QQ：</div>
            <div class="c-i-d" ys-bind="qq"></div>
        </div>
    </div>
</div>
</div>`
}