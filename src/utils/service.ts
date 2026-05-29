const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

function getHeaders(token?: string) {
	const headers: Record<string, string> = {};
	if (token) {
		headers.Authorization = token;
	}
	return headers;
}

export const AuthService = {
	login: (data: { email: string; password: string }) =>
		fetch(`${API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...getHeaders(),
			},
			body: JSON.stringify(data),
		}),
	register: (data: {
		name: string;
		email: string;
		password: string;
	}) =>
		fetch(`${API_URL}/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...getHeaders(),
			},
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
			headers: {
				"Content-Type": "application/json",
				...getHeaders(token),
			},
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
	getGroupById: (groupId: string, token: string) =>
		fetch(`${API_URL}/groups/${groupId}`, {
			headers: getHeaders(token),
		}),
	getGroupUsers: (groupId: string, token: string) =>
		fetch(`${API_URL}/groups/${groupId}/users`, {
			headers: getHeaders(token),
		}),
	deleteGroup: (groupId: string, token: string) =>
		fetch(`${API_URL}/groups/${groupId}`, {
			method: "DELETE",
			headers: getHeaders(token),
		}),
	removeMember: (groupId: string, memberId: string, token: string) =>
		fetch(`${API_URL}/groups/${groupId}/members/${memberId}`, {
			method: "PATCH",
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
			headers: {
				"Content-Type": "application/json",
				...getHeaders(token),
			},
			body: JSON.stringify(data),
		}),
	likeIdea: (ideaId: string, token: string) =>
		fetch(`${API_URL}/ideas/${ideaId}/like`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...getHeaders(token),
			},
			body: JSON.stringify({}),
		}),
	commentIdea: (
		ideaId: string,
		data: { content: string },
		token: string,
	) =>
		fetch(`${API_URL}/ideas/${ideaId}/comment`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...getHeaders(token),
			},
			body: JSON.stringify(data),
		}),
	deleteIdea: (ideaId: string, token: string) =>
		fetch(`${API_URL}/ideas/${ideaId}`, {
			method: "DELETE",
			headers: getHeaders(token),
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
	getInvitesByUser: (
		userId: string,
		token: string,
		status?: "PENDING" | "ACCEPTED" | "DECLINED",
	) => {
		const url = status
			? `${API_URL}/invites/user/${userId}?status=${status}`
			: `${API_URL}/invites/user/${userId}`;
		return fetch(url, {
			headers: getHeaders(token),
		});
	},
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
			headers: {
				"Content-Type": "application/json",
				...getHeaders(token),
			},
			body: JSON.stringify(data),
		}),
	replyInvite: (
		inviteId: string,
		status: "ACCEPTED" | "DECLINED",
		token: string,
	) =>
		fetch(`${API_URL}/invites/${inviteId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...getHeaders(token),
			},
			body: JSON.stringify({ status }),
		}),
};
