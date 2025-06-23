module.exports = {
  default: {
    require: ['features/steps/**/*.ts', 'features/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['summary', 'progress'],
    paths: ['features/**/*.feature']
  }
}