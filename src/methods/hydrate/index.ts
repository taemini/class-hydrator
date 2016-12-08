import {hydrateProp} from './hydrateProp';
import {hydratePropWithoutInstantiating} from './hydratePropWithoutInstantiating';

// export function hydrate<T>(targetObj:T):T;
export function hydrate<T>(targetObj:any, HydratableClass:{new(...args):T;}):T{
  let seenObj = [];

  if(targetObj._c_){
    //if HydratableClass is required.
    if(!HydratableClass){
      //HydratableClass is required but not passed
      throw Error("Cannot hydrate a dehydrated instance without HydratableClass");
    } else {
      return hydrateProp(targetObj, seenObj, HydratableClass);
    }
  }else{
    //trying to hydrate not-instantiated-obj (only triggers @OnHydrate handlers)
    hydratePropWithoutInstantiating(targetObj, seenObj);
    return targetObj;
  }
}

export function deserialize<T>(targetObj:any, HydratableClass:{new(...args):T;}):T{
  return hydrate(JSON.parse(targetObj), HydratableClass);
}