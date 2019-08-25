import { Builder, ITemplate, notConfiguredError } from './builder';

export type CollectionSetter<T> = (type: T, index: number) => void;

interface IBuilderSpec<T> {
  size: number;
  setters: Array<CollectionSetter<T>>;
}

export interface ICollectionBuilder<T> {
  size: number;
  build(): Array<T>;
  fromTemplate(template: ITemplate): ICollectionBuilder<T>;
  theFirst(num?: number): ICollectionBuilder<T>;
  theNext(num?: number): ICollectionBuilder<T>;
  theLast(num?: number): ICollectionBuilder<T>;
  with(setter: CollectionSetter<T>): ICollectionBuilder<T>;
}

export class CollectionBuilder<T> extends Builder<T> implements ICollectionBuilder<T> {
  private firstBuilderSpec: IBuilderSpec<T>;
  private nextBuilderSpecs: Array<IBuilderSpec<T>> = [];
  private lastBuilderSpec: IBuilderSpec<T>;
  private allBuilderSpec: IBuilderSpec<T>;
  private currentBuilderSpec: IBuilderSpec<T>;

  constructor(private count: number) {
    super();
    this.allBuilderSpec = this.createBuilderSpec(0);
    this.currentBuilderSpec = this.allBuilderSpec;
  }

  public build(): Array<T> {
    this.throwIfNoTemplateOrSetters();

    let indexPointer: number = 0;
    const size = this.size;
    const result = [];

    for (let i = indexPointer; i < size; i++) {
      const newItem: any = {};
      if (this.template) {
        this.populateFromTemplate(newItem, i + 1);
      }
      for (const setter of this.allBuilderSpec.setters) {
        setter(newItem, i);
      }
      result.push(newItem);
    }

    if (this.firstBuilderSpec) {
      for (let i = indexPointer; i < this.firstBuilderSpec.size; i++) {
        const item = result[i];
        for (const setter of this.firstBuilderSpec.setters) {
          setter(item, i);
        }
      }

      indexPointer = this.firstBuilderSpec.size;
    }

    if (this.nextBuilderSpecs.length) {
      for (const spec of this.nextBuilderSpecs) {
        for (let k = indexPointer; k < indexPointer + spec.size; k++) {
          const item = result[k];
          for (const setter of spec.setters) {
            setter(item, k);
          }
        }
        indexPointer += spec.size;
      }
    }

    if (this.lastBuilderSpec) {
      const start = size - this.lastBuilderSpec.size;
      const end = size;
      for (let l = start; l < end; l++) {
        const item = result[l];
        for (const setter of this.lastBuilderSpec.setters) {
          setter(item, l);
        }
      }
    }

    return result as Array<T>;
  }

  public fromTemplate(template: ITemplate): ICollectionBuilder<T> {
    this.template = template;
    return this;
  }

  public get size(): number {
    return this.count;
  }

  public theFirst(num: number = 1): ICollectionBuilder<T> {
    this.firstBuilderSpec = this.createBuilderSpec(num);
    this.currentBuilderSpec = this.firstBuilderSpec;
    return this;
  }

  public theNext(num: number = 1): ICollectionBuilder<T> {
    this.throwIfFirstNotInitialised();
    this.throwIfLastInitialised();
    this.throwIfNextExceedsSize(num);
    const nextBuilderSpec = this.createBuilderSpec(num);
    this.nextBuilderSpecs.push(nextBuilderSpec);
    this.currentBuilderSpec = nextBuilderSpec;
    return this;
  }

  public theLast(num: number = 1): ICollectionBuilder<T> {
    this.throwIfLastExceedsSize(num);
    this.lastBuilderSpec = this.createBuilderSpec(num);
    this.currentBuilderSpec = this.lastBuilderSpec;
    return this;
  }

  public with(setter: (type: T, index: number) => void): ICollectionBuilder<T> {
    this.currentBuilderSpec.setters.push(setter);
    return this;
  }

  private createBuilderSpec(size: number): IBuilderSpec<T> {
    return { size, setters: [] };
  }

  private firstBuilderSize(): number {
    if (!this.firstBuilderSpec) {
      return 0;
    }

    return this.firstBuilderSpec.size;
  }

  private sumOfNextBuilderSizes(): number {
    let sum = 0;
    for (const spec of this.nextBuilderSpecs) {
      sum += spec.size;
    }
    return sum;
  }

  private throwIfFirstNotInitialised(): void {
    if (!this.firstBuilderSpec) {
      throw new Error('A call to "theNext" must follow a call to "theFirst".');
    }
  }

  private throwIfLastInitialised(): void {
    if (this.lastBuilderSpec) {
      throw new Error('"theNext" cannot be used once "theLast" has been used.');
    }
  }

  private throwIfNextExceedsSize(n: number): void {
    if (this.firstBuilderSize() + this.sumOfNextBuilderSizes() + n > this.size) {
      throw new Error('Cannot exceed bounds of original builder with "theNext".');
    }
  }

  private throwIfLastExceedsSize(n: number): void {
    if (this.firstBuilderSize() + this.sumOfNextBuilderSizes() + n > this.size) {
      throw new Error('Cannot exceed bounds of original builder with "theLast".');
    }
  }

  private throwIfNoTemplateOrSetters() {
    if (!this.template && !this.allBuilderSpec.setters.length) {
      throw new Error(notConfiguredError);
    }
  }
}
