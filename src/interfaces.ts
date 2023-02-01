export interface iMovie {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
	[key: string]: number | string;
}

export interface iMessage {
  message: string;
}

export type tCreateMovie = Omit<iMovie, "id">;
