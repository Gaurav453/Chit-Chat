module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  dependencies: {
    "react-native-sqlite-storage": {
      platforms: {
        android: {
          sourceDir:
            "../node_modules/react-native-sqlite-storage/platforms/android-native",
          packageImportPath: "import io.liteglue.SQLitePluginPackage;",
          packageInstance: "new SQLitePluginPackage()"
        }
      }
    }
  },
  'react-native-gesture-handler': {
    platforms: {
      android: null,
      ios: null,
    },
  },
  assets: ['./app/assets/fonts/'], // stays the same
};
