# Unused Dependencies Report

## Frontend Dependencies Analysis

### Confirmed Unused Dependencies:
1. **clsx** - No imports found in codebase
2. **@dnd-kit/core** - No imports found in codebase 
3. **@dnd-kit/sortable** - No imports found in codebase
4. **@dnd-kit/utilities** - No imports found in codebase
5. **react-dropzone** - No imports found in codebase
6. **react-window** - No imports found in codebase
7. **react-virtualized-auto-sizer** - No imports found in codebase

### Unused Dev Dependencies:
1. **tailwind-merge** - Removed (related to Tailwind CSS)
2. **tailwindcss** - Removed (switched to inline styles)
3. **postcss** - Removed (was needed for Tailwind)
4. **autoprefixer** - Removed (was needed for Tailwind)
5. **prettier-plugin-tailwindcss** - Removed (Tailwind related)

### Potentially Unused (Need further verification):
1. **react-beautiful-dnd** - Only one reference found in BoardSidebar.tsx
2. **react-datepicker** - Need to check usage
3. **react-helmet-async** - Need to check usage
4. **react-hook-form** - Need to check usage
5. **react-hot-toast** - Need to check usage
6. **react-query** - Need to check usage (old version, should be @tanstack/react-query)
7. **react-select** - Need to check usage

### Dependencies to Keep:
- All React core packages
- axios (API calls)
- TypeScript packages
- Vite packages
- ESLint packages
- lucide-react (icons)
- framer-motion (animations)
- reactflow (Board functionality)
- recharts (analytics charts)
- socket.io-client (WebSocket)
- react-router-dom (routing)
- react-markdown (markdown rendering)
- @monaco-editor/react (code editor)
- @fortawesome/fontawesome-free (icons)
- @tauri-apps/api (desktop app)

## Actions Taken:
1. ✅ Removed Tailwind CSS and related dependencies
2. ✅ Cleaned up chat components
3. ✅ Backed up all removed files to frontend/backups/

## Next Steps:
1. Remove confirmed unused dependencies from package.json
2. Test application to ensure functionality
3. Run npm install to clean up node_modules 