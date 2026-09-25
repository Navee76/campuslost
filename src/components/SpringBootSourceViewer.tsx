import React, { useState } from 'react';
import { SPRING_BOOT_PROJECT_FILES } from '../data/springBootCode';
import { 
  FolderTree, 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  Download, 
  Code2, 
  Sparkles, 
  Server,
  BookOpen,
  FileCheck
} from 'lucide-react';

export const SpringBootSourceViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const activeFile = SPRING_BOOT_PROJECT_FILES[selectedFileIndex] || SPRING_BOOT_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    'ALL',
    'CONFIG',
    'MODEL',
    'REPOSITORY',
    'SERVICE',
    'CONTROLLER',
    'SECURITY',
    'DATABASE',
    'TEMPLATE',
    'DOCS'
  ];

  const filteredFiles = SPRING_BOOT_PROJECT_FILES.filter(
    f => activeCategory === 'ALL' || f.category === activeCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg ring-4 ring-white/10 shrink-0">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase">
                  Java Spring Boot 3.3.2 • Maven • MySQL
                </span>
                <span className="text-xs text-emerald-200/80 font-mono">JDK 17/21 • Spring Security 6</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Spring Boot Production Codebase & Architecture
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                Complete production Java backend files, repositories, service matching algorithms, security config, and MySQL scripts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied File Content!' : 'Copy Active File'}
            </button>
          </div>
        </div>
      </div>

      {/* VS Code Style IDE Layout */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[680px]">
        {/* Left Sidebar: File Explorer */}
        <div className="w-full lg:w-80 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              Project Explorer
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {SPRING_BOOT_PROJECT_FILES.length} Files
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-850 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar max-h-[500px] lg:max-h-[580px]">
            {filteredFiles.map((file) => {
              const actualIdx = SPRING_BOOT_PROJECT_FILES.findIndex(f => f.path === file.path);
              const isSelected = actualIdx === selectedFileIndex;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(actualIdx)}
                  className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                      : 'text-slate-400 hover:bg-slate-850/60 hover:text-slate-200'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="min-w-0">
                    <div className="font-mono font-medium truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-500 truncate font-mono">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Code Editor View */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {/* Editor Header Tab */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-mono text-xs font-bold border border-slate-700 flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5" />
                {activeFile.name}
              </span>
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                {activeFile.path}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase font-mono">
                {activeFile.category}
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Body with Line Numbers */}
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed bg-slate-900 max-h-[620px]">
            <pre className="text-slate-100">
              <code>{activeFile.code}</code>
            </pre>
          </div>

          {/* Status Bar */}
          <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-4">
              <span>Type: {activeFile.name.endsWith('.java') ? 'Java 17/21' : activeFile.name.endsWith('.xml') ? 'Maven XML' : activeFile.name.endsWith('.sql') ? 'MySQL SQL' : activeFile.name.endsWith('.html') ? 'Thymeleaf HTML' : 'Config / Docs'}</span>
              <span>Encoding: UTF-8</span>
            </div>
            <div>Spring Boot 3.3.2 • Maven 3.9+</div>
          </div>
        </div>
      </div>

      {/* Quick Setup Guide */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-xs mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Create MySQL Database</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Open MySQL Workbench or CLI and run <code className="text-blue-600 font-mono">CREATE DATABASE campuslost_db;</code>. Then execute the <code className="text-blue-600 font-mono">schema.sql</code> and <code className="text-blue-600 font-mono">data.sql</code> scripts.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Open in VS Code / IntelliJ</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Ensure Java 17+ and the Extension Pack for Java are installed in VS Code. Configure your MySQL credentials in <code className="text-emerald-600 font-mono">application.properties</code>.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold text-xs mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Run Maven Server</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Execute <code className="text-purple-600 font-mono">./mvnw spring-boot:run</code> or run <code className="text-purple-600 font-mono">CampusLostApplication.java</code>. Access at <code className="text-purple-600 font-mono">http://localhost:8080</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
