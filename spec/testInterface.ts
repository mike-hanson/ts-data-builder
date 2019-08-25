export interface ITestInterface {
  id: number;
  name: string;
  description: string;
  created: Date;
  children?: Array<ITestInterface>;
}
