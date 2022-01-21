module.exports = [
  {
    script: 'build/index.js',
    cwd: ".",
    name: 'Demo Application',
    exec_mode: 'cluster',
    instances: 1,
    autorestart: true
  }
]
