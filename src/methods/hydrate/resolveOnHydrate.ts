import {OnHydrateMetadataKey} from "../../decorators";

export function resolveOnHydrate(targetInst){
  for(let i in targetInst){
    let onHydrateMetadata = Reflect.getMetadata(OnHydrateMetadataKey,targetInst.constructor,i);
    if(onHydrateMetadata){
      targetInst[i] = onHydrateMetadata.callback(targetInst);
    }
  }
}