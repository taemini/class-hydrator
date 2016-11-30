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
  static dehydrate = dehydrate;
  static hydrate = hydrate;
}