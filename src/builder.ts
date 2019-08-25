import { MemberType } from './memberType';

export interface ITemplate {
  [index: string]: MemberType;
}

export const notConfiguredError: string =
  'Invalid operation: The builder has no configuration, have you forgotten to use "with" or "fromTemplate" to configure the builder.';

export abstract class Builder<T> {
  protected template: ITemplate;

  protected populateFromTemplate(result: any, sequenceNo: number = 1) {
    for (const key in this.template) {
      if (this.template.hasOwnProperty(key)) {
        result[key] = this.getValue(key, this.template[key], sequenceNo);
      }
    }
  }

  private getValue(name: string, typeOrGenerator: MemberType, item: number): any {
    if (typeOrGenerator === MemberType.Number) {
      return item;
    }

    if (typeOrGenerator === MemberType.String) {
      return name + ' ' + item.toString();
    }

    return new Date();
  }
}
