import {dehydrateProp} from './dehydrateProp';

export function dehydrate(targetObj:any){
  let seenObj = [];
  let newObj = {};
  //root obj must have '_c_' to know whether dehydrated or not when hydrating it
  newObj['_c_'] = targetObj.constructor.name;
  return dehydrateProp(targetObj, seenObj);
}

export function serialize(targetObj:any):string{
  return JSON.stringify(dehydrate(targetObj));
}