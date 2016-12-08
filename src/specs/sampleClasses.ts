import {Hydrator, OnHydrate, OnDehydrate, Exclude, hydrate, dehydrate} from '../index';

interface Fruit {
  weight:number;
  seed:Seed;
}

class Seed {
  fruit:Fruit;
  harvest(){
    return this.fruit;
  }
}

class Strawberry implements Fruit{
  constructor(public weight:number, public seed:Seed){
    seed.fruit = this;
  }
  greeting(){ console.log("Hi, I'm a strawberry") }
  getSeed(){ return this.seed }
}

class Mango implements Fruit{
  constructor(public weight:number, public seed:Seed){
    seed.fruit = this;
  }
  greeting(){ console.log("Hi, I'm a mango") }
  getSeed(){ return this.seed }
}

Hydrator.resetClasses([Strawberry,Mango,Seed]);

let strawberry = new Strawberry(30, new Seed());
console.log(strawberry);

let dehydratedStrawberry = dehydrate(strawberry);
let hydratedStrawberry = hydrate(dehydratedStrawberry, Strawberry);
console.log('dehydratedStrawberry:',dehydratedStrawberry);
console.log('hydratedStrawberry:',hydratedStrawberry);
