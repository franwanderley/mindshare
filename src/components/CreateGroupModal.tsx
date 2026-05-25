import { useState } from "react";
import { GroupService } from "../utils/service";

interface CreateGroupModalProps {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
	authHeader: string;
	onSuccess: () => void;
}

export function CreateGroupModal({
	isOpen,
	onClose,
	userId,
	authHeader,
	onSuccess,
}: CreateGroupModalProps) {
	const [newGroupName, setNewGroupName] = useState("");
	const [newGroupDescription, setNewGroupDescription] =
		useState("");
	const [creatingGroup, setCreatingGroup] = useState(false);

	if (!isOpen) return null;

	const handleCreateGroup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newGroupName.trim() || !userId) return;

		setCreatingGroup(true);
		try {
			const res = await GroupService.createGroup(
				{
					name: newGroupName,
					description: newGroupDescription,
					adminId: userId,
				},
				authHeader,
			);

			if (res.ok) {
				setNewGroupName("");
				setNewGroupDescription("");
				onSuccess();
			} else {
				const data = await res.json();
				alert(
					`Erro ao criar grupo: ${data.error || data.message || "Erro desconhecido"}`,
				);
			}
		} catch (err) {
			console.error(err);
			alert("Erro ao criar grupo.");
		} finally {
			setCreatingGroup(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
				<div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
					<h3 className="text-xl font-bold text-gray-900 dark:text-white">
						Novo Grupo
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors cursor-pointer"
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

				<form
					onSubmit={handleCreateGroup}
					className="p-6 space-y-4"
				>
					<div>
						<label
							htmlFor="groupName"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Nome do Grupo
						</label>
						<input
							id="groupName"
							type="text"
							value={newGroupName}
							onChange={(e) =>
								setNewGroupName(e.target.value)
							}
							placeholder="Ex: Projeto Integrador"
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="groupDescription"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Descrição (Opcional)
						</label>
						<textarea
							id="groupDescription"
							rows={3}
							value={newGroupDescription}
							onChange={(e) =>
								setNewGroupDescription(e.target.value)
							}
							placeholder="Sobre o que é este grupo?"
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
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
							disabled={creatingGroup}
							className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer min-w-[100px]"
						>
							{creatingGroup ? (
								<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
							) : (
								"Criar Grupo"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
