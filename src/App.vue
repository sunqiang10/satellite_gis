<template>
  <router-view />
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Microsoft YaHei', sans-serif;
  background-color: #020617;
  color: #e2e8f0;
}

:root {
  --glass-bg: rgba(15, 23, 42, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.sci-border-glow {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.scanline {
  width: 100%;
  height: 2px;
  background: linear-gradient(to bottom, rgba(34, 211, 238, 0), rgba(34, 211, 238, 0.5), rgba(34, 211, 238, 0));
  position: absolute;
  top: -2px;
  animation: scan 4s linear infinite;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.pulse-red {
  animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.bg-space-950 {
  background-color: #020617;
}

.bg-space-900 {
  background-color: #0f172a;
}

.bg-space-800 {
  background-color: #1e293b;
}

.bg-slate-900 {
  background-color: #0f172a;
}

.bg-slate-800 {
  background-color: #1e293b;
}

.bg-slate-700 {
  background-color: #334155;
}

.bg-slate-600 {
  background-color: #475569;
}

.bg-slate-500 {
  background-color: #64748b;
}

.bg-slate-400 {
  background-color: #94a3b8;
}

.text-slate-500 {
  color: #64748b;
}

.text-slate-400 {
  color: #94a3b8;
}

.text-slate-300 {
  color: #cbd5e1;
}

.text-slate-200 {
  color: #e2e8f0;
}

.text-white {
  color: #ffffff;
}

.text-sci-cyan {
  color: #22d3ee;
}

.text-sci-blue {
  color: #3b82f6;
}

.text-sci-purple {
  color: #a855f7;
}

.text-sci-red {
  color: #ef4444;
}

.text-sci-green {
  color: #10b981;
}

.text-sci-amber {
  color: #f59e0b;
}

.bg-sci-cyan {
  background-color: #22d3ee;
}

.bg-sci-blue {
  background-color: #3b82f6;
}

.bg-sci-purple {
  background-color: #a855f7;
}

.bg-sci-red {
  background-color: #ef4444;
}

.bg-sci-green {
  background-color: #10b981;
}

.bg-sci-amber {
  background-color: #f59e0b;
}

.border-slate-800 {
  border-color: #1e293b;
}

.border-slate-700 {
  border-color: #334155;
}

.border-slate-600 {
  border-color: #475569;
}

.border-sci-blue {
  border-color: #3b82f6;
}

.border-sci-green {
  border-color: #10b981;
}

.border-sci-amber {
  border-color: #f59e0b;
}

.border-sci-red {
  border-color: #ef4444;
}

.hover\:bg-sci-blue:hover {
  background-color: #3b82f6;
}

.hover\:text-white:hover {
  color: #ffffff;
}

.hover\:bg-slate-900:hover {
  background-color: #0f172a;
}

.transition-all {
  transition: all 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease, background-color 0.3s ease;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-3xl {
  border-radius: 1.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.p-16 {
  padding: 4rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.mt-8 {
  margin-top: 2rem;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.items-end {
  align-items: flex-end;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.justify-end {
  justify-content: flex-end;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.gap-8 {
  gap: 2rem;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.h-screen {
  height: 100vh;
}

.min-h-screen {
  min-height: 100vh;
}

.text-xs {
  font-size: 0.75rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-base {
  font-size: 1rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.text-4xl {
  font-size: 2.25rem;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

.uppercase {
  text-transform: uppercase;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.italic {
  font-style: italic;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cursor-pointer {
  cursor: pointer;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-10 {
  z-index: 10;
}

.z-20 {
  z-index: 20;
}

.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

.z-60 {
  z-index: 60;
}

.w-10 {
  width: 2.5rem;
}

.h-10 {
  height: 2.5rem;
}

.w-16 {
  width: 4rem;
}

.h-16 {
  height: 4rem;
}

.w-20 {
  width: 5rem;
}

.h-20 {
  height: 5rem;
}

.w-80 {
  width: 20rem;
}

.w-96 {
  width: 24rem;
}

.h-28 {
  height: 7rem;
}

.h-32 {
  height: 8rem;
}

.h-40 {
  height: 10rem;
}

.h-64 {
  height: 16rem;
}

.h-96 {
  height: 24rem;
}

.border {
  border-width: 1px;
  border-style: solid;
}

.border-b {
  border-bottom-width: 1px;
  border-bottom-style: solid;
}

.border-t {
  border-top-width: 1px;
  border-top-style: solid;
}

.border-l-4 {
  border-left-width: 4px;
  border-left-style: solid;
}

.border-r {
  border-right-width: 1px;
  border-right-style: solid;
}

.border-l-2 {
  border-left-width: 2px;
  border-left-style: solid;
}

.opacity-20 {
  opacity: 0.2;
}

.opacity-30 {
  opacity: 0.3;
}

.opacity-60 {
  opacity: 0.6;
}

.opacity-100 {
  opacity: 1;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.select-none {
  user-select: none;
}

.pointer-events-none {
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-8 > * + * {
  margin-top: 2rem;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.space-x-3 > * + * {
  margin-left: 0.75rem;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

.space-x-6 > * + * {
  margin-left: 1.5rem;
}

.space-x-8 > * + * {
  margin-left: 2rem;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.font-display {
  font-family: 'Inter', sans-serif;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.object-cover {
  object-fit: cover;
}

.mix-blend-overlay {
  mix-blend-mode: overlay;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.flex-grow {
  flex-grow: 1;
}

.min-w-0 {
  min-width: 0;
}

.w-2 {
  width: 0.5rem;
}

.w-3 {
  width: 0.75rem;
}

.w-4 {
  width: 1rem;
}

.w-5 {
  width: 1.25rem;
}

.w-6 {
  width: 1.5rem;
}

.w-8 {
  width: 2rem;
}

.h-2 {
  height: 0.5rem;
}

.h-3 {
  height: 0.75rem;
}

.h-4 {
  height: 1rem;
}

.h-5 {
  height: 1.25rem;
}

.h-6 {
  height: 1.5rem;
}

.h-8 {
  height: 2rem;
}

.bg-grid-pattern {
  background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
}
</style>