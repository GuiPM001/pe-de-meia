export {};

declare global {
  interface Date {
    toISODateString(): string;
  }
}

Date.prototype.toISODateString = function (): string {
  const year = this.getFullYear();
  const month = String(this.getMonth() + 1).padStart(2, "0");
  const day = String(this.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
