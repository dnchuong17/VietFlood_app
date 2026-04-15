#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Helper to convert strings
const pascalCase = (str) =>
  str
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")

const camelCase = (str) =>
  str
    .split(/[-_]/)
    .map((s, i) =>
      i === 0 ? s.charAt(0).toLowerCase() + s.slice(1) : pascalCase(s)
    )
    .join("")

const kebabCase = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[_\s]/g, "-")

// Command line args
const [, , command, name, ...args] = process.argv

if (!command || !name) {
  console.log(`Usage: npm run generate:TYPE NAME [options]`)
  console.log(`  npm run generate:screen HomeScreen`)
  console.log(`  npm run generate:model Operation`)
  console.log(`  npm run generate:component Button`)
  process.exit(1)
}

const options = Object.fromEntries(args.map((arg) => arg.split("=").map((s) => s.replace(/^--/, ""))))
const folder = options.folder || camelCase(name)

// Read templates (go up one level from scripts directory to root)
const templateDir = path.join(__dirname, "..", "templates", "generators")

if (command === "screen") {
  const output = path.join(__dirname, "..", "src", "features", folder, `${pascalCase(name)}.tsx`)
  const dir = path.dirname(output)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  let template = fs.readFileSync(path.join(templateDir, "screen.template.ts"), "utf8")
  template = template.replace(/{{pascalCase name}}/g, pascalCase(name))
  template = template.replace(/{{name}}/g, name)

  fs.writeFileSync(output, template)
  console.log(`✓ Created screen: ${output}`)
} else if (command === "model") {
  const output = path.join(__dirname, "..", "src", "models", folder, `${kebabCase(name)}.ts`)
  const dir = path.dirname(output)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  let template = fs.readFileSync(path.join(templateDir, "model.template.ts"), "utf8")
  template = template.replace(/{{pascalCase name}}/g, pascalCase(name))
  template = template.replace(/{{name}}/g, name)

  fs.writeFileSync(output, template)
  console.log(`✓ Created model: ${output}`)
} else if (command === "component") {
  const output = path.join(__dirname, "..", "src", "components", `${pascalCase(name)}.tsx`)
  const dir = path.dirname(output)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  let template = fs.readFileSync(path.join(templateDir, "component.template.ts"), "utf8")
  template = template.replace(/{{pascalCase name}}/g, pascalCase(name))
  template = template.replace(/{{description}}/g, `A ${pascalCase(name)} component`)

  fs.writeFileSync(output, template)
  console.log(`✓ Created component: ${output}`)
} else {
  console.error(`Unknown command: ${command}`)
  process.exit(1)
}
