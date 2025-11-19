/**
 * metro.config.js - CONFIGURACIÓN DE METRO BUNDLER PARA REACT NATIVE
 * 
 * Metro Bundler es el bundler de JavaScript para React Native (equivalente a Vite en web).
 * Este archivo configura cómo Metro resuelve e importa módulos, especialmente para
 * trabajar con la arquitectura monorepo.
 * 
 * ¿Qué hace este archivo?
 * 1. Configura watchFolders: Metro observa cambios en el workspace completo
 * 2. Configura nodeModulesPaths: Prioriza módulos del workspace root
 * 3. Resuelve módulos de packages/core-logic: Permite importar desde el código compartido
 * 4. Fuerza React desde workspace root: Evita múltiples instancias de React
 * 
 * ¿Por qué es necesario?
 * - En un monorepo, el código compartido está en packages/core-logic
 * - Mobile necesita importar desde ahí: import { useAppState } from 'packages/core-logic/...'
 * - Sin esta configuración, Metro no sabría dónde encontrar esos módulos
 * - También permite hot reload del código compartido
 * 
 * IMPORTANTE: Este archivo usa CommonJS (require/module.exports) porque Metro
 * lo requiere, no ES Modules.
 */

// getDefaultConfig: Obtiene la configuración por defecto de Expo/Metro
const { getDefaultConfig } = require('expo/metro-config');

// path: Utilidad de Node.js para trabajar con rutas de archivos
const path = require('path');

// projectRoot: Directorio raíz de la app mobile (apps/mobile/)
const projectRoot = __dirname;

// workspaceRoot: Directorio raíz del monorepo (dos niveles arriba de apps/mobile/)
// Esto apunta a la raíz del proyecto completo
const workspaceRoot = path.resolve(projectRoot, '../..');

// Obtiene la configuración por defecto de Metro para este proyecto
const config = getDefaultConfig(projectRoot);

/**
 * watchFolders: Carpetas que Metro debe observar para cambios
 * 
 * Cuando cambias código en packages/core-logic, Metro necesita detectarlo
 * para hacer hot reload. Sin esto, los cambios en código compartido no se reflejarían.
 */
config.watchFolders = [
  workspaceRoot,                                    // Raíz del workspace
  path.resolve(workspaceRoot, 'packages'),          // Carpeta packages/
  path.resolve(workspaceRoot, 'packages/core-logic'), // Carpeta core-logic/
  path.resolve(workspaceRoot, 'packages/core-logic/src'), // Carpeta src/ de core-logic
];

/**
 * nodeModulesPaths: Rutas donde Metro busca node_modules
 * 
 * Prioriza node_modules del workspace root sobre los de la app mobile.
 * Esto asegura que React y otras dependencias compartidas se resuelvan desde
 * el mismo lugar, evitando múltiples instancias.
 */
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),  // Primero busca en workspace root
  path.resolve(projectRoot, 'node_modules'),    // Luego busca en mobile/
];

/**
 * extraNodeModules: Fuerza resolución de módulos específicos desde workspace root
 * 
 * Esto asegura que React y React-DOM se resuelvan desde el workspace root,
 * evitando problemas de múltiples instancias que causan errores de hooks.
 */
config.resolver.extraNodeModules = {
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-dom': path.resolve(workspaceRoot, 'node_modules/react-dom'),
};

/**
 * Resolver personalizado para core-logic
 * 
 * Este resolver personalizado permite importar módulos desde packages/core-logic
 * usando rutas relativas como: import { useAppState } from 'packages/core-logic/src/...'
 */
const fs = require('fs');                    // File system para verificar existencia de archivos
const defaultResolver = require('metro-resolver'); // Resolver por defecto de Metro

/**
 * resolveRequest: Función personalizada que resuelve módulos
 * 
 * Esta función intercepta las importaciones y las resuelve manualmente
 * cuando es necesario (para React, React-DOM, o packages/core-logic).
 * 
 * @param {Object} context - Contexto de resolución de Metro
 * @param {string} realModuleName - Nombre del módulo a resolver
 * @param {string} platform - Plataforma (ios, android, web)
 * @returns {Object} Objeto con filePath y type del módulo resuelto
 */
config.resolver.resolveRequest = (context, realModuleName, platform) => {
  /**
   * Forzar React y React-DOM desde el workspace root
   * 
   * Esto previene errores de "Hooks can only be called inside React components"
   * que ocurren cuando hay múltiples instancias de React.
   */
  if (realModuleName === 'react' || realModuleName === 'react-dom') {
    const resolvedPath = path.resolve(workspaceRoot, 'node_modules', realModuleName);
    if (fs.existsSync(resolvedPath)) {
      return {
        filePath: path.join(resolvedPath, 'index.js'),
        type: 'sourceFile',
      };
    }
  }
  
  /**
   * Resolver módulos de packages/core-logic manualmente
   * 
   * Cuando importas: import { useAppState } from 'packages/core-logic/src/context/...'
   * Metro no sabe dónde buscar esto por defecto. Este código lo resuelve.
   */
  if (realModuleName && realModuleName.includes('packages/core-logic')) {
    // Primero intenta resolver desde el directorio del proyecto mobile
    let resolvedPath = path.resolve(projectRoot, realModuleName);
    
    // Si no existe ahí, intenta desde el workspace root
    if (!fs.existsSync(resolvedPath)) {
      const packagesPath = realModuleName.match(/packages\/.*$/);
      if (packagesPath) {
        resolvedPath = path.resolve(workspaceRoot, packagesPath[0]);
      }
    }
    
    // Intenta diferentes extensiones de archivo (.jsx, .js, .tsx, .ts, .json)
    const extensions = ['.jsx', '.js', '.tsx', '.ts', '.json'];
    for (const ext of extensions) {
      const pathWithExt = resolvedPath + ext;
      if (fs.existsSync(pathWithExt)) {
        return {
          filePath: pathWithExt,
          type: 'sourceFile',
        };
      }
    }
    
    // Si no encuentra el archivo directo, intenta con index.jsx, index.js, etc.
    for (const ext of extensions) {
      const pathWithIndex = path.join(resolvedPath, 'index' + ext);
      if (fs.existsSync(pathWithIndex)) {
        return {
          filePath: pathWithIndex,
          type: 'sourceFile',
        };
      }
    }
  }
  
  /**
   * Para todos los demás módulos, usa el resolver por defecto de Metro
   * 
   * Esto maneja todas las importaciones normales de node_modules y otros módulos.
   */
  try {
    return defaultResolver.resolve(context, realModuleName, platform);
  } catch (e) {
    // Si el resolver por defecto falla, intenta con el contexto
    return context.resolveRequest(context, realModuleName, platform);
  }
};

// Exporta la configuración para que Metro la use
module.exports = config;

