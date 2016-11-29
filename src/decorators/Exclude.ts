const ExcludeMetadataKey = "HYDRATOR_EXCLUDE_METADATA_KEY";
class ExcludeMetadata{
  constructor(public onHydrate?:(self:any, dehydratedProp:any)=>any){ }
}

export function Exclude(onHydrate?:(self:any, dehydratedProp:any)=>any){
  let newMetadata = new ExcludeMetadata(onHydrate);

  return Reflect.metadata(ExcludeMetadataKey, newMetadata);
}