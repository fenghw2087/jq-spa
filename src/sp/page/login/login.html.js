/**
 * Created by Administrator on 2018/8/12.
 */
import logo from '../../images/logo.jpg';

export default ()=>{
    return `<div class="login-outer" id="loginPage">
    <div class="login-section">
        <div class="login-logo flexbox aic jcc">
            <img src="${logo}" /><div class="logo-text">商品库管理后台</div>
        </div>
        <div class="login-form-c">
            <div class="input-group input-group-lg" style="margin-bottom: 20px">
                <span class="input-group-addon" style="background-color: #fff"><i class="fa fa-fw fa-users"></i></span>
                <div class="input-group-addon role-select" style="background-color: #fff;width: 100%;border-left: 1px solid #ccc;padding: 0"></div>
            </div>
            <div class="input-group input-group-lg" style="margin-bottom: 20px">
                <span class="input-group-addon" style="background-color: #fff"><i class="fa fa-fw fa-user-o"></i></span>
                <input type="text" style="font-size: 14px" name="username" class="form-control" placeholder="用户名">
            </div>
            <div class="input-group input-group-lg" style="margin-bottom: 20px">
                <span class="input-group-addon" style="background-color: #fff"><i class="fa fa-fw fa-key"></i></span>
                <input type="password" style="font-size: 14px" name="password" class="form-control" placeholder="密码">
            </div>
            <div class="input-group input-group-lg" style="margin-bottom: 30px">
                <span class="input-group-addon" style="background-color: #fff"><i class="fa fa-fw fa-expeditedssl"></i></span>
                <input type="text" style="font-size: 14px" name="verifyCode" class="form-control" placeholder="验证码">
                <span class="input-group-addon" style="background-color: #fff;padding: 0"><img id="vercodeImg" style="height: 100%"></span>
            </div>
        </div>
        <button class="btn btn-main login-btn btn-lg" style="width: 100%;letter-spacing: 20px">登陆</button>
    </div>
</div>`
}