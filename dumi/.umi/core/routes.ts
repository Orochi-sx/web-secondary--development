// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from 'C:/dev/web-secondary--development/node_modules/_@umijs_runtime@3.5.30@@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/~demos/:uuid",
    "layout": false,
    "wrappers": [require('../dumi/layout').default],
    "component": ((props) => {
        const React = require('react');
        const { default: getDemoRenderArgs } = require('C:/dev/web-secondary--development/node_modules/_@umijs_preset-dumi@1.1.45@@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
        const { default: Previewer } = require('dumi-theme-default/es/builtins/Previewer.js');
        const { usePrefersColor, context } = require('dumi/theme');

        
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
        })
  },
  {
    "path": "/_demos/:uuid",
    "redirect": "/~demos/:uuid"
  },
  {
    "__dumiRoot": true,
    "layout": false,
    "path": "/",
    "wrappers": [require('../dumi/layout').default, require('C:/dev/web-secondary--development/node_modules/_dumi-theme-default@1.1.22@dumi-theme-default/es/layout.js').default],
    "routes": [
      {
        "path": "/reporting/快速开始/1",
        "component": require('C:/dev/web-secondary--development/dumi/docs/1.快速开始.md').default,
        "exact": true,
        "meta": {
          "filePath": "dumi/docs/1.快速开始.md",
          "updatedTime": 1657789753000,
          "title": "快速开始",
          "nav": {
            "title": "填报",
            "path": "/reporting"
          },
          "group": {
            "title": "快速开始",
            "path": "/reporting/快速开始",
            "order": 1
          },
          "slugs": [
            {
              "depth": 2,
              "value": "介绍",
              "heading": "介绍"
            },
            {
              "depth": 2,
              "value": "文档",
              "heading": "文档"
            },
            {
              "depth": 2,
              "value": "支持功能",
              "heading": "支持功能"
            }
          ]
        },
        "title": "快速开始 - sdata-plugins"
      },
      {
        "path": "/reporting/如何开发插件/2",
        "component": require('C:/dev/web-secondary--development/dumi/docs/2.开发插件.md').default,
        "exact": true,
        "meta": {
          "filePath": "dumi/docs/2.开发插件.md",
          "updatedTime": 1657789753000,
          "title": "如何开发插件",
          "nav": {
            "title": "填报",
            "path": "/reporting"
          },
          "group": {
            "title": "如何开发插件",
            "path": "/reporting/如何开发插件",
            "order": 2
          },
          "toc": "menu",
          "slugs": [
            {
              "depth": 2,
              "value": "下载代码",
              "heading": "下载代码"
            },
            {
              "depth": 2,
              "value": "配置文件",
              "heading": "配置文件"
            },
            {
              "depth": 2,
              "value": "配置文件说明",
              "heading": "配置文件说明"
            },
            {
              "depth": 3,
              "value": "props",
              "heading": "props"
            },
            {
              "depth": 2,
              "value": "文件说明",
              "heading": "文件说明"
            },
            {
              "depth": 3,
              "value": "示例组件",
              "heading": "示例组件"
            }
          ]
        },
        "title": "如何开发插件 - sdata-plugins"
      },
      {
        "path": "/reporting/如何使用插件/3",
        "component": require('C:/dev/web-secondary--development/dumi/docs/3.使用插件.md').default,
        "exact": true,
        "meta": {
          "filePath": "dumi/docs/3.使用插件.md",
          "updatedTime": 1657789753000,
          "title": "如何使用插件",
          "nav": {
            "title": "填报",
            "path": "/reporting"
          },
          "group": {
            "title": "如何使用插件",
            "path": "/reporting/如何使用插件",
            "order": 3
          },
          "slugs": []
        },
        "title": "如何使用插件 - sdata-plugins"
      },
      {
        "path": "/reporting/API/4",
        "component": require('C:/dev/web-secondary--development/dumi/docs/4.API.md').default,
        "exact": true,
        "meta": {
          "filePath": "dumi/docs/4.API.md",
          "updatedTime": 1657789753000,
          "title": "API",
          "nav": {
            "title": "填报",
            "path": "/reporting"
          },
          "group": {
            "title": "API",
            "path": "/reporting/API",
            "order": 4
          },
          "slugs": [
            {
              "depth": 2,
              "value": "onChange",
              "heading": "onchange"
            },
            {
              "depth": 3,
              "value": "使用范围",
              "heading": "使用范围"
            },
            {
              "depth": 3,
              "value": "说明",
              "heading": "说明"
            },
            {
              "depth": 3,
              "value": "相关 assetColumnList",
              "heading": "相关-assetcolumnlist"
            },
            {
              "depth": 3,
              "value": "单字段",
              "heading": "单字段"
            },
            {
              "depth": 3,
              "value": "多字段推荐 assetColumnList",
              "heading": "多字段推荐-assetcolumnlist"
            },
            {
              "depth": 2,
              "value": "data",
              "heading": "data"
            },
            {
              "depth": 3,
              "value": "使用范围",
              "heading": "使用范围-1"
            },
            {
              "depth": 3,
              "value": "说明",
              "heading": "说明-1"
            },
            {
              "depth": 3,
              "value": "详细",
              "heading": "详细"
            },
            {
              "depth": 3,
              "value": "assetColumnList 为单字段时",
              "heading": "assetcolumnlist-为单字段时"
            },
            {
              "depth": 3,
              "value": "assetColumnList 为多字段时",
              "heading": "assetcolumnlist-为多字段时"
            },
            {
              "depth": 2,
              "value": "formConfig",
              "heading": "formconfig"
            },
            {
              "depth": 2,
              "value": "component",
              "heading": "component"
            },
            {
              "depth": 2,
              "value": "configuration",
              "heading": "configuration"
            },
            {
              "depth": 3,
              "value": "使用范围",
              "heading": "使用范围-2"
            },
            {
              "depth": 2,
              "value": "changeConfiguration",
              "heading": "changeconfiguration"
            },
            {
              "depth": 3,
              "value": "使用范围",
              "heading": "使用范围-3"
            }
          ]
        },
        "title": "API - sdata-plugins"
      },
      {
        "path": "/",
        "component": require('C:/dev/web-secondary--development/dumi/docs/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "dumi/docs/index.md",
          "updatedTime": 1657789753000,
          "hero": {
            "title": "sdata-plugins",
            "desc": "<div class=\"markdown\"><p>二次开发组件</p></div>",
            "actions": [
              {
                "text": "快速开始",
                "link": "/reporting/快速开始"
              }
            ]
          },
          "features": [
            {
              "icon": "/images/card-left-top1.url.svg",
              "title": "数据开放",
              "desc": "<div class=\"markdown\"><p>数睿大数据平台具有完整的数据接入、分析、交换、融合、治理、服务能力，提供柔性、流动、统一的数据资产。</p></div>"
            },
            {
              "icon": "/images/card-right-top1.url.svg",
              "title": "形式开放",
              "desc": "<div class=\"markdown\"><p>数睿通过对软件形式的深度抽象，基于对页面组件、业务流、逻辑控制、服务编排的装配进行填报、业务流、分析仪、大屏、文档以及应用的设计。</p></div>"
            },
            {
              "icon": "/images/card-left-bottom1.url.svg",
              "title": "系统集成",
              "desc": "<div class=\"markdown\"><p>支持与企业现有应用软件以及各种生态系统的能力集成，以支持企业应用的端到端打通，助力企业架构演进。</p></div>"
            }
          ],
          "footer": "<div class=\"markdown\"><p>Open-source MIT Licensed | Copyright © 2020<br />Powered by <a href=\"https://d.umijs.org/\" target=\"_blank\">dumi<svg xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"\" x=\"0px\" y=\"0px\" viewBox=\"0 0 100 100\" width=\"15\" height=\"15\" class=\"__dumi-default-external-link-icon\"><path fill=\"currentColor\" d=\"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z\"></path><polygon fill=\"currentColor\" points=\"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9\"></polygon></svg></a></p></div>",
          "slugs": [],
          "title": "Index"
        },
        "title": "Index - sdata-plugins"
      },
      {
        "path": "/reporting/dev/快速预览",
        "component": require('C:/dev/web-secondary--development/dumi/docs/快速预览.md').default,
        "exact": true,
        "meta": {
          "filePath": "dumi/docs/快速预览.md",
          "updatedTime": 1657789753000,
          "title": "组件开发预览",
          "nav": {
            "title": "填报",
            "path": "/reporting"
          },
          "group": {
            "title": "组件开发预览",
            "path": "/reporting/dev",
            "order": 5
          },
          "toc": "menu",
          "slugs": [
            {
              "depth": 2,
              "value": "设计页",
              "heading": "设计页"
            },
            {
              "depth": 3,
              "value": "组件",
              "heading": "组件"
            },
            {
              "depth": 3,
              "value": "配置项",
              "heading": "配置项"
            },
            {
              "depth": 2,
              "value": "新增/编辑 主表组件",
              "heading": "新增编辑-主表组件"
            },
            {
              "depth": 2,
              "value": "新增/编辑 子表组件",
              "heading": "新增编辑-子表组件"
            },
            {
              "depth": 2,
              "value": "列表页组件",
              "heading": "列表页组件"
            },
            {
              "depth": 2,
              "value": "详情页组件",
              "heading": "详情页组件"
            }
          ],
          "hasPreviewer": true
        },
        "title": "组件开发预览 - sdata-plugins"
      },
      {
        "path": "/reporting/快速开始",
        "meta": {
          "order": 1
        },
        "exact": true,
        "redirect": "/reporting/快速开始/1"
      },
      {
        "path": "/reporting",
        "meta": {},
        "exact": true,
        "redirect": "/reporting/快速开始"
      },
      {
        "path": "/reporting/如何开发插件",
        "meta": {
          "order": 2
        },
        "exact": true,
        "redirect": "/reporting/如何开发插件/2"
      },
      {
        "path": "/reporting/如何使用插件",
        "meta": {
          "order": 3
        },
        "exact": true,
        "redirect": "/reporting/如何使用插件/3"
      },
      {
        "path": "/reporting/API",
        "meta": {
          "order": 4
        },
        "exact": true,
        "redirect": "/reporting/API/4"
      },
      {
        "path": "/reporting/dev",
        "meta": {
          "order": 5
        },
        "exact": true,
        "redirect": "/reporting/dev/快速预览"
      }
    ],
    "title": "sdata-plugins",
    "component": (props) => props.children
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
