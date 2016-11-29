export const OnHydrateMetadataKey = "ON_HYDRATE";
export class OnHydrateMetadata{
  constructor(public callback:(self?:any)=>any, public useWhenInstantiating?:boolean){ }
}

export function OnHydrate(callback:(self?:any)=>any, useWhenInstantiating?:boolean){
  let newMetadata = new OnHydrateMetadata(callback, useWhenInstantiating);

  return Reflect.metadata(OnHydrateMetadataKey, newMetadata);
}

