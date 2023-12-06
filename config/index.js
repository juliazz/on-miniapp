const path = require('path');

const config = {
  projectName: 'onrunning_taro_20220505',
  date: '2022-5-5',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: ['taro-plugin-compiler-optimization', ['@tarojs/plugin-inject', {
    components: {
      View: {
        'data-cms-id': "''"
      }
    }
  }]],

  terser: {
    enable: true,
    config: {
      // 配置项同 https://github.com/terser/terser#minify-options
    }
  },
  csso: {
    enable: true,
  },
  // baseLevel:8,
  defineConstants: {
  },
  alias: {
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/images': path.resolve(__dirname, '..', 'src/assets/images'),
    '@/icons': path.resolve(__dirname, '..', 'src/assets/images/icons'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/store': path.resolve(__dirname, '..', 'src/store')
  },
  sass: {
    resource: path.resolve(__dirname, '..', 'src/assets/css/var@function.scss'),
  },
  copy: {
    patterns: [
      { from: 'src/workers', to: `dist/${process.env.TARO_ENV}/workers` }
    ],
    options: {
    }
  },
  framework: 'vue',
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          minPixelValue: 1,
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    optimizeMainPackage: {
      enable: true
    },
    prerender: {
      // match: 'pages/**', // 所有以 `pages/shop/` 开头的页面都参与 prerender
      //   include: ['pages/index/index'], // `pages/any/way/index` 也会参与 prerender
    },
    webpackChain: (chain, webpack) => {
      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [{
              terserOptions: {
                compress: true, // 默认使用terser压缩
                // mangle: false,
                keep_classnames: true, // 不改变class名称
                keep_fnames: true // 不改变函数名称
              }
            }]
          }
        }
      })
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  const env = process.env.NODE_ENV;
  if (env === 'development' || env === 'dev') {
    return merge({}, config, require('./dev'));
  } else if (env === 'stage') {
    return merge({}, config, require('./stage'));
  }
  return merge({}, config, require('./prod'));
}
