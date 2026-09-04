const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Bukhari Aliaakib\\Desktop\\logistic-system\\logistics-app\\src';

function walkSync(dir, ext) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fp = path.join(dir, file);
      const stat = fs.statSync(fp);
      if (stat.isDirectory() && !file.includes('node_modules')) {
        results = results.concat(walkSync(fp, ext));
      } else if (ext.some(e => fp.endsWith(e))) {
        results.push(fp);
      }
    }
  } catch(e) { /* skip */ }
  return results;
}

const replacements = [
  // blue → sky (MUST be first)
  ['bg-blue-500/10 text-blue-600 dark:text-blue-400', 'bg-sky-500/10 text-sky-600 dark:text-sky-400'],
  ['text-blue-600 dark:text-blue-400 bg-blue-500/10', 'text-sky-600 dark:text-sky-400 bg-sky-500/10'],
  ['bg-blue-500 text-white', 'bg-sky-500 text-white'],
  ['bg-blue-600', 'bg-sky-600'],
  ['bg-blue-500/10', 'bg-sky-500/10'],
  ['bg-blue-500', 'bg-sky-500'],
  ['bg-blue-400', 'bg-sky-400'],
  ['bg-blue-100', 'bg-sky-100'],
  ['text-blue-700', 'text-sky-700'],
  ['text-blue-600', 'text-sky-600'],
  ['text-blue-500', 'text-sky-500'],
  ['text-blue-400', 'text-sky-400'],
  ['border-blue-500', 'border-sky-500'],
  ['border-blue-600', 'border-sky-600'],
  ['ring-blue-500', 'ring-sky-500'],
  ['from-blue-', 'from-sky-'],
  ['to-blue-', 'to-sky-'],
  ['via-blue-', 'via-sky-'],
  
  // emerald → teal
  ['bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 'bg-teal-500/10 text-teal-600 dark:text-teal-400'],
  ['bg-emerald-600', 'bg-teal-600'],
  ['bg-emerald-500/10', 'bg-teal-500/10'],
  ['bg-emerald-500/20', 'bg-teal-500/20'],
  ['bg-emerald-500', 'bg-teal-500'],
  ['bg-emerald-400', 'bg-teal-400'],
  ['bg-emerald-100', 'bg-teal-100'],
  ['text-emerald-700', 'text-teal-700'],
  ['text-emerald-600', 'text-teal-600'],
  ['text-emerald-500', 'text-teal-500'],
  ['text-emerald-400', 'text-teal-400'],
  ['border-emerald-500', 'border-teal-500'],
  ['ring-emerald-500', 'ring-teal-500'],
  ['from-emerald-', 'from-teal-'],
  ['to-emerald-', 'to-teal-'],

  // violet → purple
  ['bg-violet-500/10 text-violet-600 dark:text-violet-400', 'bg-purple-500/10 text-purple-600 dark:text-purple-400'],
  ['bg-violet-600', 'bg-purple-600'],
  ['bg-violet-500/10', 'bg-purple-500/10'],
  ['bg-violet-500', 'bg-purple-500'],
  ['bg-violet-400', 'bg-purple-400'],
  ['bg-violet-100', 'bg-purple-100'],
  ['text-violet-700', 'text-purple-700'],
  ['text-violet-600', 'text-purple-600'],
  ['text-violet-500', 'text-purple-500'],
  ['text-violet-400', 'text-purple-400'],
  ['border-violet-500', 'border-purple-500'],
  ['ring-violet-500', 'ring-purple-500'],
  ['from-violet-', 'from-purple-'],
  ['to-violet-', 'to-purple-'],
  
  // rose → orange (MaterialM error = coral)
  ['bg-rose-500/10 text-rose-600 dark:text-rose-400', 'bg-orange-500/10 text-orange-600 dark:text-orange-400'],
  ['bg-rose-600', 'bg-orange-600'],
  ['bg-rose-500/10', 'bg-orange-500/10'],
  ['bg-rose-500/20', 'bg-orange-500/20'],
  ['bg-rose-500', 'bg-orange-500'],
  ['bg-rose-400', 'bg-orange-400'],
  ['bg-rose-100', 'bg-orange-100'],
  ['text-rose-700', 'text-orange-700'],
  ['text-rose-600', 'text-orange-600'],
  ['text-rose-500', 'text-orange-500'],
  ['text-rose-400', 'text-orange-400'],
  ['border-rose-500', 'border-orange-500'],
  ['ring-rose-500', 'ring-orange-500'],
  ['from-rose-', 'from-orange-'],
  ['to-rose-', 'to-orange-'],
];

const files = walkSync(srcDir, ['.tsx', '.ts']);
let totalUpdated = 0;

for (const fp of files) {
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;
  
  for (const [find, replace] of replacements) {
    content = content.split(find).join(replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    totalUpdated++;
    console.log('Updated:', path.relative(srcDir, fp));
  }
}

console.log('Total files updated:', totalUpdated);
