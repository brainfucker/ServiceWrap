const http = require('http');
const templates = require('./templates');
const staticServer = require('node-static');
const multiparty = require('multiparty')
const fs = require('fs')

class ServiceWrap {
  constructor(opts) {
    const hostname = opts.hostname || '0.0.0.0';
    const port = opts.port || 3000;

    this.actions = []

    var staticPass = new staticServer.Server(__dirname+'/static');
    // Create an HTTP server
    this.srv = http.createServer((req, res) => {

      var react = {
        file: (path) => {
          //res.writeHead(200, {'Content-Type': 'application/zip'});
          console.log('stream', path);
          var output = fs.createReadStream(path);
          output.pipe(res)
        }
      }
      //
      var actions = this.renderActions()
      console.log(req.url);
      if (req.url.indexOf('.') !== -1) {
        staticPass.serve(req, res);
      } else if (req.url == '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(templates.main(actions));
      } else if (req.url == '/run') {
        var form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
          if (!fields || !fields['id']) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(templates.error('action id undefined'));
            return
          }
          var actId = parseInt(fields['id'][0])
          var act = this.actions[actId]
          this.runAction(act, fields, files.file, react)

          //res.writeHead(200, {'content-type': 'text/plain'});
          //res.write('received upload:\n\n');
          //res.end(util.inspect({fields: fields, files: files}));
        });

      } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end(templates.error('Unsupported action'));
      }
    });
    this.srv.listen(port, hostname)
    console.log(`Server started at ${hostname}:${port}`)
  }

  runAction(act, fields, files, react) {
    switch(act.type) {
      case 'file':
        var file = files[0]['path']
        if (act.cb) {
          act.cb(file, react)
        }
        break;
    }

  }

  renderActions() {
    var out = ''
    for(var i in this.actions) {
      out += this.renderActionRow(i, this.actions[i])
    }
    return out
  }

  renderActionRow(num, act) {
    switch(act.type) {
      case 'file':
        return templates.file(num, act)
      default:
        throw new Error('action type '+act.type+' not supported')
    }
  }

  // public

  file(text, cb) {
    this.actions.push({type: 'file', text: text, cb: cb})

  }
}

module.exports = ServiceWrap
