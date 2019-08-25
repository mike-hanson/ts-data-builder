import { CollectionBuilder } from '../src/collectionBuilder';
import { ITestInterface } from './testInterface';

describe('CollectionBuilder', () => {
  let target: CollectionBuilder<ITestInterface>;

  beforeEach(() => {
    target = new CollectionBuilder<ITestInterface>(3);
  });

  it('should be defined', () => {
    expect(target).toBeDefined();
  });

  it('should throw an error if no setters or template are configured', () => {
    expect(() => {
      target.build();
    }).toThrowError(
      'Invalid operation: The builder has no configuration, have you forgotten to use "with" or "fromTemplate" to configure the builder.'
    );
  });

  it('should return the size originally specified on creation', () => {
    expect(target.size).toBe(3);
  });

  it('should return self after configuring the first subset of objects', () => {
    const actual = target.theFirst();
    expect(actual).toBe(target);
  });

  it('should return self after configuring a next subset of objects', () => {
    target.theFirst();
    const actual = target.theNext();
    expect(actual).toBe(target);
  });

  it('should return self after configuring the last subset of objects', () => {
    const actual = target.theLast();
    expect(actual).toBe(target);
  });

  it('should throw an error if next n is requested before first n', () => {
    expect(() => {
      target.theNext();
    }).toThrowError('A call to "theNext" must follow a call to "theFirst".');
  });

  it('should throw an error if next n is requested after last n', () => {
    target.theFirst();
    target.theLast();
    expect(() => {
      target.theNext();
    }).toThrowError('"theNext" cannot be used once "theLast" has been used.');
  });

  it('should throw an error if the total of first and next n exceeds original size', () => {
    target.theFirst(2);
    expect(() => {
      target.theNext(2);
    }).toThrowError('Cannot exceed bounds of original builder with "theNext".');
  });

  it('should throw an error if the total of first and last n exceeds original size', () => {
    target.theFirst(2);
    expect(() => {
      target.theLast(2);
    }).toThrowError('Cannot exceed bounds of original builder with "theLast".');
  });

  it('Should add member to all objects with correct name, type and value when type is string', () => {
    const actual = target.with((d, i) => (d.name = `name ${i + 1}`)).build();
    assertCollectionIsValid(actual, [{ name: 'name 1' }, { name: 'name 2' }, { name: 'name 3' }]);
  });

  it('Should add member with correct name, type and value when type is number', () => {
    const actual = target.with((instance, index) => (instance.id = index + 1)).build();
    assertCollectionIsValid(actual, [{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('Should add member with correct name, type and value when type is date', () => {
    const actual = target.with((instance, index) => (instance.created = new Date())).build();
    expect(actual[0].created).toBeDefined();
    expect(actual[0].created instanceof Date).toBeTruthy();
    expect(actual[1].created).toBeDefined();
    expect(actual[1].created instanceof Date).toBeTruthy();
    expect(actual[2].created).toBeDefined();
    expect(actual[2].created instanceof Date).toBeTruthy();
  });

  function assertCollectionIsValid(actual: any, expected: any) {
    expect(actual).toBeDefined();
    expect(actual instanceof Array).toBeTruthy();
    expect(actual).toEqual(expected);
  }
});
