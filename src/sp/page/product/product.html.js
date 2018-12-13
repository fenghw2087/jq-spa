/**
 * Created by Administrator on 2018/8/12.
 */
export default ({ id })=> {
    return `<div id="${id}" class="page-outer">
<div class="content-container condition-outer condition-toggle" style="min-width: 1250px">
    <div class="flexbox aic">
        <div class="section-title">商品查询</div>
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">商品名称：</div>
            <div class="c-i-d" style="width: 250px">
                <input class="form-control keyword-c" type="text" name="name" placeholder="请输入商品名称" />
            </div>
        </div>
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">商品编码：</div>
            <div class="c-i-d" style="width: 250px">
                <input class="form-control keyword-c" type="text" name="productNo" placeholder="请输入标签名称" />
            </div>
        </div>
        <button class="btn btn-link show-more"><div class="close-item">展开高级查询<i class="fa fa-chevron-down"></i></div><div class="open-item">收起高级查询<i class="fa fa-chevron-up"></i></div></button>
    </div>
    <div class="more-condition-c flexbox aic" style="padding-left: 71px;margin-top: 18px">
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">款式编码：</div>
            <div class="c-i-d" style="width: 250px">
                <input class="form-control keyword-c" type="text" name="styleCode" placeholder="请输入款式编码" />
            </div>
        </div>
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">品牌：</div>
            <div class="c-i-d" style="width: 250px">
                <input class="form-control keyword-c" type="text" name="brandName" placeholder="请输入品牌" />
            </div>
        </div>
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">渠道：</div>
            <div class="c-i-d" style="width: 250px">
                <input class="form-control keyword-c" type="text" name="channelName" placeholder="请输入渠道" />
            </div>
        </div>
    </div>
    <div class="more-condition-c flexbox aic" style="padding-left: 71px;margin-top: 18px">
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">最新进价：</div>
            <div class="c-i-d flexbox" style="width: 250px">
                <div class="flex1"><input class="form-control" type="number" name="purchasePriceBegin" /></div><div style="margin: 0 5px;line-height: 30px">-</div>
                <div class="flex1"><input class="form-control" type="number" name="purchasePriceEnd" /></div>
            </div>
        </div>
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">类目：</div>
            <div class="c-i-d category-select" style="width: 250px">
            </div>
        </div>
        <div class="c-i-c" style="margin-left: 20px">
            <div class="c-i-t" style="width: 5em">商品标签：</div>
            <div class="c-i-d label-check" style="width: 250px">
            </div>
        </div>
    </div>
    <div class="flexbox aic jcc" style="width: 1160px;margin-top: 20px">
        <button class="btn btn-main search-btn" style="margin-right: 20px"><i class="fa fa-search"></i>查询</button>
        <button class="btn btn-warning reset-btn"><i class="fa fa-refresh"></i>重置</button>
    </div>
</div>
<div class="content-container" style="margin-top: 10px;padding: 20px">
    <div class="common-table-outer product-table" style="min-height: 100px"></div>
    <div class="pagination-outer" style="margin-top: 15px"></div>
</div>
</div>`
}