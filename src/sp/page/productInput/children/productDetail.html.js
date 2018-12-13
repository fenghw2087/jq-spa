/**
 * Created by Administrator on 2018/8/18.
 */
import { editerDefault }  from '../../common/public';

export default ({ id })=>`<div id="${id}" class="page-outer">
<div class="ys-back-btn"></div>
<div class="content-container" style="padding: 20px">
    <div class="section-title">商品详情录入</div>
</div>
<div class="content-container" style="padding: 20px 20px 40px;margin-top: 15px">
    <button style="margin-bottom: 10px" class="btn btn-ys-default open-product-modal"><i class="fa fa-plus"></i>添加商品</button>
    <div class="product-table3" style="margin: 10px 0"></div>
    <!-- The toolbar will be rendered in this container. -->
    <div id="toolbar-container"></div>
    <!-- This container will become the editable. -->
    <div id="editor" style="height: 400px;border: 1px solid #ccc">
        ${editerDefault}
    </div>
    <div class="flexbox aic jcc" style="margin-top: 20px">
        <button class="btn btn-main save-content" style="margin-right: 20px">保 存</button><button class="btn btn-warning cancel-btn">取 消</button>
    </div>
</div>
</div>`