/**
 * Created by Administrator on 2018/8/26.
 */

export default ({ id })=>`<div id="${id}" class="page-outer">
<div class="ys-back-btn"></div>
<div class="content-container" style="padding: 20px">
    <div class="section-title">商品预览</div>
</div>
<div class="content-container" style="padding: 20px 20px 40px;margin-top: 15px">
    <div class="section-header"><div class="section-title">基本信息</div></div>
    <div class="step-section-c">
        <div ys-controller="basic2">
            <table class="no-body-table basic-table" style="width: 1000px;margin: 20px auto">
                <tbody>
                    <tr>
                        <th width="100">商品名称</th>
                        <td width="400" ys-bind="name"></td>
                        <th width="100">商品编码</th>
                        <td width="400" ys-bind="productNo"></td>
                    </tr>
                    <tr>
                        <th width="100">品牌</th>
                        <td width="400" ys-bind="brand"></td>
                        <th width="100">款式编码</th>
                        <td width="400" ys-bind="styleCode"></td>
                    </tr>
                    <tr>
                        <th width="100">类目</th>
                        <td width="400" ys-bind="categoryName"></td>
                        <th width="100">标签</th>
                        <td width="400" class="label-c"></td>
                    </tr>
                    <tr>
                        <th width="100">规格型号</th>
                        <td width="400" ys-bind="specification"></td>
                        <th width="100">尺码</th>
                        <td width="400" ys-bind="size"></td>
                    </tr>
                    <tr>
                        <th width="100">年份</th>
                        <td width="400" ys-bind="productYear"></td>
                        <th width="100">季节</th>
                        <td width="400" ys-bind="season"></td>
                    </tr>
                    <tr>
                        <th width="100">库存</th>
                        <td width="400" ys-bind="storageSize"></td>
                        <th width="100">图片</th>
                        <td width="400"><div class="basic-img-c"></div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div> 
     <div class="section-header"><div class="section-title">商品进货信息</div></div> 
    <div class="step-section-c">
        <div class="channel-c"></div>
    </div>
    <div class="section-header"><div class="section-title">商品销售信息</div></div>   
    <div class="step-section-c">
        <table class="no-body-table sale-table v-m" style="width: 1000px;margin: 20px auto">
            <tbody>
                <tr>
                    <th width="100">建议售价</th>
                    <td width="400" data-name="suggestPrice"></td>
                    <th width="100">审批价格</th>
                    <td width="400" data-name="auditPrice"></td>
                </tr>
            </tbody>
        </table>
        <div class="channel-i-c">
            <div class="flexbox aic channel-header">
                <div class="channel-name flex1">分段售价</div>
            </div>
            <div class="rank-table" style="padding: 0 20px;margin: 20px 0 10px"></div>
        </div>
        <div class="channel-i-c">
            <div class="flexbox aic channel-header">
                <div class="channel-name flex1">折扣售价</div>
            </div>
            <div class="discount-table" style="padding: 0 20px;margin: 20px 0 10px"></div>
        </div>
    </div>
    <div class="section-header"><div class="section-title">商品详细信息</div></div> 
    <div class="step-section-c">
        <div class="product-detail" style="width: 1000px;margin: 20px auto"></div>
    </div>
</div>
</div>`