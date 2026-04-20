import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MindShare } from "../assets/mindshare";
import type { Group } from "../types/group";
import type { Invite } from "../types/invite";
import { decodeJwt } from "../utils/function";

export function Dashboard() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token") || "";

	const [groups, setGroups] = useState<Group[]>([]);
	const [invites, setInvites] = useState<Invite[]>([]);
	const [inviteGroupNames, setInviteGroupNames] = useState<
		Record<string, string>
	>({});
	const [loading, setLoading] = useState(true);
	const [processingInviteId, setProcessingInviteId] = useState<string | null>(null);
	const [error, setError] = useState("");

	const authHeader = token.startsWith("Bearer ")
		? token
		: `Bearer ${token}`;

	const handleLogout = useCallback(() => {
		localStorage.removeItem("token");
		navigate("/login");
	}, [navigate]);

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
				const userId =
					decoded?.sub || decoded?.id || decoded?.userId;

				// Fetch Groups
				const groupsRes = await fetch(
					`http://localhost:3333/groups?userId=${userId}`,
					{
						headers: { Authorization: authHeader },
					},
				);

				if (!groupsRes.ok) {
					throw new Error("Erro ao carregar os grupos");
				}

				const groupsData = await groupsRes.json();
				setGroups(groupsData);

				// Fetch All Groups para podermos pegar o nome do grupo do convite
				const allGroupsRes = await fetch(
					"http://localhost:3333/groups",
					{
						headers: { Authorization: authHeader },
					},
				);
				if (allGroupsRes.ok) {
					const allGroupsData = await allGroupsRes.json();
					const namesMap: Record<string, string> = {};
					allGroupsData.forEach((g: Group) => {
						namesMap[g.id] = g.name;
					});
					setInviteGroupNames(namesMap);
				}

				// Fetch Invites if userId is known
				if (userId) {
					const invitesRes = await fetch(
						`http://localhost:3333/invites/user/${userId}`,
						{
							headers: { Authorization: authHeader },
						},
					);

					if (invitesRes.ok) {
						const invitesData = await invitesRes.json();
						setInvites(invitesData);
					}
				}
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
					if (
						err.message.includes("401") ||
						err.message.toLowerCase().includes("token")
					) {
						handleLogout();
					}
				} else {
					setError("An unknown error occurred");
				}
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [token, authHeader, navigate, handleLogout]);

	const handleInviteReply = async (
		inviteId: string,
		status: "ACCEPTED" | "DECLINED",
	) => {
		setProcessingInviteId(inviteId);
		try {
			const res = await fetch(
				`http://localhost:3333/invites/${inviteId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: authHeader,
					},
					body: JSON.stringify({ status }),
				},
			);

			if (res.ok) {
				setInvites((prev) =>
					prev.filter((inv) => inv.id !== inviteId),
				);
				if (status === "ACCEPTED") {
					const decoded = decodeJwt(token);
					const currentUserId =
						decoded?.sub || decoded?.id || decoded?.userId;

					const groupsRes = await fetch(
						`http://localhost:3333/groups?userId=${currentUserId}`,
						{
							headers: { Authorization: authHeader },
						},
					);
					if (groupsRes.ok)
						setGroups(await groupsRes.json());
				}
			}
		} catch (error) {
			console.error("Erro ao processar convite", error);
		} finally {
			setProcessingInviteId(null);
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
						type="button"
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
								<button
									type="button"
									className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm hover:shadow-md"
								>
									+ Novo Grupo
								</button>
							</div>

							{groups.length === 0 ? (
								<div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
									<p className="text-gray-500 dark:text-gray-400">
										Você ainda não faz parte de nenhum
										grupo.
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
												<span>
													{group.members?.length || 0}{" "}
													membro(s)
												</span>
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
										if (invite.status !== "PENDING")
											return null;

										return (
											<div
												key={invite.id}
												className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3"
											>
												<p className="text-sm text-gray-800 dark:text-gray-200">
													Você foi convidado para o grupo{" "}
													<span className="font-semibold text-indigo-600 dark:text-indigo-400">
														{
															inviteGroupNames[
																invite.groupId
															]
														}
													</span>
												</p>
												<div className="flex gap-2 mt-1">
													<button
														type="button"
														disabled={processingInviteId === invite.id}
														onClick={() =>
															handleInviteReply(
																invite.id,
																"ACCEPTED",
															)
														}
														className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-8"
													>
														{processingInviteId === invite.id ? (
															<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
														) : (
															"Aceitar"
														)}
													</button>
													<button
														type="button"
														disabled={processingInviteId === invite.id}
														onClick={() =>
															handleInviteReply(
																invite.id,
																"DECLINED",
															)
														}
														className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-gray-200 dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-8"
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
