import { ICollectionBuilder } from './collectionBuilder';
import { ISingleObjectBuilder } from './singleObjectBuilder';
export interface IFactory {
    createNew<T>(ctor: {
        new (): T;
    }): ISingleObjectBuilder<T>;
    createListOfSize<T>(size: number): ICollectionBuilder<T>;
}
export declare class Factory implements IFactory {
    createNew<T>(ctor: {
        new (): T;
    }): ISingleObjectBuilder<T>;
    createListOfSize<T>(size: number): ICollectionBuilder<T>;
}
