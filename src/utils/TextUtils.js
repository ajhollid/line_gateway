const SEVERITY_LOOKUP = new Map([
  ["none", "🔵"],
  ["warning", "🟡"],
  ["critical", "🔴"],
  ["default", "⚪"],
]);

const severityColorLookup = (severity) => {
  return SEVERITY_LOOKUP.get(severity) || SEVERITY_LOOKUP.get("default");
};

const buildBoldLog = (msg) => {
  const str = new Array(msg.length + 1).join("*");
  return "\n" + str + "\n" + msg + "\n" + str + "\n";
};

export default { severityColorLookup, buildBoldLog };
