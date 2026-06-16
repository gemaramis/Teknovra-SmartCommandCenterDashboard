import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/gmara/OneDrive/Desktop/Directory Dev/Teknovra - Smart Analysis System/src/app/components';
const files = [
  'DashboardPage.tsx',
  'LaunchScreen.tsx',
  'GenerateActionPage.tsx',
  'ProfileBuilderPage.tsx',
  'ReportPage.tsx',
  'AlertPanel.tsx', 
  'LiveDistPanel.tsx', 
  'TopIssuePanel.tsx', 
  'TopSocialPanel.tsx', 
  'PersonPanel.tsx', 
  'ListMediaPanel.tsx', 
  'LiveTicker.tsx', 
  'IssueBenchmark.tsx'
];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // Make the glass more transparent so it blurs the background visibly
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.65\)/g, 'rgba(255, 255, 255, 0.4)');
  
  // Increase the border slightly to catch the light
  content = content.replace(/border:\s*["']1px solid rgba\(255,\s*255,\s*255,\s*0\.5\)["']/g, 'border: "1px solid rgba(255, 255, 255, 0.8)"');
  
  // Apply highly rounded corners (ambience reference)
  // For panels that had rounded-xl or rounded-2xl, change to rounded-3xl or rounded-[2rem]
  if (file !== 'DashboardPage.tsx' && file !== 'LaunchScreen.tsx') {
    content = content.replace(/className="([^"]*)rounded-xl([^"]*)"/g, 'className="$1rounded-3xl p-6$2"');
    content = content.replace(/className="([^"]*)rounded-2xl([^"]*)"/g, 'className="$1rounded-3xl p-6$2"');
  }

  // Update backgrounds to be more vibrant so the glass is visible
  if (file === 'DashboardPage.tsx' || file === 'LaunchScreen.tsx' || file === 'GenerateActionPage.tsx' || file === 'ProfileBuilderPage.tsx' || file === 'ReportPage.tsx') {
    content = content.replace(/linear-gradient\(135deg,\s*#FFFFFF\s*0%,\s*#F8F6FC\s*50%,\s*#EBE4F6\s*100%\)/g, 'linear-gradient(135deg, #E6E0F8 0%, #F5E3F0 50%, #E2EDF8 100%)');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log("Successfully increased glass visibility and rounded corners!");
