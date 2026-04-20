export interface Member {
	id: string;
	role: "ADMIN" | "MEMBER";
	userId: string;
	groupId: string;
}
