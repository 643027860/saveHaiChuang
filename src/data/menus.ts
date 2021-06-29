export default [
  {
    "path": "/login",
    "name": "login",
    "meta": {
      "title": "登录"
    },
    "component": "views/login/index.vue",
    "children": []
  },
  {
    "path": "/manage",
    "name": "manage",
    "meta": {
      "title": "管理端",
      "auth": true,
      "role": 0
    },
    "component": "views/manage/index.vue",
    "children": [
      {
        "path": "testing",
        "name": "testing",
        "meta": {
          "title": "监控中心",
          "icon": "el-icon-monitor",
          "auth": true,
          "role": 0
        },
        "component": "views/manage/testing/index.vue",
        "children": []
      },
      {
        "path": "mien",
        "name": "mien",
        "meta": {
          "title": "团队风采",
          "icon": "el-icon-ship",
          "auth": true,
          "role": 0
        },
        "component": "views/manage/mien/index.vue",
        "children": [
          {
            "path": "list",
            "name": "mien-list",
            "meta": {
              "title": "风采列表",
              "auth": true,
              "role": 0
            },
            "component": "views/manage/mien/list.vue"
          },
          {
            "path": "classify",
            "name": "mien-classify",
            "meta": {
              "title": "风采分类",
              "auth": true,
              "role": 0
            },
            "component": "views/manage/mien/classify.vue"
          },
          {
            "path": "publish",
            "name": "mien-publish",
            "meta": {
              "title": "风采发布",
              "auth": true,
              "role": 0
            },
            "component": "views/manage/mien/publish.vue"
          }
        ],
        "redirect": {"name": "mien-list"}
      },
      {
        "path": "resource",
        "name": "resource",
        "meta": {
          "title": "资源管理",
          "icon": "el-icon-document",
          "auth": true,
          "role": 0
        },
        "component": "views/manage/resource/index.vue",
        "children": [
          {
            "path": "list",
            "name": "resource-list",
            "meta": {
              "title": "资源列表",
              "auth": true,
              "role": 0
            },
            "component": "views/manage/resource/list.vue"
          },
          {
            "path": "classify",
            "name": "resource-classify",
            "meta": {
              "title": "资源分类",
              "auth": true,
              "role": 0
            },
            "component": "views/manage/resource/classify.vue"
          },
          {
            "path": "publish",
            "name": "resource-publish",
            "meta": {
              "title": "资源上传",
              "auth": true,
              "role": 0
            },
            "component": "views/manage/resource/publish.vue"
          }
        ],
        "redirect": {"name": "resource-list"}
      },
      {
        "path": "user",
        "name": "user",
        "meta": {
          "title": "成员管理",
          "icon": "el-icon-user",
          "auth": true,
          "role": 1
        },
        "component": "views/manage/user/index.vue",
        "children": [
          {
            "path": "list",
            "name": "user-list",
            "meta": {
              "title": "账号列表",
              "auth": true,
              "role": 1
            },
            "component": "views/manage/user/list.vue"
          },
          {
            "path": "detail",
            "name": "user-detail",
            "meta": {
              "title": "用户详情",
              "hidden": true,
              "auth": true,
              "role": 1
            },
            "component": "views/manage/user/detail.vue"
          },
          {
            "path": "group",
            "name": "user-group",
            "meta": {
              "title": "组别管理",
              "auth": true,
              "role": 1
            },
            "component": "views/manage/user/group.vue"
          },
          {
            "path": "group/detail",
            "name": "user-group-detail",
            "meta": {
              "title": "组别详情",
              "activeName": "user-group",
              "hidden": true,
              "auth": true,
              "role": 1
            },
            "component": "views/manage/user/group-detail.vue"
          },
          {
            "path": "direction",
            "name": "user-direction",
            "meta": {
              "title": "方向管理",
              "auth": true,
              "role": 1
            },
            "component": "views/manage/user/direction.vue"
          },
          {
            "path": "direction/detail",
            "name": "user-direction-detail",
            "meta": {
              "title": "方向详情",
              "activeName": "direction-direction",
              "auth": true,
              "role": 1,
              "hidden": true
            },
            "component": "views/manage/user/direction-detail.vue"
          },
          {
            "path": "role",
            "name": "user-role",
            "meta": {
              "title": "角色权限",
              "auth": true,
              "role": 1
            },
            "component": "views/manage/user/role.vue"
          }
        ],
        "redirect": {"name": "user-list"}
      },
      {
        "path": "center",
        "name": "center",
        "meta": {
          "title": "个人中心",
          "icon": "el-icon-user",
          "auth": true,
          "role": 0
        },
        "component": "views/manage/center/index.vue",
        "children": []
      }
    ],
    "redirect": {"name": "testing"}
  },
  {
    "path": "/error",
    "name": "error",
    "meta": {
      "title": "404页面"
    },
    "component": "views/manage/error/index.vue"
  },
  {
    "path": "/",
    "redirect": {"name": "login"}
  },
  {
    "path": "/:catchAll(.*)",
    "redirect": {"name": "error"}
  }
]
