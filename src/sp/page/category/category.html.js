/**
 * Created by Administrator on 2018/8/12.
 */
import loading from '../../../component/loading/loading';


export default ({ id })=> {
    return `<div id="${id}" class="page-outer">
<div class="content-container condition-outer">
    <div class="flexbox aic">
        <div class="section-title">类目管理</div>
        <div class="c-i-c" style="width: 400px;margin-left: 20px">
            <div class="c-i-t">类目名称：</div>
            <div class="c-i-d">
                <input class="form-control keyword-c" type="text" placeholder="请输入类目名称" />
            </div>
        </div>
        <div class="flex1"></div>
        <button class="btn btn-ys-default add-category"><i class="fa fa-plus-circle"></i>添加类目</button>
    </div>
</div>
<div class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="common-table-outer">
        <table class="ys-table category-table">
            <thead>
                <tr><th width="50">序号</th><th width="120">类目名称</th><th width="100">类目编码</th><th width="100">类目图片</th><th width="100">创建时间</th><th width="110">是否APP首页显示</th><th width="120">操作</th></tr>
            </thead>
            <tbody></tbody>
        </table>
        <div class="empty-c no-msg-item">没有匹配的类目</div>
        <div class="loading-c flexbox aic jcc" style="height: 150px">${ loading(1) }</div>
        <div class="pagination-c" style="margin-top: 20px"></div>
    </div>
</div>
</div>`
}