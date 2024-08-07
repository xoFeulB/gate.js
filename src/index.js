#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import prettier from "prettier"
import yargs from "yargs"
import { minify } from "html-minifier";

let argv = yargs(process.argv.slice(2))
    .option("index", {
        alias: "i",
        description: "path to index.html",
        type: "string",
    })
    .option("out", {
        alias: "o",
        description: "path to <output>.html",
        type: "string",
        default: "./index.html",
    })
    .option("depth", {
        alias: "d",
        description: "path to output directory",
        type: "number",
        default: 10000,
    })
    .option("root", {
        alias: "r",
        description: "gate src root",
        type: "string",
    })
    .option("prettier", {
        alias: "p",
        description: "enable prettier",
        type: "boolean",
        default: true,
    })
    .option("minify", {
        alias: "m",
        description: "enable minify",
        type: "boolean",
        default: false,
    })
    .help().argv;


let index_path = path.resolve(argv.i);
let index_dir = path.dirname(index_path);
let dist_dir = path.resolve(argv.o);
let root_dir = argv.r ? path.resolve(argv.r) : argv.r;
index_dir = root_dir ? root_dir : index_dir;

let HTML = {};

fs.globSync(`${index_dir}/**/*.html`).forEach((html_path) => {
    let text = fs.readFileSync(html_path, "utf-8");
    let dom = new JSDOM(text);
    HTML[html_path] = dom;
});


for (let counter = 0; counter < argv.d; counter++) {
    if (HTML[index_path].window.document.querySelector(`gate,ga-te`)) {
        HTML[index_path].window.document.querySelectorAll(`gate,ga-te`).forEach((gate_tag) => {
            let gate_target_path = path.join(index_dir, gate_tag.getAttribute("src"));
            gate_tag.outerHTML = HTML[gate_target_path].window.document.querySelector(`html`).outerHTML;
        });
    } else {
        break;
    }
}

let result_html = HTML[index_path].window.document.querySelector(`html`).outerHTML;
if (argv.p) {
    result_html = await prettier.format(
        result_html,
        { parser: "html" }
    );
}
if (argv.m) {
    result_html = minify(result_html, {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        minifyJS: true,
    });
}


console.log(`Write out to ... ${dist_dir}`);
await fs.writeFileSync(dist_dir, result_html, "utf-8");