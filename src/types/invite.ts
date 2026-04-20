export interface Invite {
	id: string;
	groupId: string;
	senderId: string;
	receiverId: string;
	status: "PENDING" | "ACCEPTED" | "DECLINED";
}
