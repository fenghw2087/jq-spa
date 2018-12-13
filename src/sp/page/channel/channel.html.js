/**
 * Created by Administrator on 2018/8/12.
 */
export default ({ id })=> {
    return `<div id="${id}" class="page-outer">
<div class="content-container condition-outer">
    <div class="flexbox aic">
        <div class="section-title">渠道管理</div>
        <div class="c-i-c" style="width: 300px;margin-left: 20px">
            <div class="c-i-t">渠道名称：</div>
            <div class="c-i-d">
                <input class="form-control keyword-c" type="text" name="channelName" placeholder="请输入渠道名称" />
            </div>
        </div>
        <div class="c-i-c" style="width: 300px;margin-left: 10px">
            <div class="c-i-t">联系人：</div>
            <div class="c-i-d">
                <input class="form-control keyword-c" type="text" name="contactorName" placeholder="请输入联系人名称" />
            </div>
        </div>
        <div class="c-i-c" style="margin-left: 10px">
            <div class="c-i-t">渠道经理：</div>
            <div class="c-i-d jl-select" style="width: 130px">
            </div>
        </div>
        <div class="flex1"></div>
        <button class="btn btn-ys-default add-channel"><i class="fa fa-plus-circle"></i>添加渠道</button>
    </div>
</div>
<div class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="common-table-outer channel-table"></div>
</div>
</div>`
}