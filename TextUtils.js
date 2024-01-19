const severityColorLookup = {
  none: () => "🔵 ",
  warning: () => "🟡 ",
  critical: () => "🔴 ",
  default: () => "⚪ ",
};

const buildBoldLog = (msg) => {
  return "\n ***********************\n" + msg + "\n ***********************\n";
};

export default {
  severityColorLookup,
  buildBoldLog,
};
