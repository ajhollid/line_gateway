import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
marked.use({
  gfm: true,
});

const getReadme = (req: Request, res: Response, next: NextFunction) => {
  let readme: Buffer = fs.readFileSync(
    path.join(__dirname, "../static/readme.md")
  );

  let css =
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/pixelbrackets/gfm-stylesheet/dist/gfm.min.css"/>';
  res.send(css + "\n" + marked(readme.toString()));
};

export default { getReadme };
