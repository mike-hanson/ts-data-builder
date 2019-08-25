// tslint:disable: callable-types
import { CollectionBuilder, ICollectionBuilder } from './collectionBuilder';
import { ISingleObjectBuilder, SingleObjectBuilder } from './singleObjectBuilder';

export interface IFactory {
  createNew<T>(): ISingleObjectBuilder<T>;
  createListOfSize<T>(size: number): ICollectionBuilder<T>;
}

export class Factory implements IFactory {
  public createNew<T>(): ISingleObjectBuilder<T> {
    return new SingleObjectBuilder<T>();
  }

  public createListOfSize<T>(size: number): ICollectionBuilder<T> {
    return new CollectionBuilder<T>(size);
  }
}
