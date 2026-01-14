export type RegisterRequest = {
  email: string;
  name: string;
  savingTarget: number | undefined;
  dailyCost: number | undefined;
}