export const OnHydrateMetadataKey = "ON_HYDRATE";
export class OnHydrateMetadata{
  constructor(public callback:(self?:any)=>any){ }
  public applyOnHydrate(self:any){
    return this.callback(self);
  }
}

export function OnHydrate(callback:(self?:any)=>any){
  let newMetadata = new OnHydrateMetadata(callback);

  return Reflect.metadata(OnHydrateMetadataKey, newMetadata);
}

