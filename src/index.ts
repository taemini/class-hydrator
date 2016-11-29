import 'reflect-metadata';
import {dehydrate} from './methods/dehydrate';
import {hydrate} from './methods/hydrate';
export * from './methods/dehydrate';
export * from './methods/hydrate';
export * from './decorators';

export class Hydrator{
  static constructors = {
    "Array":Array,
    "Object":Object
  };
  static provideClasses(classes:Array<any>){
    for(let i=0;i<classes.length;i++){
      this.constructors[classes[i].name] = classes[i];
    }
  };
  static getConstructor(className:string){
    let targetConstructor = this.constructors[className];
    if(targetConstructor) return targetConstructor;
    else throw Error(`Hydrator:Couldn't hydrate an Object because Class(${className}) is not provided.
                      "please execute Hydrator.provideClasses([${className}])"`);
  };
  static dehydrate = dehydrate;
  static hydrate = hydrate;
}