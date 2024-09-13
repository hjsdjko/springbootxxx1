var projectName = "旧物回收管理系统"

if(!window.menus){
    let menusJSON = localStorage.getItem("menus")
    if(!menusJSON){
        http.get("menu/list",{
            params:{
                page: 1,
                limit: 1,
                sort: 'id',
            }
        }).then(res=>{
            menusJSON = res.data.data.list[0].menujson
            localStorage.setItem("menus", res.data.data.list[0].menujson)
            window.menus = JSON.parse(menusJSON)
        })
    }else{
        window.menus = JSON.parse(menusJSON)
    }
}
var indexMenuList = [
    {
        name: '旧物信息管理',
        icon: '',
        child:[
            {
                name:'旧物信息',
                url:'client/page/jiuwuxinxi/list.html'
            },

        ]
    },
    {
        name: '论坛交流',
        icon: '',
        child:[
            {
                name:'论坛交流',
                url:'client/page/forum/list.html'
            },

        ]
    },
    {
        name: '公告信息管理',
        icon: '',
        child:[
            {
                name:'公告信息',
                url:'client/page/gonggaoxinxi/list.html'
            },

        ]
    },
    {
        name: '资讯信息管理',
        icon: '',
        child:[
            {
                name:'资讯信息',
                url:'client/page/zixunxinxi/list.html'
            },

        ]
    },
]

function navigateTo(menuItem){
    let url = ''
    if (menuItem.tableName == 'center'){
        return
    }
    else if(menuItem.tableName=='examrecord'&&menuItem.menuJump=='22'){
        url = `${baseUrl}client/page/examfailrecord/list.html?centerType=1`
    }
    else if(menuItem.tableName=='exampaper'&&menuItem.menuJump=='12'){
        url =`${baseUrl}client/page/exampaper/list.html?centerType=1`
    }
    else if(menuItem.tableName=='forum'&&menuItem.menuJump=='14'){
        url = `${baseUrl}client/page/forum/list.html?centerType=1&&myType=1`
    }
    else{
        switch (menuItem.menu){
            case '我的收藏':
                url = `${baseUrl}client/page/storeup/list.html?centerType=1&&type=1`
                break;
            default:
                url = `${baseUrl}client/page/${menuItem.tableName}/list.html?centerType=1`
        }
    }
    location.href = url
}
