/**
 * Plapster Video Scanner & Metadata Service
 *
 * Videos live in /public/videos/<Category>/<file.mp4>
 * At build time, viteVideoManifest() writes /public/video-manifest.json.
 * At runtime, we fetch that manifest — videos are never bundled as Vite assets.
 */

/**
 * Clean up title from filename
 */
export function cleanTitle(filename) {
  const base = filename.replace(/\.(mp4|webm|mov|mkv)$/i, '');
  const spaced = base.replace(/[_-]+/g, ' ').trim();
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Async: fetch video manifest generated at build time.
 * Returns { videos, categories }
 */
export async function loadVideos() {
  const res = await fetch('./video-manifest.json');
  if (!res.ok) throw new Error('Failed to load video-manifest.json');
  const data = await res.json();

  const categoriesSet = new Set();
  const videos = (data.videos || []).map((entry) => {
    const { category, filename, src } = entry;
    const title = cleanTitle(filename);
    const id = `${category}-${filename}`.replace(/[^a-zA-Z0-9-_]/g, '_');
    categoriesSet.add(category);
    return { id, title, category, filename, src, duration: null };
  });

  const categories = Array.from(categoriesSet).sort((a, b) => {
    // Preserve natural order from manifest, but dedupe
    return 0;
  });

  // Maintain order from manifest (already sorted by plugin)
  const orderedCategories = [];
  const seen = new Set();
  for (const v of videos) {
    if (!seen.has(v.category)) {
      seen.add(v.category);
      orderedCategories.push(v.category);
    }
  }

  return { videos, categories: orderedCategories };
}

/**
 * scanVideos() — kept as a no-op stub for compatibility.
 * Use loadVideos() (async) instead.
 */
export function scanVideos() {
  return { videos: [], categories: [] };
}

// In-memory cache for loaded durations
const durationCache = new Map();

/**
 * Dynamically loads video metadata in the browser
 */
export function fetchVideoDuration(src) {
  if (durationCache.has(src)) {
    return Promise.resolve(durationCache.get(src));
  }

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = src;

    let hasResolved = false;

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('error', handleError);
      video.removeAttribute('src');
      video.load();
    };

    const handleLoaded = () => {
      if (!hasResolved) {
        hasResolved = true;
        const dur = Math.round(video.duration || 0);
        durationCache.set(src, dur);
        cleanup();
        resolve(dur);
      }
    };

    const handleError = () => {
      if (!hasResolved) {
        hasResolved = true;
        durationCache.set(src, 0);
        cleanup();
        resolve(0);
      }
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('error', handleError);

    setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        resolve(0);
      }
    }, 4500);
  });
}

/**
 * Format duration in seconds into M:SS or H:MM:SS
 */
export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    return '--:--';
  }
  const s = Math.round(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutesTotal(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return '0m';
  const mins = Math.round(totalSeconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
}

/**
 * Check if a duration falls within a given bucket
 */
export function matchesDurationBucket(duration, bucket) {
  if (!bucket || bucket === 'All' || bucket === 'Any Duration') return true;
  if (duration === null || duration === undefined) return true;

  switch (bucket) {
    case '< 1 min':
      return duration > 0 && duration < 60;
    case '1–5 mins':
      return duration >= 60 && duration <= 300;
    case '5–10 mins':
      return duration > 300 && duration <= 600;
    case '10+ mins':
      return duration > 600;
    default:
      return true;
  }
}

/**
 * LocalStorage Watch History & Statistics Management
 */
const HISTORY_KEY = 'plapster_watch_history_v2';
const STATS_KEY = 'plapster_user_stats_v1';
const PROFILE_KEY = 'plapster_user_profile_v1';

export function getUserProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  } catch (e) {
    return profile;
  }
}

export function getWatchHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to load watch history:', err);
    return {};
  }
}

export function getUserStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          totalSecondsPlapped: 0,
          totalPlapSessions: 0,
        };
  } catch (err) {
    return {
      totalSecondsPlapped: 0,
      totalPlapSessions: 0,
    };
  }
}

export function saveVideoWatch(srcOrId, videoDuration = 0) {
  try {
    const history = getWatchHistory();
    const now = Date.now();
    history[srcOrId] = now;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    const stats = getUserStats();
    stats.totalPlapSessions = (stats.totalPlapSessions || 0) + 1;
    if (videoDuration && videoDuration > 0) {
      stats.totalSecondsPlapped = (stats.totalSecondsPlapped || 0) + Math.round(videoDuration);
    } else {
      stats.totalSecondsPlapped = (stats.totalSecondsPlapped || 0) + 60;
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));

    return { history, stats };
  } catch (err) {
    console.error('Failed to save watch history:', err);
    return { history: {}, stats: {} };
  }
}

/**
 * Calculate Consecutive Days Streak
 */
export function calculateDaysStreak(history) {
  const timestamps = Object.values(history || {});
  if (timestamps.length === 0) return 0;

  const daySet = new Set(
    timestamps.map((ts) => {
      const d = new Date(ts);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })
  );

  const today = new Date();
  const formatDay = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  let streak = 0;
  let checkDate = new Date(today);

  if (daySet.has(formatDay(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (!daySet.has(formatDay(yesterday))) {
      return 0;
    }
    checkDate = yesterday;
  }

  while (daySet.has(formatDay(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

/**
 * Format relative watch time
 */
export function getWatchBadgeInfo(srcOrId, history) {
  const timestamp = history?.[srcOrId];
  if (!timestamp) {
    return {
      label: 'Never Plapped',
      isNew: true,
      timestamp: 0,
    };
  }

  const diffMs = Date.now() - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let label = '';
  if (diffMins < 2) {
    label = 'Plapped just now';
  } else if (diffHours < 24) {
    label = 'Plapped today';
  } else if (diffDays === 1) {
    label = 'Plapped yesterday';
  } else {
    label = `Plapped ${diffDays}d ago`;
  }

  return {
    label,
    isNew: false,
    timestamp,
  };
}

/**
 * Weighted randomizer prioritizing unwatched or least-recently-watched
 */
export function pickRandomVideo(videos, history) {
  if (!videos || videos.length === 0) return null;
  if (videos.length === 1) return videos[0];

  const unwatched = videos.filter((v) => !history[v.src] && !history[v.id]);

  if (unwatched.length > 0) {
    const idx = Math.floor(Math.random() * unwatched.length);
    return unwatched[idx];
  }

  const sorted = [...videos].sort((a, b) => {
    const timeA = history[a.src] || history[a.id] || 0;
    const timeB = history[b.src] || history[b.id] || 0;
    return timeA - timeB;
  });

  const poolSize = Math.max(1, Math.ceil(sorted.length * 0.4));
  const pool = sorted.slice(0, poolSize);
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
