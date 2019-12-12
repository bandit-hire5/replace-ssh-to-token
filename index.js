#!/usr/bin/env node

const fs = require("fs");
const childProcess = require( "child_process");

let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
} catch (err) {
  console.error("Cannot open package.json:", err);
  process.exit(1);
}

if (packageJson.replaceSshToToken === undefined) {
  console.error(`dependencies in package.json is empty, skipping`);
  process.exit(0);
}

const dependencies = packageJson.replaceSshToToken.packages;

if (!dependencies) {
  console.error(`dependencies in package.json is empty, skipping`);
  process.exit(0);
}

const envs = packageJson.replaceSshToToken.env;

let usernameVar;
let tokenVar;
let releaseBranchVar;

if (envs !== undefined) {
  usernameVar = envs.username !== undefined ? envs.username : "";
  tokenVar = envs.token !== undefined ? envs.token : "";
  releaseBranchVar = envs.releaseBranch !== undefined ? envs.releaseBranch : "";
}

const packages = Object.keys(dependencies)
  .map(key => {
    const pkg = dependencies[key];

    if (pkg.env !== undefined) {
      usernameVar = pkg.env.username !== undefined ? pkg.env.username : usernameVar;
      tokenVar = pkg.env.token !== undefined ? pkg.env.token : tokenVar;
      releaseBranchVar = pkg.env.releaseBranch !== undefined ? pkg.env.releaseBranch : releaseBranchVar;
    }

    if (!usernameVar || !tokenVar || !releaseBranchVar) {
      return pkg.link;
    }

    const username = process.env[usernameVar];
    const token = process.env[tokenVar];
    const releaseBranch = process.env[releaseBranchVar];

    if (!username || !token || !releaseBranch) {
      return pkg.link;
    }

    return pkg.link.replace(
      /git\+ssh:\/\/git@bitbucket.org:(.+)#.+/g,
      `https://${username}:${token}@bitbucket.org/$1#${releaseBranch}`
    );
  })
  .filter(item => !!item)
  .join(" ");

if (!!packages) {
  try {
    console.log("yarn add " + packages);
    childProcess.execSync("RSTT_NO_YARNPOSTINSTALL=1 yarn add " + packages, { stdio: [0, 1, 2] });
  } catch (err) {
    console.log("err", err);
  }
}
