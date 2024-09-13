var toolUtil = {
    storageSet(key, value) {
        localStorage.setItem('admin_'+key, value);
    },
    storageGet(key) {
        const str = localStorage.getItem('admin_'+key)
        return str || '';
    },
    storageRemove(key) {
        localStorage.removeItem(key);
    },
    storageClear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key=>{
            if(key.startsWith('admin_') && !key.startsWith('sys_')){
                localStorage.removeItem(key);
            }
        })
    },
    /**
     * 邮箱
     *
     */
    isEmail(s) {
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
    },
    /**
     * 手机号码
     *
     */
    isMobile(s) {
        return /^(0|86|17951)?(13[0-9]|15[012356789]|16[6]|19[89]|17[01345678]|18[0-9]|14[579])[0-9]{8}$/.test(s)
    },
    /**
     * 电话号码
     *
     */
    isPhone(s) {
        return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
    },
    /**
     * URL地址
     *
     */
    isURL(s) {
        return /^http[s]?:\/\/.*/.test(s)
    },
    /**
     * 匹配数字，可以是小数，不可以是负数,可以为空
     *
     */
    isNumber(s) {
        return /(^-?[+-]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$)|(^$)/.test(s);
    },
    /**
     * 匹配整数，可以为空
     *
     */
    isIntNumer(s) {
        return /(^-?\d+$)|(^$)/.test(s);
    },
    /**
     * 身份证校验
     */
    checkIdCard(idcard) {
        const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!regIdCard.test(idcard)) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 是否有权限
     * @param {*} key
     */
    isAuth(tableName, key) {
        let role = toolUtil.storageGet("role");
        if (!role) {
            role = '管理员';
        }
        let json_menuList = toolUtil.storageGet("menuList")
        let menuList = json_menuList?JSON.parse(json_menuList):[];
        if(!menuList.length)return false
        for (let j = 0; j < menuList.length; j++) {
            for (let k = 0; k < menuList[j].child.length; k++) {
                let sArr = tableName.split('/')
                if (sArr.length > 1) {
                    if (sArr[0] == menuList[j].child[k].tableName &&
                            (sArr[1] == menuList[j].child[k].menuJump || sArr[1] == menuList[j].child[k].menu)) {
                        if(key=='any')return true
                        return menuList[j].child[k].buttons.find(option=>(option==key))
                    }
                } else {
                    if (tableName == menuList[j].child[k].tableName) {
                        let buttons = menuList[j].child[k].buttons.join(',');
                        return buttons.indexOf(key) !== -1 || false
                    }
                }
            }
        }
        return false;
    },
    /**
     * 获取当前时间（yyyy-MM-dd hh:mm:ss）
     */
    getCurDateTime() {
        let currentTime = new Date(),
            year = currentTime.getFullYear(),
            month = currentTime.getMonth() + 1 < 10 ? '0' + (currentTime.getMonth() + 1) : currentTime.getMonth() +
                1,
            day = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate(),
            hour = currentTime.getHours(),
            minute = currentTime.getMinutes(),
            second = currentTime.getSeconds();
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    },
    /**
     *  获取当前日期（yyyy-MM-dd）
     */
    getCurDate() {
        let currentTime = new Date(),
            year = currentTime.getFullYear(),
            month = currentTime.getMonth() + 1 < 10 ? '0' + (currentTime.getMonth() + 1) : currentTime.getMonth() +
                1,
            day = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();
        return year + "-" + month + "-" + day;
    },
    getUrlParamsByKey(key) {
        let queryStr = window.location.href.split('?')[1]
        return new URLSearchParams('?' + queryStr).get(key)
    },

    /*form表单校验*/
    fromValidate: {
        //匹配整数
        intNumber: (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!toolUtil.isIntNumer(value)) {
                callback(new Error("请输入整数"));
            } else {
                callback();
            }
        },
        //匹配数字
        number: (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!toolUtil.isNumber(value)) {
                callback(new Error("请输入数字"));
            } else {
                callback();
            }
        },
        //匹配手机号码
        mobile: (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!toolUtil.isMobile(value)) {
                callback(new Error("请输入正确的手机号码"));
            } else {
                callback();
            }
        },
        //匹配电话号码
        phone: (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!toolUtil.isPhone(value)) {
                callback(new Error("请输入正确的电话号码"));
            } else {
                callback();
            }
        },
        //匹配邮箱
        email: (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!toolUtil.isEmail(value)) {
                callback(new Error("请输入正确的邮箱地址"));
            } else {
                callback();
            }
        },
        //匹配身份证
        idCard: (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!toolUtil.checkIdCard(value)) {
                callback(new Error("请输入正确的身份证号码"));
            } else {
                callback();
            }
        },
        //匹配网站地址
        url: (rule, value, callback) => {
            if (!value) {
                callback();
            } else if (!toolUtil.isURL(value)) {
                callback(new Error("请输入正确的URL地址"));
            } else {
                callback();
            }
        },
        richText: (rule, value, callback) => {
            if (!value) {
                callback();
            } else {
                if (/[^(<p>|</p>|<br>|\s)]/.test(value)) {
                    callback();
                } else {
                    callback(new Error("请输入"));
                }
            }
        }
    },
    /*加载script并监听加载完成事件*/
    loadScript(src, callback) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        // 对于IE，我们需要在onreadystatechange和onload事件中分别处理
        script.onreadystatechange = function () {
            if (this.readyState === 'complete' || this.readyState === 'loaded') {
                callback();
            }
        }
        // 其他浏览器
        script.onload = function () {
            callback();
        }
        // 对于错误的情况，执行回调函数
        script.onerror = function () {
            console.error('load script error:', src);
        }
        document.body.appendChild(script);
    },
    /*等待多个script加载完成*/
    loadScripts(scripts, callback) {
        var counter = 0;
        var total = scripts.length;

        function onLoad() {
            counter++;
            if (counter === total) {
                callback();
            }
        }

        scripts.forEach(function (src) {
            this.toolUtil.loadScript(src, onLoad);
        });
    },
    /**
     *
     * @param {Array} workSheetData 二维数组
     * @param {String} fileName 下载时文件名称
     */
    exportExcelByArray(workSheetData, fileName = 'example.xlsx'){
        const ws = XLSX.utils.aoa_to_sheet(workSheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, ws);
        return XLSX.writeFile(workbook, fileName, { type: 'binary' });
    },
}