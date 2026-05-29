import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Group } from "../types/group";
import type { Invite } from "../types/invite";
import { decodeJwt } from "../utils/function";
import {
	GroupService,
	InviteService,
} from "../utils/service";
import { CreateGroupModal } from "./CreateGroupModal";
import { Header } from "./Header";
import { Loading } from "./Loading";

export function Dashboard() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token") || "";

	const [groups, setGroups] = useState<Group[]>([]);
	const [invites, setInvites] = useState<Invite[]>([]);
	const [inviteGroupNames, setInviteGroupNames] = useState<
		Record<string, string>
	>({});
	const [loading, setLoading] = useState(true);
	const [processingInviteId, setProcessingInviteId] =
		useState<string | null>(null);
	const [error, setError] = useState("");
	const [
		isCreateGroupModalOpen,
		setIsCreateGroupModalOpen,
	] = useState(false);

	const userId = useMemo(() => {
		if (!token) return null;
		const decoded = decodeJwt(token);
		return decoded?.sub || decoded?.id || decoded?.userId;
	}, [token]);

	const authHeader = token.startsWith("Bearer ")
		? token
		: `Bearer ${token}`;

	const fetchGroups = useCallback(async () => {
		if (!userId) return;
		const res = await GroupService.getGroupsByUser(
			userId,
			authHeader,
		);
		if (!res.ok) {
			throw new Error("Erro ao carregar os grupos");
		}
		const data = await res.json();
		setGroups(data);
	}, [userId, authHeader]);

	useEffect(() => {
		async function fetchData() {
			try {
				if (!token) {
					navigate("/login");
					return;
				}

				setLoading(true);
				setError("");

				// Fetch Groups
				await fetchGroups();

				// Fetch Invites if userId is known
				if (userId) {
					const invitesRes =
						await InviteService.getInvitesByUser(
							userId,
							authHeader,
							"PENDING",
						);

					if (invitesRes.ok) {
						const invitesData = await invitesRes.json();
						setInvites(invitesData);

						const uniqueGroupIds = Array.from(
							new Set(
								invitesData.map(
									(inv: Invite) => inv.groupId,
								),
							),
						);

						if (uniqueGroupIds.length > 0) {
							const groupPromises = uniqueGroupIds.map(
								(id) =>
									GroupService.getGroupById(
										id as string,
										authHeader,
									)
										.then((res) =>
											res.ok ? res.json() : null,
										)
										.catch(() => null),
							);
							const groupsDetails =
								await Promise.all(groupPromises);

							const namesMap: Record<string, string> = {};
							groupsDetails.forEach((g: Group | null) => {
								if (g?.id) {
									namesMap[g.id] = g.name;
								}
							});
							setInviteGroupNames(namesMap);
						}
					}
				}
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
					if (
						err.message.includes("401") ||
						err.message.toLowerCase().includes("token")
					) {
						localStorage.removeItem("token");
						localStorage.removeItem("user");
						navigate("/login");
					}
				} else {
					setError("An unknown error occurred");
				}
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [token, authHeader, navigate, userId, fetchGroups]);

	const handleInviteReply = async (
		inviteId: string,
		status: "ACCEPTED" | "DECLINED",
	) => {
		setProcessingInviteId(inviteId);
		try {
			const res = await InviteService.replyInvite(
				inviteId,
				status,
				authHeader,
			);

			if (res.ok) {
				setInvites((prev) =>
					prev.filter((inv) => inv.id !== inviteId),
				);
				if (status === "ACCEPTED") {
					await fetchGroups();
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
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{error && (
					<div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200 text-sm">
						{error}
					</div>
				)}

				{loading ? (
					<Loading layout="block" size="lg" color="indigo" text="Carregando seus grupos..." />
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									Meus Grupos
								</h2>
								<button
									type="button"
									onClick={() =>
										setIsCreateGroupModalOpen(true)
									}
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
											className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col"
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
									{invites.map((invite) => (
										<div
											key={invite.id}
											className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3"
										>
											<p className="text-sm text-gray-800 dark:text-gray-200">
												Você foi convidado para o grupo{" "}
												<span className="font-semibold text-indigo-600 dark:text-indigo-400">
													{inviteGroupNames[invite.groupId]}
												</span>
											</p>
											<div className="flex gap-2 mt-1">
												<button
													type="button"
													disabled={
														processingInviteId === invite.id
													}
													onClick={() =>
														handleInviteReply(
															invite.id,
															"ACCEPTED",
														)
													}
													className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-8"
												>
													{processingInviteId ===
													invite.id ? (
														<Loading size="sm" color="white" />
													) : (
														"Aceitar"
													)}
												</button>
												<button
													type="button"
													disabled={
														processingInviteId === invite.id
													}
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
									))}
								</div>
							)}
						</div>
					</div>
				)}

				<CreateGroupModal
					isOpen={isCreateGroupModalOpen}
					onClose={() => setIsCreateGroupModalOpen(false)}
					userId={userId || ""}
					authHeader={authHeader}
					onSuccess={async () => {
						setIsCreateGroupModalOpen(false);
						try {
							await fetchGroups();
						} catch (err) {
							console.error(
								"Erro ao atualizar grupos",
								err,
							);
						}
					}}
				/>
			</main>
		</div>
	);
}
