import { DestroyInstanceClass } from "../utils/Decorators";

/**
 * 自定义类基类，所有的自定义类除了继承自编辑器的类以外，其他的都要继承该类，以达到统一销毁的目的
 */
@DestroyInstanceClass("Destroy")
export abstract class BaseClass {
    protected abstract Destroy(): void;
}