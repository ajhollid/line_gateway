import Labels, { isLabel } from "./Labels.js";
import Annotations, { isAnnotation } from "./Annotations.js";
export default interface Alert {
  status: string;
  labels: Labels;
  annotations: Annotations;
}

export function isAlert(object: any): object is Alert {
  return (
    object &&
    typeof object === "object" &&
    "status" in object &&
    typeof object.status === "string" &&
    "labels" in object &&
    isLabel(object.labels) &&
    "annotations" in object &&
    isAnnotation(object.annotations)
  );
}
