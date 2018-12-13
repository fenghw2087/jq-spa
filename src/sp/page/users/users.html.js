/**
 * Created by Administrator on 2018/8/12.
 */
export default ({ id })=> {
    return `<div id="${id}" class="page-outer">
<div class="content-container condition-outer">
    <div class="flexbox aic">
        <div class="section-title">用户管理</div>
        <div class="c-i-c" style="width: 400px;margin-left: 20px">
            <div class="c-i-t">用户名：</div>
            <div class="c-i-d">
                <input class="form-control keyword-c" type="text" placeholder="请输入用户名称" />
            </div>
        </div>
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t">用户角色：</div>
            <div class="c-i-d role-select" style="width: 180px">
            </div>
        </div>
        <div class="flex1"></div>
        <button class="btn btn-ys-default add-account"><i class="fa fa-plus-circle"></i>添加用户</button>
    </div>
</div>
<div class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="common-table-outer user-table"></div>
</div>
</div>`
}