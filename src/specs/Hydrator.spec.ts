import {Hydrator, hydrate, dehydrate, Hydratable, OnHydrate} from '../index';
import {Seed, Mango, Strawberry} from './sampleClasses';

describe("Hydratable", function(){
  it('should restore children in HydratableClass (HydratableArgs.providers) work)', function(){
    @Hydratable()
    class Plant{
      constructor(public weight:number){}
    }
    @Hydratable()
    class Fruit extends Plant{
      constructor(weight:number, public sweetiness:number){
        super(weight);
      }
    }
    @Hydratable({providers:[Plant, Fruit]})
    class Apple extends Fruit{
      constructor(weight:number, sweetiness:number, public color:string, public parent:Fruit){
        super(weight, sweetiness);
      }
    }

    let redFruit = new Fruit(30, 30);
    let apple = new Apple(25, 28, 'red', redFruit);
    let dehydratedApple = dehydrate(apple);
    let hydratedApple = hydrate(Apple, dehydratedApple);
    expect(hydratedApple).toEqual(jasmine.any(Apple));
    expect(hydratedApple.parent).toEqual(jasmine.any(Fruit));
  });
});
describe("hydrate exception handlers",function(){
  it("should throw error when there was a unhydratable class to hydrate", function(){
    class Plant{
      constructor(public weight:number){}
    }
    // @Hydratable()  Fruit is unhydratable now.
    class Fruit extends Plant{
      constructor(weight:number, public sweetiness:number){
        super(weight);
      }
    }
    @Hydratable({providers:[Fruit]})
    class Apple extends Fruit{
      constructor(weight:number, sweetiness:number, public color:string, public parent:Fruit){
        super(weight, sweetiness);
      }
    }
    let redFruit = new Fruit(30, 30);
    let apple = new Apple(25, 28, 'red', redFruit);
    let dehydratedApple = dehydrate(apple);
    expect(()=>{hydrate(Apple, dehydratedApple)}).toThrowError("Fruit is not hydratable")
  });
  it("should throw error when there was not provided class to hydrate", function(){
    class Plant{
      constructor(public weight:number){}
    }
    @Hydratable()
    class Fruit extends Plant{
      constructor(weight:number, public sweetiness:number){
        super(weight);
      }
    }
    @Hydratable()  // Fruit is not hydratable (required for hydrating Apple.parent:Fruit)
    class Apple extends Fruit{
      constructor(weight:number, sweetiness:number, public color:string, public parent:Fruit){
        super(weight, sweetiness);
      }
    }
    let redFruit = new Fruit(30, 30);
    let apple = new Apple(25, 28, 'red', redFruit);
    let dehydratedApple = dehydrate(apple);
    expect(()=>{hydrate(Apple, dehydratedApple)}).toThrowError("Fruit was not provided to Apple")
  })
});
describe("OnHydrate", function(){
  it("should works on properties of parent Class", function(){
    class Parent{
      @OnHydrate(()=>"OnHydrate worked on Parent")
      name:string;
      constructor(name){ this.name = name }
    }
    class Child extends Parent{
      @OnHydrate(()=>"OnHydrate worked on Child")
      age:number;
      constructor(name, age){ super(name); this.age = age;}
    }
  });
});
// describe("Hydrator", function(){
//   beforeAll(()=>{
//     this.classes = [Seed, Mango, Strawberry];
//     Hydrator.provideClasses(this.classes);
//   });
//   it("should have been provided Object, Array as default", function(){
//     expect(Hydrator.constructors).toEqual(jasmine.objectContaining({"Object":Object, "Array":Array}));
//   });
//   it("should have constructors which have been provided by '.provideClasses()'", function(){
//     expect(Hydrator.constructors).toEqual(jasmine.objectContaining({
//       "Seed":Seed, "Mango":Mango, "Strawberry":Strawberry
//     }));
//   });
//   it("should be able to get constructor by '.getConstructor(className:string)'", function(){
//     for(let i in this.classes){
//       expect(Hydrator.getConstructor(this.classes[i].constructor.name)).toBe(this.classes[i]);
//     }
//   });
//   it("Hydrator.hydrate === hydrate && Hydrator.dehydrate === dehydrate", function(){
//     expect(Hydrator.hydrate).toBe(hydrate);
//     expect(Hydrator.dehydrate).toBe(dehydrate);
//   });
// });
//
// describe("conservativeness of class type", function(){
//   let mango, strawberry;
//   beforeEach(()=>{
//     let mangoSeed = new Seed();
//     mango = new Mango(30, mangoSeed);
//     mangoSeed.setFruit(mango);
//     let strawberrySeed = new Seed();
//     strawberry = new Strawberry(10, strawberrySeed);
//     strawberrySeed.setFruit(mango);
//   });
//   it("should preserves class type of root object when dehydrating", function(){
//     expect(dehydrate(mango)).toEqual(jasmine.objectContaining({_c_:"Mango"}));
//   });
//   it("should preserves class type of root object when dehydrate -> stringify -> parse -> hydrate", function(){
//     let transformingMango = dehydrate(mango);
//     transformingMango = JSON.stringify(transformingMango);
//     transformingMango = JSON.parse(transformingMango as string);
//     transformingMango = hydrate(transformingMango);
//     expect(transformingMango).toEqual(jasmine.any(Mango));
//   });
// });
//
// describe("@Exclude decorator", function(){
//
// });