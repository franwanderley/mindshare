import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MindShare } from "../assets/mindshare";
import { AuthService } from "../utils/service";

export function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (localStorage.getItem("token")) {
			navigate("/dashboard");
		}
	}, [navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await AuthService.login({ email, password });

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Erro ao realizar login.");
			}

			localStorage.setItem("token", data.token);
			navigate("/dashboard");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
				<div className="p-8">
					<div className="flex flex-col items-center mb-8">
						<MindShare className="h-16 w-16 mb-4" />
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							MindShare
						</h1>
						<p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
							Ideias Colaborativas
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
								Acesse a plataforma
							</h2>

							{error && (
								<div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-200 text-center">
									{error}
								</div>
							)}

							<div className="space-y-4">
								<div>
									<label
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										htmlFor="email"
									>
										E-mail
									</label>
									<input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
										placeholder="seu@email.com"
									/>
								</div>

								<div>
									<label
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
										htmlFor="password"
									>
										Senha
									</label>
									<input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
										placeholder="••••••••"
									/>
								</div>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center shadow-md hover:shadow-lg cursor-pointer"
						>
							{loading ? (
								<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
							) : (
								"Entrar"
							)}
						</button>
					</form>
					
					<div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
						Ainda não tem uma conta?{" "}
						<Link
							to="/register"
							className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
						>
							Cadastre-se
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
