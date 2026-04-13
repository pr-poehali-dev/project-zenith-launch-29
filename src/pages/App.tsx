import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Icon from "@/components/ui/icon";

const SAFE_LIMIT = 85;

const weekData = [
  { day: "Пн", avg: 62, max: 78 },
  { day: "Вт", avg: 74, max: 89 },
  { day: "Ср", avg: 58, max: 72 },
  { day: "Чт", avg: 81, max: 95 },
  { day: "Пт", avg: 70, max: 84 },
  { day: "Сб", avg: 55, max: 68 },
  { day: "Вс", avg: 63, max: 77 },
];

const todayData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  db: i >= 8 && i <= 22 ? Math.floor(50 + Math.random() * 40) : 0,
}));

const tabs = ["Сейчас", "Сегодня", "Неделя", "Настройки"];

function getColor(db: number) {
  if (db < 70) return "#22c55e";
  if (db < 85) return "#f59e0b";
  return "#ef4444";
}

function getLabel(db: number) {
  if (db < 70) return "Безопасно";
  if (db < 85) return "Умеренно";
  return "Опасно!";
}

function NowTab() {
  const [db, setDb] = useState(62);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [listening, setListening] = useState(true);

  useEffect(() => {
    if (!listening) return;
    intervalRef.current = setInterval(() => {
      setDb((prev) => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.max(40, Math.min(110, Math.round(prev + delta)));
      });
    }, 800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [listening]);

  const color = getColor(db);
  const label = getLabel(db);
  const pct = Math.min(100, ((db - 40) / 70) * 100);

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="95" fill="none" stroke="#1e293b" strokeWidth="12" />
          <motion.circle
            cx="110"
            cy="110"
            r="95"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 95}`}
            strokeDashoffset={`${2 * Math.PI * 95 * (1 - pct / 100)}`}
            transform="rotate(-90 110 110)"
            animate={{ strokeDashoffset: `${2 * Math.PI * 95 * (1 - pct / 100)}`, stroke: color }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            key={db}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold text-white leading-none"
          >
            {db}
          </motion.span>
          <span className="text-neutral-400 text-sm mt-1">дБ</span>
          <motion.span
            animate={{ color }}
            className="text-sm font-semibold mt-2"
          >
            {label}
          </motion.span>
        </div>
      </div>

      <div className="w-full bg-[#1e293b] rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex justify-between text-xs text-neutral-400 uppercase tracking-wide">
          <span>Безопасный порог</span>
          <span>{SAFE_LIMIT} дБ</span>
        </div>
        <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-500">
          <span>40 дБ — тишина</span>
          <span>110 дБ — концерт</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="bg-[#1e293b] rounded-2xl p-4">
          <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Источник</p>
          <div className="flex items-center gap-2">
            <Icon name="Headphones" size={18} className="text-blue-400" />
            <span className="text-white text-sm font-medium">Наушники</span>
          </div>
        </div>
        <div className="bg-[#1e293b] rounded-2xl p-4">
          <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Сегодня</p>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={18} className="text-purple-400" />
            <span className="text-white text-sm font-medium">3ч 24м</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setListening((v) => !v)}
        className="w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-300"
        style={{ background: listening ? "#ef4444" : "#22c55e", color: "white" }}
      >
        {listening ? "Остановить мониторинг" : "Начать мониторинг"}
      </button>
    </div>
  );
}

function TodayTab() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Среднее", value: "64 дБ", icon: "Activity", color: "text-blue-400" },
          { label: "Максимум", value: "92 дБ", icon: "TrendingUp", color: "text-red-400" },
          { label: "Время", value: "3ч 24м", icon: "Clock", color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e293b] rounded-2xl p-3 flex flex-col gap-2">
            <Icon name={s.icon as "Activity"} size={16} className={s.color} />
            <p className="text-white font-bold text-lg leading-none">{s.value}</p>
            <p className="text-neutral-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#1e293b] rounded-2xl p-4">
        <p className="text-neutral-400 text-xs uppercase tracking-wide mb-4">Уровень дБ по часам</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={todayData}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 10 }} interval={3} />
            <YAxis domain={[0, 110]} tick={{ fill: "#64748b", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "none", borderRadius: 12, color: "#fff" }}
              formatter={(v: number) => [`${v} дБ`, "Уровень"]}
            />
            <Area type="monotone" dataKey="db" stroke="#3b82f6" fill="url(#grad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-[#1e293b] rounded-2xl p-4">
        <p className="text-neutral-400 text-xs uppercase tracking-wide mb-2">Оценка дня</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Умеренная нагрузка</p>
            <p className="text-neutral-500 text-xs">Превышение порога 2 раза по 5–10 минут</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekTab() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="bg-[#1e293b] rounded-2xl p-4">
        <p className="text-neutral-400 text-xs uppercase tracking-wide mb-4">Средний уровень по дням</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weekData} barGap={4}>
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis domain={[0, 110]} tick={{ fill: "#64748b", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "#0f172a", border: "none", borderRadius: 12, color: "#fff" }}
              formatter={(v: number) => [`${v} дБ`]}
            />
            <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Среднее" />
            <Bar dataKey="max" fill="#ef4444" radius={[6, 6, 0, 0]} name="Макс" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-neutral-400 text-xs">Среднее</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 opacity-60" /><span className="text-neutral-400 text-xs">Максимум</span></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1e293b] rounded-2xl p-4">
          <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Всего в наушниках</p>
          <p className="text-white text-2xl font-bold">21ч 18м</p>
          <p className="text-neutral-500 text-xs mt-1">за 7 дней</p>
        </div>
        <div className="bg-[#1e293b] rounded-2xl p-4">
          <p className="text-neutral-400 text-xs uppercase tracking-wide mb-1">Превышений</p>
          <p className="text-red-400 text-2xl font-bold">5</p>
          <p className="text-neutral-500 text-xs mt-1">выше {SAFE_LIMIT} дБ</p>
        </div>
      </div>
      <div className="bg-[#1e293b] rounded-2xl p-4">
        <p className="text-neutral-400 text-xs uppercase tracking-wide mb-2">Рекомендация</p>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
            <Icon name="Info" size={20} className="text-blue-400" />
          </div>
          <p className="text-white text-sm leading-relaxed">
            В четверг зафиксировано превышение 95 дБ. Рекомендуем снизить громкость или делать паузы каждые 30 минут.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [threshold, setThreshold] = useState(85);
  const [notif, setNotif] = useState(true);
  const [vibro, setVibro] = useState(false);
  const [autoStop, setAutoStop] = useState(true);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="bg-[#1e293b] rounded-2xl p-4">
        <p className="text-neutral-400 text-xs uppercase tracking-wide mb-3">Безопасный порог</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-white font-bold text-2xl">{threshold} дБ</span>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: getColor(threshold) + "30", color: getColor(threshold) }}>
            {getLabel(threshold)}
          </span>
        </div>
        <input
          type="range"
          min={60}
          max={100}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-neutral-500 text-xs mt-1">
          <span>60 дБ</span><span>100 дБ</span>
        </div>
      </div>

      {[
        { label: "Уведомления при превышении", sub: "Push-уведомление на телефон", value: notif, set: setNotif, icon: "Bell" },
        { label: "Вибрация", sub: "Вибросигнал при опасном уровне", value: vibro, set: setVibro, icon: "Vibrate" },
        { label: "Авто-пауза", sub: "Снизить громкость автоматически", value: autoStop, set: setAutoStop, icon: "VolumeX" },
      ].map((s) => (
        <div key={s.label} className="bg-[#1e293b] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f172a] flex items-center justify-center">
              <Icon name={s.icon as "Bell"} size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{s.label}</p>
              <p className="text-neutral-500 text-xs">{s.sub}</p>
            </div>
          </div>
          <button
            onClick={() => s.set((v: boolean) => !v)}
            className="w-12 h-6 rounded-full transition-all duration-300 relative"
            style={{ background: s.value ? "#3b82f6" : "#334155" }}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 rounded-full bg-white"
              animate={{ left: s.value ? "calc(100% - 20px)" : "4px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      ))}

      <div className="bg-[#1e293b] rounded-2xl p-4">
        <p className="text-neutral-400 text-xs uppercase tracking-wide mb-3">Профиль слуха</p>
        <div className="grid grid-cols-3 gap-2">
          {["Обычный", "Чувствительный", "Музыкант"].map((p) => (
            <button
              key={p}
              className="py-2 px-2 rounded-xl text-xs font-medium transition-all duration-200 first:bg-blue-500 first:text-white bg-[#0f172a] text-neutral-400 hover:bg-blue-500/20"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HearGuardApp() {
  const [activeTab, setActiveTab] = useState(0);

  const tabContent = [<NowTab key="now" />, <TodayTab key="today" />, <WeekTab key="week" />, <SettingsTab key="settings" />];

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0f172a] rounded-[40px] overflow-hidden shadow-2xl border border-white/5" style={{ minHeight: 700 }}>
        <div className="px-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-xl font-bold">HearGuard</h1>
              <p className="text-neutral-500 text-xs">Контроль слуха</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Icon name="Headphones" size={20} className="text-blue-400" />
            </div>
          </div>

          <div className="flex bg-[#1e293b] rounded-2xl p-1 gap-1">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 relative"
                style={{ color: activeTab === i ? "#fff" : "#64748b" }}
              >
                {activeTab === i && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-xl bg-blue-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight: 560 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
