"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  sermonTitle: string;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ audioUrl, sermonTitle }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onEnded = () => setPlaying(false);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  return (
    <div className="bg-[#F4EFE8] rounded-2xl p-5 border border-[#EAE2D6]">
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      <p className="text-xs text-[#6B7280] font-sans mb-3 uppercase tracking-wider">Now Playing</p>
      <p className="font-serif text-lg text-[#1C3A2E] mb-4 leading-snug">{sermonTitle}</p>

      {/* Progress bar */}
      <div
        className="relative h-1.5 bg-[#EAE2D6] rounded-full cursor-pointer mb-3 group"
        onClick={seek}
      >
        <div
          className="absolute left-0 top-0 h-full bg-[#C9A845] rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#C9A845] rounded-full shadow-sm pointer-events-none"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[#6B7280] font-sans mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{duration ? formatTime(duration) : "--:--"}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          disabled={!audioUrl}
          aria-label={playing ? "Pause" : "Play"}
          className="w-12 h-12 rounded-full bg-[#1C3A2E] text-white flex items-center justify-center hover:bg-[#2D6A4F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>

        <button
          onClick={toggleMute}
          disabled={!audioUrl}
          aria-label={muted ? "Unmute" : "Mute"}
          className="text-[#6B7280] hover:text-[#1C3A2E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {!audioUrl && (
          <span className="text-xs text-[#6B7280] font-sans italic">Audio coming soon</span>
        )}
      </div>
    </div>
  );
}
