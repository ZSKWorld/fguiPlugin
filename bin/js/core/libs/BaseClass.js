"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClass = void 0;
const Decorators_1 = require("../utils/Decorators");
/**
 * 自定义类基类，所有的自定义类除了继承自编辑器的类以外，其他的都要继承该类，以达到统一销毁的目的
 */
let BaseClass = class BaseClass {
};
BaseClass = __decorate([
    (0, Decorators_1.DestroyInstanceClass)("Destroy")
], BaseClass);
exports.BaseClass = BaseClass;
