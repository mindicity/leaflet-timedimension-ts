declare module "iso8601-js-period" {
  type Duration = [number, number, number, number, number, number, number];

  export type Period = {
    parse: (period: string, distributeOverflow: boolean) => Duration;
    parseToTotalSeconds: (period: string) => number;
    isValid: (period: string) => boolean;
    parsePeriodString: (
      period: string,
      distributeOverflow: boolean
    ) => Duration;
  };
}
