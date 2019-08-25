import { CollectionBuilder } from '../src/collectionBuilder';
import { Factory } from '../src/factory';
import { SingleObjectBuilder } from '../src/singleObjectBuilder';
import { ITestInterface } from './testInterface';

describe('Factory', () => {
  let factory: Factory;

  beforeEach(() => {
    factory = new Factory();
  });

  it('Should be defined', () => {
    expect(factory).toBeDefined();
  });

  it('Should return a single object builder on createNew', () => {
    const actual = factory.createNew<ITestInterface>();

    expect(actual instanceof SingleObjectBuilder).toBeTruthy();
  });

  it('Should return a collection builder on createListOfSize', () => {
    const actual = factory.createListOfSize<ITestInterface>(2);

    expect(actual instanceof CollectionBuilder).toBeTruthy();
  });
});
