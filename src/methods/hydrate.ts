import {Hydrator} from '../index';

export function hydrate(targetObj:any){
  let seenObj = [];

  if(!targetObj._c_) {
    //when targetObj != dehydratedObject
    console.error('Hydrator:you can hydrate only a dehydrated object');
    return targetObj;
  }
    //when targetObj == dehydratedObject
  let newInst = new (Hydrator.getConstructor(targetObj._c_) as any)();
  seenObj[targetObj._i_] = newInst;


  let hydrateProp = (targetProp:any) => {
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
        //Array
        let newArr = new Array();
        seenObj[targetProp.shift()] = newArr;
        for(let i in targetProp){
          if(i==="_i_" || i==="_c_") continue;
          newArr[i] = hydrateProp(targetProp[i]);
        }
        return newArr;
      }else if(targetProp.constructor === Object && targetProp._c_){
        //Class
        let newInst = new (Hydrator.getConstructor(targetProp._c_) as any)();
        seenObj[targetProp._i_] = newInst;
        for(let i in targetProp){
          if(i==="_i_" || i==="_c_") continue;
          newInst[i] = hydrateProp(targetProp[i]);
        }
        return newInst;
      }else{
        //Object
        let newObj = new Object();
        seenObj[targetProp._i_] = newObj;
        for(let i in targetProp){
          if(i==="_i_" || i==="_c_") continue;
          newObj[i] = hydrateProp(targetProp[i]);
        }
        return newObj
      }
    }
  };

  for(let i in targetObj){
    if(i==="_i_" || i==="_c_") continue;
    newInst[i] = hydrateProp(targetObj[i]);
  }

  return newInst;
}
