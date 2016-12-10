import 'core-js/es6';
import 'core-js/es7/reflect';
import {dehydrate, serialize} from './methods/dehydrate';
import {hydrate, deserialize} from './methods/hydrate';
export * from './methods/dehydrate';
export * from './methods/hydrate';
export * from './decorators';

export class Hydrator{
  static classes = {
    "Object":Object,
    "Array":Array
  };
  static constructors = {
    "Array":Array,
    "Object":Object
  };
  static dehydrate = dehydrate;
  static hydrate = hydrate;
  static serialize = serialize;
  static deserialize = deserialize;
  static provideClasses = function(classes:any[]){
    for(let i=0;i<classes.length;i++){
      this.classes[classes[i].name] = classes[i];
    }
  };
  static resetClasses = function(classes?:any[]){
    this.classes = {
      "Object":Object,
      "Array":Array
    };
    this.provideClasses(classes);
  }
}