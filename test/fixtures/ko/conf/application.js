const { join } = require('path')

module.exports = {
  mono: {
    modules: [
      // Absolute path to module directory (development)
      join(__dirname, '../../../..')
    ]
  }
}
