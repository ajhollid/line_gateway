import Labels from "./Labels";
import Annotations from "./Annotations";
export default interface Alert {
  status: string;
  labels: Labels;
  annotations: Annotations;
}
