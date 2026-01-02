import fs from 'fs';
import path from 'path';

const forbidden = ;

function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) scan(p);
    else if (p.match(/\.(ts|tsx|json)$/)) {
      const c = fs.readFileSync(p,'utf8');
      for (const x of forbidden) {
        if (new RegExp(x,'i').test(c)) {
          throw new Error(❌ Compliance violation:  in );
        }
      }
    }
  }
}

scan(process.cwd());
console.log("✔ Compliance lint passed");
