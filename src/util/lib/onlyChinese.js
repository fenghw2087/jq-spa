/**
 * Created by Administrator on 2018/7/30.
 */
const onlyChinese =(val)=>{
    return /^[(\u4e00-\u9fa5)]+$/.test(val)
};
export default onlyChinese;