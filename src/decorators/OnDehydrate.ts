export const OnDehydrateMetadataKey = "ON_HYDRATE";
export class OnDehydrateMetadata{
  constructor(public callback:(self?:any)=>any){ }
  public applyOnDehydrate(self:any){
    return this.callback(self);
  }
}

export function OnDehydrate(callback:(self?:any)=>any){
  let newMetadata = new OnDehydrateMetadata(callback);

  return Reflect.metadata(OnDehydrateMetadataKey, newMetadata);
}

