/**
 * Created by Administrator on 2018/8/9.
 */
export default ({ id })=>`<div id="${id}" class="page-outer">
<div class="content-container condition-outer">
    <div class="flexbox aic">
        <div class="section-title">标签管理</div>
        <div class="c-i-c" style="width: 400px;margin-left: 20px">
            <div class="c-i-t">标签名称：</div>
            <div class="c-i-d">
                <input class="form-control keyword-c" type="text" placeholder="请输入标签名称" />
            </div>
        </div>
        <div class="c-i-c" style="width: 200px;margin-left: 20px">
            <div class="c-i-t">标签状态：</div>
            <div class="c-i-d status-select">
            </div>
        </div>
        <div class="flex1"></div>
        <button class="btn btn-ys-default add-tag"><i class="fa fa-plus-circle"></i>添加标签</button>
    </div>
</div>
<div class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="common-table-outer label-table"></div>
</div>
</div>`