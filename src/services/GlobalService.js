import {getData, getError} from "utils/request";
const API = "http://192.168.3.166:9090/Rtucloud";
const PORT = "9835";

export default class GlobalService {
    static async getOnlineDevices() {
        return axios.get(API + '/onlinedevices').then(getData).catch(getError);
    }

    static async init() {
        return axios.get(API + '/init', { params: { port: PORT } }).then(getData).catch(getError);
    }

    static async downloadFile(deviceid, filename, filecontent) {
        return axios.get(API + '/downloadFile', { params: { deviceid, filename, filecontent } })
            .then((resp) => getData(resp, "保存"))
            .catch(getError);
    }

    static async compile(deviceid) {
        return axios.get(API + '/compile', { params: { deviceid } })
            .then((resp) => getData(resp, "编译"))
            .catch(getError);
    }

    static async flash(deviceid) {
        return axios.get(API + '/flash', { params: { deviceid } })
            .then((resp) => getData(resp, "烧录"))
            .catch(getError);
    }
}