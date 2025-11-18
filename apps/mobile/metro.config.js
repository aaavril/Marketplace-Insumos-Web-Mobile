const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Configurar watchFolders para incluir el workspace
config.watchFolders = [
  workspaceRoot,
  path.resolve(workspaceRoot, 'packages'),
  path.resolve(workspaceRoot, 'packages/core-logic'),
  path.resolve(workspaceRoot, 'packages/core-logic/src'),
];

// Configurar nodeModulesPaths - priorizar workspace root para React
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

// Forzar resolución de módulos desde el workspace root para evitar múltiples instancias
config.resolver.extraNodeModules = {
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-dom': path.resolve(workspaceRoot, 'node_modules/react-dom'),
  '@react-native-community/datetimepicker': path.resolve(projectRoot, 'node_modules/@react-native-community/datetimepicker'),
};

// Resolver personalizado para core-logic
const fs = require('fs');
const defaultResolver = require('metro-resolver');

config.resolver.resolveRequest = (context, realModuleName, platform) => {
  // Forzar React y React-DOM desde el workspace root
  if (realModuleName === 'react' || realModuleName === 'react-dom') {
    const resolvedPath = path.resolve(workspaceRoot, 'node_modules', realModuleName);
    if (fs.existsSync(resolvedPath)) {
      return {
        filePath: path.join(resolvedPath, 'index.js'),
        type: 'sourceFile',
      };
    }
  }
  
  // Forzar @react-native-community/datetimepicker desde apps/mobile/node_modules
  if (realModuleName === '@react-native-community/datetimepicker') {
    const resolvedPath = path.resolve(projectRoot, 'node_modules', realModuleName);
    if (fs.existsSync(resolvedPath)) {
      return {
        filePath: path.join(resolvedPath, 'index.js'),
        type: 'sourceFile',
      };
    }
  }
  
  // Si el módulo contiene 'packages/core-logic', resolverlo manualmente
  if (realModuleName && realModuleName.includes('packages/core-logic')) {
    let resolvedPath = path.resolve(projectRoot, realModuleName);
    
    // Si no existe, intentar desde workspaceRoot
    if (!fs.existsSync(resolvedPath)) {
      const packagesPath = realModuleName.match(/packages\/.*$/);
      if (packagesPath) {
        resolvedPath = path.resolve(workspaceRoot, packagesPath[0]);
      }
    }
    
    // Intentar con diferentes extensiones
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
    
    // Intentar con index
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
  
  // Usar el resolver por defecto para otros módulos
  try {
    return defaultResolver.resolve(context, realModuleName, platform);
  } catch (e) {
    return context.resolveRequest(context, realModuleName, platform);
  }
};

module.exports = config;

