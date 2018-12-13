/**
 * Created by Administrator on 2018/8/12.
 */
export default ({ id })=> {
    return `<div id="${id}" class="page-outer">
<div class="content-container condition-outer">
    <div class="flexbox aic">
        <div class="section-title">角色管理</div>
        <div class="c-i-c" style="width: 400px;margin-left: 20px">
            <div class="c-i-t">角色名称：</div>
            <div class="c-i-d">
                <input class="form-control keyword-c" type="text" placeholder="请输入角色名称" />
            </div>
        </div>
        <div class="flex1"></div>
        <button class="btn btn-ys-default add-role"><i class="fa fa-plus-circle"></i>添加角色</button>
    </div>
</div>
<div class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="common-table-outer role-table"></div>
</div>
</div>`
}