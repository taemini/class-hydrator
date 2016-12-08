export const ExcludeMetadataKey = "EXCLUDE";

class ExcludeMetadata { }

export function Exclude(){
  return Reflect.metadata(ExcludeMetadataKey, new ExcludeMetadata());
}
