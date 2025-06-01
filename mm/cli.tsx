#!/usr/bin/env bun
import { render } from "ink";
import App from "./app.js";

const filepath = process.argv[2];

if (!filepath) {
  console.error("Usage: bun cli.tsx <file.mm>");
  process.exit(1);
}

render(<App filepath={filepath} />);
