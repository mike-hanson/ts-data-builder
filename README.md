### ts-data-builder

A utility library for creating test objects inspired by [NBuilder](https://github.com/garethdown44/nbuilder/) my preferred .NET test data builder.

Building complex or multiple object literals to test your JavaScript component can be tedious. Copy and paste can help, but it is still tedious, and my experience is often a barrier to adopting TDD for some developers.

You can use the builder pattern to avoid repetition, but even though this helps you practice the DRY principle creating the builder can be tedious, albeit only once.

Using some sort of builder can make test code much more readable and expressive, which is always a good thing. Whether you are building test data inline with tests or creating custom builders I believe ts-data-builder can help you do so quickly and cleanly.

#### Installing

ts-data-builder is designed for development time where you are coding with TypeScript or ES6 and the test runner executing in a Node.js environment. I do all my JavaScript development with TypeScript using VS Code so that is where pretty much all of my testing effort on this package has been focused.
It may well work in other environments but I haven't tested it and have no plans to do so.

Install with npm.

```
npm install ts-data-builder -D
```

or yarn

```
yarn add ts-data-builder --dev
```

#### Usage

With ts-data-builder you can create single objects or collections (arrays) of objects, you can use an object as a template or you can just use the fluent API to build your objects.

To start building objects you first need a reference to the factory object which you get by importing it into your current module.

```javascript
import { builder } 'ts-data-builder';
```

Once you have the factory you can use methods to get instances of SingleObjectBuilder<T> or CollectionBuilder<T>. Both types of builder support fluent usage, all methods except one return the builder to support chaining.

```javascript
// to get a SingleObjectBuilder
const mySob = builder.createNew<MyModel>();

// to get a CollectionBuilder
const myCb = builder.createListOfSize<MyModel>(3);
```

##### Using Templates

Once you have a builder you can configure it to use a template for building objects. A template is similar to an Interface, in that it defines members that all built objects should have and a type specifier.

The supported member type specifiers are provided in an "enum" object

```javascript
MemberType.String;
MemberType.Number;
MemberType.Date;
```

If one of the supported type specifiers is used builders will generate predictable values as follows:

String: member name + sequence number e.g. {name: 'name 1'}, {name: 'name 2'}
Number: squence number e.g. {id: 1}, {id: 2}
Date: new Date()

Once you have defined you template you pass it to the "fromTemplate" method of the builder and call the build method to generate objects based on the template.

```javascript
const template = {
  id: MemberType.Number,
  name: MemberType.String,
  age: MemberType.Number
};

const testData = builder
  .createListOfSize(5)
  .fromTemplate()
  .build();

// testData will look like this
[
  { id: 1, name: 'name 1', age: 1 },
  { id: 2, name: 'name 2', age: 2 },
  { id: 3, name: 'name 3', age: 3 },
  { id: 4, name: 'name 4', age: 4 },
  { id: 5, name: 'name 5', age: 5 }
];
```

For anything else or to override template specification you must use the fluent "with" method of the builder.

#### Fluent Building

Templates are great when you want a number of similar objects generated and don't care too much what the values are, or when you want to re-use a single object builder to generate objects with minor differences.
However there are times when you want something more than a simple set of sequentially generated objects, this is where the fluent building API comes in handy.

Both types of builder implement a **with** method that can be used to configure the builder or override the template for some members.

**with** accepts a setter action that sets the value of an object instance, which is passed as the first argument. The CollectionBuilder supports a second argument to provide you the index of the object being generated.

```javascript
SingleObjectBuilder<T>::with((instance: T) => void);
CollectionBuilder<T>::with((instance: T, index: number) => void);
```

The following example shows how to fluently produce the same result as above.

```javascript
var myCollection = builder
  .createListOfSize(5)
  .with((d, i) => (d.id = i + 1))
  .with((d, i) => (d.name = `name ${i + 1}`))
  .with((d, i) => (d.age = (i + 1) * 15))
  .build();
```

Personally I find this more expressive and readable than the template example.

Ok you say, so this is all well and good, but sometimes I want a collection of objects with a more complicated setup.
Maybe I want the first couple of objects to have one set of values, then the next three something different and the last few with yet another set of values.

And I say, no problem ts-data-builder can help you there with its **theFirst**, **theNext** and **theLast** methods.
These methods can all be used in conjunction with a template to setup the base requirements of generated objects and only override specific members.
If you don't use a template to specify defaults you must use the fluent interface to define defaults for members that are not configured using **theFirst**, **theNext** and **theLast**.

###### theFirst

Sets the context of the builder to the first _n_ objects generated.
Subsequent calls to **with** affect only the first specified subset of objects in the collection. Each time it is called it overrides any previous specification for the first _n_ objects.

###### theNext

Sets the context of the builder to the next _n_ objects generated.
An error will be thrown if **theNext** is used without first using **theFirst** or the specified number combined with previous numbers exceeds the specified size of the collection.
It can be called multiple times and each subset starts after the preceding first _n_ or next _n_ subset.

##### theLast

Sets the context of the builder to the last _n_ objects generated.
You can use **theLast** on its own but if you have used **theFirst** with or without **theNext** it will throw an error if the combined total of items specified exceeds the size of the collection.

```javascript
var myCollection = builder
  .createListOfSize(10)
  .with((d, i) => (d.id = i + 1))
  .with((d, i) => (d.name = `name ${i + 1}`))
  .theFirst(2)
  .with((d, i) => (d.age = 20))
  .theNext(2)
  .with((d, i) => (d.age = 25))
  .theNext(2)
  .with((d, i) => (d.age = 23))
  .theLast()
  .with((d, i) => (d.age = 50))
  .build();

// generates the following collection

[
  { id: 1, name: 'name 1', age: 20 },
  { id: 2, name: 'name 2', age: 20 },
  { id: 3, name: 'name 3', age: 25 },
  { id: 4, name: 'name 4', age: 25 },
  { id: 5, name: 'name 5', age: 23 },
  { id: 6, name: 'name 6', age: 23 },
  { id: 7, name: 'name 7', age: 35 },
  { id: 8, name: 'name 8', age: 40 },
  { id: 9, name: 'name 9', age: 45 },
  { id: 10, name: 'name 10', age: 50 }
];
```

Note in the above example no value is specified for _n_ in the call to **theLast**. All of the methods assume 1 if no explicit value is specified.

Ok you say, this is all well and good, but!! sometimes I need to build really complex object graphs with members that are collections or complex objects.

And I say, no problem you can "nest" builders to create objects as complex as you like

#### Nested Builders

ts-data-builder doesn't do templates within templates (uugghh!! how ugly would that be) but you can still generate complex objects with deep hierarchies using the fluent API.
I took the decision early on that I would only support automatic generation of primitive members, for anything else including fixed values you need to use the fluent API.
This keeps ts-data-builder fairly simple but gives you the flexibility to do pretty much anything you want.

Here is an example of a using "nesting" to create a simple object with a collection member

```javascript
 const testData = builder.createNew()
      .with(d => d.id = 1)
      .with(d => d.name = 'name 1')
      .with(d => d.age = 35)
      .with(
        d =>
          (d.children = builder.createListOfSize(3)
            .with((c, i) => c.id = i + 1)
            .with((c, i) => c.name = `name ${i + 1}`)
            .with((c, i) => c.age = (i + 1) * 3
            .build())
      )
      .build();

// this produces
{
  id: 1,
  name: 'name 1',
  age: 35,
  children: [
    {
      id: 1,
      name: 'name 1',
      age: 3
    },
    {
      id: 2,
      name: 'name 2',
      age: 6
    },
    {
      id: 3,
      name: 'name 3',
      age: 9
    }
  ]
};
```

You can use templates with nested builder like this

```javascript
const template = {
  id: MemberType.Number,
  name: MemberType.String,
  age: MemberType.Number
};

 const testData = builder.createNew()
    .fromTemplate(template)
    .with(d => d.age = 35)
    .with(
        d =>
          (d.children = builder.createListOfSize(3)
            .fromTemplate(template
            .with((c, i) => c.age = (i + 1) * 3
            .build())
      )
      .build();

// this produces
{
  id: 1,
  name: 'name 1',
  age: 35,
  children: [
    {
      id: 1,
      name: 'name 1',
      age: 3
    },
    {
      id: 2,
      name: 'name 2',
      age: 6
    },
    {
      id: 3,
      name: 'name 3',
      age: 9
    }
  ]
};
```

That's it for now, as always if you have any constructive comments or questions please feel free to post an Issue in this repo and I will deal with it as soon as I can.

For more examples browse the tests in the spec folder of the source.
