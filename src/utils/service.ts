const API_URL = "http://localhost:3333";

function getHeaders(token?: string) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (token) {
		headers.Authorization = token;
	}
	return headers;
}

export const AuthService = {
	login: (data: { email: string; password: string }) =>
		fetch(`${API_URL}/login`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(data),
		}),
	register: (data: {
		name: string;
		email: string;
		password: string;
	}) =>
		fetch(`${API_URL}/users`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(data),
		}),
};

export const GroupService = {
	createGroup: (
		data: {
			name: string;
			description: string;
			adminId: string;
		},
		token: string,
	) =>
		fetch(`${API_URL}/groups`, {
			method: "POST",
			headers: getHeaders(token),
			body: JSON.stringify(data),
		}),
	getGroupsByUser: (userId: string, token: string) =>
		fetch(`${API_URL}/groups?userId=${userId}`, {
			headers: getHeaders(token),
		}),
	getAllGroups: (token: string) =>
		fetch(`${API_URL}/groups`, {
			headers: getHeaders(token),
		}),
	getGroupUsers: (groupId: string, token: string) =>
		fetch(`${API_URL}/groups/${groupId}/users`, {
			headers: getHeaders(token),
		}),
};

export const IdeaService = {
	getIdeasByGroup: (groupId: string, token: string) =>
		fetch(`${API_URL}/ideas/${groupId}`, {
			headers: getHeaders(token),
		}),
	createIdea: (
		data: {
			title: string;
			description: string;
			authorId: string;
			groupId: string;
		},
		token: string,
	) =>
		fetch(`${API_URL}/ideas`, {
			method: "POST",
			headers: getHeaders(token),
			body: JSON.stringify(data),
		}),
	likeIdea: (ideaId: string, token: string) =>
		fetch(`${API_URL}/ideas/${ideaId}/like`, {
			method: "POST",
			headers: getHeaders(token),
		}),
	commentIdea: (
		ideaId: string,
		data: { content: string },
		token: string,
	) =>
		fetch(`${API_URL}/ideas/${ideaId}/comment`, {
			method: "POST",
			headers: getHeaders(token),
			body: JSON.stringify(data),
		}),
};

export const UserService = {
	getUserById: (userId: string, token: string) =>
		fetch(`${API_URL}/users/${userId}`, {
			headers: getHeaders(token),
		}),
	getUserByIdQuery: (userId: string, token: string) =>
		fetch(`${API_URL}/users?id=${userId}`, {
			headers: getHeaders(token),
		}),
	getUserByEmail: (email: string, token?: string) =>
		fetch(
			`${API_URL}/users?email=${encodeURIComponent(email)}`,
			{ headers: getHeaders(token) },
		),
};

export const InviteService = {
	getInvitesByUser: (userId: string, token: string) =>
		fetch(`${API_URL}/invites/user/${userId}`, {
			headers: getHeaders(token),
		}),
	sendInvite: (
		data: {
			receiverId: string;
			groupId: string | undefined;
			senderId: string;
		},
		token: string,
	) =>
		fetch(`${API_URL}/invites`, {
			method: "POST",
			headers: getHeaders(token),
			body: JSON.stringify(data),
		}),
	replyInvite: (
		inviteId: string,
		status: "ACCEPTED" | "DECLINED",
		token: string,
	) =>
		fetch(`${API_URL}/invites/${inviteId}`, {
			method: "PUT",
			headers: getHeaders(token),
			body: JSON.stringify({ status }),
		}),
};
