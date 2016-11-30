export const HydratableMetadataKey = "HYDRATABLE";
export interface HydratableArgs {
  providers: any[];
}
export class HydratableMetadata{
  public providers = {};
  constructor(args?:HydratableArgs){
    if(!args) args = {providers:[]};
    for(let i=0;i<args.providers.length;i++){
      this.providers[args.providers[i].name] = args.providers[i];
    }
  }
}

export function Hydratable(args?:HydratableArgs){
  let newMetadata = new HydratableMetadata(args);

  return function(constructor){
    Reflect.defineMetadata(HydratableMetadataKey, newMetadata, constructor);
  }
}
