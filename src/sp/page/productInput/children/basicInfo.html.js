/**
 * Created by Administrator on 2018/8/15.
 */
export default ({ id })=>`<div id="${id}" class="page-outer">
<div class="ys-back-btn"></div>
<div class="content-container" style="padding: 20px">
    <div class="section-title">基本信息录入</div>
</div>
<div class="content-container" style="padding: 20px">
    <div style="width: 1000px;margin: 0 auto">
        <div class="flexbox jcfe">
            <button style="margin: 0 20px 20px 0" class="btn btn-ys-default open-product-modal"><i class="fa fa-mail-forward"></i>导入相似商品</button>
        </div>
        <div class="flexbox aic jcsb" style="margin-bottom:20px" style="margin-bottom:10px">
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t is-must" style="width: 10em;text-align: right">商品名称：</div>
                <div class="c-i-d">
                    <input class="form-control" name="name" type="text" placeholder="输入商品名称" />
                </div>
            </div>
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t is-must" style="width: 10em;text-align: right">商品编码：</div>
                <div class="c-i-d">
                    <input class="form-control" name="productNo" type="text" placeholder="输入商品编码" />
                </div>
            </div>
        </div>
        <div class="flexbox aic jcsb" style="margin-bottom:20px">
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t is-must" style="width: 10em;text-align: right">品牌：</div>
                <div class="c-i-d">
                    <input class="form-control" name="brand" type="text" placeholder="输入品牌" />
                </div>
            </div>
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t" style="width: 10em;text-align: right">款式编码：</div>
                <div class="c-i-d">
                    <input class="form-control" name="styleCode" type="text" placeholder="输入款式编码" />
                </div>
            </div>
        </div>
        <div class="flexbox aic jcsb" style="margin-bottom:20px">
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t is-must" style="width: 10em;text-align: right">类目：</div>
                <div class="c-i-d flexbox jcsb aic">
                    <div class="category-select" style="width:160px"></div>
                    <div class="category-select2" style="width:160px;display:none"></div>
                </div>
            </div>
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t" style="width: 10em;text-align: right">标签：</div>
                <div class="c-i-d label-checks"></div>
            </div>
        </div>
        <div class="flexbox aic jcsb" style="margin-bottom:20px">
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t is-must" style="width: 10em;text-align: right">规格型号：</div>
                <div class="c-i-d">
                    <input class="form-control" name="specification" type="text" placeholder="输入规格型号" />
                </div>
            </div>
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t" style="width: 10em;text-align: right">尺码：</div>
                <div class="c-i-d">
                    <input class="form-control" name="size" type="text" placeholder="输入尺码" />
                </div>
            </div>
        </div>
        <div class="flexbox aic jcsb" style="margin-bottom:20px">
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t" style="width: 10em;text-align: right">年份：</div>
                <div class="c-i-d year-select"></div>
            </div>
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t" style="width: 10em;text-align: right">季节：</div>
                <div class="c-i-d season-select"></div>
            </div>
        </div>
        <div class="flexbox aic jcsb" style="margin-bottom:20px">
            <div class="c-i-c" style="width: 480px">
                <div class="c-i-t is-must" style="width: 10em;text-align: right">库存：</div>
                <div class="c-i-d">
                    <input class="form-control" name="storageSize" type="number" placeholder="输入库存" />
                </div>
            </div>
        </div>
        <div class="flexbox aic">
            <div class="c-i-c aifs">
                <div class="c-i-t is-must" style="width: 10em;text-align: right">图片：</div>
                <div class="c-i-d">
                    <div style="margin-bottom: 10px;color: #666;line-height:32px">【注：默认第一张图片为封面图】</div>
                    <div class="upload-imgs" style="height: 100px"></div>
                </div>
            </div>
        </div>
        <div class="flexbox aic jcc" style="margin-top: 20px">
            <button class="btn btn-main save-btn">保 存</button>
            <button class="btn btn-warning reset-btn" style="margin-left: 30px">重 置</button>
            <button class="btn btn-ys-default cancel-btn" style="margin-left: 30px">取 消</button>
        </div>
    </div>
</div>
</div>`