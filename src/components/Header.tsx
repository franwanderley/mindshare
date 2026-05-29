import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MindShare } from "../assets/mindshare";

interface HeaderProps {
	groupName?: string;
}

export function Header({ groupName }: HeaderProps) {
	const navigate = useNavigate();
	const [userName] = useState(() => {
		try {
			const savedUser = localStorage.getItem("user");
			if (savedUser) {
				const u = JSON.parse(savedUser);
				return u.name || "Usuário";
			}
		} catch (e) {
			console.error(
				"Erro ao ler usuário do localStorage",
				e,
			);
		}
		return "Usuário";
	});

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<MindShare className="h-10 w-10 shrink-0" />
					{groupName ? (
						<div className="flex items-center gap-2">
							<Link
								to="/dashboard"
								className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition-colors"
							>
								Dashboard
							</Link>
							<span className="text-gray-300 dark:text-gray-600">
								/
							</span>
							<h1 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
								{groupName}
							</h1>
						</div>
					) : (
						<h1 className="text-xl font-bold text-gray-900 dark:text-white">
							MindShare
						</h1>
					)}
				</div>
				<div className="flex items-center gap-4">
					<span className="text-sm font-medium text-gray-700 dark:text-gray-200">
						{userName}
					</span>
					<button
						type="button"
						onClick={handleLogout}
						className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
					>
						Sair
					</button>
				</div>
			</div>
		</header>
	);
}
