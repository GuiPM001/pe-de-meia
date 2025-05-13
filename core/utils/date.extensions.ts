export {};

declare global {
  interface Date {
    toIsoDateString(): string;
  }
}

Date.prototype.toIsoDateString = function (): string {
  return this.toISOString().split("T")[0];
};
