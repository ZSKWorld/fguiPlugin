"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewChild = ViewChild;
exports.ViewChildInit = ViewChildInit;
exports.DestroyInstanceClass = DestroyInstanceClass;
const Const_1 = require("../common/Const");
/**
 * 查找子节点
 * @param childName 节点名字
 */
function ViewChild(childName) {
    if (!childName)
        return;
    return function (target, propertyKey) {
        target.__childMap || (target.__childMap = {});
        let childMap = target.__childMap;
        childMap[propertyKey] = childName;
    };
}
function ViewChildInit(target) {
    if (target && target.__childMap) {
        const childMap = target.__childMap;
        for (const key in childMap) {
            const names = childMap[key].split(".");
            if (names.length) {
                let child = target.panel;
                names.forEach(v => {
                    if (v && child && typeof child.GetChild == "function")
                        child = child.GetChild(v).asCom;
                });
                child != target.panel && (target[key] = child);
            }
        }
    }
}
/**
 * 重写类构造，保存所有类实例，方便统一销毁
 * @param destroyFuncName 销毁时调用的方法名
 */
function DestroyInstanceClass(destroyFuncName) {
    return function (constructor) {
        const OldClass = constructor;
        class NewClass extends OldClass {
            static [Const_1.DestroyInstanceMethodName]() {
                this.__instances.forEach(v => v[destroyFuncName]());
                this.__instances.length = 0;
                this.__instances = null;
            }
            constructor(...args) {
                super(...args);
                NewClass.__instances.push(this);
            }
        }
        NewClass.__instances = [];
        return NewClass;
    };
}
