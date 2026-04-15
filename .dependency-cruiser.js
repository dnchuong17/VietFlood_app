/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbid: [
    {
      name: "no-circular",
      comment: "Forbid circular dependencies",
      severity: "error",
      type: "circular",
    },
    {
      name: "no-orphans",
      comment:
        "Forbid orphans - modules without any dependencies or dependents",
      severity: "info",
      type: "orphan",
      from: {
        pathNot: ["node_modules", "dist", "build"],
      },
    },
    {
      name: "services-cant-import-features",
      comment: "Services cannot import from features (UI layer)",
      severity: "error",
      from: { path: "^src/services" },
      to: { path: "^src/features" },
    },
    {
      name: "services-cant-import-components",
      comment: "Services cannot import UI components",
      severity: "error",
      from: { path: "^src/services" },
      to: { path: "^src/components" },
    },
    {
      name: "models-cant-import-features",
      comment: "Models cannot import from features (UI layer)",
      severity: "error",
      from: { path: "^src/models" },
      to: { path: "^src/features" },
    },
    {
      name: "models-cant-import-components",
      comment: "Models cannot import UI components",
      severity: "error",
      from: { path: "^src/models" },
      to: { path: "^src/components" },
    },
    {
      name: "components-cant-import-features",
      comment: "Components cannot import from features (avoid feature-specific logic in shared components)",
      severity: "warn",
      from: { path: "^src/components" },
      to: { path: "^src/features" },
    },
    {
      name: "features-cant-import-other-features",
      comment: "Features should not depend on other features directly (use models/services instead)",
      severity: "warn",
      from: { path: "^src/features/[^/]+/" },
      to: { path: "^src/features/(?![^/]*$)" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: "^(node_modules|dist|build)",
    },
    maxDepth: 6,
    reportingFormat: "text",
  },
};
