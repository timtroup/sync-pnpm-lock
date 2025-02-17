#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");

// Load package.json
const packageJsonPath = "package.json";
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Run pnpm list --json and parse output
console.log("🔄 Fetching dependency versions from pnpm...");
const pnpmDeps = JSON.parse(execSync("pnpm list --json", { encoding: "utf8" }));

// Helper function to extract exact versions
const getExactVersion = (name, pnpmDependecies) => {
    const dep = pnpmDependecies[name];
    return dep ? dep.version : null;
};

// Update dependencies
const updateDeps = (pkgDeps, pnpmDeps) => {
    for (const dep in pkgDeps) {
        const exactVersion = getExactVersion(dep, pnpmDeps);
        if (exactVersion) {
            pkgDeps[dep] = exactVersion;
        }
    }
};

updateDeps(packageJson.dependencies, pnpmDeps[0].dependencies);
updateDeps(packageJson.devDependencies, pnpmDeps[0].devDependencies);

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log("✅ Synced package.json with pnpm-lock.yaml");