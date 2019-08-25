import { ITemplate, notConfiguredError } from '../src/builder';
import { MemberType } from '../src/memberType';
import { SingleObjectBuilder } from '../src/singleObjectBuilder';
import { ITestInterface } from './testInterface';

describe('SingleObjectBuilder', () => {
  let target: SingleObjectBuilder<ITestInterface>;

  beforeEach(() => {
    target = new SingleObjectBuilder<ITestInterface>();
  });

  it('Should be defined', () => {
    expect(target).toBeDefined();
  });

  it('should throw an error if no setters or template are configured', () => {
    expect(() => {
      target.build();
    }).toThrowError(notConfiguredError);
  });

  it('should return new instance with properties set using with', () => {
    const actual = target
      .with(t => (t.id = 1))
      .with(t => (t.name = 'name 1'))
      .with(t => (t.description = 'description 1'))
      .with(t => (t.created = new Date()))
      .build();

    const expected: ITestInterface = {
      id: 1,
      name: 'name 1',
      // tslint:disable-next-line: object-literal-sort-keys
      description: 'description 1',
      created: new Date()
    };

    expect(actual).toEqual(expected);
  });

  it('should return new instance from template only', () => {
    const template: ITemplate = {
      created: MemberType.Date,
      description: MemberType.String,
      id: MemberType.Number,
      name: MemberType.String
    };

    const expected: ITestInterface = {
      id: 1,
      name: 'name 1',
      // tslint:disable-next-line: object-literal-sort-keys
      description: 'description 1',
      created: new Date()
    };

    const actual = target.fromTemplate(template).build();

    expect(actual).toEqual(expected);
  });

  it('should return new instance from template and override', () => {
    const template: ITemplate = {
      created: MemberType.Date,
      description: MemberType.String,
      id: MemberType.Number,
      name: MemberType.String
    };

    const expected: ITestInterface = {
      id: 99,
      name: 'name 1',
      // tslint:disable-next-line: object-literal-sort-keys
      description: 'description 1',
      created: new Date()
    };

    const actual = target
      .fromTemplate(template)
      .with(d => {
        d.id = 99;
      })
      .build();

    expect(actual).toEqual(expected);
  });
});
