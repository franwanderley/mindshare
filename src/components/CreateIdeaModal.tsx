import { useState } from "react";
import { CloseIcon } from "../assets/close";
import { IdeaService } from "../utils/service";
import { Loading } from "./Loading";


interface CreateIdeaModalProps {
	isOpen: boolean;
	onClose: () => void;
	groupId: string;
	userId: string;
	authHeader: string;
	onSuccess: () => void;
}

export function CreateIdeaModal({
	isOpen,
	onClose,
	groupId,
	userId,
	authHeader,
	onSuccess,
}: CreateIdeaModalProps) {
	const [newIdeaTitle, setNewIdeaTitle] = useState("");
	const [newIdeaDescription, setNewIdeaDescription] =
		useState("");
	const [creatingIdea, setCreatingIdea] = useState(false);

	if (!isOpen) return null;

	const handleCreateIdea = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!newIdeaTitle.trim() ||
			!newIdeaDescription.trim() ||
			!userId
		)
			return;

		setCreatingIdea(true);
		try {
			const res = await IdeaService.createIdea(
				{
					title: newIdeaTitle,
					description: newIdeaDescription,
					authorId: userId,
					groupId,
				},
				authHeader,
			);

			if (res.ok) {
				setNewIdeaTitle("");
				setNewIdeaDescription("");
				onSuccess();
			} else {
				const data = await res.json();
				alert(
					`Erro ao criar ideia: ${data.error || data.message || "Erro desconhecido"}`,
				);
			}
		} catch (err) {
			console.error(err);
			alert("Erro ao criar ideia.");
		} finally {
			setCreatingIdea(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
				<div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						Nova Ideia
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
					>
						<CloseIcon className="w-6 h-6" />
					</button>
				</div>

				<form
					onSubmit={handleCreateIdea}
					className="p-6 space-y-4"
				>
					<div>
						<label
							htmlFor="ideaTitle"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Título da Ideia
						</label>
						<input
							id="ideaTitle"
							type="text"
							value={newIdeaTitle}
							onChange={(e) =>
								setNewIdeaTitle(e.target.value)
							}
							placeholder="Dê um título curto e claro"
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="ideaDescription"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Descrição Detalhada
						</label>
						<textarea
							id="ideaDescription"
							rows={4}
							value={newIdeaDescription}
							onChange={(e) =>
								setNewIdeaDescription(e.target.value)
							}
							placeholder="Descreva sua ideia, como ela funciona, por que ela é importante..."
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
							required
						></textarea>
					</div>

					<div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-6">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={creatingIdea}
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer min-w-25"
						>
							{creatingIdea ? (
								<Loading size="md" color="white" />
							) : (
								"Compartilhar"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
