import {v4} from "uuid";


export type UUID = string;

export const uuid = (): UUID => (v4());
