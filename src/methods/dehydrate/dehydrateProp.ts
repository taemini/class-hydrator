import {OnDehydrateMetadataKey} from '../../decorators';

export function dehydrateProp(targetProp:any, seenObj:any){
  if(targetProp === null || targetProp === undefined ||
    targetProp.constructor === String || targetProp.constructor === Number || targetProp.constructor === Boolean) {
    //primitive type
    return targetProp;
  }else if(targetProp.constructor === Function){
    //ignores Function type
    return null;
  }else{
    let targetIdxInSeenObj = seenObj.indexOf(targetProp);
    if(targetIdxInSeenObj !== -1){
      //circular object
      return "_i_"+targetIdxInSeenObj
    }else{
      //not circular object
      if(targetProp.constructor === Array){
        //Array type
        let newArr = new Array();
        for (let i in targetProp) {
          let newProp = dehydrateProp(targetProp[i], seenObj);
          if(newProp) newArr[i] = newProp;
        }
        //_i_ of an Array is saved in [0] not ['_i_']
        newArr.unshift(seenObj.push(targetProp)-1);
        return newArr;
      }else if(targetProp.constructor === Object) {
        //Object(plain) type
        let newObj = new Object();
        newObj['_i_'] = seenObj.push(targetProp)-1;
        for(let i in targetProp){
          if(!targetProp.hasOwnProperty(i)) continue; // targetProp[i] is getter or setter

          let newProp = dehydrateProp(targetProp[i], seenObj);
          if(newProp) newObj[i] = newProp;
        }
        return newObj;
      }else{
        //Class type
        let newInst = new Object();
        newInst['_c_'] = targetProp.constructor.name;
        newInst['_i_'] = seenObj.push(targetProp)-1;
        for(let i in targetProp){
          if(!targetProp.hasOwnProperty(i)) continue; // targetProp[i] is getter or setter

          let onDehydrateMetadata = Reflect.getMetadata(OnDehydrateMetadataKey, targetProp.constructor.prototype, i);
          if(onDehydrateMetadata){
            newInst[i] = onDehydrateMetadata.callback(targetProp);
          }else{
            let newProp = dehydrateProp(targetProp[i], seenObj);
            if(newProp) newInst[i] = newProp;
          }
        }
        return newInst;
      }
    }
  }
};
