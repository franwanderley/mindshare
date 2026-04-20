export interface Idea {
	id: string;
	title: string;
	description: string;
	authorId: string;
	groupId: string;
	createdAt: string;
	comments: Comment[];
	likes: { userId: string }[];
}
