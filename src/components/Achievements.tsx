import { useState } from "react";
import { Header } from "./Header";

// ── tipos ──────────────────────────────────────────────────────────────────
type AchievementCategory = "leitura" | "social" | "engajamento" | "streak";

interface Achievement {
	id: string;
	title: string;
	description: string;
	category: AchievementCategory;
	unlocked: boolean;
	unlockedAt?: string;
	xp: number;
	rarity: "common" | "rare" | "epic" | "legendary";
	iconType: string;
}

// ── SVG icons ──────────────────────────────────────────────────────────────
function IconFirstBook() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-book-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#818cf8" />
					<stop offset="100%" stopColor="#6366f1" />
				</linearGradient>
			</defs>
			<rect x="8" y="8" width="38" height="48" rx="4" fill="url(#ach-book-grad)" />
			<rect x="14" y="18" width="26" height="3" rx="1.5" fill="white" fillOpacity="0.8" />
			<rect x="14" y="26" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.6" />
			<rect x="14" y="34" width="23" height="3" rx="1.5" fill="white" fillOpacity="0.6" />
			<rect x="14" y="42" width="16" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
			<rect x="46" y="8" width="4" height="48" rx="2" fill="#4f46e5" />
			<circle cx="48" cy="56" r="6" fill="#fbbf24" />
			<path d="M45 56 L47.5 58.5 L52 54" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function IconFiveBooks() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-5book-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#34d399" />
					<stop offset="100%" stopColor="#059669" />
				</linearGradient>
			</defs>
			<rect x="4" y="14" width="28" height="38" rx="3" fill="#a7f3d0" />
			<rect x="10" y="12" width="28" height="38" rx="3" fill="#6ee7b7" />
			<rect x="16" y="10" width="28" height="38" rx="3" fill="#34d399" />
			<rect x="22" y="8" width="28" height="38" rx="3" fill="url(#ach-5book-grad)" />
			<rect x="27" y="16" width="17" height="2.5" rx="1.2" fill="white" fillOpacity="0.85" />
			<rect x="27" y="22" width="13" height="2.5" rx="1.2" fill="white" fillOpacity="0.65" />
			<rect x="27" y="28" width="15" height="2.5" rx="1.2" fill="white" fillOpacity="0.65" />
			<circle cx="50" cy="50" r="10" fill="#fbbf24" />
			<text x="50" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">5</text>
		</svg>
	);
}

function IconWeekStreak() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-fire-grad" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#fb923c" />
					<stop offset="60%" stopColor="#ef4444" />
					<stop offset="100%" stopColor="#dc2626" />
				</linearGradient>
			</defs>
			<path d="M32 4 C32 4 44 18 44 30 C44 30 40 24 36 26 C40 32 38 44 32 52 C26 44 24 32 28 26 C24 24 20 30 20 30 C20 18 32 4 32 4Z" fill="url(#ach-fire-grad)" />
			<path d="M32 28 C32 28 38 36 38 42 C38 42 35 38 33 39 C35 43 34 50 32 54 C30 50 29 43 31 39 C29 38 26 42 26 42 C26 36 32 28 32 28Z" fill="#fde68a" fillOpacity="0.8" />
			<circle cx="32" cy="46" r="6" fill="#fbbf24" fillOpacity="0.9" />
		</svg>
	);
}

function IconMonthStreak() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-month-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#f97316" />
					<stop offset="100%" stopColor="#ea580c" />
				</linearGradient>
				<linearGradient id="ach-month-fire" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#fdba74" />
					<stop offset="100%" stopColor="#f97316" />
				</linearGradient>
			</defs>
			<circle cx="32" cy="32" r="28" fill="url(#ach-month-grad)" fillOpacity="0.15" stroke="url(#ach-month-grad)" strokeWidth="2" />
			<path d="M32 8 C32 8 46 24 46 36 C46 36 41 28 36 31 C41 38 39 50 32 57 C25 50 23 38 28 31 C23 28 18 36 18 36 C18 24 32 8 32 8Z" fill="url(#ach-month-fire)" />
			<path d="M32 30 C32 30 38 38 38 44 C38 44 35 40 33 41 C35 46 34 53 32 57 C30 53 29 46 31 41 C29 40 26 44 26 44 C26 38 32 30 32 30Z" fill="#fef3c7" fillOpacity="0.9" />
		</svg>
	);
}

function IconFirstGroup() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-group-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#c084fc" />
					<stop offset="100%" stopColor="#7c3aed" />
				</linearGradient>
			</defs>
			<circle cx="22" cy="22" r="10" fill="url(#ach-group-grad)" fillOpacity="0.7" />
			<circle cx="42" cy="22" r="10" fill="url(#ach-group-grad)" fillOpacity="0.85" />
			<circle cx="32" cy="38" r="10" fill="url(#ach-group-grad)" />
			<path d="M22 32 Q32 28 42 32" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 2" />
			<path d="M17 30 Q24 40 32 48" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 2" />
			<path d="M47 30 Q40 40 32 48" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 2" />
		</svg>
	);
}

function IconFirstIdea() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-idea-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#fde68a" />
					<stop offset="100%" stopColor="#f59e0b" />
				</linearGradient>
			</defs>
			<circle cx="32" cy="26" r="16" fill="url(#ach-idea-grad)" />
			<path d="M26 40 h12 M28 44 h8 M30 48 h4" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
			<line x1="32" y1="10" x2="32" y2="6" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
			<line x1="44" y1="14" x2="47" y2="11" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
			<line x1="20" y1="14" x2="17" y2="11" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
			<line x1="48" y1="26" x2="52" y2="26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
			<line x1="16" y1="26" x2="12" y2="26" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
			<circle cx="32" cy="26" r="8" fill="#fffbeb" fillOpacity="0.6" />
			<path d="M28 24 Q32 18 36 24 Q36 29 32 32 Q28 29 28 24Z" fill="#f59e0b" />
		</svg>
	);
}

function IconTenIdeas() {
	const dots = Array.from({ length: 10 }, (_, i) => {
		const angle = (i * 36 - 90) * (Math.PI / 180);
		const x = 32 + 20 * Math.cos(angle);
		const y = 32 + 20 * Math.sin(angle);
		return { x, y, active: i < 7 };
	});
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-tenidea-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#fb7185" />
					<stop offset="100%" stopColor="#e11d48" />
				</linearGradient>
			</defs>
			<circle cx="32" cy="32" r="26" fill="url(#ach-tenidea-grad)" fillOpacity="0.1" stroke="url(#ach-tenidea-grad)" strokeWidth="1.5" />
			{dots.map((d, i) => (
				<circle key={i} cx={d.x} cy={d.y} r="4" fill="url(#ach-tenidea-grad)" fillOpacity={d.active ? 1 : 0.3} />
			))}
			<circle cx="32" cy="32" r="10" fill="url(#ach-tenidea-grad)" />
			<text x="32" y="36" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">10</text>
		</svg>
	);
}

function IconFirstComment() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-comment-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#67e8f9" />
					<stop offset="100%" stopColor="#0891b2" />
				</linearGradient>
			</defs>
			<rect x="6" y="8" width="44" height="34" rx="8" fill="url(#ach-comment-grad)" />
			<path d="M16 48 L12 56 L26 50" fill="url(#ach-comment-grad)" />
			<rect x="14" y="18" width="28" height="3" rx="1.5" fill="white" fillOpacity="0.85" />
			<rect x="14" y="26" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.65" />
		</svg>
	);
}

function IconExplorer() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-star-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#fcd34d" />
					<stop offset="100%" stopColor="#d97706" />
				</linearGradient>
			</defs>
			<polygon points="32,4 39,24 60,24 44,38 50,58 32,46 14,58 20,38 4,24 25,24" fill="url(#ach-star-grad)" />
			<polygon points="32,14 37,28 52,28 40,37 44,51 32,43 20,51 24,37 12,28 27,28" fill="#fef3c7" fillOpacity="0.5" />
			<circle cx="32" cy="32" r="6" fill="#f59e0b" />
		</svg>
	);
}

function IconLegend() {
	return (
		<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="ach-legend-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#f0abfc" />
					<stop offset="50%" stopColor="#818cf8" />
					<stop offset="100%" stopColor="#38bdf8" />
				</linearGradient>
				<linearGradient id="ach-crown-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#fde68a" />
					<stop offset="100%" stopColor="#f59e0b" />
				</linearGradient>
			</defs>
			<circle cx="32" cy="32" r="28" fill="url(#ach-legend-bg)" fillOpacity="0.2" />
			<path d="M12 40 L20 20 L32 34 L44 20 L52 40 Z" fill="url(#ach-crown-grad)" />
			<circle cx="12" cy="40" r="4" fill="#fbbf24" />
			<circle cx="32" cy="34" r="4" fill="#fbbf24" />
			<circle cx="52" cy="40" r="4" fill="#fbbf24" />
			<rect x="10" y="40" width="44" height="6" rx="3" fill="url(#ach-crown-grad)" />
			<circle cx="32" cy="10" r="5" fill="#fcd34d" />
			<path d="M29 10 L31.5 12.5 L36 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

const ICON_MAP: Record<string, React.FC> = {
	firstBook: IconFirstBook,
	fiveBooks: IconFiveBooks,
	weekStreak: IconWeekStreak,
	monthStreak: IconMonthStreak,
	firstGroup: IconFirstGroup,
	firstIdea: IconFirstIdea,
	tenIdeas: IconTenIdeas,
	firstComment: IconFirstComment,
	explorer: IconExplorer,
	legend: IconLegend,
};

// ── dados mockados ─────────────────────────────────────────────────────────
const ACHIEVEMENTS: Achievement[] = [
	{
		id: "first-book",
		title: "Primeiro Livro",
		description: "Completou seu primeiro livro no MindShare.",
		category: "leitura",
		unlocked: true,
		unlockedAt: "15 Jan 2026",
		xp: 50,
		rarity: "common",
		iconType: "firstBook",
	},
	{
		id: "five-books",
		title: "Leitor Dedicado",
		description: "Completou 5 livros diferentes.",
		category: "leitura",
		unlocked: true,
		unlockedAt: "02 Mar 2026",
		xp: 150,
		rarity: "rare",
		iconType: "fiveBooks",
	},
	{
		id: "week-streak",
		title: "Uma Semana Ativa",
		description: "Acessou o MindShare por 7 dias consecutivos.",
		category: "streak",
		unlocked: true,
		unlockedAt: "10 Abr 2026",
		xp: 100,
		rarity: "common",
		iconType: "weekStreak",
	},
	{
		id: "month-streak",
		title: "Mês em Chamas",
		description: "Manteve uma sequência de 30 dias consecutivos.",
		category: "streak",
		unlocked: false,
		xp: 300,
		rarity: "epic",
		iconType: "monthStreak",
	},
	{
		id: "first-group",
		title: "Socialite",
		description: "Entrou ou criou seu primeiro grupo de leitura.",
		category: "social",
		unlocked: true,
		unlockedAt: "05 Jan 2026",
		xp: 75,
		rarity: "common",
		iconType: "firstGroup",
	},
	{
		id: "first-idea",
		title: "Primeira Ideia",
		description: "Compartilhou sua primeira ideia em um grupo.",
		category: "engajamento",
		unlocked: true,
		unlockedAt: "07 Jan 2026",
		xp: 50,
		rarity: "common",
		iconType: "firstIdea",
	},
	{
		id: "ten-ideas",
		title: "Mente Criativa",
		description: "Publicou 10 ideias nos seus grupos.",
		category: "engajamento",
		unlocked: false,
		xp: 200,
		rarity: "rare",
		iconType: "tenIdeas",
	},
	{
		id: "first-comment",
		title: "Voz Ativa",
		description: "Comentou pela primeira vez em uma ideia.",
		category: "engajamento",
		unlocked: true,
		unlockedAt: "08 Jan 2026",
		xp: 30,
		rarity: "common",
		iconType: "firstComment",
	},
	{
		id: "explorer",
		title: "Explorador",
		description: "Participou de 5 grupos diferentes.",
		category: "social",
		unlocked: false,
		xp: 250,
		rarity: "epic",
		iconType: "explorer",
	},
	{
		id: "legend",
		title: "Lenda do MindShare",
		description: "Completou todas as outras conquistas. Você é uma lenda!",
		category: "social",
		unlocked: false,
		xp: 1000,
		rarity: "legendary",
		iconType: "legend",
	},
];

// ── config ─────────────────────────────────────────────────────────────────
const RARITY_CONFIG: Record<
	Achievement["rarity"],
	{ label: string; gradFrom: string; gradTo: string; glow: string; badge: string }
> = {
	common: {
		label: "Comum",
		gradFrom: "#94a3b8",
		gradTo: "#64748b",
		glow: "0 8px 24px rgba(100,116,139,0.35)",
		badge: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
	},
	rare: {
		label: "Raro",
		gradFrom: "#818cf8",
		gradTo: "#4f46e5",
		glow: "0 8px 24px rgba(99,102,241,0.45)",
		badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
	},
	epic: {
		label: "Épico",
		gradFrom: "#c084fc",
		gradTo: "#7c3aed",
		glow: "0 8px 24px rgba(139,92,246,0.5)",
		badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
	},
	legendary: {
		label: "Lendário",
		gradFrom: "#fbbf24",
		gradTo: "#ec4899",
		glow: "0 8px 32px rgba(251,191,36,0.55)",
		badge: "bg-gradient-to-r from-amber-100 to-rose-100 text-amber-700 dark:from-amber-900/40 dark:to-rose-900/40 dark:text-amber-300",
	},
};

const CATEGORY_FILTER_OPTIONS: Array<{
	value: AchievementCategory | "all";
	label: string;
}> = [
	{ value: "all", label: "Todas" },
	{ value: "leitura", label: "📚 Leitura" },
	{ value: "social", label: "👥 Social" },
	{ value: "engajamento", label: "💡 Engajamento" },
	{ value: "streak", label: "🔥 Sequência" },
];

// ── AchievementCard ────────────────────────────────────────────────────────
function AchievementCard({ achievement }: { achievement: Achievement }) {
	const [hovered, setHovered] = useState(false);
	const rarity = RARITY_CONFIG[achievement.rarity];
	const IconComp = ICON_MAP[achievement.iconType];

	return (
		<div
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				transform: hovered ? "translateY(-5px)" : "translateY(0)",
				boxShadow: hovered && achievement.unlocked ? rarity.glow : undefined,
				transition: "transform 0.25s ease, box-shadow 0.25s ease",
			}}
			className={[
				"relative rounded-2xl p-5 flex flex-col gap-3 border cursor-default select-none",
				achievement.unlocked
					? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
					: "bg-gray-50 dark:bg-gray-900 border-dashed border-gray-200 dark:border-gray-700",
			].join(" ")}
		>
			{/* Legendary shimmer */}
			{achievement.rarity === "legendary" && achievement.unlocked && (
				<div
					className="absolute inset-0 rounded-2xl pointer-events-none"
					style={{
						background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(236,72,153,0.08), rgba(139,92,246,0.08))",
					}}
				/>
			)}

			{/* Locked overlay */}
			{!achievement.unlocked && (
				<div className="absolute inset-0 rounded-2xl z-10 flex flex-col items-center justify-center gap-1"
					style={{ background: "rgba(249,250,251,0.7)", backdropFilter: "blur(2px)" }}>
					<svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7a4.5 4.5 0 10-9 0v3.5M5.25 10.5h13.5A1.5 1.5 0 0120.25 12v7.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
					</svg>
					<span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Bloqueada</span>
				</div>
			)}

			{/* Icon circle */}
			<div
				className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center p-2 transition-all duration-300"
				style={
					achievement.unlocked
						? {
								background: `linear-gradient(135deg, ${rarity.gradFrom}, ${rarity.gradTo})`,
								boxShadow: hovered ? rarity.glow : "none",
							}
						: { background: "#e2e8f0", filter: "grayscale(1)", opacity: 0.4 }
				}
			>
				<div className="w-full h-full">{IconComp && <IconComp />}</div>
			</div>

			{/* Title + rarity */}
			<div className="text-center space-y-1.5 z-0">
				<h3
					className={[
						"font-bold text-sm leading-tight",
						achievement.unlocked
							? "text-gray-900 dark:text-white"
							: "text-gray-400 dark:text-gray-600",
					].join(" ")}
				>
					{achievement.title}
				</h3>
				<span
					className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${rarity.badge}`}
				>
					{rarity.label}
				</span>
				<p
					className={[
						"text-xs leading-relaxed",
						achievement.unlocked
							? "text-gray-500 dark:text-gray-400"
							: "text-gray-400 dark:text-gray-600",
					].join(" ")}
				>
					{achievement.description}
				</p>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
				<span
					className={[
						"text-xs font-bold",
						achievement.unlocked
							? "text-indigo-600 dark:text-indigo-400"
							: "text-gray-400 dark:text-gray-600",
					].join(" ")}
				>
					+{achievement.xp} XP
				</span>
				{achievement.unlocked && achievement.unlockedAt ? (
					<span className="text-xs text-gray-400 dark:text-gray-500">
						{achievement.unlockedAt}
					</span>
				) : (
					<span className="text-xs text-gray-400 dark:text-gray-500 italic">
						Não desbloqueada
					</span>
				)}
			</div>
		</div>
	);
}

// ── StatsBar ───────────────────────────────────────────────────────────────
function StatsBar() {
	const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
	const total = ACHIEVEMENTS.length;
	const totalXp = ACHIEVEMENTS.filter((a) => a.unlocked).reduce(
		(s, a) => s + a.xp,
		0,
	);
	const pct = Math.round((unlocked / total) * 100);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Progresso geral
					</p>
					<p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-0.5">
						{unlocked}
						<span className="text-xl font-medium text-gray-400 dark:text-gray-500">
							{" "}
							/ {total}
						</span>
					</p>
				</div>
				<div className="text-right">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						XP Total
					</p>
					<p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
						{totalXp.toLocaleString("pt-BR")}
					</p>
				</div>
			</div>

			{/* Progress bar */}
			<div className="space-y-1.5">
				<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
					<span>Conquistas desbloqueadas</span>
					<span className="font-semibold">{pct}%</span>
				</div>
				<div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
					<div
						className="h-3 rounded-full transition-all duration-700"
						style={{
							width: `${pct}%`,
							background:
								"linear-gradient(90deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)",
						}}
					/>
				</div>
			</div>

			{/* Rarity breakdown */}
			<div className="grid grid-cols-4 gap-3">
				{(["common", "rare", "epic", "legendary"] as const).map((r) => {
					const count = ACHIEVEMENTS.filter(
						(a) => a.rarity === r && a.unlocked,
					).length;
					const cfg = RARITY_CONFIG[r];
					return (
						<div
							key={r}
							className="text-center rounded-xl py-2 px-1"
							style={{
								background: `linear-gradient(135deg, ${cfg.gradFrom}18, ${cfg.gradTo}18)`,
							}}
						>
							<div
								className="text-xl font-extrabold"
								style={{
									background: `linear-gradient(135deg, ${cfg.gradFrom}, ${cfg.gradTo})`,
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
								}}
							>
								{count}
							</div>
							<div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
								{cfg.label}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// ── Main page ──────────────────────────────────────────────────────────────
export function Achievements() {
	const [filter, setFilter] = useState<AchievementCategory | "all">("all");
	const [showOnly, setShowOnly] = useState<"all" | "unlocked" | "locked">(
		"all",
	);

	const filtered = ACHIEVEMENTS.filter((a) => {
		const catOk = filter === "all" || a.category === filter;
		const statusOk =
			showOnly === "all" ||
			(showOnly === "unlocked" && a.unlocked) ||
			(showOnly === "locked" && !a.unlocked);
		return catOk && statusOk;
	});

	const recentlyUnlocked = ACHIEVEMENTS.filter((a) => a.unlocked).slice(0, 4);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Header />

			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* Page header */}
				<div className="flex items-center gap-3">
					<div
						className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
						style={{
							background:
								"linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #8b5cf6 100%)",
						}}
					>
						<svg
							className="w-6 h-6 text-white"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					</div>
					<div>
						<h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
							Minhas Conquistas
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							Acompanhe seu progresso e desbloqueie novas conquistas!
						</p>
					</div>
				</div>

				{/* Stats */}
				<StatsBar />

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-2">
					{CATEGORY_FILTER_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() =>
								setFilter(opt.value as AchievementCategory | "all")
							}
							className={[
								"px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer",
								filter === opt.value
									? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
									: "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:text-indigo-600",
							].join(" ")}
						>
							{opt.label}
						</button>
					))}

					<div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1" />

					{(
						[
							{ value: "all", label: "Todas" },
							{ value: "unlocked", label: "✅ Desbloqueadas" },
							{ value: "locked", label: "🔒 Bloqueadas" },
						] as const
					).map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => setShowOnly(opt.value)}
							className={[
								"px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer",
								showOnly === opt.value
									? "bg-violet-600 text-white border-violet-600"
									: "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-violet-400",
							].join(" ")}
						>
							{opt.label}
						</button>
					))}
				</div>

				{/* Grid */}
				{filtered.length === 0 ? (
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
						<p className="text-gray-400 dark:text-gray-500 text-sm">
							Nenhuma conquista encontrada com esse filtro.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
						{filtered.map((a) => (
							<AchievementCard key={a.id} achievement={a} />
						))}
					</div>
				)}

				{/* Recently unlocked list */}
				<div className="space-y-3">
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">
						Desbloqueadas Recentemente
					</h2>
					<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
						{recentlyUnlocked.map((a) => {
							const rarity = RARITY_CONFIG[a.rarity];
							const IconComp = ICON_MAP[a.iconType];
							return (
								<div
									key={a.id}
									className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
								>
									<div
										className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center p-1.5"
										style={{
											background: `linear-gradient(135deg, ${rarity.gradFrom}, ${rarity.gradTo})`,
										}}
									>
										{IconComp && <IconComp />}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
											{a.title}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
											{a.description}
										</p>
									</div>
									<div className="text-right flex-shrink-0">
										<p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
											+{a.xp} XP
										</p>
										<p className="text-xs text-gray-400 dark:text-gray-500">
											{a.unlockedAt}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</main>
		</div>
	);
}
