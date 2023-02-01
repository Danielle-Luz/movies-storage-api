export interface iMovie {
    id: number;
	name: string;
	description: string;
	duration: number;
	price: number;
}

export type iCreateMovie = Omit<iMovie, "id">;