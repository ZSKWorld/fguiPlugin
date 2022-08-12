"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorUtils = void 0;
const csharp_1 = require("csharp");
class EditorUtils {
    /**
     * @description: 创建菜单目录
     * @param data 菜单数据
     * @param parent 父菜单
     */
    static CreateMenu(data, parent) {
        var _a, _b;
        if (data.subMenuData && data.subMenuData.length) {
            const nameCheckArr = [];
            for (let i = data.subMenuData.length - 1; i >= 0; i--) {
                const name = data.subMenuData[i].name;
                if (nameCheckArr.indexOf(name) != -1)
                    return csharp_1.FairyEditor.App.Alert("菜单目录有重名：" + name);
                else
                    nameCheckArr.push(name);
            }
        }
        if (data.isSubMenu) {
            parent.AddItem(data.text, data.name, (_a = data.atIndex) !== null && _a !== void 0 ? _a : -1, true, data.selectCallback);
            if (data.subMenuData && data.subMenuData.length) {
                const curMenu = parent.GetSubMenu(data.name);
                data.subMenuData.forEach((v) => this.CreateMenu(v, curMenu));
            }
        }
        else
            parent.AddItem(data.text, data.name, (_b = data.atIndex) !== null && _b !== void 0 ? _b : -1, false, data.selectCallback);
    }
    /**
     * 创建控制器XML数据
     * @param name 控制器名字
     * @param pageNames 页数量&名字
     * @param exported 是否导出为组件属性
     * @returns
     */
    static CreateControllerXML(name, pageNames, exported) {
        const xml = csharp_1.FairyGUI.Utils.XML.Create("");
        xml.SetAttribute("name", name);
        // xml.SetAttribute("alias","asdfas");  //备注名
        // xml.SetAttribute("autoRadioGroupDepth",true);    //自动调整单选组对象层次
        xml.SetAttribute("exported", !!exported); //导出为组件属性
        // xml.SetAttribute("homePageType","variable"); //首页类型
        // xml.SetAttribute("homePage","Test");
        if (!pageNames || !pageNames.length) {
            pageNames = ["", ""];
        }
        let pageData = "";
        pageNames.forEach((v, index) => { pageData += index + "," + v + (index == pageNames.length - 1 ? "" : ","); });
        xml.SetAttribute("pages", pageData); //页面
        // xml.SetAttribute("selected",0);
        return xml;
    }
    /**
     * @description: 向编辑器中添加组件
     * @param url 组件URL
     */
    static AddComponent(url) {
        if (!csharp_1.FairyEditor.App.activeDoc)
            return;
        if (url.startsWith("ui://") == false)
            return csharp_1.FairyEditor.App.Alert(`错误的组件URL---${url}\nURL必须以 ui:// 开头`);
        csharp_1.FairyEditor.App.activeDoc.UnselectAll();
        csharp_1.FairyEditor.App.activeDoc.InsertObject(url);
    }
    /** 获取插件根目录 */
    static GetPluginRootDir() {
        return csharp_1.FairyEditor.App.pluginManager.projectPluginFolder + "/" + eval("__dirname").split("/")[0];
    }
    /**
     * 获取包地址
     * @param name 包名
     */
    static GetPackagePath(name) {
        return this.GetPluginRootDir() + "/Packages/" + name;
    }
    /**获取config目录下的配置路径 */
    static GetConfigPath(type, fileName) {
        const dir = type ? type + "/" : "";
        return `${this.GetPluginRootDir()}/config/${dir}${fileName}.json`;
    }
    /**获取config目录下的配置数据 */
    static GetConfig(type, fileName) {
        const cfgPath = this.GetConfigPath(type, fileName);
        if (csharp_1.System.IO.File.Exists(cfgPath) == false)
            return console.warn("文件不存在" + cfgPath);
        const cfgJsonStr = csharp_1.System.IO.File.ReadAllText(cfgPath);
        if (!cfgJsonStr)
            return console.warn("文件内容为空" + cfgPath);
        try {
            return JSON.parse(cfgJsonStr);
        }
        catch (e) {
            return console.warn("文件内容格式错误");
        }
    }
}
exports.EditorUtils = EditorUtils;
//界面
//fairygui.LibraryView          0   资源库
//fairygui.InspectorView        1   检查器
//fairygui.HierarchyView        2   显示列表
//fairygui.PreviewView          3   预览
//fairygui.TimelineView         4   时间轴
//fairygui.TransitionListView   5   动效
//fairygui.FavoritesView        6   收藏夹
//fairygui.SearchView           7   搜索
//fairygui.ConsoleView          8   控制台
//fairygui.ReferenceView        9   引用
//fairygui.PlugInView           10  插件
//fairygui.DocumentView         11  编辑页面
//fairygui.TestView             12  测试页面
//主界面上方选项变量名
//file      文件
//edit      编辑
//assets    资源
//tool      工具
//view      视图
//help      帮助
//各种路径
// FairyEditor.App.project.basePath
// FairyEditor.App.project.assetsPath
// FairyEditor.App.project.objsPath
// FairyEditor.App.project.settingsPath
// FairyEditor.App.pluginManager.userPluginFolder
// FairyEditor.App.pluginManager.projectPluginFolder
// FairyEditor.App.pluginManager.basePath
//从插件目录开始的路径
//eval("__dirname")
// FairyEditor.App.mainView.panel
// toolbar holder startScene logItem newVersionPrompt menuBar userInfo
