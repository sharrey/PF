document.addEventListener('DOMContentLoaded', function () {
  if (typeof Terminal === 'undefined') return;
  const terminalElement = document.getElementById('terminal');
  if (!terminalElement) return;

  const term = new Terminal({
    cursorBlink: true,
    fontFamily: '"JetBrains Mono", "Fira Mono", monospace',
    fontSize: 13,
    lineHeight: 1.5,
    theme: {
      background:    '#0a0a0a',
      foreground:    '#d4d4d8',
      cursor:        '#22c55e',
      cursorAccent:  '#0a0a0a',
      black:         '#18181b',
      brightBlack:   '#3f3f46',
      red:           '#ef4444',
      brightRed:     '#f87171',
      green:         '#22c55e',
      brightGreen:   '#4ade80',
      yellow:        '#f59e0b',
      brightYellow:  '#fbbf24',
      blue:          '#3b82f6',
      brightBlue:    '#60a5fa',
      cyan:          '#06b6d4',
      brightCyan:    '#22d3ee',
      white:         '#d4d4d8',
      brightWhite:   '#f4f4f5',
    },
    cols: 80,
    rows: 14,
    scrollback: 200,
  });

  term.open(terminalElement);

  // ── Colour helpers ────────────────────────────────────────
  const g  = s => `\x1b[32m${s}\x1b[0m`;   // green
  const b  = s => `\x1b[34m${s}\x1b[0m`;   // blue
  const c  = s => `\x1b[36m${s}\x1b[0m`;   // cyan
  const y  = s => `\x1b[33m${s}\x1b[0m`;   // yellow
  const r  = s => `\x1b[31m${s}\x1b[0m`;   // red
  const d  = s => `\x1b[90m${s}\x1b[0m`;   // dim
  const w  = s => `\x1b[1m${s}\x1b[0m`;    // bold

  const nl = '\r\n';
  const prompt = () => `${c('sharriy@portfolio')}:${b('~')}$ `;

  function write(text) { term.write(text); }
  function writeln(text = '') { term.write(text + nl); }
  function showPrompt() { write(prompt()); }

  // ── Command definitions ───────────────────────────────────
  const COMMANDS = {

    help() {
      writeln();
      writeln(g('  available commands') + d('  ──────────────────────────────'));
      const cmds = [
        ['whoami',              'about sharriy'],
        ['ls',                  'list projects'],
        ['ls blog',             'list blog posts'],
        ['cat about.txt',       'read the about page'],
        ['cat contact.txt',     'contact info'],
        ['cat stack.yaml',      'tech stack'],
        ['git log',             'recent project commits'],
        ['kubectl get pods',    'check cluster status'],
        ['docker ps',           'list running containers'],
        ['open <page>',         'navigate — try: open blog, open about'],
        ['echo <text>',         'print text'],
        ['pwd',                 'current directory'],
        ['uname -a',            'system info'],
        ['clear',               'clear the terminal'],
        ['help',                'show this help'],
      ];
      cmds.forEach(([cmd, desc]) => {
        writeln(`  ${g(cmd.padEnd(24))}${d(desc)}`);
      });
      writeln();
    },

    whoami() {
      writeln();
      writeln(`  ${w('sharriy')} ${d('—')} DevOps · Fullstack · Backend`);
      writeln();
      writeln(`  ${d('focus:')}   ${g('Cloud · Containers · Node.js · Automation')}`);
      writeln(`  ${d('cloud:')}   AWS · Azure · GCP`);
      writeln(`  ${d('stack:')}   Kubernetes · Terraform · Node.js · React · PostgreSQL`);
      writeln(`  ${d('editor:')}  nvim ${d('(no shame)')}`);
      writeln(`  ${d('os:')}      Linux ${d('(always)')}`);
      writeln(`  ${d('status:')}  ${g('● available for work')}`);
      writeln(`  ${d('email:')}   shar.ajaz2010@gmail.com`);
      writeln();
    },

    ls(args) {
      const target = args[0] || '';
      if (target === 'blog') {
        writeln();
        writeln(d('  drwxr-xr-x  blog/'));
        const posts = [
          ['kubernetes-guide',       'Kubernetes for DevOps Engineers: The Practical Guide'],
          ['docker-multistage',      'Docker Multi-Stage Builds That Actually Cut Your Image Size'],
          ['github-actions-cicd',    'GitHub Actions: Build Your CI/CD Pipeline in 10 Minutes'],
          ['s3-filesystem-evolution','S3 in 2025: AWS\'s Filesystem Revolution'],
          ['aws-anthropic-cybersec', 'AWS + Anthropic: How AI Is Reshaping Cybersecurity'],
          ['terraform-state',        'Terraform State Management: Don\'t Lose Your Infrastructure'],
        ];
        posts.forEach(([slug, title]) => {
          writeln(`  ${g('-rw-r--r--')}  ${c(slug + '.md')}  ${d(title.slice(0, 42) + '…')}`);
        });
        writeln();
        writeln(d('  → open blog  to visit'));
        writeln();
      } else {
        writeln();
        writeln(d('  total 8'));
        writeln(`  ${g('drwxr-xr-x')}  ${b('projects/')}         ${d('k8s-homelab  ci-templates  erp-platform  +5 more')}`);
        writeln(`  ${g('drwxr-xr-x')}  ${b('blog/')}             ${d('6 posts')}`);
        writeln(`  ${g('-rw-r--r--')}  ${c('about.txt')}         ${d('2.1K')}`);
        writeln(`  ${g('-rw-r--r--')}  ${c('contact.txt')}       ${d('0.4K')}`);
        writeln(`  ${g('-rw-r--r--')}  ${c('stack.yaml')}        ${d('1.2K')}`);
        writeln(`  ${g('-rwxr-xr-x')}  ${y('portfolio.sh')}      ${d('the site you\'re on')}`);
        writeln();
      }
    },

    cat(args) {
      const file = args[0] || '';
      writeln();
      if (file === 'about.txt') {
        writeln(`  DevOps engineer. Fullstack developer.`);
        writeln(`  I build products end-to-end and make infrastructure break less.`);
        writeln();
        writeln(`  Infra:   ${g('Terraform · Kubernetes · CI/CD · AWS/Azure/GCP')}`);
        writeln(`  Product: ${g('Node.js · React · PostgreSQL · Redis · FastAPI')}`);
        writeln();
        writeln(`  ${d('// currently: building things, writing about them, shipping them.')}`);
      } else if (file === 'contact.txt') {
        writeln(`  ${d('email:')}    shar.ajaz2010@gmail.com`);
        writeln(`  ${d('linkedin:')} linkedin.com/in/sharif-ajaz-0965aa319`);
        writeln(`  ${d('github:')}   github.com/sharrey`);
        writeln();
        writeln(`  ${g('● available for work')}  ${d('— DevOps · Fullstack · Backend')}`);
      } else if (file === 'stack.yaml') {
        writeln(c('  # tech stack'));
        writeln();
        writeln(y('  containers:'));
        writeln(`    - ${g('Kubernetes')}  ${d('80%')}`);
        writeln(`    - ${g('Docker')}      ${d('92%')}`);
        writeln(`    - ${g('Helm')}        ${d('70%')}`);
        writeln(y('  cicd:'));
        writeln(`    - ${g('GitHub Actions')} ${d('90%')}`);
        writeln(`    - ${g('Jenkins')}        ${d('80%')}`);
        writeln(`    - ${g('ArgoCD')}         ${d('70%')}`);
        writeln(y('  cloud:'));
        writeln(`    - ${g('AWS')}   ${d('82%')}`);
        writeln(`    - ${g('Azure')} ${d('70%')}`);
        writeln(y('  backend:'));
        writeln(`    - ${g('Node.js')}    ${d('82%')}`);
        writeln(`    - ${g('TypeScript')} ${d('78%')}`);
        writeln(`    - ${g('PostgreSQL')} ${d('74%')}`);
        writeln(`    - ${g('Redis')}      ${d('68%')}`);
        writeln(y('  iac:'));
        writeln(`    - ${g('Terraform')} ${d('80%')}`);
        writeln(`    - ${g('Ansible')}   ${d('72%')}`);
      } else if (file) {
        writeln(`  ${r('cat:')} ${file}: ${r('No such file or directory')}`);
        writeln(`  ${d('try: cat about.txt  |  cat contact.txt  |  cat stack.yaml')}`);
      } else {
        writeln(`  ${r('usage:')} cat <file>`);
      }
      writeln();
    },

    'git'(args) {
      const sub = args[0];
      if (sub === 'log') {
        writeln();
        const commits = [
          ['2ed09a0', 'feat: align content with fullstack/backend profile'],
          ['dec8998', 'refactor: strip distractions, minimal terminal trigger'],
          ['d5bdd6f', 'feat: add ERP, image gen, workflow, cost projects'],
          ['a040761', 'feat: add boot sequence, glitch effect, projects section'],
          ['c00316f', 'feat: sort security advisories by date desc'],
          ['9afafd1', 'chore: ignore .vercel build output directory'],
        ];
        commits.forEach(([hash, msg]) => {
          writeln(`  ${y('commit ' + hash)}`);
          writeln(`  ${d(msg)}`);
          writeln();
        });
      } else {
        writeln();
        writeln(`  ${r('git:')} unknown subcommand '${sub || ''}'`);
        writeln(`  ${d('try: git log')}`);
        writeln();
      }
    },

    'kubectl'(args) {
      const sub = args.slice(0, 2).join(' ');
      writeln();
      if (sub === 'get pods') {
        writeln(d('  NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE'));
        writeln(`  ${c('production')}   api-service-764fd9fc-x9k2p    ${g('1/1')}     ${g('Running')}   0          ${d('14d')}`);
        writeln(`  ${c('production')}   client-ui-55c9d59c-m8bqr      ${g('1/1')}     ${g('Running')}   0          ${d('14d')}`);
        writeln(`  ${c('production')}   postgres-0                    ${g('1/1')}     ${g('Running')}   0          ${d('30d')}`);
        writeln(`  ${c('monitoring')}   prometheus-7b79bdc4-wz9k1     ${g('1/1')}     ${g('Running')}   0          ${d('30d')}`);
        writeln(`  ${c('monitoring')}   grafana-55c9d59c-p2qmn        ${g('1/1')}     ${g('Running')}   1          ${d('30d')}`);
        writeln(`  ${c('infra')}        argocd-server-764fd9f-v7k4p   ${g('1/1')}     ${g('Running')}   0          ${d('30d')}`);
      } else if (sub === 'get nodes') {
        writeln(d('  NAME           STATUS   ROLES           AGE   VERSION'));
        writeln(`  control-plane  ${g('Ready')}    control-plane   30d   ${d('v1.29.2')}`);
        writeln(`  worker-01      ${g('Ready')}    <none>          30d   ${d('v1.29.2')}`);
        writeln(`  worker-02      ${g('Ready')}    <none>          30d   ${d('v1.29.2')}`);
      } else {
        writeln(`  ${r('error:')} unknown kubectl command`);
        writeln(`  ${d('try: kubectl get pods  |  kubectl get nodes')}`);
      }
      writeln();
    },

    docker(args) {
      const sub = args[0];
      writeln();
      if (sub === 'ps') {
        writeln(d('  CONTAINER ID   IMAGE                  STATUS          PORTS'));
        writeln(`  ${d('a1b2c3d4e5f6')}   ${c('nginx:1.25-alpine')}     ${g('Up 14 days')}      ${d('0.0.0.0:80->80/tcp')}`);
        writeln(`  ${d('b7e8f9a0c1d2')}   ${c('node:20-alpine')}        ${g('Up 14 days')}      ${d('0.0.0.0:3000->3000/tcp')}`);
        writeln(`  ${d('c3d4e5f6a7b8')}   ${c('postgres:16-alpine')}    ${g('Up 30 days')}      ${d('5432/tcp')}`);
        writeln(`  ${d('d9e0f1a2b3c4')}   ${c('redis:7-alpine')}        ${g('Up 30 days')}      ${d('6379/tcp')}`);
      } else {
        writeln(`  ${r('docker:')} unknown command`);
        writeln(`  ${d('try: docker ps')}`);
      }
      writeln();
    },

    open(args) {
      const page = args[0];
      const routes = { blog: '/blog', about: '/about', projects: '/#projects', contact: '/#contact', home: '/' };
      writeln();
      if (routes[page]) {
        writeln(`  ${g('→')} navigating to ${c(page)}…`);
        writeln();
        setTimeout(() => { window.location.href = routes[page]; }, 600);
      } else {
        writeln(`  ${r('open:')} unknown page '${page || ''}'`);
        writeln(`  ${d('available:')} home · about · blog · projects · contact`);
        writeln();
      }
    },

    echo(args) {
      writeln();
      writeln('  ' + args.join(' '));
      writeln();
    },

    pwd() {
      writeln();
      writeln(`  ${g('/home/sharriy/portfolio')}`);
      writeln();
    },

    'uname'(args) {
      const flag = args[0];
      writeln();
      if (flag === '-a' || flag === '-s') {
        writeln(`  Linux sharriy-devops 6.1.0-k8s #1 SMP ${g('x86_64')} GNU/Linux`);
      } else {
        writeln('  Linux');
      }
      writeln();
    },

    clear() {
      term.clear();
    },
  };

  // ── Input handling ─────────────────────────────────────────
  let currentLine = '';
  let historyList = [];
  let historyIdx  = -1;

  function runCommand(raw) {
    const line  = raw.trim();
    if (!line) { writeln(); showPrompt(); return; }

    historyList.unshift(line);
    historyIdx = -1;

    const parts  = line.split(/\s+/);
    const cmd    = parts[0].toLowerCase();
    const args   = parts.slice(1);

    writeln();

    const handler = COMMANDS[cmd];
    if (handler) {
      handler(args);
    } else {
      writeln(`  ${r('command not found:')} ${cmd}  ${d('— type help for a list')}`);
      writeln();
    }

    showPrompt();
  }

  term.onData(data => {
    const code = data.charCodeAt(0);

    // Ctrl+C
    if (data === '\x03') {
      write('^C');
      writeln();
      currentLine = '';
      historyIdx  = -1;
      showPrompt();
      return;
    }

    // Ctrl+L
    if (data === '\x0c') {
      COMMANDS.clear();
      showPrompt();
      return;
    }

    // Enter
    if (data === '\r') {
      runCommand(currentLine);
      currentLine = '';
      return;
    }

    // Backspace
    if (data === '\x7f') {
      if (currentLine.length > 0) {
        currentLine = currentLine.slice(0, -1);
        write('\b \b');
      }
      return;
    }

    // Arrow up — history previous
    if (data === '\x1b[A') {
      if (historyList.length === 0) return;
      historyIdx = Math.min(historyIdx + 1, historyList.length - 1);
      const entry = historyList[historyIdx];
      // Clear current line
      write('\r' + prompt() + ' '.repeat(currentLine.length) + '\r' + prompt());
      currentLine = entry;
      write(currentLine);
      return;
    }

    // Arrow down — history next
    if (data === '\x1b[B') {
      if (historyIdx <= 0) {
        historyIdx = -1;
        write('\r' + prompt() + ' '.repeat(currentLine.length) + '\r' + prompt());
        currentLine = '';
        return;
      }
      historyIdx--;
      const entry = historyList[historyIdx];
      write('\r' + prompt() + ' '.repeat(currentLine.length) + '\r' + prompt());
      currentLine = entry;
      write(currentLine);
      return;
    }

    // Ignore other escape sequences
    if (code === 27) return;

    // Printable character
    currentLine += data;
    write(data);
  });

  // ── Welcome banner ────────────────────────────────────────
  writeln(d('  ┌──────────────────────────────────────────────────┐'));
  writeln(`  ${d('│')}  ${g('sharriy@portfolio')} ${d('~')}                              ${d('│')}`);
  writeln(`  ${d('│')}  ${d('type')} ${g('help')} ${d('to see available commands')}           ${d('│')}`);
  writeln(d('  └──────────────────────────────────────────────────┘'));
  writeln();
  showPrompt();
});
