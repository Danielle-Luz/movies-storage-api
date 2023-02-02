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

interface iParamCheck {
  idealValues: string[] | number[];
  dependsOn?: string;
  paramValueType?: "number";
}

export interface iParamCheckGroup {
  [key: string]: iParamCheck;
}

export interface iCount {
  count: number;
}

export interface iPagination {
  previousPage: string | null;
  nextPage: string | null;
  count: number;
  data: iMovie[];
}

export type tCreateMovie = Omit<iMovie, "id">;
