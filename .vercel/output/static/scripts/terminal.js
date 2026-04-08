document.addEventListener('DOMContentLoaded', function () {
  if (typeof Terminal !== 'undefined') {
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "'Pixelify Sans', monospace",
      fontSize: 14,
      theme: {
        background: '#0f0f0f',
        foreground: '#00ff00',
        cursor: '#00ff00'
      },
      cols: 80,
      rows: 15
    });

    const terminalElement = document.getElementById('terminal');
    if (terminalElement) {
      term.open(terminalElement);
      term.write('\r\n\x1b[32mWelcome to sharriy\'s DevOps Terminal!\x1b[0m\r\n');
      term.write('\x1b[36muser@devops\x1b[0m:\x1b[34m~\x1b[0m$ ');

      setTimeout(() => {
        term.write('kubectl get pods\r\n');
        setTimeout(() => {
          term.write('NAME                         READY   STATUS    RESTARTS   AGE\r\n');
          term.write('api-service-764fd9fcb8-xyz   1/1     Running   0          2m\r\n');
          term.write('client-ui-55c9d59cc6-abc     1/1     Running   0          2m\r\n');
          term.write('jenkins-7b79bdc4dd-wxyz      1/1     Running   1          1h\r\n');
          term.write('\x1b[36muser@devops\x1b[0m:\x1b[34m~\x1b[0m$ ');

          setTimeout(() => {
            term.write('docker ps\r\n');
            setTimeout(() => {
              term.write('CONTAINER ID   IMAGE          COMMAND       CREATED       STATUS       PORTS\r\n');
              term.write('a1b2c3d4e5f6   nginx:latest   "nginx -g…"   2 hours ago   Up 2 hours   80/tcp\r\n');
              term.write('\x1b[36muser@devops\x1b[0m:\x1b[34m~\x1b[0m$ ');

              let currentLine = '';
              term.onData(data => {
                if (data === '\r') {
                  term.write('\r\n');
                  if (currentLine.trim()) {
                    term.write(`Command "${currentLine}" executed!\r\n`);
                  }
                  term.write('\x1b[36muser@devops\x1b[0m:\x1b[34m~\x1b[0m$ ');
                  currentLine = '';
                } else if (data === '\u007f') {
                  if (currentLine.length > 0) {
                    currentLine = currentLine.slice(0, -1);
                    term.write('\b \b');
                  }
                } else {
                  currentLine += data;
                  term.write(data);
                }
              });
            }, 1000);
          }, 2000);
        }, 1000);
      }, 2000);
    }
  }
});
