/**
 * Created by Administrator on 2018/8/12.
 */
import htmlStr from './pageError.html';
import SinglePage from '../../../component/SinglePage/SinglePage';

export default class PageErrorPage extends SinglePage{
    constructor(){
        super();
        this.id = 'pageErrorPage';
        this.docTitle = '错误提示';
        this.html = htmlStr;
    }

    _init =()=>{
        this._showPage(this.state.code);
    };

    _showPage =(code)=> {
        this.outer.find('.error-page-sc').hide().filter(`.page${code}`).show();
    };

    _bindEvent =()=> {
        const that = this;
        this.pager.on('click','.btn-main',function () {
            that.router.replace({ url:window.basePath })
        })
    };

    _initComponent =()=> {

    }

}