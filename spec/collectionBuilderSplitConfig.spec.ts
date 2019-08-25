import { ITemplate } from '../src/builder';
import { CollectionBuilder } from '../src/collectionBuilder';
import { MemberType } from '../src/memberType';
import { ITestInterface } from './testInterface';

describe('CollectionBuilder with split config', () => {
  let target: CollectionBuilder<ITestInterface>;
  const testDate = new Date(2015, 2, 10);
  const template: ITemplate = {
    created: MemberType.Date,
    description: MemberType.String,
    id: MemberType.Number,
    name: MemberType.String
  };

  beforeEach(() => {
    target = new CollectionBuilder<ITestInterface>(3);
  });

  it('Should return expected collection with first items overridden', () => {
    const actual = target
      .fromTemplate(template)
      .with((d, i) => (d.created = testDate))
      .theFirst(2)
      .with((d, i) => (d.id = 9))
      .build();

    const expected: Array<ITestInterface> = [
      {
        created: testDate,
        description: 'description 1',
        id: 9,
        name: 'name 1'
      },
      {
        created: testDate,
        description: 'description 2',
        id: 9,
        name: 'name 2'
      },
      {
        created: testDate,
        description: 'description 3',
        id: 3,
        name: 'name 3'
      }
    ];

    expect((actual as Array<ITestInterface>).length).toBe(expected.length);
    expect(actual).toEqual(expected);
  });

  it('Should return expected collection with last items overridden', () => {
    const actual = target
      .fromTemplate(template)
      .with((d, i) => (d.created = testDate))
      .theLast(2)
      .with((d, i) => (d.id = 9))
      .build();

    const expected: Array<ITestInterface> = [
      {
        created: testDate,
        description: 'description 1',
        id: 1,
        name: 'name 1'
      },
      {
        created: testDate,
        description: 'description 2',
        id: 9,
        name: 'name 2'
      },
      {
        created: testDate,
        description: 'description 3',
        id: 9,
        name: 'name 3'
      }
    ];

    expect(actual).toEqual(expected);
  });

  it('Should return expected collection with first and single next subset overridden', () => {
    const actual = target
      .fromTemplate(template)
      .with((d, i) => (d.created = testDate))
      .theFirst()
      .with((d, i) => (d.id = 9))
      .theNext(2)
      .with((d, i) => (d.id = 8))
      .build();

    const expected: Array<ITestInterface> = [
      {
        created: testDate,
        description: 'description 1',
        id: 9,
        name: 'name 1'
      },
      {
        created: testDate,
        description: 'description 2',
        id: 8,
        name: 'name 2'
      },
      {
        created: testDate,
        description: 'description 3',
        id: 8,
        name: 'name 3'
      }
    ];

    expect(actual).toEqual(expected);
  });

  it('Should return expected collection with first and multiple next subsets overridden', () => {
    const actual = new CollectionBuilder<ITestInterface>(5)
      .fromTemplate(template)
      .with((d, i) => (d.created = testDate))
      .theFirst()
      .with((d, i) => (d.id = 9))
      .theNext()
      .with((d, i) => (d.id = 8))
      .theNext(2)
      .with((d, i) => (d.id = 7))
      .build();

    const expected: Array<ITestInterface> = [
      {
        created: testDate,
        description: 'description 1',
        id: 9,
        name: 'name 1'
      },
      {
        created: testDate,
        description: 'description 2',
        id: 8,
        name: 'name 2'
      },
      {
        created: testDate,
        description: 'description 3',
        id: 7,
        name: 'name 3'
      },
      {
        created: testDate,
        description: 'description 4',
        id: 7,
        name: 'name 4'
      },
      {
        created: testDate,
        description: 'description 5',
        id: 5,
        name: 'name 5'
      }
    ];

    expect(actual).toEqual(expected);
  });

  it('Should return expected collection with first, multiple next and last subsets overridden', () => {
    const actual = new CollectionBuilder<ITestInterface>(6)
      .fromTemplate(template)
      .with((d, i) => (d.created = testDate))
      .theFirst()
      .with((d, i) => (d.id = 9))
      .theNext()
      .with((d, i) => (d.id = 8))
      .theNext(2)
      .with((d, i) => (d.id = 7))
      .theLast(2)
      .with((d, i) => (d.id = 6))
      .build();

    const expected: Array<ITestInterface> = [
      {
        created: testDate,
        description: 'description 1',
        id: 9,
        name: 'name 1'
      },
      {
        created: testDate,
        description: 'description 2',
        id: 8,
        name: 'name 2'
      },
      {
        created: testDate,
        description: 'description 3',
        id: 7,
        name: 'name 3'
      },
      {
        created: testDate,
        description: 'description 4',
        id: 7,
        name: 'name 4'
      },
      {
        created: testDate,
        description: 'description 5',
        id: 6,
        name: 'name 5'
      },
      {
        created: testDate,
        description: 'description 6',
        id: 6,
        name: 'name 6'
      }
    ];

    expect(actual).toEqual(expected);
  });

  it('Should return expected collection with default, first, single next, last subsets overridden', () => {
    const actual = new CollectionBuilder<ITestInterface>(6)
      .fromTemplate(template)
      .with((d, i) => (d.created = testDate))
      .with((d, i) => (d.id = 3))
      .theFirst()
      .with((d, i) => (d.id = 9))
      .theNext()
      .with((d, i) => (d.id = 8))
      .theLast(2)
      .with((d, i) => (d.id = 6))
      .build();

    const expected: Array<ITestInterface> = [
      {
        created: testDate,
        description: 'description 1',
        id: 9,
        name: 'name 1'
      },
      {
        created: testDate,
        description: 'description 2',
        id: 8,
        name: 'name 2'
      },
      {
        created: testDate,
        description: 'description 3',
        id: 3,
        name: 'name 3'
      },
      {
        created: testDate,
        description: 'description 4',
        id: 3,
        name: 'name 4'
      },
      {
        created: testDate,
        description: 'description 5',
        id: 6,
        name: 'name 5'
      },
      {
        created: testDate,
        description: 'description 6',
        id: 6,
        name: 'name 6'
      }
    ];

    expect(actual).toEqual(expected);
  });
});
