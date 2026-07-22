import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";
import { Achievements } from "./components/Achievements";
import { Dashboard } from "./components/Dashboard";
import { GroupDetails } from "./components/GroupDetails";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

const ProtectedRoute = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const token = localStorage.getItem("token");
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	return <>{children}</>;
};

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={<Navigate to="/dashboard" replace />}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/group/:groupId"
					element={
						<ProtectedRoute>
							<GroupDetails />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/achievements"
					element={
						<ProtectedRoute>
							<Achievements />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
