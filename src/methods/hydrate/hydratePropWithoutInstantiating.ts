import {HydratableMetadataKey, OnHydrateMetadataKey} from "../../decorators";
import {resolveOnHydrate} from './resolveOnHydrate';

export function hydratePropWithoutInstantiating(targetProp){
  // if(targetProp.constructor === Array || targetProp.constructor === Object){
  //   if(targetProp.constructor === Array){
  //     //Array
  //     for(let i in targetProp){
  //       resolveOnHydrate(targetProp[i]);
  //     }
  //   }else if(targetProp.constructor === Object){
  //     //Object
  //     for(let i in targetProp){
  //       resolveOnHydrate(targetProp[i]);
  //     }
  //   }else{
  //     //Class
  //     let hydratableMetadata = Reflect.getMetadata(HydratableMetadataKey,classOfTarget);
  //     console.log(hydratableMetadata);
  //     if(hydratableMetadata){
  //       let targetProviders = hydratableMetadata.providers;
  //       for(let i in targetProviders){
  //         providers[i] = targetProviders[i];
  //       }
  //       console.log('providers:',providers);
  //     }else{
  //       throw Error(`${targetProp._c_} is not hydratable`)
  //     }
  //     seenObj[targetProp._i_] = newInst;
  //     for(let i in targetProp){
  //       if(i==="_i_" || i==="_c_") continue;
  //       newInst[i] = hydrateProp(targetProp[i], seenObj, providers, HydratableClass);
  //     }
  //     (newInst as any).__proto__ = classOfTarget.prototype;
  //     // apply @OnHydrate()
  //     resolveOnHydrate(newInst);
  //     return newInst;
  //   }
  // }
}
