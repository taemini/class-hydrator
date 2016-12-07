import 'reflect-metadata';
import {dehydrate, serialize} from './methods/dehydrate';
import {hydrate, deserialize} from './methods/hydrate';
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
  static serialize = serialize;
  static deserialize = deserialize;
}