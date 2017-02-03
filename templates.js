module.exports.main = (actions) => `
<html>
<head>
  <link rel="stylesheet" href="./proto.css">
</head>
<body>
  <block>
    <h1>Select actions</h1>
    ${actions}
  </block>
</body>
</html>
`

module.exports.file = (id, data) => `
<form id="from_${id}" action="/run" method="POST" enctype="multipart/form-data">
  <field>${data.text}</field>
  <input name="id" type="hidden" value="${id}">
  <input name="file" type="file" class="file" onchange="document.getElementById('from_${id}').submit()">
</form>
`

module.exports.error = (text) => `
<html>
<head>
  <link rel="stylesheet" href="./proto.css">
</head>
<body>
  <block>
    <h1>Error</h1>
    ${text}
  </block>
</body>
</html>
`
