import { MindShare } from "./assets/mindshare";

function App() {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-200 text-gray-700">
			<header className="mb-6 flex flex-row items-center justify-center">
				<MindShare className="align-middle w-24 h-20" />
				<div className="flex flex-col ml-1">
					<h1 className="text-2xl font-bold text-purple-600">MindShare</h1>
					<p className="text-center">Ideias colaborativas</p>
				</div>
			</header>
			<div className="bg-white rounded-xl p-6 mb-6 w-full max-w-sm">
				<h2 className="mb-1">Acesse a plataforma</h2>
				<p className="mb-2">Entre usando seu e-mail e senha cadastrados</p>
				<form action="">
					<label className="block mb-1 font-medium" htmlFor="email">E-mail</label>
					<input type="email" name="email" id="email" className="w-full border rounded-xl p-2 mb-3" />
					<label className="block mb-1 font-medium" htmlFor="password">Senha</label>
					<input type="password" name="password" id="password" className="w-full border rounded-xl p-2 mb-3" />
					<button className="bg-indigo-700 w-full text-center text-white rounded-2xl mt-4 cursor-pointer p-4" type="submit">Entrar</button>
				</form>
			</div>
			<div className="bg-white rounded-xl p-6 mb-6 w-full max-w-sm">
				<h3>Ainda não tem uma conta?</h3>
				<p>Cadastre-se gratuitamente</p>
				<button className="bg-gray-200 w-full text-center rounded-2xl p-4 mt-4 cursor-pointer" type="button">Criar Conta</button>
			</div>
		</div>
	);
}

export default App;
