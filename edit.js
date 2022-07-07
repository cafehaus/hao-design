/**
*  此文件用来自动修改 package.json 文件
*  项目里部分配置开发阶段调试才会用到，发布到 npm 并不需要
*  每次发布 npm 时先：yarn edit
*  但是git仓库里还是要保留完整的配置
*/

const fs = require('node:fs')
const path = require('node:path')
let jsonData = require('./package.json')

const noNeedKeys = ['scripts', 'dependencies', 'devDependencies', 'eslintConfig', 'browserslist']
noNeedKeys.map(m => {
  delete jsonData[m]
})

// 直接写入 Object 数据会报错：TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received an instance of Object
// 解决方式：JSON.stringify，第3个参数可以用来格式化美化数据
const jsonText = JSON.stringify(jsonData, null, 2)
fs.writeFile(path.join(__dirname, './package.json'), jsonText, (err) => {
  if (err) throw err
  console.log('package.json 文件修改成功!')
})