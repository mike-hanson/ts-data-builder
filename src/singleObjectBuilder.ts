import { Builder, ITemplate, notConfiguredError } from './builder';

export interface ISingleObjectBuilder<T> {
  build(): T;
  fromTemplate(template: ITemplate): ISingleObjectBuilder<T>;
  with(setter: (t: T) => void): ISingleObjectBuilder<T>;
}

export class SingleObjectBuilder<T> extends Builder<T> implements ISingleObjectBuilder<T> {
  private setters: Array<(t: T) => void> = [];
  constructor() {
    super();
  }

  public build(): T {
    this.throwIfNoTemplateOrSetters();

    const result: any = {};

    if (this.template) {
      this.populateFromTemplate(result);
    }

    for (const setter of this.setters) {
      setter(result);
    }

    return result;
  }

  public fromTemplate(template: ITemplate): ISingleObjectBuilder<T> {
    this.template = template;
    return this;
  }

  public with(setter: (t: T) => void): ISingleObjectBuilder<T> {
    this.setters.push(setter);
    return this;
  }

  private throwIfNoTemplateOrSetters() {
    if (!this.template && !this.setters.length) {
      throw new Error(notConfiguredError);
    }
  }
}
