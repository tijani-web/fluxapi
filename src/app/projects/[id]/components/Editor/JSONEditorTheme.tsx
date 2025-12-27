// /src/app/projects/[id]/components/Editor/JSONEditorTheme.tsx

// Correct theme format for react-json-editor-ajrm
export const lightTheme = {
  base00: '#ffffff', // background
  base01: '#f8fafc', // 
  base02: '#fef3c7', // background_warning (amber-100)
  base03: '#64748b', // colon (slate-500)
  base04: '#94a3b8', // keys_whiteSpace (slate-400)
  base05: '#0f172a', // keys (slate-900)
  base06: '#059669', // string (emerald-600)
  base07: '#2563eb', // primitive (blue-600)
  base08: '#dc2626', // error (red-600)
  base09: '#2563eb', // number (blue-600)
};

export const darkTheme = {
  base00: '#0f172a', // background (slate-900)
  base01: '#1e293b', // 
  base02: '#451a03', // background_warning (amber-950)
  base03: '#94a3b8', // colon (slate-400)
  base04: '#64748b', // keys_whiteSpace (slate-500)
  base05: '#f8fafc', // keys (slate-50)
  base06: '#34d399', // string (emerald-400)
  base07: '#60a5fa', // primitive (blue-400)
  base08: '#f87171', // error (red-400)
  base09: '#60a5fa', // number (blue-400)
};

// Export based on current theme
export const JSONEditorTheme = typeof window !== 'undefined' && 
  window.matchMedia && 
  window.matchMedia('(prefers-color-scheme: dark)').matches 
  ? darkTheme 
  : lightTheme;