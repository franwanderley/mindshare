export interface LoadingProps {
	size?: "sm" | "md" | "lg" | "xl";
	color?: "white" | "indigo" | "red" | "gray" | "current";
	layout?: "inline" | "block" | "fullscreen";
	variant?: "spinner" | "dots";
	text?: string;
	className?: string;
}

export function Loading({
	size = "md",
	color = "indigo",
	layout = "inline",
	variant = "spinner",
	text,
	className = "",
}: LoadingProps) {
	const spinnerSizeClasses = {
		sm: "w-4 h-4 border-2",
		md: "w-5 h-5 border-2",
		lg: "w-8 h-8 border-3",
		xl: "w-12 h-12 border-4",
	};

	const dotSizeClasses = {
		sm: "w-1 h-1",
		md: "w-1.5 h-1.5",
		lg: "w-2 h-2",
		xl: "w-3 h-3",
	};

	const spinnerColorClasses = {
		white: "border-white/30 border-t-white",
		indigo:
			"border-indigo-200 border-t-indigo-600 dark:border-indigo-900/50 dark:border-t-indigo-400",
		red: "border-red-200 border-t-red-600 dark:border-red-900/50 dark:border-t-red-400",
		gray: "border-gray-200 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-400",
		current: "border-current/30 border-t-current",
	};

	const dotColorClasses = {
		white: "text-white",
		indigo: "text-indigo-600 dark:text-indigo-400",
		red: "text-red-600 dark:text-red-400",
		gray: "text-gray-500 dark:text-gray-400",
		current: "text-current",
	};

	const renderIndicator = () => {
		if (variant === "dots") {
			const dotSize = dotSizeClasses[size];
			const dotColor = dotColorClasses[color];

			return (
				<div
					className={`flex items-center gap-1 ${dotColor} ${className}`}
				>
					<span
						className={`${dotSize} rounded-full bg-current animate-bounce`}
						style={{ animationDelay: "-0.3s" }}
					/>
					<span
						className={`${dotSize} rounded-full bg-current animate-bounce`}
						style={{ animationDelay: "-0.15s" }}
					/>
					<span
						className={`${dotSize} rounded-full bg-current animate-bounce`}
					/>
				</div>
			);
		}

		const spinnerSize = spinnerSizeClasses[size];
		const spinnerColor = spinnerColorClasses[color];

		return (
			<span
				className={`rounded-full animate-spin shrink-0 ${spinnerSize} ${spinnerColor} ${className}`}
			/>
		);
	};

	if (layout === "fullscreen") {
		return (
			<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-300">
				<div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
					{renderIndicator()}
					{text && (
						<p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200 animate-pulse">
							{text}
						</p>
					)}
				</div>
			</div>
		);
	}

	if (layout === "block") {
		return (
			<div className="flex flex-col items-center justify-center py-12 px-4 w-full h-full min-h-[16rem]">
				{renderIndicator()}
				{text && (
					<p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
						{text}
					</p>
				)}
			</div>
		);
	}

	return renderIndicator();
}
