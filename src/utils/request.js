import {message} from 'antd';
import GlobalService from "services/GlobalService";

// 根据api格式
const getData = (resp, opera="") => {
    const respData = resp.data;
    if(respData.status === "success") {
        if(opera){
            message.success(opera + "成功!");
        }
        return respData.data;
    } else {
        switch(respData.err) {
            case "未初始化":
                GlobalService.init();
                break;
            default:
                message.error(respData.err);
        }
    }
    return null;
};

const getError = (err) => message.error(err.message);

export {getData, getError};