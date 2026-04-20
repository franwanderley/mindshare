import { HeaderLogin } from "./components/HeaderLogin";

function Register() {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-200 text-gray-700">
			<HeaderLogin />
			<div className="bg-white rounded-xl p-6 mb-6 w-full max-w-sm">
				<h2 className="mb-1 font-bold text-2xl">Crie sua conta</h2>
				<p className="mb-4 text-gray-600">
					Informe seu nome, e-mail e senha de acesso
				</p>
				<form action="">
					<label className="block mb-1 font-medium" htmlFor="name">
						Nome
					</label>
					<input
						type="text"
						name="name"
						id="name"
						className="w-full border rounded-xl p-2 mb-3"
						placeholder="Digite seu nome"
					/>
					<label className="block mb-1 font-medium" htmlFor="email">
						E-mail
					</label>
					<input
						type="email"
						name="email"
						id="email"
						className="w-full border rounded-xl p-2 mb-3"
						placeholder="exemplo@mail.com"
					/>
					<label className="block mb-1 font-medium" htmlFor="password">
						Senha
					</label>
					<input
						type="password"
						name="password"
						id="password"
						className="w-full border rounded-xl p-2 mb-3"
						placeholder="Digite sua senha"
					/>
					<button
						className="bg-indigo-700 w-full hover:bg-indigo-800 text-center text-white rounded-2xl mt-4 cursor-pointer p-4"
						type="submit"
					>
						Criar Conta
					</button>
				</form>
			</div>
			<div className="bg-white rounded-xl p-6 mb-6 w-full max-w-sm">
				<h3 className="mb-1 font-bold text-xl">Já tem uma conta?</h3>
				<p className="text-gray-600 mb-4">Entre agora mesmo</p>
				<button
					className="bg-gray-200 w-full hover:bg-gray-300 text-center rounded-2xl p-4 mt-4 cursor-pointer"
					type="button"
				>
					Acessar Conta
				</button>
			</div>
		</div>
	);
}

export default Register;
