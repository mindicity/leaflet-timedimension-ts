import nezasa from "iso8601-js-period";

export function getTimeDuration(ISODuration) {
    return nezasa.Period.parse(ISODuration, true);
}

export function addTimeDuration(date, duration, utc) {
    if (typeof utc === "undefined") {
        utc = true;
    }
    if (typeof duration == "string" || duration instanceof String) {
        duration = getTimeDuration(duration);
    }
    var l = duration.length;
    var get = utc ? "getUTC" : "get";
    var set = utc ? "setUTC" : "set";

    if (l > 0 && duration[0] != 0) {
        date[set + "FullYear"](date[get + "FullYear"]() + duration[0]);
    }
    if (l > 1 && duration[1] != 0) {
        date[set + "Month"](date[get + "Month"]() + duration[1]);
    }
    if (l > 2 && duration[2] != 0) {
        // weeks
        date[set + "Date"](date[get + "Date"]() + duration[2] * 7);
    }
    if (l > 3 && duration[3] != 0) {
        date[set + "Date"](date[get + "Date"]() + duration[3]);
    }
    if (l > 4 && duration[4] != 0) {
        date[set + "Hours"](date[get + "Hours"]() + duration[4]);
    }
    if (l > 5 && duration[5] != 0) {
        date[set + "Minutes"](date[get + "Minutes"]() + duration[5]);
    }
    if (l > 6 && duration[6] != 0) {
        date[set + "Seconds"](date[get + "Seconds"]() + duration[6]);
    }
}

export function subtractTimeDuration(date, duration, utc) {
    if (typeof duration == "string" || duration instanceof String) {
        duration = getTimeDuration(duration);
    }
    var subDuration = [];
    for (var i = 0, l = duration.length; i < l; i++) {
        subDuration.push(-duration[i]);
    }
    addTimeDuration(date, subDuration, utc);
}

export function parseAndExplodeTimeRange(timeRange, overwritePeriod) {
    var tr = timeRange.split("/");
    var startTime = new Date(Date.parse(tr[0]));
    var endTime = new Date(Date.parse(tr[1]));
    var period = tr.length > 2 && tr[2].length ? tr[2] : "P1D";
    if (overwritePeriod !== undefined && overwritePeriod !== null) {
        period = overwritePeriod;
    }
    return explodeTimeRange(startTime, endTime, period);
}

export function explodeTimeRange(
    startTime,
    endTime,
    ISODuration,
    validTimeRange
) {
    var duration = getTimeDuration(ISODuration);
    var result = [];
    var currentTime = new Date(startTime.getTime());
    var minHour = null,
        minMinutes = null,
        maxHour = null,
        maxMinutes = null;
    if (validTimeRange !== undefined) {
        var validTimeRangeArray = validTimeRange.split("/");
        minHour = validTimeRangeArray[0].split(":")[0];
        minMinutes = validTimeRangeArray[0].split(":")[1];
        maxHour = validTimeRangeArray[1].split(":")[0];
        maxMinutes = validTimeRangeArray[1].split(":")[1];
    }
    while (currentTime < endTime) {
        if (
            validTimeRange === undefined ||
            (currentTime.getUTCHours() >= minHour &&
                currentTime.getUTCHours() <= maxHour)
        ) {
            if (
                (currentTime.getUTCHours() != minHour ||
                    currentTime.getUTCMinutes() >= minMinutes) &&
                (currentTime.getUTCHours() != maxHour ||
                    currentTime.getUTCMinutes() <= maxMinutes)
            ) {
                result.push(currentTime.getTime());
            }
        }
        addTimeDuration(currentTime, duration);
    }
    if (currentTime >= endTime) {
        result.push(endTime.getTime());
    }
    return result;
}

export function parseTimeInterval(timeInterval) {
    var parts = timeInterval.split("/");
    if (parts.length != 2) {
        throw "Incorrect ISO8601 TimeInterval: " + timeInterval;
    }
    const startTime = Date.parse(parts[0]);
    let startTimeDate;
    let endTime;
    let endTimeDate;
    var duration = null;
    if (isNaN(startTime)) {
        // -> format duration/endTime
        duration = getTimeDuration(parts[0]);
        endTime = Date.parse(parts[1]);
        startTimeDate = new Date(endTime);
        subtractTimeDuration(startTimeDate, duration, true);
        endTimeDate = new Date(endTime);
    } else {
        endTime = Date.parse(parts[1]);
        if (isNaN(endTime)) {
            // -> format startTime/duration
            duration = getTimeDuration(parts[1]);
            endTimeDate = new Date(startTime);
            addTimeDuration(endTime, duration, true);
        } else {
            // -> format startTime/endTime
            endTimeDate = new Date(endTime);
        }
        startTimeDate = new Date(startTime);
    }
    return [startTimeDate, endTimeDate];
}

export function parseTimesExpression(times, overwritePeriod) {
    var result = [];
    if (!times) {
        return result;
    }
    if (typeof times == "string" || times instanceof String) {
        var timeRanges = times.split(",");
        var timeRange;
        var timeValue;
        for (var i = 0, l = timeRanges.length; i < l; i++) {
            timeRange = timeRanges[i];
            if (timeRange.split("/").length == 3) {
                result = result.concat(
                    parseAndExplodeTimeRange(timeRange, overwritePeriod)
                );
            } else {
                timeValue = Date.parse(timeRange);
                if (!isNaN(timeValue)) {
                    result.push(timeValue);
                }
            }
        }
    } else {
        result = times;
    }
    return result.sort(function (a, b) {
        return a - b;
    });
}

export function intersect_arrays(arrayA, arrayB) {
    var a = arrayA.slice(0);
    var b = arrayB.slice(0);
    var result = [];
    while (a.length > 0 && b.length > 0) {
        if (a[0] < b[0]) {
            a.shift();
        } else if (a[0] > b[0]) {
            b.shift();
        } /* they're equal */ else {
            result.push(a.shift());
            b.shift();
        }
    }
    return result;
}

export function union_arrays(arrayA, arrayB) {
    var a = arrayA.slice(0);
    var b = arrayB.slice(0);
    var result = [];
    while (a.length > 0 && b.length > 0) {
        if (a[0] < b[0]) {
            result.push(a.shift());
        } else if (a[0] > b[0]) {
            result.push(b.shift());
        } /* they're equal */ else {
            result.push(a.shift());
            b.shift();
        }
    }
    if (a.length > 0) {
        result = result.concat(a);
    } else if (b.length > 0) {
        result = result.concat(b);
    }
    return result;
}

export function sort_and_deduplicate(arr) {
    arr = arr.slice(0).sort(function (a, b) {
        return a - b;
    });
    var result = [];
    var last = null;
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] !== last) {
            result.push(arr[i]);
            last = arr[i];
        }
    }
    return result;
}
