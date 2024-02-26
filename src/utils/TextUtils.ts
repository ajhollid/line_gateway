const STATUS_LOOKUP = new Map([
  ["resolved", "✅"],
  ["firing", "🚨"],
  ["default", "❔"],
]);

const SEVERITY_LOOKUP = new Map([
  ["none", "🔵"],
  ["warning", "🟡"],
  ["critical", "🔴"],
  ["default", "⚪"],
]);

const severityColorLookup = (severity: string): string => {
  return SEVERITY_LOOKUP.has(severity)
    ? SEVERITY_LOOKUP.get(severity)
    : SEVERITY_LOOKUP.get("default");
};

const statusLookup = (status: string) => {
  console.log("WHAT: ", status);
  return STATUS_LOOKUP.has(status)
    ? STATUS_LOOKUP.get(status)
    : STATUS_LOOKUP.get("default");
};

const buildBoldLog = (msg: string): string => {
  const str = new Array(msg.length + 1).join("*");
  return "\n" + str + "\n" + msg + "\n" + str + "\n";
};

export default { severityColorLookup, statusLookup, buildBoldLog };
