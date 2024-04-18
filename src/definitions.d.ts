import { Map, ControlOptions, Evented } from "leaflet";

export class TimeDimensionControl {
  constructor(options: { dog: boolean });
}

export interface PlayerOptions {
  buffer?: number;
  minBufferReady?: number;
  loop?: boolean;
  transitionTime?: number;
}

export class Player extends Evented {
  constructor(options: PlayerOptions, timeDimension: TimeDimension);
  start: (numSteps: number) => void;
  stop: () => void;
}

export interface TimeDimensionOptions {
  loadingTimeout?: number;
  currentTime?: string;
  // time period with ISO 8601
  times?: string;
  lowerLimitTime?: Date;
  upperLimitTime?: Date;
  player?: Player;
  playerOptions?: PlayerOptions;
}

export class TimeDimension extends Evented {
  constructor(options: TimeDimensionOptions);
  setAvailableTimes: (times: string, mode: 'replace'| 'intersect' | 'extremes'| 'union' ) => void;
  setCurrentTime:(time: number) => void;
  getCurrentTime:() => number | null;
  prepareNextTimes: (numSteps: number, howMany: number, loop: boolean) => void;
}

export interface TimeDimensionWMS {
  _update: () => void;
  onRemove: (map: Map) => void;
  setLoaded: (loaded: boolean) => void;
  isLoaded: () => boolean;
  hide: () => void;
  show: () => void;
  getURL: () => string;
}

export interface TimeDimensionWMSLayerOptions {
  getCapabilitiesParams?: any;
  getCapabilitiesUrl?: string;
  getCapabilitiesLayerName?: string;
  cache?: number;
  cacheBackward?: number;
  cacheForward?: number;
  wmsVersion?: string;
  requestTimeFromCapabilities?: boolean;
  timeDimension?: TimeDimension;
}

export class TimeDimensionWMSLayer {
  constructor(
    wmsLayer: TimeDimensionWMS,
    options: TimeDimensionWMSLayerOptions
  );
}

export interface TimeDimensionImage {
  _update: () => void;
  onRemove: (map: Map) => void;
  setLoaded: (loaded: boolean) => void;
  isLoaded: () => boolean;
  hide: () => void;
  show: () => void;
  getURL: () => string;
}

export interface TimeDimensionImageLayerOptions {
  getCapabilitiesParams?: any;
  getCapabilitiesUrl?: string;
  getCapabilitiesLayerName?: string;
  cache?: number;
  cacheBackward?: number;
  cacheForward?: number;
  requestTimeFromCapabilities?: boolean;
  timeDimension?: TimeDimension;
}

export class TimeDimensionImageLayer {
  constructor(
    imageLayer: TimeDimensionImage,
    options: TimeDimensionImageLayerOptions
  );
}

export interface TimeDimensionControlOptions extends ControlOptions {
  onlyUTC?: boolean,
  timeZones?: string[],
  minSpeed?: number,
  maxSpeed?: number,
  speedStep?: number,
  timeSteps?: number,
  timeSlider?: boolean,
  timeSliderDragUpdate?: boolean,
  limitSliders?: boolean,
  limitMinimumRange?: number,
  speedSlider?: boolean,
  autoPlay?: boolean,
  backwardButton?: boolean,
  forwardButton?: boolean,
  playButton?: boolean,
  playReverseButton?: boolean,
  loopButton?: boolean,
  displayDate?: boolean,
  dateFontWeight?: number,
  title?: string,
  styleNS?: string,
  playerOptions?: PlayerOptions;
}

export function parseTimesExpression(times: string)

declare module "leaflet" {
  export interface MapOptions {
    timeDimension?: boolean | TimeDimension;
    timeDimensionControl?: boolean;
    timeDimensionControlOptions?: TimeDimensionControlOptions;
  }

  export class Map {
    public timeDimension: TimeDimension
  }
}

