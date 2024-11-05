import {Control, ControlOptions, Evented, LayerOptions, Layer, LatLngBounds} from "leaflet";

export class TimeDimensionControl extends Control {
    constructor(options: TimeDimensionControlOptions);
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

// Define additional options for the TimeDimensionLayer
export interface TimeDimensionLayerOptions extends LayerOptions {
    opacity?: number;
    zIndex?: number;
    timeDimension?: any;
}

// Define the TimeDimensionLayer class
export class TimeDimensionLayer extends Layer {
    options: TimeDimensionLayerOptions;
    private _baseLayer: Layer;
    private _currentLayer: Layer | null;
    private _timeDimension: any;

    constructor(layer: Layer, options?: TimeDimensionLayerOptions);

    eachLayer(method: (layer: Layer) => void, context?: any): this;

    setZIndex(zIndex: number): this;

    setOpacity(opacity: number): this;

    bringToBack(): this;

    bringToFront(): this;

    protected _onNewTimeLoading(ev: { time: number }): void;

    isReady(time: number): boolean;

    _update(): void;

    getBaseLayer(): Layer;

    getBounds(): LatLngBounds;
}

export class TimeDimension extends Evented {
    constructor(options: TimeDimensionOptions);

    setAvailableTimes: (times: number[], mode: 'replace' | 'intersect' | 'extremes' | 'union') => void;
    setCurrentTime: (time: number) => void;
    getCurrentTime: () => number | null;

    nextTime(numSteps: number, loop: boolean): void;

    previousTime(numSteps: number, loop: boolean): void;

    prepareNextTimes: (numSteps: number, howMany: number, loop: boolean) => void;

    registerSyncedLayer(layer: TimeDimensionLayer): void;

    unregisterSyncedLayer(layer: TimeDimensionLayer): void;
}

export interface TimeDimensionWMS extends TimeDimensionLayer {
    setLoaded: (loaded: boolean) => void;
    isLoaded: () => boolean;
    hide: () => void;
    show: () => void;
    getURL: () => string;
}

export interface TimeDimensionWMSLayerOptions extends TimeDimensionLayerOptions {
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

export interface TimeDimensionImage extends TimeDimensionLayer {
    setLoaded: (loaded: boolean) => void;
    isLoaded: () => boolean;
    hide: () => void;
    show: () => void;
    getURL: () => string;
}

export interface TimeDimensionImageLayerOptions extends TimeDimensionLayerOptions {
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
    player?: Player,
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
        public timeDimension: TimeDimension;
        public TimeDimensionPlayer: Player;
    }
}

