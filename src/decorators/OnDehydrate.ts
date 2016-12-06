export const OnDehydrateMetadataKey = "ON_DEHYDRATE";
export class OnDehydrateMetadata{
  constructor(public callback:(self?:any)=>any){ }
}

export function OnDehydrate(callback:(self?:any)=>any){
  let newMetadata = new OnDehydrateMetadata(callback);

  return Reflect.metadata(OnDehydrateMetadataKey, newMetadata);
}

