import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AmbientBackground from './components/AmbientBackground';
import Header from './components/Header';
import PlapRouletteDeck from './components/PlapRouletteDeck';
import VideoCard from './components/VideoCard';
import EmptyState from './components/EmptyState';
import CountdownModal from './components/CountdownModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import PostPlaybackToast from './components/PostPlaybackToast';
import OnboardingModal from './components/OnboardingModal';
import Footer from './components/Footer';
import {
  loadVideos,
  fetchVideoDuration,
  matchesDurationBucket,
  getWatchHistory,
  getUserStats,
  saveVideoWatch,
  calculateDaysStreak,
  pickRandomVideo,
  getUserProfile,
  saveUserProfile,
} from './utils/videoScanner';

export default function App() {
  // Bundled video collection
  const [allVideos, setAllVideos] = useState([]);
  const [categories, setCategories] = useState([]);

  // Focus specs: Category & Duration
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');

  // Toggle to peek at matching videos
  const [showLibrary, setShowLibrary] = useState(false);

  // User Profile (Name + 18+ verification)
  const [userProfile, setUserProfile] = useState(() => getUserProfile());
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Watch history & stats dictionary
  const [history, setHistory] = useState(() => getWatchHistory());
  const [stats, setStats] = useState(() => getUserStats());

  // Interactive Modals & Toast State
  const [countdownVideo, setCountdownVideo] = useState(null);
  const [activePlayerVideo, setActivePlayerVideo] = useState(null);
  const [lastFinishedVideo, setLastFinishedVideo] = useState(null);

  // 1. Initial Load of Videos via manifest
  useEffect(() => {
    loadVideos()
      .then(({ videos, categories: foundCats }) => {
        setAllVideos(videos);
        setCategories(foundCats);

        if (foundCats.length > 0) {
          setSelectedCategory(foundCats[0]);
        } else {
          setSelectedCategory('All');
        }
      })
      .catch((err) => {
        console.error('Failed to load video manifest:', err);
      });

    // Check if user has completed onboarding/18+ age gate
    const profile = getUserProfile();
    if (!profile || !profile.is18Plus) {
      setShowOnboarding(true);
    }
  }, []);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (profileData) => {
    saveUserProfile(profileData);
    setUserProfile(profileData);
    setShowOnboarding(false);
  };

  // Allow user to edit their nickname
  const handleEditUserName = () => {
    const current = userProfile?.name || 'Darling';
    const next = window.prompt('What should we call you, darling?', current);
    if (next !== null && next.trim() !== '') {
      const updated = { ...(userProfile || {}), name: next.trim(), is18Plus: true };
      saveUserProfile(updated);
      setUserProfile(updated);
    }
  };

  // 2. Dynamic Duration Loading for Current Scope
  useEffect(() => {
    if (!selectedCategory || allVideos.length === 0) return;

    const targetVideos = allVideos.filter(
      (v) =>
        (selectedCategory === 'All' || v.category === selectedCategory) &&
        (v.duration === null || v.duration === undefined)
    );

    if (targetVideos.length === 0) return;

    let isMounted = true;

    targetVideos.forEach(async (v) => {
      try {
        const duration = await fetchVideoDuration(v.src);
        if (isMounted) {
          setAllVideos((prev) =>
            prev.map((item) =>
              item.id === v.id ? { ...item, duration } : item
            )
          );
        }
      } catch (err) {
        console.error(`Failed to load duration for ${v.src}:`, err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, allVideos]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: allVideos.length };
    categories.forEach((cat) => {
      counts[cat] = allVideos.filter((v) => v.category === cat).length;
    });
    return counts;
  }, [allVideos, categories]);

  // Compute duration counts
  const durationCounts = useMemo(() => {
    const scopedVideos =
      selectedCategory === 'All'
        ? allVideos
        : allVideos.filter((v) => v.category === selectedCategory);

    const counts = {
      All: scopedVideos.length,
      '< 1 min': 0,
      '1–5 mins': 0,
      '5–10 mins': 0,
      '10+ mins': 0,
    };

    scopedVideos.forEach((v) => {
      if (v.duration !== null) {
        if (v.duration > 0 && v.duration < 60) counts['< 1 min']++;
        else if (v.duration >= 60 && v.duration <= 300) counts['1–5 mins']++;
        else if (v.duration > 300 && v.duration <= 600) counts['5–10 mins']++;
        else if (v.duration > 600) counts['10+ mins']++;
      }
    });

    return counts;
  }, [allVideos, selectedCategory]);

  // Filtered videos matching both Category and Duration specs
  const filteredVideos = useMemo(() => {
    return allVideos.filter((video) => {
      const matchesCategory =
        selectedCategory === 'All' || video.category === selectedCategory;
      if (!matchesCategory) return false;

      const matchesDuration = matchesDurationBucket(video.duration, selectedDuration);
      return matchesDuration;
    });
  }, [allVideos, selectedCategory, selectedDuration]);

  // Count unwatched in current filtered match
  const unwatchedMatchingCount = useMemo(() => {
    return filteredVideos.filter((v) => !history[v.src] && !history[v.id]).length;
  }, [filteredVideos, history]);

  // Reset Filters Handler
  const handleResetFilters = useCallback(() => {
    setSelectedCategory('All');
    setSelectedDuration('All');
  }, []);

  // Clear Watch History Handler
  const handleClearHistory = useCallback(() => {
    if (window.confirm('Reset your Plap history memory and stats?')) {
      localStorage.removeItem('plapster_watch_history_v2');
      localStorage.removeItem('plapster_user_stats_v1');
      setHistory({});
      setStats({ totalSecondsPlapped: 0, totalPlapSessions: 0 });
    }
  }, []);

  // Launch Video Player
  const startPlayingVideo = useCallback((video) => {
    if (!video) return;
    setCountdownVideo(null);
    setActivePlayerVideo(video);
    setLastFinishedVideo(null);
    const { history: updatedHistory, stats: updatedStats } = saveVideoWatch(
      video.src || video.id,
      video.duration || 60
    );
    setHistory(updatedHistory);
    setStats(updatedStats);
  }, []);

  // Trigger Random Roulette Picker
  const handleLaunchRandom = useCallback(() => {
    const pool = filteredVideos.length > 0 ? filteredVideos : allVideos;
    if (pool.length === 0) return;

    const chosen = pickRandomVideo(pool, history);
    if (chosen) {
      setCountdownVideo(chosen);
    }
  }, [filteredVideos, allVideos, history]);

  // Reroll inside countdown modal
  const handleRerollCountdown = useCallback(() => {
    const pool = filteredVideos.length > 0 ? filteredVideos : allVideos;
    if (pool.length <= 1) return;

    let next = pickRandomVideo(pool, history);
    let attempts = 0;
    while (next?.id === countdownVideo?.id && attempts < 5) {
      next = pickRandomVideo(pool, history);
      attempts++;
    }
    if (next) {
      setCountdownVideo(next);
    }
  }, [filteredVideos, allVideos, history, countdownVideo]);

  // Video Completed Handler
  const handleVideoEnded = useCallback((video) => {
    setActivePlayerVideo(null);
    setLastFinishedVideo(video);
  }, []);

  const totalWatchedCount = Object.keys(history).length;
  const daysStreak = useMemo(() => calculateDaysStreak(history), [history]);

  const activeName = userProfile?.name || 'darling';

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-[#F5A9B8]/40 selection:text-slate-900 overflow-x-hidden">
      {/* 1. Luminous Trans Pride Ambient Background */}
      <AmbientBackground />

      {/* 2. Top Header with User Greeting, Minutes Plapped, Vids Watched, and Streak */}
      <Header
        userName={userProfile?.name}
        onEditUserName={handleEditUserName}
        totalVideos={allVideos.length}
        watchedCount={totalWatchedCount}
        totalSecondsPlapped={stats?.totalSecondsPlapped || 0}
        daysStreak={daysStreak}
        onClearHistory={handleClearHistory}
      />

      {/* 3. The Core Focus: Expansive Plap Roulette Deck */}
      <main className="flex-1 w-full">
        <PlapRouletteDeck
          userName={activeName}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedDuration={selectedDuration}
          onSelectDuration={setSelectedDuration}
          categoryCounts={categoryCounts}
          durationCounts={durationCounts}
          matchingVideosCount={filteredVideos.length}
          unwatchedMatchingCount={unwatchedMatchingCount}
          onLaunchRandom={handleLaunchRandom}
          disabledLaunch={filteredVideos.length === 0}
          showLibrary={showLibrary}
          onToggleShowLibrary={() => setShowLibrary((prev) => !prev)}
        />

        {/* 4. Peek Matching Plap Vids (Expansive Wide Responsive Grid) */}
        {showLibrary && (
          <section className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 mt-8 pt-8 border-t border-slate-200/80 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="text-[#5BCEFA] font-black text-lg">♠</span>
                <span>Matching Plap Vids for {activeName} ({filteredVideos.length})</span>
              </h3>
              <span className="text-xs sm:text-sm font-bold text-slate-500">
                Click any card to plap immediately
              </span>
            </div>

            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    history={history}
                    onPlay={startPlayingVideo}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                userName={activeName}
                onResetFilters={handleResetFilters}
                currentCategory={selectedCategory}
                currentDuration={selectedDuration}
              />
            )}
          </section>
        )}
      </main>

      {/* 5. First Time Onboarding & 18+ Age Verification Modal */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* 6. Safe 4s Countdown Modal */}
      {countdownVideo && (
        <CountdownModal
          userName={activeName}
          video={countdownVideo}
          history={history}
          onPlayImmediately={() => startPlayingVideo(countdownVideo)}
          onCancel={() => setCountdownVideo(null)}
          onReroll={handleRerollCountdown}
          countdownSeconds={4}
        />
      )}

      {/* 7. Native OS Fullscreen Player Modal */}
      {activePlayerVideo && (
        <VideoPlayerModal
          video={activePlayerVideo}
          onClose={() => setActivePlayerVideo(null)}
          onVideoEnded={handleVideoEnded}
        />
      )}

      {/* 8. Post-Playback Action Toast */}
      {lastFinishedVideo && !activePlayerVideo && (
        <PostPlaybackToast
          userName={activeName}
          video={lastFinishedVideo}
          onReplay={() => startPlayingVideo(lastFinishedVideo)}
          onPickAnother={handleLaunchRandom}
          onDismiss={() => setLastFinishedVideo(null)}
        />
      )}

      {/* 9. Seductive Footer with AJ Creator Logo and Discord */}
      <Footer userName={activeName} />
    </div>
  );
}
