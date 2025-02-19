"use strict";
self["webpackHotUpdateapp"]("components-Status-Status-stories",{

/***/ "./src/components/Status/Status.tsx":
/*!******************************************!*\
  !*** ./src/components/Status/Status.tsx ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/.pnpm/next@15.0.3_@babel+core@7.26.0_react-dom@19.0.0-rc-66855b96-20241106_react@19.0.0-rc-66855b96_fpy4of67lljj5mmtr3hdr3usnm/node_modules/next/dist/compiled/react/jsx-dev-runtime.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.15_react-refresh@0.14.2_type-fest@4.32.0_webpack-hot_euqyt3554vtxwgyegrk3ywqllq/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/.pnpm/@pmmmwh+react-refresh-webpack-plugin@0.5.15_react-refresh@0.14.2_type-fest@4.32.0_webpack-hot_euqyt3554vtxwgyegrk3ywqllq/node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js */ "./node_modules/.pnpm/react-refresh@0.14.2/node_modules/react-refresh/runtime.js");


const STATUS_MAP = {
    reception: {
        statusType: "A",
        statusText: "受付中",
        backgroundColor: "bg-main border-main",
        textColor: "text-base"
    },
    approaching: {
        statusType: "A",
        statusText: "締切間近",
        backgroundColor: "bg-alert border-alert",
        textColor: "text-base"
    },
    closed: {
        statusType: "A",
        statusText: "受付終了",
        backgroundColor: "bg-base border-sub",
        textColor: "text-[--sub-color]"
    },
    registered: {
        statusType: "B",
        statusText: "登録済",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]"
    },
    unregistered: {
        statusType: "B",
        statusText: "未登録",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]"
    },
    unnecessary: {
        statusType: "C",
        statusText: "不要",
        backgroundColor: "bg-[--base-color] border-[--sub-color]",
        textColor: "text-[--sub-color]"
    },
    done: {
        statusType: "C",
        statusText: "済",
        backgroundColor: "bg-[--main-color] border-[--main-color]",
        textColor: "text-[--base-color]"
    },
    not_yet: {
        statusType: "C",
        statusText: "末",
        backgroundColor: "bg-[--alert-color] border-[--alert-color]",
        textColor: "text-[--base-color]"
    }
};
const Status = ({ statusType, status })=>{
    const statusInfo = STATUS_MAP[status];
    const commonBgStyle = "flex items-center justify-center rounded-[15px] border-2 border-solid";
    const commonTextStyle = "flex items-center justify-center shrink-0 text-[16px]";
    const sizeStyles = {
        A: {
            bg: "w-[100px] h-[30px]",
            text: "w-[92px] h-[23px]"
        },
        B: {
            bg: "w-[86px] h-[30px]",
            text: "w-[78px] h-[22px]"
        },
        C: {
            bg: "w-[56px] h-[30px]",
            text: "w-[48px] h-[19px]"
        }
    };
    // 🚨 実行時にエラーをスローする
    if (statusInfo.statusType !== statusType) {
        throw new Error(`statusType="${statusType}" と status="${status}"の組み合わせは不適切です!!`);
    }
    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
        className: `${commonBgStyle} ${sizeStyles[statusType].bg} ${statusInfo.backgroundColor}`,
        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
            className: `${commonTextStyle} ${sizeStyles[statusType].text} ${statusInfo.textColor}`,
            children: statusInfo.statusText
        }, void 0, false, {
            fileName: "/home/kure/workspace/group-manager-2/user/src/components/Status/Status.tsx",
            lineNumber: 90,
            columnNumber: 13
        }, undefined)
    }, void 0, false, {
        fileName: "/home/kure/workspace/group-manager-2/user/src/components/Status/Status.tsx",
        lineNumber: 89,
        columnNumber: 11
    }, undefined);
};
_c = Status;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Status);
Status.__docgenInfo = {
    "description": "",
    "methods": [],
    "displayName": "Status"
};
var _c;
__webpack_require__.$Refresh$.register(_c, "Status");


const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		let errorOverlay;
		if (true) {
			errorOverlay = false;
		}
		let testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ })

});
//# sourceMappingURL=components-Status-Status-stories.8456d7183b6e810c772a.hot-update.js.map