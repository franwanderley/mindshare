import { useState } from "react";
import type { Idea } from "../types/ideas";
import type { User } from "../types/user";

interface CommentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	idea: Idea | null;
	authHeader: string;
	users: User[];
	onSuccess: () => void;
}

export function CommentsModal({
	isOpen,
	onClose,
	idea,
	authHeader,
	users,
	onSuccess,
}: CommentsModalProps) {
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen || !idea) return null;

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		setIsSubmitting(true);
		try {
			const res = await fetch(
				`http://localhost:3333/ideas/${idea.id}/comment`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: authHeader,
					},
					body: JSON.stringify({ content: newComment }),
				},
			);

			if (res.ok) {
				setNewComment("");
				onSuccess();
			} else {
				const data = await res.json();
				alert(
					`Erro ao adicionar comentário: ${
						data.error ||
						data.message ||
						"Erro desconhecido"
					}`,
				);
			}
		} catch (err) {
			console.error("Erro ao adicionar comentário", err);
			alert("Erro ao adicionar comentário");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
				<div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-gray-700 shrink-0">
					<div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white">
							{idea.title}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
							{idea.description}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer shrink-0 ml-4 mt-1"
					>
						<svg
							aria-hidden="true"
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>

				<div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 shrink-0">
					<h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
						Comentários
					</h4>
				</div>

				<div className="p-6 overflow-y-auto flex-1 space-y-4">
					{!idea.comments || idea.comments.length === 0 ? (
						<p className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
							Nenhum comentário ainda. Seja o primeiro a
							comentar!
						</p>
					) : (
						idea.comments.map((comment) => {
							const author = users.find(
								(u) => u.id === comment.authorId,
							);
							const authorName = author
								? author.name
								: "Autor desconhecido";
							return (
								<div
									key={comment.id}
									className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
								>
									<div className="flex items-center justify-between mb-2">
										<span className="font-semibold text-sm text-gray-900 dark:text-white">
											{authorName}
										</span>
									</div>
									<p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
										{comment.content}
									</p>
								</div>
							);
						})
					)}
				</div>

				<form
					onSubmit={handleAddComment}
					className="p-6 border-t border-gray-100 dark:border-gray-700 shrink-0 bg-gray-50 dark:bg-gray-800/50"
				>
					<div className="flex gap-3">
						<input
							type="text"
							value={newComment}
							onChange={(e) =>
								setNewComment(e.target.value)
							}
							placeholder="Escreva um comentário..."
							className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
							required
						/>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-4 py-2 text- cursor-pointer font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
						>
							{isSubmitting ? (
								<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
							) : (
								"Enviar"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
