import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/gmara/OneDrive/Desktop/Directory Dev/Teknovra - Smart Analysis System/src/app/components';
const files = [
  'AlertPanel.tsx', 'LiveDistPanel.tsx', 'TopIssuePanel.tsx', 
  'TopSocialPanel.tsx', 'PersonPanel.tsx', 'ListMediaPanel.tsx', 
  'LiveTicker.tsx', 'IssueBenchmark.tsx'
];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace solid backgrounds with Glassmorphism
  content = content.replace(/background:\s*["']#(?:fff|FFFFFF)["']/gi, 
    'background: "rgba(255, 255, 255, 0.65)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)"');
  
  // Replace borders
  content = content.replace(/border:\s*["']1px solid rgba\(123,47,214,0.12\)["']/gi, 
    'border: "1px solid rgba(255, 255, 255, 0.5)"');
    
  // Replace shadows
  content = content.replace(/boxShadow:\s*["']0 2px 12px rgba\(123,47,214,0.06\)["']/gi, 
    'boxShadow: "0 4px 24px -4px rgba(123, 47, 214, 0.08)"');

  // Upscale fonts for better legibility
  content = content.replace(/fontSize:\s*["']0.5625rem["']/g, 'fontSize: "0.65rem"');
  content = content.replace(/fontSize:\s*["']0.6875rem["']/g, 'fontSize: "0.75rem"');
  content = content.replace(/fontSize:\s*["']0.75rem["']/g, 'fontSize: "0.85rem"');
  content = content.replace(/fontSize:\s*["']0.8125rem["']/g, 'fontSize: "0.9rem"');
  content = content.replace(/fontSize:\s*["']0.875rem["']/g, 'fontSize: "1rem"');
  content = content.replace(/fontSize:\s*["']1.125rem["']/g, 'fontSize: "1.25rem"'); 
  content = content.replace(/fontSize:\s*["']1.5rem["']/g, 'fontSize: "1.75rem"'); 
  content = content.replace(/fontSize:\s*["']1.75rem["']/g, 'fontSize: "2rem"');

  // Convert tailwind text sizes
  content = content.replace(/text-xs/g, 'text-sm');
  content = content.replace(/"text-sm"/g, '"text-base"');

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log("Successfully applied glassmorphism and font scaling to all panels!");
