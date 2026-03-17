// --- 1. RELÓGIO ATUALIZADO ---
function atualizarHorario() {
    const elementoRelogio = document.getElementById('current-time');
    const agora = new Date();
    const horarioFormatado = agora.toLocaleTimeString(undefined, {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    elementoRelogio.textContent = horarioFormatado;
}
atualizarHorario();
setInterval(atualizarHorario, 1000);

// --- 2. ANIMAÇÃO INDEPENDENTE E MULTIPLICADA DAS LETRAS ---
const containerLetras = document.querySelector('.letters-container');
const spansOriginais = document.querySelectorAll('.letters-container span');

// Multiplica a quantidade de letras (4 cópias)
for (let i = 0; i < 4; i++) {
    spansOriginais.forEach(span => {
        containerLetras.appendChild(span.cloneNode(true));
    });
}

const todasAsLetras = document.querySelectorAll('.letters-container span');

function animarLetra(span) {
    const topRandom = Math.random() * 80 + 10; 
    
    // Duração da animação (entre 5s e 15s)
    const duration = (Math.random() * 10 + 5) * 1000; 
    
    // O SEGREDO: Delay negativo faz a animação começar como se já estivesse rodando
    // Isso espalha as letras na tela desde o segundo zero, sem surgirem do nada
    const delay = -(Math.random() * duration); 
    
    const opacity = Math.random() * 0.7 + 0.1; 
    const direction = Math.random() > 0.5 ? 1 : -1; 

    span.style.top = `${topRandom}%`;
    span.style.opacity = opacity;
    
    // Zeramos o left para que o translateX assuma 100% do controle
    span.style.left = '0px';

    // Valores fixos (-300px) garantem que a letra fique totalmente escondida antes de retornar
    const startX = direction === 1 ? '-300px' : 'calc(100vw + 300px)';
    const endX = direction === 1 ? 'calc(100vw + 300px)' : '-300px';

    span.animate([
        { transform: `translateX(${startX})` },
        { transform: `translateX(${endX})` }
    ], {
        duration: duration,
        iterations: Infinity,
        easing: 'linear',
        delay: delay // Aplica o delay negativo aqui
    });
}

// Inicializa a animação
todasAsLetras.forEach(animarLetra);

// --- 3. RASTRO DO MOUSE (CANVAS) CORRIGIDO ---
const canvas = document.getElementById('mouse-trail');
const ctx = canvas.getContext('2d');

let points = [];
const maxAge = 40; // Tempo que o rastro demora para sumir (quanto maior, mais longo o rastro)

// Ajusta o tamanho do canvas para o tamanho da tela
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Captura o movimento do mouse
window.addEventListener('mousemove', (e) => {
    points.push({ x: e.clientX, y: e.clientY, age: 0 });
});

// Função de desenho contínuo
function drawTrail() {
    // Limpa a tela a cada frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o rastro ligando os pontos
    for (let i = 0; i < points.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        
        // Calcula a transparência: os pontos mais velhos ficam mais transparentes
        const opacity = 1 - (points[i].age / maxAge);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 3; // Espessura da linha
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    // Aumenta a "idade" de cada ponto
    points.forEach(p => p.age += 1);
    
    // Filtra e remove os pontos que já passaram do tempo de vida
    points = points.filter(p => p.age < maxAge);

    // CHAVE DO SUCESSO: O loop continua rodando mesmo se o mouse estiver parado!
    requestAnimationFrame(drawTrail);
}

// Inicia o loop de animação
drawTrail();

// --- 4. CONTROLE DO MENU E LINKS ---
const workBtn = document.getElementById('work-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const linksDropdown = document.querySelectorAll('.dropdown-menu a');
const sections = document.querySelectorAll('.portfolio-section');

// Ação de abrir/fechar ao clicar em "WORK"
workBtn.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
        event.preventDefault(); 
        dropdownMenu.classList.toggle('mostrar-no-celular');
    }
});

// Ação de fechar ao clicar em uma categoria (Long-form, Short-form, etc)
linksDropdown.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();

        // Faz a troca das seções
        const targetId = this.getAttribute('href').substring(1);
        sections.forEach(sec => sec.classList.remove('ativo'));
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('ativo');
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        // FECHA O DROPDOWN garantido
        dropdownMenu.classList.remove("mostrar-no-celular");
    });
});

// Fechar o menu se o usuário tocar fora dele
document.addEventListener('click', function(event) {
    if (!workBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('mostrar-no-celular');
    }
});

const emailSpan = document.getElementById('email-span');
// Guarda o seu email em uma variável
const meuEmail = 'lucasaqs@gmail.com';

// Adiciona um evento de "clique" no elemento
emailSpan.addEventListener('click', function() {
            
            // API moderna para copiar texto para a área de transferência do usuário
    navigator.clipboard.writeText(meuEmail).then(() => {
                
                // Muda o texto para "Copied!" quando a cópia for bem-sucedida
        emailSpan.textContent = 'Copied!';
                
                // Espera 1000 milissegundos (1 segundo) e volta para o email original
            setTimeout(() => {
                emailSpan.textContent = meuEmail;
            }, 1000);
                
         }).catch(err => {
            console.error('Erro ao copiar o texto: ', err);
     });
});