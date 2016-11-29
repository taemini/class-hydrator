import {Hydrator, hydrate, dehydrate} from '../index';
import {Seed, Mango, Strawberry} from './sampleClasses';

describe("Hydrator", function(){
  beforeAll(()=>{
    this.classes = [Seed, Mango, Strawberry];
    Hydrator.provideClasses(this.classes);
  });
  it("should have been provided Object, Array as default", function(){
    expect(Hydrator.constructors).toEqual(jasmine.objectContaining({"Object":Object, "Array":Array}));
  });
  it("should have constructors which have been provided by '.provideClasses([classes])'", function(){
    expect(Hydrator.constructors).toEqual(jasmine.objectContaining({"Seed":Seed, "Mango":Mango, "Strawberry":Strawberry}));
  });
  it("should be able to get constructor by '.getConstructor(className:string)'", function(){
    for(let i in this.classes){
      expect(Hydrator.getConstructor(this.classes[i].constructor.name)).toBe(this.classes[i]);
    }
  });
  it("Hydrator.hydrate === hydrate && Hydrator.dehydrate === dehydrate", function(){
    expect(Hydrator.hydrate).toBe(hydrate);
    expect(Hydrator.dehydrate).toBe(dehydrate);
  });
});

describe("conservativeness of class type", function(){
  let mango, strawberry;
  beforeEach(()=>{
    let mangoSeed = new Seed();
    mango = new Mango(30, mangoSeed);
    mangoSeed.setFruit(mango);
    let strawberrySeed = new Seed();
    strawberry = new Strawberry(10, strawberrySeed);
    strawberrySeed.setFruit(mango);
  });
  it("should preserves class type of root object when dehydrating", function(){
    expect(dehydrate(mango)).toEqual(jasmine.objectContaining({_c_:"Mango"}));
  });
  it("should preserves class type of root object when dehydrate -> stringify -> parse -> hydrate", function(){
    let transformingMango = dehydrate(mango);
    transformingMango = JSON.stringify(transformingMango);
    transformingMango = JSON.parse(transformingMango as string);
    transformingMango = hydrate(transformingMango);
    expect(transformingMango).toEqual(jasmine.any(Mango));
  });
});
