function formatHour(dt) {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}

function detectSpikes(curve) {
    const spikes = [];

    for (let i = 1; i < curve.length; i++) {
        const prev = curve[i - 1];
        const curr = curve[i];

        const delta = curr.smoothProbability - prev.smoothProbability;

        if (delta >= 15) {
            spikes.push({
                time: curr.time,
                intensity: delta,
                probability: curr.smoothProbability
            });
        }
    }

    return spikes;
}

function generateAlerts(curve, spikes) {
    const alerts = [];

    const best = curve.reduce((a, b) =>
        b.smoothProbability > a.smoothProbability ? b : a
    );

    if (best.smoothProbability >= 75) {
        alerts.push({
            type: "PEAK_WINDOW",
            message: `High probability bite window around ${best.time}`
        });
    }

    if (spikes.length > 0) {
        const nextSpike = spikes[0];

        alerts.push({
            type: "BITE_SPIKE",
            message: `Bite activity rising sharply near ${nextSpike.time}`,
            intensity: nextSpike.intensity
        });
    }

    const lowActivity = curve.every(h => h.smoothProbability < 45);

    if (lowActivity) {
        alerts.push({
            type: "TOUGH_DAY",
            message: "Low overall activity — focus on finesse and cover"
        });
    }

    return alerts;
}

function smoothCurve(curve) {
    return curve.map((h, i) => {
        const prev = curve[i - 1]?.probability ?? h.probability;
        const next = curve[i + 1]?.probability ?? h.probability;

        const smoothed =
            (h.probability * 0.5) +
            (prev * 0.25) +
            (next * 0.25);

        return {
            ...h,
            smoothProbability: Math.round(smoothed)
        };
    });
}

function scoreHour(hour, solunar) {
    let score = 50;

    const hourNum = new Date(hour.dt * 1000).getHours();

    // -------------------------
    // SOLUNAR
    // -------------------------
    if (solunar?.activityScore >= 80) score += 20;
    else if (solunar?.activityScore >= 60) score += 10;

    // -------------------------
    // TIME WINDOWS
    // -------------------------
    if (hourNum >= 5 && hourNum <= 9) score += 15;
    if (hourNum >= 17 && hourNum <= 20) score += 20;
    if (hourNum >= 22 || hourNum <= 2) score -= 10;

    // -------------------------
    // UV
    // -------------------------
    const uvi = hour.uvi ?? 0;
    if (uvi <= 2) score += 5;
    if (uvi >= 8) score -= 5;

    // -------------------------
    // CLOUDS
    // -------------------------
    if (hour.clouds >= 40 && hour.clouds <= 80) score += 5;
    if (hour.clouds < 10) score -= 3;

    // -------------------------
    // RAIN / POP
    // -------------------------
    const pop = hour.pop ?? 0;
    if (pop >= 0.2 && pop <= 0.6) score += 5;
    if (pop > 0.7) score -= 8;

    return Math.max(0, Math.min(100, score));
}

/**
 * Convert score → probability curve (0–100 smooth mapping)
 * This is the key upgrade.
 */
function toProbability(score) {
    // sigmoid-like smoothing (prevents harsh jumps)
    const normalized = 1 / (1 + Math.exp(-(score - 55) / 10));

    return Math.round(normalized * 100);
}

function buildFishingWindows(context) {

    const hourly =
        context?.weather?.hourly ??
        context?.weather?.data ??
        [];

    const solunar = context?.solunar;

    if (!Array.isArray(hourly) || hourly.length === 0) {
        return {
            curve: [],
            best: null
        };
    }

    // -------------------------
    // BUILD PROBABILITY CURVE
    // -------------------------
    const curve = hourly
    .sort((a, b) => a.dt - b.dt)
    .map(h => {
        const score = scoreHour(h, solunar);
        const probability = toProbability(score);

        return {
            time: formatHour(h.dt),
            dt: h.dt,
            score,
            probability
        };
    });

    const smoothed = smoothCurve(curve);
    const spikes = detectSpikes(smoothed);
    const alerts = generateAlerts(smoothed, spikes);

    // -------------------------
    // FIND BEST HOUR (peak probability)
    // -------------------------
    const best = curve.reduce((max, curr) => {
        return curr.probability > (max?.probability ?? 0)
            ? curr
            : max;
    }, null);

    // -------------------------
    // OPTIONAL: SMOOTH WINDOW CLUSTERING
    // (keeps your "window" concept alive)
    // -------------------------
    const clusters = [];
    let current = null;

    for (let i = 0; i < curve.length; i++) {
        const h = curve[i];

        const isHot = h.probability >= 65;

        if (isHot) {
            if (!current) {
                current = {
                    start: h,
                    end: h,
                    probs: [h.probability]
                };
            } else {
                current.end = h;
                current.probs.push(h.probability);
            }
        } else {
            if (current) {
                clusters.push(current);
                current = null;
            }
        }
    }

    if (current) clusters.push(current);

    const windows = clusters.map(c => {
        const avg =
            c.probs.reduce((a, b) => a + b, 0) / c.probs.length;

        return {
            start: c.start.time,
            end: c.end.time,
            avgProbability: Math.round(avg),
            durationHours: c.probs.length
        };
    });

    return {
    curve: smoothed,
    best,
    windows,
    spikes,
    alerts
};
}

module.exports = {
    buildFishingWindows
};