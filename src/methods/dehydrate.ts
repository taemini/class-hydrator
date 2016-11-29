export function dehydrate(targetObj:any){
  let seenObj = [];

  let newObj = {};
  newObj['_c_'] = targetObj.constructor.name;
  newObj['_i_'] = seenObj.push(targetObj) - 1;

  let dehydrateProp = (targetProp:any)=>{
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
        if(targetProp.constructor === Object){
          //Object(plain) type
          let newObj = new Object();
          newObj['_i_'] = seenObj.push(targetProp)-1;
          for(let i in targetProp){
            let newProp = dehydrateProp(targetProp[i]);
            if(newProp) newObj[i] = newProp;
          }
          return newObj;
        }else if(targetProp.constructor === Array) {
          //Array type
          let newArr = new Array();
          for (let i in targetProp) {
            let newProp = dehydrateProp(targetProp[i]);
            if(newProp) newArr[i] = newProp;
          }
          //_i_ of an Array is saved in [0] not ['_i_']
          newArr.unshift(seenObj.push(targetProp)-1);
          return newArr;
        }else{
          //Class type
          let newInst = new Object();
          newInst['_c_'] = targetProp.constructor.name;
          newInst['_i_'] = seenObj.push(targetProp)-1;
          for(let i in targetProp){
            let newProp = dehydrateProp(targetProp[i]);
            if(newProp) newInst[i] = newProp;
          }
          return newInst;
        }
      }
    }
  };

  for(let i in targetObj){
    let newProp = dehydrateProp(targetObj[i]);
    if(newProp) newObj[i] = newProp;
  }

  return newObj;
}