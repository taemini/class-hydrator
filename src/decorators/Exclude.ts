import {OnDehydrateMetadataKey, OnDehydrateMetadata} from './OnDehydrate';

export function Exclude(){
  let newMetadata = new OnDehydrateMetadata(()=>'_N_'); // _N_ means NULL

  return Reflect.metadata(OnDehydrateMetadataKey, newMetadata);
}
