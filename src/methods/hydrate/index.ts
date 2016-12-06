import {hydrateProp} from './hydrateProp';
import {hydratePropWithoutInstantiating} from './hydratePropWithoutInstantiating';

// export function hydrate<T>(targetObj:T):T;
export function hydrate<T>(targetObj:any, HydratableClass:{new(...args):T;}):T{
  let seenObj = [];
  let providers = {};

  if(targetObj._c_){
    //if HydratableClass is required.
    if(!HydratableClass){
      //HydratableClass is required but not passed
      throw Error("Cannot hydrate a dehydrated instance without HydratableClass");
    } else {
      providers[(HydratableClass as any).name] = HydratableClass;
      return hydrateProp(targetObj, seenObj, providers, HydratableClass);
    }
  }else{
    //trying to hydrate not-instantiated-obj (only triggers @OnHydrate handlers)
    hydratePropWithoutInstantiating(targetObj, seenObj);
    return targetObj;
  }
}