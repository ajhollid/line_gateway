const severityColorLookup = {
  none: () => "🔵",
  warning: () => "🟡",
  critical: () => "🔴",
  default: () => "⚪",
};

const buildBoldLog = (msg) => {
  const str = new Array(msg.length + 1).join("*");
  return "\n" + str + "\n" + msg + "\n" + str + "\n";
};

export { severityColorLookup, buildBoldLog };
