#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import prettier from "prettier"
import yargs from "yargs"

let argv = yargs(process.argv.slice(2))
    .option("index", {
        alias: "i",
        description: "path to index.html",
        type: "string",
    })
    .option("out", {
        alias: "o",
        description: "path to output directory",
        type: "string",
        default: "./",
    })
    .option("depth", {
        alias: "d",
        description: "path to output directory",
        type: "number",
        default: 10000,
    })
    .help().argv;


let index_path = path.resolve(argv.i);
let index_dir = path.dirname(index_path);
let dist_dir = path.resolve(argv.o);

let HTML = {};

fs.globSync(`${index_dir}/**/*.html`).forEach((html_path) => {
    let text = fs.readFileSync(html_path, "utf-8");
    let dom = new JSDOM(text);
    HTML[html_path] = dom;
});


for (let counter = 0; counter < argv.d; counter++) {
    if (HTML[index_path].window.document.querySelector(`gate`)) {
        HTML[index_path].window.document.querySelectorAll(`gate`).forEach((gate_tag) => {
            let gate_target_path = path.join(index_dir, gate_tag.getAttribute("src"));
            gate_tag.outerHTML = HTML[gate_target_path].window.document.querySelector(`html`).outerHTML;
        });
    } else {
        break;
    }
}

let result_html = await prettier.format(
    HTML[index_path].window.document.querySelector(`html`).outerHTML,
    { parser: "html" }
);

console.log(`Write out to ... ${path.join(dist_dir, path.basename(index_path))}`);
await fs.writeFileSync(path.join(dist_dir, path.basename(index_path)), result_html, "utf-8");