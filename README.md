# class-hydrator

When you stringify an instance of a typescript class, it loses its **class type** and it's impossible to use methods of the class.
And you can't even stringify it if the instance had **circular structures.**

Let me introduce class-hydrator. `dehydrate` the instance and stringify it. And send it with ajax, websocket, webrtc
to remote machine. Then, `hydrate` (restore) it and use it as if it was created in remote machine.

This is my first open-source project for my private project. I hope it also helpful for your projects.
Forks, pull-requests and feedbacks are always welcome.

## Installation

1. It supports only a typescript project. And it requires `emitDecoratorMetadata`, `experimentalDecorators` options in `tsconfig.json`
    ```json
    {
      "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "removeComments": false,
        "noImplicitAny": false,
        "suppressImplicitAnyIndexErrors": true
      }
    }
    ```
2. Install it with npm
    ```
    $npm install --save class-hydrator
    ```

## Getting started

Let's create some classes like below.
```typescript
class Seed {
  fruit:Fruit;
  harvest(){
    return this.fruit;
  }
}

class Strawberry {
  constructor(public weight:number, public seed:Seed){
    seed.fruit = this;    // causes circular structure!
  }
  greeting(){ console.log("Hi, I'm a strawberry") }
  getSeed(){ return this.seed }
}
```

And create strawberry instance using classes defined above.
```typescript
let strawberry = new Strawberry(30, new Seed());
```

You cannot serialize strawberry as it is. `JSON.stringify(strawberry)` will throw an Error because `strawberry` instance
has a circular structure. So, dehydrate it before serializing.

```typescript
import { Hydrator, hydrate, dehydrate, serialize } from "class-hydrator";

let dehydratedStrawberry = Hydrator.dehydrate(strawberry);  // little verbose
// or you can also
let dehydratedStrawberry = dehydrate(strawberry);           // dehydrate is same with Hydrator.dehydrate except there is no namespace.
                                                // Which style you choose is entirely up to your favor.
/* dehydratedStrawberry
  Object{
    _c_: "Strawberry", _i_: 0,
    weight: 30,
    seed: Object{
      _c_: "Seed", _i_: 1,
      fruit: "_i_0"
    }
  }
 */
let serializedStrawberry = JSON.stringify(dehydratedStrawberry);
```

or you can just

```typescript
let serializedStrawberry = serialize(strawberry);
```

And now, suppose that serializedStrawberry have sent to remote browser using websocket or xhr or anything you prefer.
Remote browser can `hydrate` (restore) it preserving class types and circular structures.
Before hydrating it, Every classes in `Strawberry` should have been provided to Hydrator so as to use the classes for
instantiating in hydrating process..
```typescript
import { Hydrator, hydrate, deserialize } from "class-hydrator";

Hydrator.provideClasses([Strawberry, Seed]);
dehydratedStrawberry = JSON.parse(serializedStrawberry);
restoredStrawberry = hydrate(dehydratedStrawberry, Strawberry);
```

or you can just

```typescript
restoredStrawberry = deserialize(serializedStrawberry, Strawberry);
```

You can now use `restoredStrawberry.greeting()` or `restoredStrawberry.seed.harvest()`.

##Decorators
You can refine how the properties in you Class will be Hydrated or Dehydrated with property decorators.
I prepared two decorators, `@OnDehydrate()` and `@OnHydrate()`.
And also additional `@Exclude()` for convenience.

```typescript
import {Hydrator, OnHydrate, OnDehydrate, hydrate, dehydrate} from 'class-hydrator';

class Point{
  constructor(public x:number, public y:number){ }
}

class Rectangle{
  @OnDehydrate((self)=>{    // or you can use just @Exclude() (@Exclude() equals to @OnDehydrate((self)=>null)
    return null;
  })
  @OnHydrate((self)=>{
    let divElement = new HTMLDivElement();
    // style the divElement using self.color, self.offset
    return divElement;
  })
  elem:HTMLDivElement;
  
  constructor(private color:string, private offset:Point){ }
}

Hydrator.provideClasses([Point, Rectangle]);
```
`@OnDehydrate()` decorator accepts a function which returns new value you want to set when Rectangle is dehydrated.
It is good practice to compress some properties if they can be generated using other properties. Rectangle.elem will
be null when you dehydrate a Rectangle-type object. And restored when being hydrated.

You can hydrate `Rectangle` instance as well as **dehydrated** Rectangle so as to trigger the `@OnHydrate()` decorators.
```typescript
let rectangle = new Rectangle('red', new Point(300,200)); // rectangle.elem is not ready yet.
rectangle = hydrate(rectangle);                           // rectangle.elem is now ready.
```
