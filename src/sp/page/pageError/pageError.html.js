/**
 * Created by Administrator on 2018/8/12.
 */
import img403 from '../../images/403.svg';
import img404 from '../../images/404.svg';

export default ({ id })=> {
    return `<div id="${id}" class="page-outer" style="height: 100%">
    <div class="flexbox aic jcc error-page-sc page403" style="height: 500px;display: none">
        <div style="width: 400px;height: 360px;background: url(${img403}) no-repeat scroll center / auto 100%"></div>
        <div style="margin-left: 120px">
            <div style="font-size: 72px;line-height: 1;margin-bottom: 24px">403</div>
            <div style="font-size: 20px;line-height: 1;margin-bottom: 16px;color: #999">抱歉，你无权访问该页面</div>
            <button class="btn btn-main">返回首页</button>
        </div>
    </div>
    <div class="flexbox aic jcc error-page-sc page404" style="height: 500px;display: none">
        <div style="width: 400px;height: 360px;background: url(${img404}) no-repeat scroll center / auto 100%"></div>
        <div style="margin-left: 120px">
            <div style="font-size: 72px;line-height: 1;margin-bottom: 24px">404</div>
            <div style="font-size: 20px;line-height: 1;margin-bottom: 16px;color: #999">抱歉，你访问的页面不存在</div>
            <button class="btn btn-main">返回首页</button>
        </div>
    </div>
</div>`
}