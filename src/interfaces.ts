export interface iMovie {
    id: number;
	name: string;
	description: string;
	duration: number;
	price: number;
}

export interface iMessage {
	message: string;
}

export type tCreateMovie = Omit<iMovie, "id">;