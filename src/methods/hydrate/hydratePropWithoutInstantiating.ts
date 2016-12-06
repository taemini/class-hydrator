import {OnHydrateMetadataKey} from "../../decorators";

export function hydratePropWithoutInstantiating(targetProp, seenObj){
  if(seenObj.indexOf(targetProp) !== -1){
    //pass seenObj (prevent infinite recursive)
  }else if(targetProp.constructor === String || targetProp.constructor === Number || targetProp.constructor === Boolean){
    //do nothing
  }else if(targetProp.constructor === Array || targetProp.constructor === Object){
    //Array || Object
    seenObj.push(targetProp);
    for(let i in targetProp){
      hydratePropWithoutInstantiating(targetProp[i], seenObj);
    }
  }else{
    //class
    seenObj.push(targetProp);
    for(let i in targetProp){
      let onHydrateMetadata = Reflect.getMetadata(OnHydrateMetadataKey, targetProp.constructor.prototype, i);
      if(onHydrateMetadata){
        targetProp[i] = onHydrateMetadata.callback(targetProp);
      }
    }
    hydratePropWithoutInstantiating(targetProp, seenObj);
  }
}
