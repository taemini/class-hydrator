import {HydratableMetadataKey, OnHydrateMetadataKey} from "../../decorators";

export function hydrateProp(targetProp, seenObj, providers, HydratableClass){
  if(targetProp.constructor === String){
    if(targetProp.indexOf('_i_') === 0){
      //TODO remove below line when clear about it.
      if(!seenObj[targetProp.slice(3)]) console.error("Hydrator:couldn't find seenObj");
      //seenObjId
      return seenObj[targetProp.slice(3)];
    }else{
      //String
      return targetProp;
    }
  }else if(targetProp.constructor === Number || targetProp.constructor === Boolean){
    //primitive type
    return targetProp;
  }else{
    //Array || Class || Object
    if(targetProp.constructor === Array){
      //targetProp:Array
      let newArr = new Array();
      seenObj[targetProp.shift()] = newArr;
      for(let i in targetProp){
        newArr[i] = hydrateProp(targetProp[i], seenObj, providers, HydratableClass);
      }
      return newArr;
    }else if(targetProp.constructor === Object && targetProp._c_){
      //Class
      let classOfTarget = providers[targetProp._c_];
      if(!classOfTarget){
        throw Error(`${targetProp._c_} was not provided to ${(HydratableClass as any).name}`)
      }
      let newInst = new Object();

      let hydratableMetadata = Reflect.getMetadata(HydratableMetadataKey,classOfTarget);
      if(hydratableMetadata){
        let targetProviders = hydratableMetadata.providers;
        for(let i in targetProviders){
          providers[i] = targetProviders[i];
        }
      }else{
        throw Error(`${targetProp._c_} is not hydratable`)
      }
      seenObj[targetProp._i_] = newInst;
      for(let i in targetProp){
        if(i==="_i_" || i==="_c_") continue;
        newInst[i] = hydrateProp(targetProp[i], seenObj, providers, HydratableClass);
      }
      (newInst as any).__proto__ = classOfTarget.prototype;
      // apply @OnHydrate()
      for(let i in newInst){
        let onHydrateMetadata = Reflect.getMetadata(OnHydrateMetadataKey,newInst.constructor.prototype,i);
        if(onHydrateMetadata){
          newInst[i] = onHydrateMetadata.callback(newInst);
        }
      }
      return newInst;
    }else{
      //Object
      let newObj = new Object();
      seenObj[targetProp._i_] = newObj;
      for(let i in targetProp){
        if(i==="_i_" || i==="_c_") continue;
        newObj[i] = hydrateProp(targetProp[i], seenObj, providers, HydratableClass);
      }
      return newObj
    }
  }
}