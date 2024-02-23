export default interface Label {
  [key: string]: string;
}

export function isLabel(object: any): object is Label {
  return (
    object &&
    typeof object === "object" &&
    Object.values(object).every((value) => typeof value === "string")
  );
}
