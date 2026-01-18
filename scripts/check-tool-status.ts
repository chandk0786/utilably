#!/usr/bin/env node

import { ToolAnalyzer } from '../src/lib/tool-analyzer';
import { toolChecker } from '../src/lib/tool-checker';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🔍 Checking tool status...\n');
  
  const analyzer = new ToolAnalyzer();
  
  // Generate analysis
  const analysis = analyzer.analyzeAllTools();
  
  // Print summary
  const functionalCount = Object.values(analysis).filter(a => a.status === 'functional').length;
  const mockCount = Object.values(analysis).filter(a => a.status === 'mock').length;
  const totalCount = Object.keys(analysis).length;
  const progress = Math.round((functionalCount / totalCount) * 10000) / 100;
  
  console.log('📊 SUMMARY');
  console.log('══════════════════════════════════════');
  console.log(`Total Tools: ${totalCount}`);
  console.log(`Functional: ${functionalCount} ✅`);
  console.log(`Mock: ${mockCount} ⚠️`);
  console.log(`WIP/Partial: ${totalCount - functionalCount - mockCount} 🔄`);
  console.log(`Overall Progress: ${progress}%`);
  console.log('');
  
  // Check with tool checker
  const checkResult = await toolChecker.checkAllTools();
  console.log(toolChecker.generateStatusMessage());
  console.log('');
  
  // Show mock tools
  if (mockCount > 0) {
    console.log('⚠️ MOCK TOOLS NEEDING ATTENTION:');
    console.log('══════════════════════════════════════');
    Object.values(analysis)
      .filter(a => a.status === 'mock')
      .forEach(tool => {
        console.log(`\n${tool.toolName}`);
        console.log(`  Score: ${tool.functionalityScore}%`);
        console.log(`  Issues: ${tool.issues.length}`);
        if (tool.issues.length > 0) {
          console.log('  Top issues:');
          tool.issues.slice(0, 2).forEach(issue => {
            console.log(`    • ${issue}`);
          });
        }
      });
    console.log('');
  }
  
  // Show priority tools
  const priorityTools = toolChecker.getPriorityTools(3);
  if (priorityTools.length > 0) {
    console.log('🎯 TOP PRIORITY TOOLS TO FIX:');
    console.log('══════════════════════════════════════');
    priorityTools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Status: ${tool.status}`);
      console.log(`   Score: ${tool.functionalityScore}%`);
      console.log(`   Priority: ${tool.priority}/10`);
    });
    console.log('');
  }
  
  // Generate report file
  const report = analyzer.generateReport();
  const reportPath = path.join(process.cwd(), 'tool-status-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Report saved to: ${reportPath}`);
  
  // Update registry if needed
  const registryPath = path.join(process.cwd(), 'src/lib/tool-registry.ts');
  console.log(`\n💡 Run 'npm run update-registry' to update the tool registry with latest analysis.`);
}

main().catch(console.error);