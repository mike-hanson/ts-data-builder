import { ICollectionBuilder } from './collectionBuilder';
import { MemberType } from './memberType';
import { ISingleObjectBuilder } from './singleObjectBuilder';
export declare type ValueGenerator = (i: number) => any;
export declare type TypeOrGenerator = ValueGenerator | MemberType;
export declare type SingleOrCollectionBuilder<T> = ICollectionBuilder<T> | ISingleObjectBuilder<T>;
export interface ITemplate {
    [index: string]: any;
}
export interface IBuilder<T> {
    fromTemplate(template: ITemplate): SingleOrCollectionBuilder<T>;
    with<K extends keyof T>(name: K, typeOrGenerator: TypeOrGenerator): SingleOrCollectionBuilder<T>;
}
export declare abstract class Builder<T> implements IBuilder<T> {
    protected template: ITemplate;
    abstract fromTemplate(template: ITemplate): SingleOrCollectionBuilder<T>;
    with<K extends keyof T>(name: K, typeOrGenerator: TypeOrGenerator): SingleOrCollectionBuilder<T>;
    protected abstract internalWith(name: string, typeOrGenerator: TypeOrGenerator): SingleOrCollectionBuilder<T>;
    protected objectFromTemplate(template: ITemplate, sequenceNo: number): T;
    private getValue;
}
