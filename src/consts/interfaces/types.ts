export type ButtonParam = {
  text:string,
  classes:string[]
};
export type Car = {
  id:number,
  color:string,
  name:string
};
export type CarArray = Car[];
export type EngineResp = {
  velocity:number,
  distance:number;
};
export type Winner = {
  id:number,
  time:number,
  wins?:number
};
export type AllInfo = {
  id:number,
  time:number,
  wins?:number,
  rest:Car
};
