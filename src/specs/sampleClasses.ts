export class Seed {
  fruit:Fruit;
  constructor(){ }
  setFruit(fruit:Fruit){
    this.fruit = fruit;
  }
  harvest(){
    return this.fruit;
  }
}

interface Fruit {
  weight:number;
  seed:Seed;
}

export class Strawberry implements Fruit{
  constructor(public weight:number, public seed:Seed){ }
  greeting(){ console.log("Hi, I'm a strawberry") }
  getSeed(){ return this.seed }
}

export class Mango implements Fruit{
  constructor(public weight:number, public seed:Seed){ }
  greeting(){ console.log("Hi, I'm a mango") }
  getSeed(){ return this.seed }
}