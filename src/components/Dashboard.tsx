import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MindShare } from "../assets/mindshare";

// Minimal JWT decode to extract userId safely
function decodeJwt(token: string) {
	try {
		const payload = token.split(".")[1];
		const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		return null;
	}
}

export function Dashboard() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token") || "";
	
	const [groups, setGroups] = useState<any[]>([]);
	const [invites, setInvites] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	useEffect(() => {
		async function fetchData() {
			try {
				if (!token) {
					navigate("/login");
					return;
				}

				setLoading(true);
				setError("");

				// Decode token to find user ID
				const decoded = decodeJwt(token);
				const userId = decoded?.sub || decoded?.id || decoded?.userId;

				// Fetch Groups
				const groupsRes = await fetch("http://localhost:3333/groups", {
					headers: { Authorization: authHeader },
				});

				if (!groupsRes.ok) {
					throw new Error("Erro ao carregar os grupos");
				}

				const groupsData = await groupsRes.json();
				setGroups(groupsData);

				// Fetch Invites if userId is known
				if (userId) {
					const invitesRes = await fetch(
						`http://localhost:3333/invites/user/${userId}`,
						{
							headers: { Authorization: authHeader },
						}
					);

					if (invitesRes.ok) {
						const invitesData = await invitesRes.json();
						setInvites(invitesData);
					}
				}
			} catch (err: any) {
				setError(err.message);
				if (err.message.includes("401") || err.message.toLowerCase().includes("token")) {
					handleLogout();
				}
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [token, authHeader, navigate]);

	const handleInviteReply = async (inviteId: string, status: "ACCEPTED" | "DECLINED") => {
		try {
			const res = await fetch(`http://localhost:3333/invites/${inviteId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: authHeader,
				},
				body: JSON.stringify({ status }),
			});

			if (res.ok) {
				// Remove invite from list and refresh groups if accepted
				setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
				if (status === "ACCEPTED") {
					const groupsRes = await fetch("http://localhost:3333/groups", {
						headers: { Authorization: authHeader },
					});
					if (groupsRes.ok) setGroups(await groupsRes.json());
				}
			}
		} catch (error) {
			console.error("Erro ao responder convite", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<MindShare className="h-10 w-10" />
						<h1 className="text-xl font-bold text-gray-900 dark:text-white">
							MindShare
						</h1>
					</div>
					<button
						onClick={handleLogout}
						className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
					>
						Sair
					</button>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{error && (
					<div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200 text-sm">
						{error}
					</div>
				)}

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Grupos */}
						<div className="lg:col-span-2 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									Meus Grupos
								</h2>
								<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm hover:shadow-md">
									+ Novo Grupo
								</button>
							</div>

							{groups.length === 0 ? (
								<div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
									<p className="text-gray-500 dark:text-gray-400">
										Você ainda não faz parte de nenhum grupo.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{groups.map((group) => (
										<Link
											to={`/group/${group.id}`}
											key={group.id}
											className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col block"
										>
											<h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
												{group.name}
											</h3>
											{group.description && (
												<p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
													{group.description}
												</p>
											)}
											<div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
												<span>{group.members?.length || 0} membro(s)</span>
												<span className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300">
													Ver Ideias &rarr;
												</span>
											</div>
										</Link>
									))}
								</div>
							)}
						</div>

						{/* Convites */}
						<div className="space-y-6 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700 lg:border-t-0 lg:pt-0 lg:mt-0 lg:border-l lg:pl-8">
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Convites Pendentes
							</h2>

							{invites.length === 0 ? (
								<div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
									<p className="text-gray-500 dark:text-gray-400 text-sm">
										Você não tem nenhum convite pendente.
									</p>
								</div>
							) : (
								<div className="space-y-3">
									{invites.map((invite) => {
										// Apenas exibe se for pendente
										if (invite.status !== "PENDING") return null;
										
										return (
											<div
												key={invite.id}
												className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3"
											>
												<p className="text-sm text-gray-800 dark:text-gray-200">
													Você foi convidado para o grupo{" "}
													<span className="font-semibold text-indigo-600 dark:text-indigo-400">
														{invite.groupId.substring(0, 8)}...
													</span>
												</p>
												<div className="flex gap-2 mt-1">
													<button
														onClick={() => handleInviteReply(invite.id, "ACCEPTED")}
														className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
													>
														Aceitar
													</button>
													<button
														onClick={() => handleInviteReply(invite.id, "DECLINED")}
														className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-gray-200 dark:border-gray-600"
													>
														Recusar
													</button>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
