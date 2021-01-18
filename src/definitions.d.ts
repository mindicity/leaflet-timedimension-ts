import { Map } from "leaflet";
declare module "leaflet-timedimension-scoped" {
  export class TimeDimensionControl {
    constructor(options: { dog: boolean });
  }

  export class TimeDimension {
    loadingTimeout?: number;
    currentTime?: string;
    // time period with ISO 8601
    times?: string;
    lowerLimitTime?: Date;
    upperLimitTime?: Date;
  }

  interface TimeDimensionWMS {
    _update: () => void;
    onRemove: (map: Map) => void;
    setLoaded: (loaded: boolean) => void;
    isLoaded: () => boolean;
    hide: () => void;
    show: () => void;
    getURL: () => string;
  }

  interface TimeDimensionWMSLayerOptions {
    getCapabilitiesParams?: any;
    getCapabilitiesUrl?: string;
    getCapabilitiesLayerName?: string;
    cache?: number;
    cacheBackward?: number;
    cacheForward?: number;
    wmsVersion?: string;
    requestTimeFromCapabilities?: boolean;
    timeDimension: TimeDimension;
  }

  export class TimeDimensionWMSLayer {
    constructor(wmsLayer: TimeDimensionWMS);
  }
}
