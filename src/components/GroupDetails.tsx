import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CloseIcon } from "../assets/close";
import { CommentsIcon } from "../assets/comments";
import { LikeIcon } from "../assets/like";
import { TrashIcon } from "../assets/trash";
import type { Group } from "../types/group";
import type { Idea } from "../types/ideas";
import type { User } from "../types/user";
import { decodeJwt } from "../utils/function";
import {
	GroupService,
	IdeaService,
	InviteService,
	UserService,
} from "../utils/service";
import { CommentsModal } from "./CommentsModal";
import { CreateIdeaModal } from "./CreateIdeaModal";
import { Header } from "./Header";
import { Loading } from "./Loading";

export function GroupDetails() {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();
	const token = localStorage.getItem("token") || "";

	const [group, setGroup] = useState<Group | null>(null);
	const [groupName, setGroupName] = useState(
		"Carregando grupo...",
	);
	const [ideas, setIdeas] = useState<Idea[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviting, setInviting] = useState(false);
	const [likingIdeaId, setLikingIdeaId] = useState<
		string | null
	>(null);
	const [isCreateIdeaModalOpen, setIsCreateIdeaModalOpen] =
		useState(false);
	const [activeCommentIdeaId, setActiveCommentIdeaId] =
		useState<string | null>(null);
	const [deletingIdeaId, setDeletingIdeaId] = useState<
		string | null
	>(null);
	const [deletingGroupId, setDeletingGroupId] =
		useState(false);
	const [removingMemberId, setRemovingMemberId] = useState<
		string | null
	>(null);

	const activeCommentIdea = useMemo(() => {
		return (
			ideas.find((i) => i.id === activeCommentIdeaId) ||
			null
		);
	}, [ideas, activeCommentIdeaId]);

	const userId = useMemo(() => {
		if (!token) return null;
		const decoded = decodeJwt(token);
		return decoded?.sub || decoded?.id || decoded?.userId;
	}, [token]);

	const authHeader = token.startsWith("Bearer ")
		? token
		: `Bearer ${token}`;

	const fetchIdeas = useCallback(async () => {
		if (!groupId) return;
		try {
			const res = await IdeaService.getIdeasByGroup(
				groupId,
				authHeader,
			);
			if (res.ok) {
				const data = await res.json();
				setIdeas(data);
			}
		} catch (err) {
			console.error("Erro ao recarregar ideias", err);
		}
	}, [groupId, authHeader]);

	useEffect(() => {
		async function fetchGroupData() {
			try {
				if (!token) {
					navigate("/login");
					return;
				}
				if (!groupId) {
					return;
				}

				setLoading(true);

				await fetchIdeas();

				const usersRes = await GroupService.getGroupUsers(
					groupId,
					authHeader,
				);

				const groupRes = await GroupService.getGroupById(
					groupId,
					authHeader,
				);

				if (groupRes.ok) {
					const currentGroup = await groupRes.json();
					if (currentGroup) {
						setGroup(currentGroup);
						setGroupName(currentGroup.name);
					} else {
						setGroupName("Detalhes do Grupo");
					}
				}

				if (usersRes.ok) {
					const usersData = await usersRes.json();

					const isMember = usersData.some(
						(u: User) => u.id === userId,
					);
					if (!isMember) {
						navigate("/dashboard");
						return;
					}

					setUsers(usersData);
				} else {
					navigate("/dashboard");
					return;
				}
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError(String(err));
				}
			} finally {
				setLoading(false);
			}
		}

		if (groupId) {
			fetchGroupData();
		}
	}, [
		groupId,
		token,
		authHeader,
		navigate,
		userId,
		fetchIdeas,
	]);

	const handleLike = async (ideaId: string) => {
		setLikingIdeaId(ideaId);
		try {
			const res = await IdeaService.likeIdea(
				ideaId,
				authHeader,
			);
			if (res.ok) {
				await fetchIdeas();
			}
		} catch (err) {
			console.error("Erro ao curtir a ideia", err);
		} finally {
			setLikingIdeaId(null);
		}
	};

	const handleInviteUser = async (
		e: React.SubmitEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		if (!inviteEmail.trim() || !userId) return;

		setInviting(true);
		try {
			const usersRes = await UserService.getUserByEmail(
				inviteEmail.trim(),
				authHeader,
			);
			if (!usersRes.ok) {
				throw new Error(
					"Erro ao buscar usuário pelo e-mail",
				);
			}

			const usersData = await usersRes.json();
			if (!usersData || usersData.length === 0) {
				alert("Nenhum usuário encontrado com este e-mail.");
				return;
			}

			const receiverId = usersData[0].id;

			const res = await InviteService.sendInvite(
				{
					receiverId,
					groupId,
					senderId: userId,
				},
				authHeader,
			);

			if (res.ok) {
				alert("Convite enviado com sucesso!");
				setInviteEmail("");
			} else {
				const data = await res.json();
				alert(
					`Erro ao enviar convite: ${data.message || "Erro desconhecido"}`,
				);
			}
		} catch (err) {
			console.error(err);
			alert("Erro ao enviar convite.");
		} finally {
			setInviting(false);
		}
	};

	const handleDeleteGroup = async () => {
		if (!groupId) return;
		const confirmDelete = window.confirm(
			"Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.",
		);
		if (!confirmDelete) return;

		setDeletingGroupId(true);
		try {
			const res = await GroupService.deleteGroup(
				groupId,
				authHeader,
			);
			if (res.ok) {
				navigate("/dashboard");
			} else {
				const data = await res.json();
				alert(
					`Erro ao excluir grupo: ${data.message || data.error || "Erro desconhecido"}`,
				);
			}
		} catch (err) {
			console.error("Erro ao excluir grupo:", err);
			alert("Erro de conexão ao excluir o grupo.");
		} finally {
			setDeletingGroupId(false);
		}
	};

	const handleDeleteIdea = async (ideaId: string) => {
		const confirmDelete = window.confirm(
			"Tem certeza que deseja excluir esta ideia? Esta ação não pode ser desfeita.",
		);
		if (!confirmDelete) return;

		setDeletingIdeaId(ideaId);
		try {
			const res = await IdeaService.deleteIdea(
				ideaId,
				authHeader,
			);
			if (res.ok) {
				await fetchIdeas();
			} else {
				const data = await res.json();
				alert(
					`Erro ao excluir ideia: ${data.message || data.error || "Erro desconhecido"}`,
				);
			}
		} catch (err) {
			console.error("Erro ao excluir ideia:", err);
			alert("Erro de conexão ao excluir a ideia.");
		} finally {
			setDeletingIdeaId(null);
		}
	};

	const handleRemoveMember = async (
		userIdToRemove: string,
	) => {
		if (!groupId || !group) return;

		const member = group.members?.find(
			(m) => m.userId === userIdToRemove,
		);
		if (!member) {
			alert("Membro não encontrado neste grupo.");
			return;
		}

		const confirmRemove = window.confirm(
			"Tem certeza que deseja remover este membro do grupo?",
		);
		if (!confirmRemove) return;

		setRemovingMemberId(userIdToRemove);
		try {
			const res = await GroupService.removeMember(
				groupId,
				member.id,
				authHeader,
			);
			if (res.ok) {
				const usersRes = await GroupService.getGroupUsers(
					groupId,
					authHeader,
				);
				if (usersRes.ok) {
					const usersData = await usersRes.json();
					setUsers(usersData);
				}
				const groupRes = await GroupService.getGroupById(
					groupId,
					authHeader,
				);
				if (groupRes.ok) {
					const currentGroup = await groupRes.json();
					if (currentGroup) {
						setGroup(currentGroup);
					}
				}
			} else {
				const data = await res.json();
				alert(
					`Erro ao remover membro: ${data.message || "Erro desconhecido"}`,
				);
			}
		} catch (err) {
			console.error("Erro ao remover membro:", err);
			alert("Erro de conexão ao remover o membro.");
		} finally {
			setRemovingMemberId(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<Header groupName={groupName} />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{error && (
					<div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200 text-sm">
						{error}
					</div>
				)}

				{loading ? (
					<Loading
						layout="block"
						size="lg"
						color="indigo"
						text="Carregando grupo e ideias..."
					/>
				) : (
					<div className="flex flex-col lg:flex-row gap-8">
						<div className="flex-1 space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									Ideias do Grupo
								</h2>
								<button
									type="button"
									onClick={() =>
										setIsCreateIdeaModalOpen(true)
									}
									className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm hover:shadow-md"
								>
									+ Nova Ideia
								</button>
							</div>

							{ideas.length === 0 ? (
								<div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
									<p className="text-gray-500 dark:text-gray-400">
										Nenhuma ideia foi compartilhada neste
										grupo ainda.
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{ideas.map((idea) => {
										const isLikedByMe = idea.likes?.some(
											(like) => like.userId === userId,
										);
										const author = users.find(
											(u) => u.id === idea.authorId,
										);
										const authorName = author
											? author.name
											: "Autor desconhecido";

										return (
											<div
												key={idea.id}
												className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
											>
												<div className="flex justify-between items-start mb-4">
													<h3 className="font-semibold text-xl text-gray-900 dark:text-white">
														{idea.title}
													</h3>
													<span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
														Por: {authorName}
													</span>
												</div>
												<p className="text-gray-600 dark:text-gray-300 text-sm mb-6 whitespace-pre-wrap">
													{idea.description}
												</p>

												<div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
													<button
														type="button"
														onClick={() =>
															handleLike(idea.id)
														}
														disabled={
															likingIdeaId === idea.id
														}
														className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
															isLikedByMe
																? "text-indigo-600 dark:text-indigo-400"
																: "text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
														}`}
													>
														{likingIdeaId === idea.id ? (
															<Loading
																size="md"
																color="indigo"
															/>
														) : (
															<LikeIcon
																className="w-5 h-5"
																fill={
																	isLikedByMe
																		? "currentColor"
																		: "none"
																}
															/>
														)}
														Curtir{" "}
														{idea.likes?.length > 0 &&
															`(${idea.likes.length})`}
													</button>

													<button
														type="button"
														onClick={() =>
															setActiveCommentIdeaId(
																idea.id,
															)
														}
														className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
													>
														<CommentsIcon className="w-5 h-5" />
														Comentários{" "}
														{idea.comments?.length > 0 &&
															`(${idea.comments.length})`}
													</button>

													{(idea.authorId === userId ||
														group?.adminId === userId) && (
														<button
															type="button"
															disabled={
																deletingIdeaId === idea.id
															}
															onClick={() =>
																handleDeleteIdea(idea.id)
															}
															className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors cursor-pointer ml-auto disabled:opacity-75 disabled:cursor-not-allowed"
														>
															{deletingIdeaId ===
															idea.id ? (
																<Loading
																	size="sm"
																	color="red"
																/>
															) : (
																<TrashIcon className="w-5 h-5" />
															)}
															{deletingIdeaId === idea.id
																? "Excluindo..."
																: "Excluir"}
														</button>
													)}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>

						<aside className="lg:w-80 space-y-6 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700 lg:border-t-0 lg:pt-0 lg:mt-0 lg:border-l lg:pl-8 shrink-0">
							{group?.adminId === userId && (
								<div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900 shadow-sm mb-6">
									<h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-3 text-sm uppercase tracking-wider">
										Painel do Admin
									</h3>
									<form
										onSubmit={handleInviteUser}
										className="space-y-3"
									>
										<div>
											<label
												htmlFor="inviteEmail"
												className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
											>
												E-mail do Usuário
											</label>
											<input
												id="inviteEmail"
												type="email"
												value={inviteEmail}
												onChange={(e) =>
													setInviteEmail(e.target.value)
												}
												placeholder="usuario@email.com"
												className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
												required
											/>
										</div>
										<button
											type="submit"
											disabled={inviting}
											className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-9"
										>
											{inviting ? (
												<Loading size="sm" color="white" />
											) : (
												"Enviar Convite"
											)}
										</button>
									</form>
									<div className="mt-4 pt-4 border-t border-gray-150 dark:border-gray-700">
										<button
											type="button"
											disabled={deletingGroupId}
											onClick={handleDeleteGroup}
											className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium py-2 rounded-lg text-sm transition-colors cursor-pointer border border-red-200 dark:border-red-900/50 flex justify-center items-center gap-2 h-9 disabled:opacity-75 disabled:cursor-not-allowed"
										>
											{deletingGroupId ? (
												<Loading size="sm" color="red" />
											) : (
												<TrashIcon className="w-4 h-4" />
											)}
											{deletingGroupId
												? "Excluindo..."
												: "Excluir Grupo"}
										</button>
									</div>
								</div>
							)}

							<h3 className="text-xl font-bold text-gray-900 dark:text-white">
								Membros do Grupo
							</h3>

							<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
								{users.length === 0 ? (
									<div className="p-6 text-center text-gray-500 text-sm">
										Nenhum usuário encontrado.
									</div>
								) : (
									<ul className="divide-y divide-gray-100 dark:divide-gray-700">
										{users.map((user) => (
											<li
												key={user.id}
												className="p-4 flex items-center gap-3"
											>
												<div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
													{user.name
														.charAt(0)
														.toUpperCase()}
												</div>
												<div className="overflow-hidden">
													<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
														{user.name}
													</p>
													<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
														{user.email}
													</p>
												</div>
												{user.role === "ADMIN" ? (
													<span className="ml-auto text-[10px] font-bold uppercase bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full">
														Admin
													</span>
												) : (
													group?.adminId === userId && (
														<button
															type="button"
															disabled={
																removingMemberId === user.id
															}
															onClick={() =>
																handleRemoveMember(user.id)
															}
															className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-55 shrink-0"
															title="Remover membro do grupo"
														>
															{removingMemberId ===
															user.id ? (
																<Loading
																	size="sm"
																	color="red"
																/>
															) : (
																<CloseIcon className="w-5 h-5" />
															)}
														</button>
													)
												)}
											</li>
										))}
									</ul>
								)}
							</div>
						</aside>
					</div>
				)}

				<CreateIdeaModal
					isOpen={isCreateIdeaModalOpen}
					onClose={() => setIsCreateIdeaModalOpen(false)}
					groupId={groupId || ""}
					userId={userId || ""}
					authHeader={authHeader}
					onSuccess={() => {
						setIsCreateIdeaModalOpen(false);
						fetchIdeas();
					}}
				/>

				<CommentsModal
					isOpen={!!activeCommentIdeaId}
					onClose={() => setActiveCommentIdeaId(null)}
					idea={activeCommentIdea}
					authHeader={authHeader}
					users={users}
					onSuccess={fetchIdeas}
				/>
			</main>
		</div>
	);
}
