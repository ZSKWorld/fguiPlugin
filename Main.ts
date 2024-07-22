import { FairyEditor } from 'csharp';
import { DestroyInstanceMethodName, PkgCustom, PkgCustom_Btn, PkgCustom_Text } from './core/common/Const';
import { CustomSetting } from './core/common/CustomSetting';
import { InspectorName, ShowObjectType } from './core/common/Types';
import { BaseInspector } from './core/inspectors/BaseInspector';
import { BtnInspector } from './core/inspectors/BtnInspector';
import { ComInspector } from './core/inspectors/ComInspector';
import { InspectorData } from './core/inspectors/InspectorData';
import { TextLayoutInspector } from './core/inspectors/TextLayoutInspector';
import { BaseClass } from './core/libs/BaseClass';
import { genCode_TS_XiaoYanDemo } from './core/libs/GenCode_TS_XiaoYanDemo';
import { MenuDoc_CreateComponent } from './core/menu/menuDoc/MenuDoc_CreateComponent';
import { MenuDoc_CreateLayaName } from './core/menu/menuDoc/MenuDoc_CreateLayaName';
import { MenuDoc_CreateLuaName } from './core/menu/menuDoc/MenuDoc_CreateLuaName';
import { MenuDoc_CreateRelation } from './core/menu/menuDoc/MenuDoc_CreateRelation';
import { MenuLib_CreateController } from './core/menu/menuLib/MenuLib_CreateController';
import { MenuMain_ImageReference } from './core/menu/menuMain/MenuMain_ImageReference';
import { MenuMain_Publish } from './core/menu/menuMain/MenuMain_Publish';
import { MenuTest_Doc } from './core/menu/test/MenuTest_Doc';
import { MenuTest_Lib } from './core/menu/test/MenuTest_Lib';
import { MenuTest_Main } from './core/menu/test/MenuTest_Main';
import { EditorUtils } from './core/utils/EditorUtils';
import { MenuBase_Doc } from './core/menu/MenuBase_Doc';
import { MenuBase_Lib } from './core/menu/MenuBase_Lib';

/** 加载插件UI包 */
FairyEditor.App.pluginManager.LoadUIPackage(EditorUtils.GetPackagePath(PkgCustom));
CustomSetting.Init();
[
    //编辑区菜单
    new MenuDoc_CreateRelation(),
    new MenuDoc_CreateLuaName(),
    new MenuDoc_CreateLayaName(),
    new MenuDoc_CreateComponent(),

    //资源库菜单
    new MenuLib_CreateController(),

    //主菜单
    new MenuMain_Publish(),
    new MenuMain_ImageReference(),

    //测试用例
    new MenuTest_Doc(),
    new MenuTest_Lib(),
    new MenuTest_Main(),

    //检查器
    new BtnInspector(new InspectorData(PkgCustom, PkgCustom_Btn, InspectorName.Custom_BtnInspector, "按钮自定义数据", ShowObjectType.Button, true)),
    new ComInspector(new InspectorData(PkgCustom, PkgCustom_Btn, InspectorName.Custom_ComInspector, "组件自定义数据", ShowObjectType.Component, true, true)),
    new TextLayoutInspector(new InspectorData(PkgCustom, PkgCustom_Text, "TextInspector", "文本横竖排", ShowObjectType.Mixed, true)),
].forEach(v => v.Create());

MenuBase_Doc.AddSeperator();
MenuBase_Lib.AddSeperator();

export function onPublishStart() {
    console.log("[color=#00ff00]on publish start[/color]");
}

//自定义发布代码
export function onPublish(handler: FairyEditor.PublishHandler) {
    if (!handler.genCode) return;
    console.log("[color=#ffff00]on publish code[/color] => [u][b]" + handler.pkg.name + "[/b][/u]");
    handler.genCode = false; //prevent default output
    genCode_TS_XiaoYanDemo(handler); //do it myself
}

export function onPublishEnd() {
    console.log("[color=#00ff00]on publish end[/color]");
}

export function onDestroy() {
    BaseClass[DestroyInstanceMethodName]();
    BaseInspector[DestroyInstanceMethodName]();
}
