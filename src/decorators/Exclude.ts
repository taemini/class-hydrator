import {OnDehydrateMetadataKey, OnDehydrateMetadata} from './OnDehydrate';

export function Exclude(){
  let newMetadata = new OnDehydrateMetadata(()=>null);

  return Reflect.metadata(OnDehydrateMetadataKey, newMetadata);
}
