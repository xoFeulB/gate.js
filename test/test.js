import child_process from "child_process";

child_process.spawn("gate --index index.html --out ./dist --depth 10000", [], { shell: true, stdio: "inherit" });