import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame, CheckCircle2 } from 'lucide-react';
import GlassCard from './GlassCard';

const PomodoroTimer = ({ tasks, onFocusSessionCompleted }) => {
  const [focusTime, setFocusTime] = useState(25); // Minutes
  const [breakTime, setBreakTime] = useState(5); // Minutes
  
  const [timeLeft, setTimeLeft] = useState(focusTime * 60); // Seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus | break
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef(null);

  // Synchronize time left when presets are adjusted and timer is idle
  useEffect(() => {
    if (!isActive) {
      setTimeLeft((mode === 'focus' ? focusTime : breakTime) * 60);
    }
  }, [focusTime, breakTime, mode, isActive]);

  // Audio synthesis helper (Synthesizes sound directly in browser without mp3 files)
  const playSoundAlert = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 500);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  };

  // Timer Tick Core Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer expired!
            clearInterval(timerRef.current);
            setIsActive(false);
            playSoundAlert();
            
            if (mode === 'focus') {
              // Log Pomodoro to selected task if any
              if (selectedTaskId && onFocusSessionCompleted) {
                onFocusSessionCompleted(selectedTaskId);
              }
              // Switch to Break Mode
              setMode('break');
              return breakTime * 60;
            } else {
              // Switch back to Focus Mode
              setMode('focus');
              return focusTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, mode, focusTime, breakTime, selectedTaskId]);

  // Actions
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(focusTime * 60);
  };

  const handleModeChange = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft((newMode === 'focus' ? focusTime : breakTime) * 60);
  };

  // String formatting
  const formatTimeStr = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Circular progress calculations
  const totalSeconds = (mode === 'focus' ? focusTime : breakTime) * 60;
  const strokeDashoffset = totalSeconds > 0 
    ? 282 - (timeLeft / totalSeconds) * 282 
    : 0;

  return (
    <GlassCard className="max-w-md mx-auto flex flex-col items-center">
      
      {/* Settings Options Row */}
      <div className="w-full flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex gap-2.5">
          <button
            onClick={() => handleModeChange('focus')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === 'focus' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
          >
            Deep Focus
          </button>
          <button
            onClick={() => handleModeChange('break')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${mode === 'break' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}
          >
            Short Break
          </button>
        </div>

        {/* Audio control */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all"
          title={soundEnabled ? "Mute audio alarms" : "Unmute audio alarms"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Circle Animation Clock */}
      <div className="relative w-56 h-56 flex items-center justify-center mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Base border track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-white/5"
            strokeWidth="4"
            fill="transparent"
          />
          {/* Animated remaining fill */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`transition-all duration-300 ${mode === 'focus' ? 'stroke-indigo-500 shadow-lg shadow-indigo-500/50' : 'stroke-purple-500'}`}
            strokeWidth="4.5"
            fill="transparent"
            strokeDasharray="282.7"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Digital Clock text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold font-display text-white tracking-widest leading-none">
            {formatTimeStr(timeLeft)}
          </span>
          <span className="text-xs uppercase text-gray-500 font-bold tracking-wider mt-2.5">
            {mode === 'focus' ? 'Focus Session' : 'Relaxing Break'}
          </span>
        </div>
      </div>

      {/* Task association selector */}
      {mode === 'focus' && (
        <div className="w-full mb-6">
          <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">
            Associate with Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full rounded-xl bg-dark-800 border border-white/5 px-3 py-2.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- No specific task --</option>
            {tasks
              .filter((t) => t.status !== 'completed')
              .map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-4 w-full">
        <button
          onClick={resetTimer}
          className="flex-1 py-3 px-4 rounded-xl border border-white/5 hover:border-white/10 text-gray-400 hover:text-white bg-white/5 transition-all text-xs font-semibold flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        <button
          onClick={toggleTimer}
          className={`flex-[2] py-3 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
            isActive 
              ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/10' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              Pause Timer
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Start Focus
            </>
          )}
        </button>
      </div>

      {/* Quick settings multipliers */}
      <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-gray-600 font-semibold border-t border-white/5 pt-4 w-full">
        <button 
          onClick={() => { setIsActive(false); setFocusTime(15); }}
          className="hover:text-indigo-400 transition-colors"
        >
          15m Mini
        </button>
        <span>•</span>
        <button 
          onClick={() => { setIsActive(false); setFocusTime(25); }}
          className="hover:text-indigo-400 transition-colors"
        >
          25m Classic
        </button>
        <span>•</span>
        <button 
          onClick={() => { setIsActive(false); setFocusTime(50); }}
          className="hover:text-indigo-400 transition-colors"
        >
          50m Deep Focus
        </button>
      </div>
    </GlassCard>
  );
};

export default PomodoroTimer;
