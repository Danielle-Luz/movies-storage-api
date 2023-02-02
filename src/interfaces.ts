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

export interface iParamCheckGroup {
  [key: string]: iParamCheck;
}

interface iParamCheck {
  idealValues: string[] | number[];
  errorMessage: string;
  dependsOn?: string;
}

export type tCreateMovie = Omit<iMovie, "id">;
