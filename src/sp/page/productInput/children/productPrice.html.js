/**
 * Created by Administrator on 2018/8/15.
 */
export default ({ id })=>`<div id="${id}" class="page-outer">
<div class="ys-back-btn"></div>
<div class="content-container" style="padding: 20px">
    <div class="section-title">价格信息录入</div>
</div>
<div class="content-container" style="padding: 20px 20px 50px;margin-top: 15px">
    <div class="ys-step-o">
        <div class="step-item current">
            <div class="step-icon"><span class="step-num">1</span><i class="fa fa-check"></i></div>
            <div class="step-content">选择商品</div>
        </div>
        <div class="step-bar"></div>
        <div class="step-item">
            <div class="step-icon"><span class="step-num">2</span><i class="fa fa-check"></i></div>
            <div class="step-content">录入进货信息</div>
        </div>
        <div class="step-bar"></div>
        <div class="step-item">
            <div class="step-icon"><span class="step-num">3</span><i class="fa fa-check"></i></div>
            <div class="step-content">录入销售信息</div>
        </div>
    </div>
    <div class="step-section current">
        <div class="section-header"><div class="section-title">选择商品</div></div>
        <div class="step-section-c">
            <button style="margin-bottom: 10px" class="btn btn-ys-default open-product-modal current-show"><i class="fa fa-mail-forward"></i>选择商品</button>
            <div class="" ys-controller="basic">
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
                            <th width="100">尺码</th>
                            <td width="400" ys-bind="size"></td>
                        </tr>
                        <tr>
                            <th width="100">规格型号</th>
                            <td width="400" ys-bind="specification"></td>
                            <th width="100">图片</th>
                            <td width="400"><div class="basic-img-c"></div></td>
                        </tr>
                    </tbody>
                </table>
                <div class="btn-group1" style="text-align: center">
                    <button class="btn btn-main to-step2" style="margin-right: 20px">下一步</button><button class="btn btn-ys-default cancel-btn">取消</button>
                </div>
            </div>
        </div>   
    </div>
    <div class="step-section">
        <div class="section-header"><div class="section-title">录入进货信息</div></div> 
        <div class="step-section-c">
            <button style="margin-bottom: 10px" class="btn btn-ys-default open-channel-modal current-show"><i class="fa fa-mail-forward"></i>选择渠道</button>
            <div class="channel-c"></div>
            <div class="btn-group2" style="text-align: center;margin: 20px  auto">
                <button class="btn btn-main to-step3" style="margin-right: 20px;display: none">下一步</button><button class="btn btn-warning back-step1" style="margin-right: 20px">上一步</button><button class="btn btn-ys-default cancel-btn">取消</button>
            </div>
        </div>
    </div>
    <div class="step-section">
        <div class="section-header"><div class="section-title">录入销售信息</div></div>   
        <div class="step-section-c">
            <table class="no-body-table sale-table v-m" style="width: 1000px;margin: 20px auto">
                <tbody>
                    <tr>
                        <th width="100"><span class="is-must">建议售价</span></th>
                        <td width="400"><input type="number" class="form-control" name="suggestPrice" placeholder="请输入商品建议售价" /></td>
                        <th width="100">审批价格</th>
                        <td width="400"><input type="number" class="form-control" name="auditPrice" placeholder="请输入商品审批价格" /></td>
                    </tr>
                </tbody>
            </table>
            <div class="channel-i-c">
                <div class="flexbox aic channel-header">
                    <div class="channel-name flex1">分段售价</div>
                </div>
                <div class="rank-table" style="padding: 0 20px;margin: 20px 0 10px"></div>
                <table class="no-body-table v-m" style="width: 1000px;margin: 20px 0">
                    <tbody>
                        <tr>
                            <th width="80">分段数量</th>
                            <td width="350"><input type="number" class="form-control" name="rankAmount" placeholder="请输入本段内一次性购买上限" /></td>
                            <th width="80">分段售价</th>
                            <td width="350"><input type="number" class="form-control" name="rankPrice" placeholder="请输入当前分段售卖价格" /></td>
                            <td width="100"><a class="btn btn-link add-new-rank">添加</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="channel-i-c">
                <div class="flexbox aic channel-header">
                    <div class="channel-name flex1">折扣售价</div>
                </div>
                <div class="discount-table" style="padding: 0 20px;margin: 20px 0 10px"></div>
                <table class="no-body-table v-m" style="width: 1000px;margin: 20px 0">
                    <tbody>
                        <tr>
                            <th width="80">入库日期</th>
                            <td width="350"><input type="text" class="form-control" name="instoreDate" placeholder="请选择入库日期" /></td>
                            <th width="80">商品折扣</th>
                            <td width="350"><input type="number" class="form-control" name="discountRate" placeholder="如：9折请输入0.9" /></td>
                            <td width="100"><a class="btn btn-link add-discount">添加</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-group3" style="text-align: center;margin: 20px 0">
                <button class="btn btn-main save-all" style="margin-right: 20px">保存</button><button class="btn btn-warning back-step2" style="margin-right: 20px">上一步</button><button class="btn btn-ys-default cancel-btn">取消</button>
            </div>
        </div>
    </div>
</div>
</div>`