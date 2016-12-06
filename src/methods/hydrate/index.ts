import {hydrateProp} from './hydrateProp';

export function hydrate<T>(targetObj:any, HydratableClass?:{new(...args):T;}):T{
  let seenObj = [];
  let providers = {};
  providers[(HydratableClass as any).name] = HydratableClass;

  if(targetObj._c_){
    //if HydratableClass is required.
    if(!HydratableClass){
      //HydratableClass is required but not passed
      throw Error("Cannot hydrate a dehydrated instance without HydratableClass");
    } else {
      return hydrateProp(targetObj, seenObj, providers, HydratableClass);
    }
  }else{
    //trying to hydrate not-instantiated-obj (only triggers @OnHydrate handlers)

  }
}
