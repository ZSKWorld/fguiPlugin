import { DestroyInstanceMethodName } from "../common/Const";

/**
 * 查找子节点
 * @param childName 节点名字
 */
export function ViewChild(childName: string) {
    if (!childName) return;
    return function (target: CS.FairyEditor.View.PluginInspector & { __childMap?: any }, propertyKey: string) {
        target.__childMap ||= {};
        let childMap = target.__childMap;
        childMap[ propertyKey ] = childName;
    }
}

export function ViewChildInit(target: CS.FairyEditor.View.PluginInspector & { __childMap?: any }) {
    if (target && target.__childMap) {
        const childMap = target.__childMap;
        for (const key in childMap) {
            const names: string[] = childMap[ key ].split(".");
            if (names.length) {
                let child = target.panel;
                names.forEach(v => {
                    if (v && child && typeof child.GetChild == "function")
                        child = child.GetChild(v).asCom;
                });
                child != target.panel && (target[ key ] = child);
            }
        }
    }
}

/**
 * 重写类构造，保存所有类实例，方便统一销毁
 * @param destroyFuncName 销毁时调用的方法名
 */
export function DestroyInstanceClass(destroyFuncName: string) {
    return function (constructor: any): any {
        const OldClass = constructor as unknown as { new(...args): any };
        class NewClass extends OldClass {
            private static __instances: NewClass[] = [];
            public static [ DestroyInstanceMethodName ]() {
                this.__instances.forEach(v => v[ destroyFuncName ]());
                this.__instances.length = 0;
                this.__instances = null;
            }
            constructor(...args: any[]) {
                super(...args);
                NewClass.__instances.push(this);
            }
        }
        return NewClass;
    }
}