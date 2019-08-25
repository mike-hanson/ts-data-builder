import { Builder, IBuilder, TypeOrGenerator } from './builder';
export interface ICollectionBuilder<T> extends IBuilder<T> {
    size: number;
    build(): Array<T>;
    theFirst(num?: number): ICollectionBuilder<T>;
    theNext(num?: number): ICollectionBuilder<T>;
    theLast(num?: number): ICollectionBuilder<T>;
}
export declare class CollectionBuilder<T> extends Builder<T> implements ICollectionBuilder<T> {
    private count;
    private firstBuilderSpec;
    private nextBuilderSpecs;
    private lastBuilderSpec;
    private allBuilderSpec;
    private currentBuilderSpec;
    constructor(count: number);
    fromTemplate(template: {}): ICollectionBuilder<T>;
    build(): Array<T>;
    readonly size: number;
    theFirst(num?: number): ICollectionBuilder<T>;
    theNext(num?: number): ICollectionBuilder<T>;
    theLast(num?: number): ICollectionBuilder<T>;
    protected internalWith(name: string, typeOrGenerator: TypeOrGenerator): ICollectionBuilder<T>;
    private copyTemplate;
    private createBuilderSpec;
    private firstBuilderSize;
    private sumOfNextBuilderSizes;
    private throwIfFirstNotInitialised;
    private throwIfLastInitialised;
    private throwIfNextExceedsSize;
    private throwIfLastExceedsSize;
}
