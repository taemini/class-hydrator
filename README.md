###Caution: This is in progress. Do not install this package.

#class-hydrator

When you stringify an instance of a typescript class, it loses its **class type** and it's impossible to use methods of it.
And you can't even stringify it if the instance had **circular structure.**

Introduce class-hydrator. `dehydrate` the instance and stringify it. And send it with ajax, websocket, webrtc
to remote machine. Then, `hydrate` (restore) it and use it as if it was created in local machine.

This is my first open-source project for my private project. I hope it also helpful for your projects.
Forks, pull-requests and feedbacks are always welcome.

##Installation

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

##Getting started

Let's play some classes (`Human`, `Dog`, `Cat`) like below.
```typescript
class Human {
  pets:Pet[] = [];
  
  constructor(public name:string){ };
  
  addPet(pet:Pet){ this.pets.push(pet); }
  say(){ console.log("Hi!"); }
}

interface Pet {
  name:string;
  master:Human;
  say:()=>void;
}

class Dog implements Pet{
  name:string;
  master:Human;   //causes circular structure
  
  say(){
    console.log("bowwow!");
  }
  
  constructor(name:string, master:Human, info?:any){
    this.name = name;
    this.master = master;
  }
}

class Cat implements Cat{
  name:string;
  master:Human;   //causes circular structure
  
  constructor(name:string, master:Human, private info?:any){
    this.name = name;
    this.master = master;
  }
  
  say(){
    console.log("meow!");
  }
}
```

And create these instances using classes defined above.
```typescript
let girl = new Human('Mary');
let dog = new Dog('Toni' ,girl , { habitat:'outdoor', favorites:['chicken', 'santa', 'Mary'] });
let cat = new Cat('Charls', girl, { habitat:'indoor', favorites:['fish' ,'Toni'] });
```

You cannot serialize girl as it is. `JSON.stringify(girl)` will throw an Error because `girl` instance has circular structures.
So, dehydrate it before serializing.

```typescript
import { Hydrator, dehydrate } from "class-hydrator";

let dehydratedGirl = Hydrator.dehydrate(girl);  // little verbose
// or
let dehydratedGirl = dehydrate(girl);           // dehydrate = Hydrator.dehydrate (without namespace)
                                                // Which style you choose is entirely up to your favor.
/* dehydratedGirl
  Object{
    _c_: "Human", _i_: 0,
    name: "Mary",
    pets: [
      Object{
        _c_: "Dog", _i_: 
      },
      Object{
      }
    ]
  }
 */
let serializedGirl = JSON.stringify(dehydratedGirl);
```

And now, suppose that serializedGirl have sent to remote browser using websocket.
Remote browser can `hydrate` (restore) it preserving class types and circular structures.
Before hydrating it, Every classes used for instanciating `girl` should be provided to Hydrator.
```typescript
import { Hydrator, hydrate } from "class-hydrator";

Hydrator.provideClasses([Human, Girl, Dog]);
dehydratedGirl = JSON.parse(serializedGirl);
restoredGirl = hydrate(dehydratedGirl);
```
You can now use `restoredGirl.say()` or access to `dehydratedGirl.pets[0].master`.
