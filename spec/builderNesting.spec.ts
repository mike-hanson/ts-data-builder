import { CollectionBuilder } from '../src/collectionBuilder';
import { MemberType } from '../src/memberType';
import { SingleObjectBuilder } from '../src/singleObjectBuilder';
import { ITestInterface } from './testInterface';

describe('Nesting Builders', () => {
  it('Should build a semi complex object using "nested" builders without a template', () => {
    const actual = new SingleObjectBuilder<ITestInterface>()
      .with(d => (d.id = 1))
      .with(d => (d.name = 'name 1'))
      .with(d => (d.description = 'description 1'))
      .with(d => (d.created = new Date()))
      .with(
        d =>
          (d.children = new CollectionBuilder<ITestInterface>(3)
            .with((c, i) => (c.id = i + 1))
            .with((c, i) => (c.name = `name ${i + 1}`))
            .with((c, i) => (c.description = `description ${i + 1}`))
            .with((c, i) => (c.created = new Date()))
            .build())
      )
      .build();

    const expected: ITestInterface = {
      id: 1,
      name: 'name 1',
      // tslint:disable-next-line: object-literal-sort-keys
      description: 'description 1',
      created: new Date(),
      children: [
        {
          id: 1,
          name: 'name 1',
          // tslint:disable-next-line: object-literal-sort-keys
          description: 'description 1',
          created: new Date()
        },
        {
          id: 2,
          name: 'name 2',
          // tslint:disable-next-line: object-literal-sort-keys
          description: 'description 2',
          created: new Date()
        },
        {
          id: 3,
          name: 'name 3',
          // tslint:disable-next-line: object-literal-sort-keys
          description: 'description 3',
          created: new Date()
        }
      ]
    };

    assertModelsMatch(actual, expected);
  });

  it('Should build a semi complex object using "nested" builders with a template for root', () => {
    const template = {
      created: MemberType.Date,
      description: MemberType.String,
      id: MemberType.Number,
      name: MemberType.String
    };

    const target = new SingleObjectBuilder<ITestInterface>();

    const actual: ITestInterface = target
      .fromTemplate(template)
      .with(
        d =>
          (d.children = new CollectionBuilder<ITestInterface>(3)
            .with((c, i) => (c.id = i + 1))
            .with((c, i) => (c.name = `name ${i + 1}`))
            .with((c, i) => (c.description = `description ${i + 1}`))
            .with((c, i) => (c.created = new Date()))
            .build())
      )
      .build();

    const expected: ITestInterface = {
      children: [
        {
          created: new Date(),
          description: 'description 1',
          id: 1,
          name: 'name 1'
        },
        {
          created: new Date(),
          description: 'description 2',
          id: 2,
          name: 'name 2'
        },
        {
          created: new Date(),
          description: 'description 3',
          id: 3,
          name: 'name 3'
        }
      ],
      created: new Date(),
      description: 'description 1',
      id: 1,
      name: 'name 1'
    };

    assertModelsMatch(actual, expected);
  });

  it('Should build a semi complex object using "nested" builders with a template for parent and children', () => {
    const template = {
      created: MemberType.Date,
      description: MemberType.String,
      id: MemberType.Number,
      name: MemberType.String
    };

    const target = new SingleObjectBuilder<ITestInterface>();

    const actual: ITestInterface = target
      .fromTemplate(template)
      .with(d => (d.children = new CollectionBuilder<ITestInterface>(3).fromTemplate(template).build()))
      .build();

    const expected: ITestInterface = {
      children: [
        {
          created: new Date(),
          description: 'description 1',
          id: 1,
          name: 'name 1'
        },
        {
          created: new Date(),
          description: 'description 2',
          id: 2,
          name: 'name 2'
        },
        {
          created: new Date(),
          description: 'description 3',
          id: 3,
          name: 'name 3'
        }
      ],
      created: new Date(),
      description: 'description 1',
      id: 1,
      name: 'name 1'
    };

    assertModelsMatch(actual, expected);
  });

  function assertModelsMatch(actual: ITestInterface, expected: ITestInterface) {
    expect(actual.id).toBe(expected.id);
    expect(actual.name).toBe(expected.name);
    expect(actual.description).toBe(expected.description);
    expect(actual.created.valueOf()).toBeLessThanOrEqual(expected.created.valueOf());
    if (actual.children && actual.children.length) {
      for (let i = 0; i < actual.children.length; i++) {
        assertModelsMatch(actual.children[i], expected.children[i]);
      }
    }
  }
});
