export default interface Annotation {
  [key: string]: string;
}

export function isAnnotation(object: any): object is Annotation {
  return (
    object &&
    typeof object === "object" &&
    Object.values(object).every((value) => typeof value === "string")
  );
}
