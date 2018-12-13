/**
 * Created by Administrator on 2018/8/12.
 */
import './login.less';
import Dropdown from '../../../component/dropDown/dropdown';
import doRequest from '../../../util/lib/doRequest';

import message from '../../../component/message/message';

export default class LoginPage {
    constructor(){
        this.id = 'loginPage';
        this.hasInit = false;
        this.data = {

        }
    }

    init(){
        if(!this.hasInit){
            this.outer = $('#'+this.id);
            this._initComponent();
            this._bindEvent();
            this._getRole();
        }
        this._getVerCode();
    }

    _getVerCode =()=> {
        const _prev = _DEV_ === 'dev'?'/api/':window.basePath;
        $('#vercodeImg').attr('src',`${_prev}verifycode/get?ts=${Date.now()}`);
    };

    _checkData =()=> {
        if(!this.data.roleId){
            message({
                msg:'请选择要登陆的角色'
            });
            return false;
        }
        const username = this.outer.find('input[name="username"]').val().trim();
        if(!username){
            message({
                msg:'请输入用户名'
            });
            return false;
        }
        this.data.username = username;
        const password = this.outer.find('input[name="password"]').val().trim();
        if(!password){
            message({
                msg:'请输入密码'
            });
            return false;
        }
        this.data.password = password;
        const verifyCode = this.outer.find('input[name="verifyCode"]').val().trim();
        if(!verifyCode){
            message({
                msg:'请输入验证码'
            });
            return false;
        }
        this.data.verifyCode = verifyCode;
        return true;
    };

    _doLogin =()=> {
        doRequest({
            url:'login',
            type:'post',
            contentType:'application/json;charset=utf-8',
            data: JSON.stringify(this.data),
            success:(data)=> {
                if(data.success){
                    window.localStorage.setItem('islogin','login');
                    window.location.href = `${window.basePath}`;
                }else {
                    this._getVerCode();
                    message({
                        msg:data.errorMsg || '登录失败！'
                    })
                }
            }
        })
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.login-btn',function () {
            that._checkData() && that._doLogin();
        }).on('click','#vercodeImg',function () {
            that._getVerCode();
        }).on('keydown','input[name="verifyCode"]',function (e) {
            if(e.keyCode === 13){
                that._checkData() && that._doLogin();
            }
        })
    };

    _getRole =()=> {
        doRequest({
            url:'roleSelect',
            type:'post',
            contentType:'application/json;charset=utf-8',
            success:(data)=> {
                this.roleSelct.renderList(data.data)
            }
        })
    };

    _initComponent =()=> {
        document.title = '商品库-登录';
        this.roleSelct = new Dropdown({
            obj:this.outer.find('.role-select'),
            onSelectChange:current=>{
                this.data.roleId = current.id;
            },
            renderLi:row=>row.name,
            btnStyle:'border:none',
            placeholder:'请选择登陆角色',
            menuStyle:'max-height:300px;overflow-y:auto'
        })
    }
}