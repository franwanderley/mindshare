import { MindShare } from "../assets/mindshare";

export function HeaderLogin() {
	return (
		<header className="mb-6 flex flex-row items-center justify-center">
			<MindShare className="align-middle w-24 h-20" />
			<div className="flex flex-col ml-1">
				<h1 className="text-2xl font-bold text-purple-600">
					MindShare
				</h1>
				<p className="text-center text-gray-600">
					Ideias colaborativas
				</p>
			</div>
		</header>
	);
}
