import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// 1. The Continuous Emotion Spectrum (Y-Axis)
const MOOD_LEVELS = [
  { level: 4, label: 'Thriving', color: '#4ade80', shadow: 'rgba(74,222,128,0.5)', keywords: ['joy', 'excited', 'motivated', 'happy', 'thrilled', 'great'] },
  { level: 3, label: 'Balanced', color: '#2dd4bf', shadow: 'rgba(45,212,191,0.5)', keywords: ['peaceful', 'calm', 'content', 'grateful', 'good', 'okay'] },
  { level: 2, label: 'Neutral',  color: '#9ca3af', shadow: 'rgba(156,163,175,0.5)', keywords: ['neutral', 'fine', 'meh', 'tired'] },
  { level: 1, label: 'Strained', color: '#f97316', shadow: 'rgba(251,146,60,0.5)', keywords: ['overwhelmed', 'anxious', 'frustrated', 'angry', 'stressed', 'nervous'] },
  { level: 0, label: 'Rough',    color: '#ef4444', shadow: 'rgba(239,68,68,0.5)', keywords: ['sad', 'burnt out', 'exhausted', 'depressed', 'lonely', 'fear'] }
];

const getMoodLevelConfig = (moodText) => {
  if (!moodText) return MOOD_LEVELS[2];
  const text = moodText.toLowerCase();
  for (const level of MOOD_LEVELS) {
    if (level.keywords.some(kw => text.includes(kw))) return level;
  }
  return MOOD_LEVELS[2];
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  
  if (!payload.isActive) {
    return <circle cx={cx} cy={cy} r={3} fill="rgba(255,255,255,0.1)" />;
  }

  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={6} 
      fill={payload.config.color} 
      stroke="white"
      strokeWidth={1.5}
      style={{ filter: `drop-shadow(0px 0px 8px ${payload.config.shadow})` }}
    />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length && payload[0].payload.isActive) {
    const data = payload[0].payload.entry;
    return (
      <div className="bg-[#1e1e2f]/90 backdrop-blur-md border border-purple-500/30 p-4 rounded-xl shadow-2xl max-w-xs text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg capitalize" style={{ color: payload[0].payload.config.color }}>
            {data.userFeeling}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(data.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <p className="text-sm text-gray-300 italic leading-relaxed">
          "{data.notes.length > 80 ? data.notes.substring(0, 80) + '...' : data.notes}"
        </p>
      </div>
    );
  }
  return null;
};

const MoodHeatmap = ({ entries }) => {
  const chartData = useMemo(() => {
    const data = [];
    const days = [];
    
    // Generate last 15 days
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    days.forEach((dayString) => {
      const dateObj = new Date(dayString);
      const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      const entryForDay = entries.find(e => e.date.startsWith(dayString));
      
      if (entryForDay) {
        const config = getMoodLevelConfig(entryForDay.mood);
        data.push({ x: formattedDate, y: config.level, isActive: true, entry: entryForDay, config });
      } else {
        data.push({ x: formattedDate, y: null, isActive: false });
      }
    });
    
    return data;
  }, [entries]);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-2xl shadow-xl mb-10 w-full overflow-hidden">
      <h3 className="text-xl font-bold text-white mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        Mood Trends (Last 15 Days)
      </h3>
      
      <div className="h-[300px] w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart margin={{ top: 10, right: 10, bottom: 10, left: 20 }} data={chartData}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="x" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              interval={2}
            />
            
            <YAxis 
              type="number" 
              domain={[0, 4]} 
              ticks={[0, 1, 2, 3, 4]}
              axisLine={false} 
              tickLine={false}
              tickFormatter={(tick) => MOOD_LEVELS.find(l => l.level === tick)?.label}
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              width={80}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} 
            />
            
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke="#a855f7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMood)" 
              dot={<CustomDot />}
              connectNulls={true}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodHeatmap;