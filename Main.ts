import { FairyEditor } from 'csharp';
import { DestroyInstanceMethodName, PkgCustom } from './core/common/Const';
import { CustomSetting } from './core/common/CustomSetting';
import { MainMenuType } from './core/common/Types';
import { BaseInspector } from './core/inspectors/BaseInspector';
import { BaseClass } from './core/libs/BaseClass';
import { genCode_TS } from './core/libs/GenCode_TS';
import { MenuDoc_CreateLayaName } from './core/menu/menuDoc/MenuDoc_CreateLayaName';
import { MenuMain_Publish } from './core/menu/menuMain/MenuMain_Publish';
import { Menu_Test } from './core/menu/Menu_Test';
import { EditorUtils } from './core/utils/EditorUtils';

/** 加载插件UI包 */
FairyEditor.App.pluginManager.LoadUIPackage(EditorUtils.GetPackagePath(PkgCustom));
CustomSetting.Init();

const docMenu = FairyEditor.App.docFactory.contextMenu;
const libMenu = FairyEditor.App.libView.contextMenu;
const mainMenu = FairyEditor.App.menu;
const mainSubMenu = (name: MainMenuType) => mainMenu.GetSubMenu(name);

[
    //测试用例
    // new Menu_Test(docMenu),

    //编辑区菜单
    // new MenuDoc_CreateComponent(docMenu),
    // new MenuDoc_CreateRelation(docMenu),
    // new MenuDoc_CreateLuaName(docMenu),
    // new MenuDoc_CreateLayaName(docMenu),

    //资源库菜单
    // new MenuLib_CreateController(libMenu),

    //主菜单，注意：使用mainMenu做父菜单时，menuData.isSubMenu必须为true
    new MenuMain_Publish(mainMenu),

    //检查器
    // new BtnInspector(new InspectorData(PkgCustom, PkgCustom_Btn, InspectorName.Custom_BtnInspector, "按钮自定义数据", ShowObjectType.Button, true)),
    // new ComInspector(new InspectorData(PkgCustom, PkgCustom_Btn, InspectorName.Custom_ComInspector, "组件自定义数据", ShowObjectType.Component, true, true)),
    // new TextLayoutInspector(new InspectorData(PkgCustom, PkgCustom_Text, "TextInspector", "文本横竖排", ShowObjectType.Mixed, true)),

].forEach(v => v.Create());

//自定义发布代码
export function onPublish(handler: FairyEditor.PublishHandler) {
    if (!handler.genCode) return;
    handler.genCode = false; //prevent default output

    console.log('Handling gen code in plugin');
    genCode_TS(handler); //do it myself
}

export function onDestroy() {
    BaseClass[DestroyInstanceMethodName]();
    BaseInspector[DestroyInstanceMethodName]();
}
