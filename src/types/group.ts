import type { Member } from "./Member";

export interface Group {
	id: string;
	name: string;
	description: string | null;
	adminId: string;
	createdAt: string;
	members: Member[];
}
