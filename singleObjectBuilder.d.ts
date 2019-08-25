export interface ISingleObjectBuilder<T> {
    build(): T;
    with(setter: (t: T) => void): ISingleObjectBuilder<T>;
}
export declare class SingleObjectBuilder<T> implements ISingleObjectBuilder<T> {
    private ctor;
    private settters;
    constructor(ctor: {
        new (): T;
    });
    build(): T;
    with(setter: (t: T) => void): ISingleObjectBuilder<T>;
}
