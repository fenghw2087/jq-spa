/**
 * Created by Administrator on 2018/8/12.
 */
export default class SinglePage {
    constructor(){
        this.hasInit = false;
    }

    init =( route,router,type,outer )=> {
        this.state = route.state;
        this.router = router;
        if(!this.hasInit){
            this.outer = outer;
            this.DidMount =  this._renderHtml();
            this.hasInit = true;
        }
        document.title = this.docTitle || '商品库';
        this.pager && this.pager.show();
        this.DidMount.then(()=>{
            this._init();
        })
    };

    _renderHtml =()=> {
        return new window.Promise(res=>{
            this.outer.append(this.html({ id:this.id }));
            setTimeout(()=>{
                this.pager = $('#'+this.id).show();
                this._initComponent();
                this._bindEvent();
                res();
            },0);
        });
    };

}