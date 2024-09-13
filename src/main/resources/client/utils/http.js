var baseUrl = "http://localhost:8080/cl19196363/";

// 环境的切换
const http = axios.create({
    baseURL: baseUrl,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})
// 请求拦截
http.interceptors.request.use(config => {
    const token = localStorage.getItem('Token')
    if (token) {
        config.headers.Token = token
    }
    return config
}, error => {
    return Promise.reject(error)
})
// 响应拦截
http.interceptors.response.use(response => {
    if (response.data && response.data.code === 401) { // 401, token失效
        this.ELEMENT.Message.error(response.data.msg || '请求出错')
        const keys = Object.keys(localStorage);
        keys.forEach(key=>{
            if(!key.startsWith('admin_')){
                localStorage.removeItem(key);
            }
        })
        setTimeout(()=>{
            location.href = `${baseUrl}client/page/login.html?redirect=`+encodeURIComponent(location.href)
        },1000)
        return Promise.reject(response)
    } else if (response.data && response.data.code === 0) {
        return response
    } else {
        this.ELEMENT.Message.error(response.data.msg || '请求出错')
        return Promise.reject(response)
    }
}, error => {
    this.ELEMENT.Message.error(error.message || '请求出错')
    return Promise.reject(error)
})