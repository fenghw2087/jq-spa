/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './userCenter.html';
import SinglePage from '../../../component/SinglePage/SinglePage';
import YsModel from '../../../component/ysModel/ysModel';
import doRequest from '../../../util/lib/doRequest';
import ChangePsdModal from './changePsdModal';
import message from '../../../component/message/message';

export default class UserCenterPage extends SinglePage{
    constructor(){
        super();
        this.id = 'userCenterPage';
        this.docTitle = '个人中心';
        this.html = htmlStr;
    }

    _init =()=>{
        this._getInfo();
    };

    _getInfo =()=> {
        doRequest({
            url:'admin/user/get',
            type:'post',
            contentType:'application/json;charset=utf-8',
            data:window.currentUser,
            success:data=>{
                if(data.success){
                    this.data = data.data;
                    this.model.setData(data.data);
                }else {
                    message({
                        msg:'获取个人信息失败'
                    })
                }
            }
        })
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.changePsd',function () {
            that.modal.setData({
                fn:data=>{
                    doRequest({
                        url:'user/changePassword',
                        type:'post',
                        contentType:'application/json;charset=utf-8',
                        data:JSON.stringify({
                            username:that.data.username,
                            ...data
                        }),
                        success:res=>{
                            if(res.success){
                                message({
                                    type:'success',
                                    msg:res.errorMsg
                                });
                                that.modal.modalHide();
                            }else {
                                message({
                                    msg:res.errorMsg || '密码修改失败，请联系管理员'
                                });
                            }
                        }
                    })
                }
            }).modalShow();
        })
    };

    _initComponent =()=> {
        this.model = new YsModel({ controller:'user' });
        this.modal = new ChangePsdModal({});
    }

}