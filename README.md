ServiceWrap
===========

Allow you to wrap any function or bash script into web service

#Only files support at the moment

Example:
```
var wrap = new ServiceWrap({port: 3010})
wrap.file('Some title', (path, react) => {
  react.file('Any file path as result')
})
```
