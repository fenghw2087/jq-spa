/**
 * Created by Administrator on 2018/8/12.
 */
export default ({ id })=> {
    return `<div id="${id}" class="page-outer">
<div class="content-container condition-outer">
    <div class="flexbox aic">
        <div class="section-title">商品录入</div>
        <div class="c-i-c" style="width: 300px;margin-left: 20px">
            <div class="c-i-t">商品编码：</div>
            <div class="c-i-d">
                <input class="form-control keyword-c" type="text" placeholder="请输入商品编码" />
            </div>
        </div>
        <div class="c-i-c" style="width: 160px;">
            <div class="c-i-d price-select">
            </div>
        </div>
        <div class="c-i-c" style="width: 160px">
            <div class="c-i-d detail-select">
            </div>
        </div>
        <div class="flex1"></div>
    </div>
</div>
<div class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="flexbox jcfe" style="margin-bottom: 10px">
        <button class="btn btn-ys-default jump-to-basic" style="margin-right: 20px"><i class="fa fa-plus-circle"></i>基本信息录入</button>
        <button class="btn btn-ys-default upload-excel" style="margin-right: 20px"><i class="fa fa-file-excel-o"></i>基本信息批量导入</button>
        <button class="btn btn-ys-default price-btn"><i class="fa fa-cny"></i>价格录入</button>
        <button style="margin-left: 20px" class="btn btn-ys-default detail-btn"><i class="fa fa-list-ol"></i>详情录入</button>
    </div>
    <div class="common-table-outer product-table2 product-table"></div>
</div>
</div>`
}