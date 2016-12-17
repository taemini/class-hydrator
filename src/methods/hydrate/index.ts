import {hydrateProp} from './hydrateProp';
import {hydratePropWithoutInstantiating} from './hydratePropWithoutInstantiating';

// export function hydrate<T>(targetObj:T):T;
export function hydrate<T>(targetObj:any, HydratableClass?:{new(...args):T;}):T{
  let seenObj = [];

  if(targetObj._c_){
    return hydrateProp(targetObj, seenObj);
  }else{
    //trying to hydrate not-instantiated-obj (only triggers @OnHydrate handlers)
    hydratePropWithoutInstantiating(targetObj, seenObj);
    return targetObj;
  }
}

export function deserialize<T>(targetObj:any, HydratableClass:{new(...args):T;}):T{
  return hydrate(JSON.parse(targetObj), HydratableClass);
}