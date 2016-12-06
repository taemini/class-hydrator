console.log("--------- ./sampleSrc/sample1.ts ----------");
import {Hydrator, dehydrate, hydrate} from '../src';

class Human {
  pets:Pet[] = [];
  constructor(public name:string){ };
  addPet(pet:Pet){
    this.pets.push(pet);
  }
}

interface Pet {
  name:string;
  master:Human;
  say:()=>void;
}
class Dog implements Pet{
  name:string;
  master:Human;
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
  master:Human;
  say(){
    console.log("meow!");
  }
  constructor(name:string, master:Human, private info?:any){
    this.name = name;
    this.master = master;
  }
}

let girl = new Human('Mary');
let dog = new Dog('Toni', girl, {habitat:'outdoor', favorites:['chicken', 'santa', 'Mary']});
let cat = new Cat('Charls', girl, {habitat:'indoor', favorites:['fish' ,'Toni']});

girl.addPet(dog);
girl.addPet(cat);

console.log('original girl:', girl);
let dehydratedGirl = dehydrate(girl);
console.log(JSON.stringify(dehydratedGirl));
console.log('dehydrated girl:', dehydratedGirl);
let hydratedGirl = hydrate(dehydratedGirl, Human);
console.log('hydrated girl:', hydratedGirl);
