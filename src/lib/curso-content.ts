// AUTO-GERADO — Conteúdo completo das 37 aulas do Trade Master Pro
// Atualizado: 05/03/2026
// Cada chave corresponde ao slug da aula em curso-data.ts

export const LESSON_CONTENT: Record<string, string> = {
  "mindset": `
<div class="blockquote">
  <div class="blockquote-text">O mercado não é seu inimigo. Sua mente é. O mercado apenas reflete, com brutalidade matemática, as decisões que você toma sob pressão emocional.</div>
  <div class="blockquote-author">— Mark Douglas · Trading in the Zone</div>
</div>

<h2><span class="h2-num">1</span> A Estatística Que Ninguém Quer Mostrar</h2>
<p>Antes de qualquer gráfico, antes de qualquer indicador, precisamos encarar um número que a indústria prefere esconder. Uma pesquisa com mais de 19.000 traders brasileiros de day trade mostrou que <strong>apenas 3% lucraram de forma consistente por mais de 300 dias</strong>. O mais revelador: quem parou de perder não aprendeu mais indicadores — adotou um <em>processo disciplinado de mentalidade e risco</em>.</p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">80%</div><div class="kpi-label">Perdem dinheiro no 1º ano</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">95%</div><div class="kpi-label">Perdem em 3 anos</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">5%</div><div class="kpi-label">Lucram de forma consistente</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">100%</div><div class="kpi-label">Dos 5% têm um processo</div></div>
</div>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Por Que Você Ainda Vai Perder Antes de Ganhar</div>
  <p>Não é pessimismo — é estatística. Todo trader profissional perdeu antes de lucrar consistentemente. A diferença é que o profissional <strong>usou cada perda como dado para melhorar o processo</strong>. O amador usou como combustível para revenge trade — e saiu do mercado destruído. Este módulo existe para você não cometer esse erro.</p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">O Ciclo da Destruição vs O Ciclo do Profissional</div>
  <svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- LEFT: Destruction cycle -->
    <rect x="10" y="10" width="330" height="190" rx="8" fill="#0a1628" stroke="#600" stroke-width="1.5"/>
    <text x="175" y="30" text-anchor="middle" font-size="11" fill="#e8394a" font-family="sans-serif" font-weight="700">❌ Ciclo da Destruição</text>
    <!-- Steps in circle -->
    <circle cx="175" cy="110" r="60" fill="none" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="4,4"/>
    <!-- Node 1 top -->
    <rect x="135" y="50" width="80" height="22" rx="5" fill="#c0392b" opacity=".2" stroke="#c0392b" stroke-width="1"/>
    <text x="175" y="65" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif">FOMO → Entra tarde</text>
    <!-- Node 2 right -->
    <rect x="218" y="100" width="80" height="22" rx="5" fill="#c0392b" opacity=".2" stroke="#c0392b" stroke-width="1"/>
    <text x="258" y="115" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif">Sem stop → Segura</text>
    <!-- Node 3 bottom -->
    <rect x="135" y="150" width="80" height="22" rx="5" fill="#c0392b" opacity=".2" stroke="#c0392b" stroke-width="1"/>
    <text x="175" y="165" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif">Perda grande</text>
    <!-- Node 4 left -->
    <rect x="32" y="100" width="80" height="22" rx="5" fill="#c0392b" opacity=".2" stroke="#c0392b" stroke-width="1"/>
    <text x="72" y="115" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif">Revenge trade</text>
    <!-- Arrows -->
    <path d="M 215,61 Q 248,70 248,98" fill="none" stroke="#e8394a" stroke-width="1.5" marker-end="url(#arrR)"/>
    <path d="M 245,124 Q 240,148 215,158" fill="none" stroke="#e8394a" stroke-width="1.5" marker-end="url(#arrR)"/>
    <path d="M 133,158 Q 100,150 110,124" fill="none" stroke="#e8394a" stroke-width="1.5" marker-end="url(#arrR)"/>
    <path d="M 108,98 Q 118,72 133,64" fill="none" stroke="#e8394a" stroke-width="1.5" marker-end="url(#arrR)"/>
    <defs>
      <marker id="arrR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#e8394a"/></marker>
      <marker id="arrG" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#00d68f"/></marker>
    </defs>

    <!-- RIGHT: Professional cycle -->
    <rect x="380" y="10" width="330" height="190" rx="8" fill="#0a1628" stroke="#005C3A" stroke-width="1.5"/>
    <text x="545" y="30" text-anchor="middle" font-size="11" fill="#00d68f" font-family="sans-serif" font-weight="700">✓ Ciclo do Profissional</text>
    <circle cx="545" cy="110" r="60" fill="none" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="4,4"/>
    <!-- Node 1 top -->
    <rect x="505" y="50" width="80" height="22" rx="5" fill="#005C3A" opacity=".3" stroke="#00d68f" stroke-width="1"/>
    <text x="545" y="65" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">Analisa → Score</text>
    <!-- Node 2 right -->
    <rect x="588" y="100" width="84" height="22" rx="5" fill="#005C3A" opacity=".3" stroke="#00d68f" stroke-width="1"/>
    <text x="630" y="115" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">Entra com stop</text>
    <!-- Node 3 bottom -->
    <rect x="505" y="150" width="80" height="22" rx="5" fill="#005C3A" opacity=".3" stroke="#00d68f" stroke-width="1"/>
    <text x="545" y="165" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">TP ou stop: ok</text>
    <!-- Node 4 left -->
    <rect x="398" y="100" width="84" height="22" rx="5" fill="#005C3A" opacity=".3" stroke="#00d68f" stroke-width="1"/>
    <text x="440" y="115" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">Documenta</text>
    <!-- Arrows -->
    <path d="M 585,61 Q 618,70 618,98" fill="none" stroke="#00d68f" stroke-width="1.5" marker-end="url(#arrG)"/>
    <path d="M 615,124 Q 610,148 585,158" fill="none" stroke="#00d68f" stroke-width="1.5" marker-end="url(#arrG)"/>
    <path d="M 503,158 Q 470,150 478,124" fill="none" stroke="#00d68f" stroke-width="1.5" marker-end="url(#arrG)"/>
    <path d="M 476,98 Q 488,72 503,64" fill="none" stroke="#00d68f" stroke-width="1.5" marker-end="url(#arrG)"/>
    <!-- Center: melhora -->
    <text x="545" y="108" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">Melhora</text>
    <text x="545" y="120" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">contínua</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> O Ciclo da Destruição — Você Reconhece Esse Padrão?</h2>
<p>Existe um ciclo psicológico que destrói 9 em cada 10 traders. Ele não é aleatório — é previsível, documentado e evitável quando você o conhece:</p>

<div class="steps">
  <div class="step-card" style="border-color:var(--border);border-left:3px solid var(--gold)">
    <div class="step-num" style="background:linear-gradient(135deg,#7B5C00,#f0a500)">1</div>
    <div class="step-content">
      <h4>🤑 Euforia Inicial — "Isso é fácil!"</h4>
      <p>Você entra no mercado, faz 2 ou 3 trades e ganha por sorte ou bull market. Sente que "nasceu para isso". Aumenta posições. A <strong>confiança ultrapassa a competência</strong> em larga margem — essa é a zona mais perigosa do desenvolvimento de um trader.</p>
    </div>
  </div>
  <div class="step-card" style="border-color:var(--border);border-left:3px solid var(--amber)">
    <div class="step-num" style="background:linear-gradient(135deg,#8B3A00,#e67e22)">2</div>
    <div class="step-content">
      <h4>😰 Primeira Grande Perda — "Vai voltar..."</h4>
      <p>Uma perda inesperada aparece. Você não fecha. "Vai voltar." O preço continua caindo. Você remove o stop para "dar mais espaço". O que era -3% controlado vira -20% devastador. Paralisia emocional.</p>
    </div>
  </div>
  <div class="step-card" style="border-color:var(--border);border-left:3px solid var(--red)">
    <div class="step-num" style="background:linear-gradient(135deg,#8B0000,#e8394a)">3</div>
    <div class="step-content">
      <h4>😡 Revenge Trade — "Vou recuperar agora"</h4>
      <p>Você fecha no prejuízo e <em>imediatamente</em> abre posição maior para "recuperar". Opera com raiva, sem análise, sem setup. Segunda perda, agora maior. O estado emocional degradado produz decisões em espiral descendente.</p>
    </div>
  </div>
  <div class="step-card" style="border-color:var(--border);border-left:3px solid var(--gray3)">
    <div class="step-num" style="background:linear-gradient(135deg,#1e304d,#4d6a8f)">4</div>
    <div class="step-content">
      <h4>😶 Abandono Sem Mudança de Fundação</h4>
      <p>O trader para por meses. Volta com nova conta, novos indicadores, <strong>mesmo comportamento emocional</strong>. O ciclo reinicia. A única coisa que quebra esse padrão é mudar a fundação mental — não a ferramenta técnica.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">3</span> A Verdade Matemática Que Liberta</h2>
<p>A maioria dos traders acredita que precisa ter razão na maioria das vezes para lucrar. Isso é <strong>fundamentalmente falso</strong> e é a causa raiz de contas destruídas. Veja os números:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead>
  <tr><th>Perfil</th><th>Taxa de Acerto</th><th>R:R Médio</th><th>Resultado em 100 Trades</th><th>Lucro Total</th></tr>
</thead>
<tbody>
  <tr>
    <td class="td-em" style="color:var(--red)">Trader Emocional</td>
    <td>72%</td><td>1 : 0.4</td>
    <td>72 ganhos × 0.4 = 28.8R<br>28 perdas × 1 = 28R</td>
    <td class="td-red td-em">+0.8R ≈ ZERO (após custos: negativo)</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--gold)">Trader Disciplinado</td>
    <td>50%</td><td>1 : 2</td>
    <td>50 ganhos × 2 = 100R<br>50 perdas × 1 = 50R</td>
    <td class="td-gold td-em">+50R — LUCRATIVO</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--green)">Analista TMP</td>
    <td>45%</td><td>1 : 3</td>
    <td>45 ganhos × 3 = 135R<br>55 perdas × 1 = 55R</td>
    <td class="td-green td-em">+80R — EXCELENTE</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--cyan)">Analista Elite</td>
    <td>40%</td><td>1 : 5</td>
    <td>40 ganhos × 5 = 200R<br>60 perdas × 1 = 60R</td>
    <td class="td-cyan td-em">+140R — ELITE</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-gold">
  <div class="callout-title">🧮 A Fórmula da Expectativa — Memorize Isso</div>
  <p style="font-family:var(--font-mono);font-size:13px;color:var(--cyan);margin-bottom:10px;text-align:center">Expectativa = (% Acerto × Ganho Médio) − (% Erro × Perda Média)</p>
  <p><strong>Com 40% acerto e R:R 1:3 →</strong> (0.40 × 3) − (0.60 × 1) = 1.20 − 0.60 = <strong style="color:var(--green)">+0.60R por trade</strong><br>
  <strong>Com 70% acerto e R:R 1:0.5 →</strong> (0.70 × 0.5) − (0.30 × 1) = 0.35 − 0.30 = <strong style="color:var(--amber)">+0.05R por trade (frágil!)</strong><br><br>
  <strong>Conclusão:</strong> R:R alto protege sua conta muito melhor do que taxa de acerto alta. Foque no R:R — a taxa de acerto vem como consequência de um processo sólido.</p>
</div>

<h2><span class="h2-num">4</span> Os 7 Assassinos de Conta — Anatomia Completa</h2>
<p>Não são apenas erros técnicos. São <strong>padrões psicológicos previsíveis</strong> que se ativam sob pressão. Conhecê-los é o primeiro passo para desarmá-los.</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">01</div>
  <div class="rule-content">
    <h4>😱 FOMO — Fear Of Missing Out</h4>
    <p><strong>O que é:</strong> Entrar porque o preço está subindo rápido e você "não quer perder o movimento".<br>
    <strong>Por que mata:</strong> Você entra no topo, sem análise, sem stop definido, no pior R:R possível.<br>
    <strong>Exemplo real XRP:</strong> Alta de $1.12 → $3.66 em jan/2026. Traders entram em $3.40 por FOMO. XRP cai para $1.11. Perda de 67% para quem entrou no topo.<br>
    <strong>Antídoto:</strong> O processo define quando entrar. Se perdeu o setup: <em>aguarda o próximo</em>. Sempre haverá outro.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">02</div>
  <div class="rule-content">
    <h4>🚫 Operar Sem Stop Loss Definido</h4>
    <p><strong>O que é:</strong> Entrar em posição sem definir antecipadamente o ponto de saída em caso de erro.<br>
    <strong>Por que mata:</strong> Uma perda controlada de 3% pode virar 30%, 50% ou 100% se o ativo colapsar.<br>
    <strong>A mentira que você conta para si mesmo:</strong> "Vou monitorar de perto e sair manualmente." Você não vai. Sob pressão emocional o cérebro paralisa ou racionaliza para não fechar.<br>
    <strong>Antídoto:</strong> Stop colocado no momento da entrada. Nunca depois. Nunca movido <em>contra</em> a posição.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">03</div>
  <div class="rule-content">
    <h4>💣 Posição Desproporcional</h4>
    <p><strong>O que é:</strong> Alocar mais capital do que o processo permite em um único trade.<br>
    <strong>Por que mata:</strong> Um único trade mal dimensionado destrói semanas ou meses de lucros.<br>
    <strong>Exemplo:</strong> 40% do portfólio em XRP + queda de 30% = −12% do capital total em 1 trade.<br>
    <strong>Antídoto:</strong> Máximo 1.5% do capital em risco por trade. Máximo 15% do portfólio em 1 ativo. Sem exceção.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">04</div>
  <div class="rule-content">
    <h4>🌊 Ignorar o Contexto Macro</h4>
    <p><strong>O que é:</strong> Comprar XRP olhando só o gráfico do XRP, ignorando que BTC está em downtrend e F&G está em 5.<br>
    <strong>Por que mata:</strong> No mercado cripto, BTC e macro ditam 70% do movimento de altcoins no curto prazo.<br>
    <strong>Exemplo real:</strong> Anúncio de tarifas Trump em 23/02/2026 → BTC −5% → XRP, ETH, SOL caem em cascata.<br>
    <strong>Antídoto:</strong> Fase 1 do método: SEMPRE análise macro antes de qualquer gráfico individual.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">05</div>
  <div class="rule-content">
    <h4>🔄 Revenge Trade</h4>
    <p><strong>O que é:</strong> Após uma perda, abrir outra posição maior imediatamente para "recuperar".<br>
    <strong>Por que mata:</strong> Você opera com raiva, não com análise. Estado emocional degradado → decisões ruins em série.<br>
    <strong>Sinal de alerta:</strong> Se você pensa "preciso recuperar essa perda hoje", está prestes a cometer revenge trade.<br>
    <strong>Antídoto:</strong> Regra inviolável: após qualquer loss, mínimo 60 minutos de pausa antes da próxima decisão.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">06</div>
  <div class="rule-content">
    <h4>📈 Overtrading — "Preciso Estar no Mercado"</h4>
    <p><strong>O que é:</strong> Operar com frequência excessiva mesmo sem setup válido, por ansiedade ou compulsão.<br>
    <strong>Por que mata:</strong> Cada trade sem edge real é um jogo de azar com spreads e taxas corroendo o capital.<br>
    <strong>Dado real:</strong> Traders que fazem mais de 10 trades/dia têm performance 3× pior que os que fazem 1–3 trades seletivos.<br>
    <strong>Antídoto:</strong> Máx 3 trades simultâneos. Sem setup = fora do mercado. Não operar é uma posição legítima.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">07</div>
  <div class="rule-content">
    <h4>🎯 Mover Stop Contra a Posição</h4>
    <p><strong>O que é:</strong> Quando o preço se aproxima do stop, mover o stop para baixo (em longs) "dando mais espaço".<br>
    <strong>Por que mata:</strong> Transforma perda controlada e planejada em perda descontrolada e crescente.<br>
    <strong>A ilusão:</strong> "Só dessa vez. Tenho certeza que vai voltar." — Cada trader que quebrou conta pensou exatamente isso.<br>
    <strong>Antídoto:</strong> Stop no nível técnico correto desde o início. Uma vez colocado, só pode ser movido <em>a favor</em> da posição.</p>
  </div>
</div>

<h2><span class="h2-num">5</span> O Conceito de Capital Emocional</h2>
<p>Existe um recurso que a maioria nunca considera: o <strong>capital emocional</strong>. Assim como você tem capital financeiro, você tem capital emocional — energia mental, foco e equilíbrio para tomar decisões de qualidade. Ele se esgota.</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Capital Emocional ALTO ✅</th><th>Capital Emocional BAIXO ❌</th></tr></thead>
<tbody>
  <tr><td class="td-green">Análise clara e objetiva</td><td class="td-red">Análise turva, viés de confirmação forte</td></tr>
  <tr><td class="td-green">Stop loss respeitado automaticamente</td><td class="td-red">Stop removido, posição "segurada" contra a lógica</td></tr>
  <tr><td class="td-green">Aceita a incerteza como parte do jogo</td><td class="td-red">Precisa de certeza antes de qualquer ação</td></tr>
  <tr><td class="td-green">Perda = dado valioso para melhorar o processo</td><td class="td-red">Perda = ameaça ao ego, motiva revenge trade</td></tr>
  <tr><td class="td-green">Sem setup = fica de fora tranquilamente</td><td class="td-red">Sem setup = ansiedade, cria trade artificial</td></tr>
  <tr><td class="td-green">Segue o plano mesmo sem "feeling" no momento</td><td class="td-red">Abandona o plano por impulso emocional</td></tr>
</tbody>
</table>
</div>

<div class="callout callout-info">
  <div class="callout-title">💡 Como Preservar Capital Emocional — 4 Práticas Concretas</div>
  <p>
    <strong>1. Sono adequado:</strong> Pesquisa da Universidade da Pennsylvania mostra que decisões tomadas com menos de 6h de sono têm qualidade comparável às tomadas com 0.08% de álcool no sangue.<br><br>
    <strong>2. Limite de perda diário:</strong> Defina um número. "Se eu perder X% hoje, paro e analiso amanhã." Automatiza a proteção sem depender de disciplina no calor do momento.<br><br>
    <strong>3. Pausa após sequência negativa:</strong> 2 losses seguidos = 60 minutos de pausa obrigatória. 3 losses = sessão encerrada.<br><br>
    <strong>4. Separe trading da identidade:</strong> Você não é seus resultados. Um dia ruim não define quem você é. Essa separação protege o capital emocional para o próximo dia.
  </p>
</div>

<h2><span class="h2-num">6</span> Protocolo de Preparação Diária — Os 4 Blocos</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">🧘</div>
    <div class="step-content">
      <h4>BLOCO 1 — Check Mental (3 min) — Antes de Abrir Qualquer Plataforma</h4>
      <p>Responda honestamente:</p>
      <ul>
        <li><strong>"Estou descansado e em equilíbrio emocional?"</strong> — Se não: não opera hoje.</li>
        <li><strong>"Tenho perda recente que ainda me incomoda?"</strong> — Se sim: risco de revenge trade alto.</li>
        <li><strong>"Estou operando por escolha ou por necessidade financeira urgente?"</strong> — Se urgência: capital emocional comprometido.</li>
      </ul>
      <p style="color:var(--gold);margin-top:8px"><strong>⚠️ Se 2 de 3 respostas forem problemáticas → sessão cancelada. Sem exceção.</strong></p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">📓</div>
    <div class="step-content">
      <h4>BLOCO 2 — Revisão do Diário (5 min)</h4>
      <ul>
        <li>Leia os últimos 3 trades: ganhos E perdas, sem julgamento</li>
        <li>Existe padrão de erro se repetindo? (ex: "sempre perco em longs quando ADX &lt; 20")</li>
        <li>Há posições abertas? Status do stop e TP ainda fazem sentido?</li>
        <li>Confirme os níveis críticos definidos no dia anterior</li>
      </ul>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">🌍</div>
    <div class="step-content">
      <h4>BLOCO 3 — Contexto Macro (10 min)</h4>
      <ul>
        <li>BTC: tendência atual, preço, variação 24h, suporte/resistência crítico</li>
        <li>Fear & Greed Index: valor atual e tendência nos últimos 3 dias</li>
        <li>Dominância BTC: Bitcoin Season (&gt;55%) ou Altcoin Season (&lt;50%)?</li>
        <li>Liquidações 24h: longs ou shorts sendo mais destruídos? Volume total?</li>
        <li>Evento macro hoje? (Fed, CPI, payroll, anúncio político relevante)</li>
      </ul>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">📋</div>
    <div class="step-content">
      <h4>BLOCO 4 — Revisão de Setups (10 min)</h4>
      <ul>
        <li>Quais ativos monitorados atingiram os alertas de preço definidos ontem?</li>
        <li>Há setup formado? Quantos dos 5 filtros de confirmação estão ativos?</li>
        <li>Se sim: defina entrada, stop e take profit ANTES de abrir qualquer ordem</li>
        <li>Se não há setup qualificado: feche a plataforma. Não operar é uma posição legítima.</li>
      </ul>
    </div>
  </div>
</div>

<h2><span class="h2-num">7</span> Autodiagnóstico — Onde Você Está Agora?</h2>
<p>Marque o que você já viveu. Não existe resposta certa — existe autoconhecimento honesto:</p>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Já entrei em trade por FOMO nos últimos 3 meses</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Já fiz revenge trade imediatamente após uma perda</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Já removi ou movi stop loss contra a posição esperando "voltar"</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Já coloquei mais de 20% do capital em um único ativo</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Já operei sem stop loss pré-definido antes da entrada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Já continuei operando após sequência de 3+ perdas no mesmo dia</div></div>
</div>

<div class="callout callout-success">
  <div class="callout-title">🏆 O Que Fazer com Este Diagnóstico</div>
  <p>Se você marcou 3 ou mais: você está no grupo dos 95% — <em>ainda</em>. A boa notícia: você está aqui, reconhece o padrão, e isso é o primeiro passo real de mudança. Os próximos módulos constroem o processo que elimina esses comportamentos, um de cada vez, com ferramentas concretas e mensuráveis. Não é motivação — é engenharia de processo.</p>
</div>`,

  "pilares": `
<div class="blockquote">
  <div class="blockquote-text">Não são os eventos externos que nos perturbam, mas nossa interpretação sobre eles. Você não pode controlar o mercado — mas pode controlar sua resposta.</div>
  <div class="blockquote-author">— Epicteto · adaptado para o trading moderno</div>
</div>

<h2><span class="h2-num">1</span> Por Que Mindset Antes de Técnica</h2>
<p>A maioria dos cursos começa pelo indicador. O Trade Master Pro começa pela mente. Motivo simples: <strong>você pode ter o melhor método técnico do mundo e ainda assim perder tudo</strong> se não tiver a fundação mental para executá-lo sob pressão. O ser humano não foi projetado para tomar boas decisões financeiras sob estresse — nosso cérebro primitivo confunde volatilidade de mercado com ameaça à sobrevivência, ativando respostas de luta ou fuga que são catastróficas para o trading.</p>

<div class="callout callout-info">
  <div class="callout-title">🧠 Neurociência do Trading — Por Que É Tão Difícil</div>
  <p>Pesquisas de neuroeconomia (Camerer, Loewenstein, Prelec) mostram que:<br>
  • <strong>Perder $100 causa 2× mais sofrimento</strong> do que ganhar $100 causa prazer — isso faz traders segurarem perdas<br>
  • A amígdala (centro do medo) ativa-se em <strong>0.07 segundos</strong> ao ver patrimônio caindo — mais rápido que qualquer pensamento racional<br>
  • Após uma ganância, o córtex pré-frontal (pensamento racional) <strong>reduz atividade</strong> — literalmente fica menos inteligente no pico da euforia<br><br>
  Conclusão: sem processo estruturado, você está literalmente brigando contra a biologia.</p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Os 5 Pilares do Método TMP</div>
  <div class="pillars-grid-tmpl">
    <div class="pillar-c" style="--p-color: var(--gold)">
      <div class="p-icon">🧠</div>
      <div class="p-title">Mindset</div>
      <div class="p-desc">Processo sobre<br>resultado<br>Regras absolutas</div>
    </div>
    <div class="pillar-c" style="--p-color: var(--bright)">
      <div class="p-icon">📊</div>
      <div class="p-title">Contexto</div>
      <div class="p-desc">F&amp;G · BTC.D<br>On-chain<br>Notícias SCN</div>
    </div>
    <div class="pillar-c" style="--p-color: var(--green)">
      <div class="p-icon">📈</div>
      <div class="p-title">Análise Técnica</div>
      <div class="p-desc">Estrutura · S/R · Fib<br>Indicadores TMP<br>MTF completo</div>
    </div>
    <div class="pillar-c" style="--p-color: var(--purple)">
      <div class="p-icon">🎲</div>
      <div class="p-title">Probabilidades</div>
      <div class="p-desc">3 Cenários<br>Score de pontos<br>Expectativa R</div>
    </div>
    <div class="pillar-c" style="--p-color: var(--red)">
      <div class="p-icon">🛡️</div>
      <div class="p-title">Gestão de Risco</div>
      <div class="p-desc">Sizing preciso<br>Stop · TP escalonado<br>Máx 2% por trade</div>
    </div>
  </div>
  <div style="text-align:center;font-size:11px;color:var(--gray3);font-family:var(--font-sans);margin-top:12px">Todos os 5 pilares devem estar presentes — nenhum substitui o outro</div>
</div>
<h2><span class="h2-num">2</span> Os 5 Pilares — Cada Um com Profundidade Prática</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">01</div>
  <div class="rule-content">
    <h4>🔬 Pilar 1 — Processo Acima de Resultado</h4>
    <p><strong>O conceito:</strong> Julgue cada decisão pela qualidade do processo que a gerou — não pelo resultado que produziu. Uma boa decisão pode dar errado (o mercado é probabilístico). Uma decisão ruim pode dar certo por sorte. Se você avalia suas decisões pelo resultado, aprenderá lições erradas do mercado.</p>
    <p><strong>Exemplo prático:</strong> Você analisa XRP, identifica suporte confluente, R:R 1:3, 4 filtros ativos. Entra. O preço cai por uma notícia inesperada e o stop é atingido. Isso foi um <em>bom trade</em> — a decisão foi correta, o resultado foi adverso. A diferença entre as duas perspectivas define a evolução a longo prazo.</p>
    <div class="callout callout-gold" style="margin-top:10px">
      <div class="callout-title">💬 Pergunta Que Muda Tudo</div>
      <p>Substitua "Ganhei ou perdi nesse trade?" por <strong>"Segui meu processo nesse trade?"</strong> Essa mudança de pergunta, praticada consistentemente, é o que diferencia o amador do profissional.</p>
    </div>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">02</div>
  <div class="rule-content">
    <h4>📊 Pilar 2 — Probabilidade Acima de Certeza</h4>
    <p><strong>O conceito:</strong> O mercado é um sistema probabilístico, não determinístico. Nenhum método, nenhum indicador, nenhuma análise garante resultado certo. Quem busca certeza no trading sofre quando a incerteza inevitavelmente aparece.</p>
    <p><strong>A mudança de linguagem:</strong></p>
    <div class="data-table-wrap" style="margin:8px 0">
    <table class="data-table">
    <thead><tr><th>❌ Linguagem do Amador</th><th>✅ Linguagem do Profissional</th></tr></thead>
    <tbody>
      <tr><td>"XRP vai subir"</td><td>"Dado o contexto, probabilidade de alta nas próximas 48h: 55%"</td></tr>
      <tr><td>"Tenho certeza que vai voltar"</td><td>"A tese técnica é válida enquanto preço &gt; $1.32 — abaixo, erro"</td></tr>
      <tr><td>"Esse é o fundo"</td><td>"Há sinais de exaustão vendedora. Entrada parcial com confirmação."</td></tr>
      <tr><td>"Não vou perder nessa"</td><td>"Risco definido: $75. Se atingir SL, aceito e passo para o próximo."</td></tr>
    </tbody>
    </table>
    </div>
    <p><strong>Por que isso importa:</strong> Quando você opera com linguagem probabilística, a perda não é uma surpresa catastrófica — é um resultado esperado dentro da distribuição. Isso preserva o capital emocional.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">03</div>
  <div class="rule-content">
    <h4>🛡️ Pilar 3 — Preservação de Capital Acima de Lucro</h4>
    <p><strong>O conceito:</strong> Sua prioridade absoluta número um é <em>não perder dinheiro</em>. Lucro é consequência de um processo correto aplicado consistentemente. Sem capital, não há oportunidade — é fim de jogo.</p>
    <p><strong>A matemática cruel das perdas:</strong></p>
    <div class="data-table-wrap" style="margin:8px 0">
    <table class="data-table">
    <thead><tr><th>Perda no Portfólio</th><th>Retorno Necessário para Recuperar</th><th>Tempo Médio de Recuperação</th></tr></thead>
    <tbody>
      <tr><td>-10%</td><td class="td-green">+11.1%</td><td>Semanas a meses</td></tr>
      <tr><td>-20%</td><td class="td-gold">+25%</td><td>Meses</td></tr>
      <tr><td>-33%</td><td class="td-amber">+50%</td><td>6 meses a 1 ano</td></tr>
      <tr><td>-50%</td><td class="td-red">+100%</td><td>1 a 2 anos</td></tr>
      <tr><td>-75%</td><td class="td-red td-em">+300%</td><td>Raramente recuperado</td></tr>
    </tbody>
    </table>
    </div>
    <p><strong>Conclusão prática:</strong> Evitar perdas grandes é matematicamente muito mais eficiente do que buscar ganhos grandes. Um drawdown de 50% exige um retorno de 100% só para voltar ao zero.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">04</div>
  <div class="rule-content">
    <h4>📓 Pilar 4 — Documentação Compulsiva</h4>
    <p><strong>O conceito:</strong> Sem registro, você não tem dados. Sem dados, você não tem aprendizado real — apenas a ilusão de aprendizado criada pela memória seletiva do cérebro, que tende a lembrar os ganhos e minimizar as perdas.</p>
    <p><strong>O que a documentação revela que sua memória esconde:</strong></p>
    <ul>
      <li>Em qual horário você comete mais erros? (Pesquisas mostram: primeiras e últimas horas da sessão)</li>
      <li>Qual tipo de setup tem melhor R:R real na sua história? (Diferente do que você acha)</li>
      <li>Após quantas perdas consecutivas sua performance cai drasticamente?</li>
      <li>Em qual contexto macro (F&amp;G, dominância BTC) seus trades têm mais acerto?</li>
    </ul>
    <p><strong>Formato mínimo:</strong> Data · Ativo · Tipo · Entrada · SL · TP · Resultado · 1 lição. Qualquer ferramenta serve: planilha, Notion, caderno. O que importa é a consistência, não a ferramenta.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--purple)">05</div>
  <div class="rule-content">
    <h4>🧘 Pilar 5 — Equanimidade Emocional</h4>
    <p><strong>O conceito:</strong> Equanimidade é a capacidade de manter estado mental estável tanto nas vitórias quanto nas derrotas. Não é indiferença — é equilíbrio. Tanto a euforia quanto o desespero são igualmente perigosos para o capital.</p>
    <p><strong>O paradoxo da euforia:</strong> A maioria dos traders perde mais após uma sequência de vitórias do que após uma sequência de perdas. Por quê? Porque a euforia leva ao aumento de tamanho de posição, à tomada de riscos não previstos no processo e ao abandono das regras "porque estou indo muito bem".</p>
    <p><strong>Prática concreta — O protocolo pós-trade:</strong></p>
    <ul>
      <li>Após ganho: respire, registre no diário, <strong>não aumente o próximo trade por euforia</strong></li>
      <li>Após perda: respire, registre no diário, <strong>aguarde 60 min antes de qualquer nova decisão</strong></li>
      <li>Após sequência positiva (3+ ganhos): revise se está aumentando tamanho inconscientemente</li>
      <li>Após sequência negativa (2+ perdas): pause a sessão, analise o padrão de erro</li>
    </ul>
  </div>
</div>

<h2><span class="h2-num">3</span> O Mapa da Evolução do Trader</h2>
<p>Todo trader passa por estágios. Saber em qual estágio você está é fundamental para saber o que focar:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Estágio</th><th>Característica Central</th><th>Erro Principal</th><th>O Que Focar</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em" style="color:var(--red)">Iniciante Inconsciente</td>
    <td>Não sabe o que não sabe. Age por instinto.</td>
    <td>FOMO, sem stop, overtrading</td>
    <td>Aprender os 7 assassinos. Paper trade exclusivo.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--amber)">Iniciante Consciente</td>
    <td>Conhece os erros mas ainda os comete sob pressão.</td>
    <td>Sabe das regras mas as quebra em momentos de emoção</td>
    <td>Construir processo. Diário diário. Capital mínimo real.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--gold)">Intermediário</td>
    <td>Processo parcialmente seguido. Resultados inconsistentes.</td>
    <td>Selective compliance: segue as regras quando convém</td>
    <td>Métricas semanais. Identificar padrão dos erros restantes.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--green)">Profissional</td>
    <td>Processo seguido mesmo sob pressão. Resultados consistentes.</td>
    <td>Complacência após período de sucesso</td>
    <td>Monitorar capital emocional. Escalar capital gradualmente.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Exercício de Consolidação — O Trade da Semana Passada</h2>
<div class="callout callout-gold">
  <div class="callout-title">📝 Exercício Prático Obrigatório</div>
  <p>Escolha o último trade que você fez (ou imagine um trade hipotético em XRP).<br><br>
  <strong>Analise pelos 5 Pilares:</strong><br>
  1. O processo estava correto independente do resultado? O que você controlava vs não controlava?<br>
  2. Você operou com linguagem de probabilidade ou de certeza? Havia plano B para o cenário adverso?<br>
  3. O tamanho da posição protegia seu capital adequadamente?<br>
  4. Você registrou a operação com todos os campos? Se não, o que faltou?<br>
  5. Seu estado emocional antes e depois estava em equilíbrio?<br><br>
  <strong>Escreva 5 frases — uma para cada pilar.</strong> Esse exercício simples, feito semanalmente, vale mais do que horas de estudo de indicadores.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo a diferença entre avaliar processo vs avaliar resultado</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Mudei minha linguagem de "vai subir" para "probabilidade de X%"</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizei a tabela de recuperação de perdas — nunca mais serei descuidado com drawdowns</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Vou iniciar meu diário de trading hoje — mesmo que simples</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Tenho um protocolo definido para pós-ganho e pós-perda</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Identifiquei em qual estágio do mapa de evolução estou agora</div></div>
</div>`,

  "diario": `
<div class="blockquote">
  <div class="blockquote-text">Se você não pode medir, você não pode gerenciar. E se não pode gerenciar, está operando no escuro — independente de quantos indicadores tiver na tela.</div>
  <div class="blockquote-author">— Peter Drucker · adaptado para o trading</div>
</div>

<h2><span class="h2-num">1</span> O Diário de Trading — Por Que É Inegociável</h2>
<p>O diário de trading é a ferramenta mais poderosa e mais negligenciada do arsenal de qualquer analista. É o único instrumento que converte <strong>experiência em aprendizado real</strong> — porque sem registro escrito, o cérebro reescreve a memória das operações de forma conveniente, lembrando mais dos acertos e minimizando os erros.</p>

<div class="kpi-row kpi-row-3">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">2.3×</div><div class="kpi-label">Mais acerto com diário consistente vs sem diário</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">6 meses</div><div class="kpi-label">Tempo para ver melhora estatística significativa</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">87%</div><div class="kpi-label">Dos traders profissionais mantêm diário formal</div></div>
</div>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ O Mito da Memória do Trader</div>
  <p>Pergunte a qualquer trader "qual é sua taxa de acerto?". A maioria vai dizer 60–70%. Quando você olha o extrato real da corretora, costuma ser 35–45%. O cérebro humano tem <strong>viés de resultado positivo</strong> — lembra melhor das vitórias e reescreve mentalmente as perdas como "azaradas" ou "manipulação do mercado". O diário é o antídoto contra essa ilusão.</p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Diário de Trading — Os 3 Níveis de Detalhe</div>
  <svg viewBox="0 0 720 175" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- Level 1 -->
    <rect x="15" y="10" width="214" height="150" rx="8" fill="#0a1628" stroke="#607d8b" stroke-width="1.5"/>
    <rect x="15" y="10" width="214" height="32" rx="8" fill="#607d8b" opacity=".2"/>
    <text x="122" y="31" text-anchor="middle" font-size="11" fill="#607d8b" font-family="sans-serif" font-weight="700">Nível 1 — Básico</text>
    <text x="25" y="58" font-size="9.5" fill="#607d8b" font-family="monospace">□ Data e ativo</text>
    <text x="25" y="74" font-size="9.5" fill="#607d8b" font-family="monospace">□ Entrada / Saída / P&amp;L</text>
    <text x="25" y="90" font-size="9.5" fill="#607d8b" font-family="monospace">□ Stop utilizado</text>
    <text x="25" y="106" font-size="9.5" fill="#607d8b" font-family="monospace">□ Resultado em $</text>
    <text x="122" y="148" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Trader iniciante</text>

    <!-- Level 2 -->
    <rect x="253" y="10" width="214" height="150" rx="8" fill="#0a1628" stroke="#3d8fef" stroke-width="1.5"/>
    <rect x="253" y="10" width="214" height="32" rx="8" fill="#3d8fef" opacity=".15"/>
    <text x="360" y="31" text-anchor="middle" font-size="11" fill="#3d8fef" font-family="sans-serif" font-weight="700">Nível 2 — Intermediário</text>
    <text x="263" y="58" font-size="9.5" fill="#3d8fef" font-family="monospace">□ Score STMP no momento</text>
    <text x="263" y="74" font-size="9.5" fill="#3d8fef" font-family="monospace">□ Resultado em R</text>
    <text x="263" y="90" font-size="9.5" fill="#3d8fef" font-family="monospace">□ Cenário ativado (C1/C2/C3)</text>
    <text x="263" y="106" font-size="9.5" fill="#3d8fef" font-family="monospace">□ Processo seguido? (S/N)</text>
    <text x="263" y="122" font-size="9.5" fill="#3d8fef" font-family="monospace">□ Screenshot do setup</text>
    <text x="360" y="148" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Trader em desenvolvimento</text>

    <!-- Level 3 -->
    <rect x="491" y="10" width="214" height="150" rx="8" fill="#0a1628" stroke="#f0a500" stroke-width="2"/>
    <rect x="491" y="10" width="214" height="32" rx="8" fill="#f0a500" opacity=".12"/>
    <text x="598" y="31" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">Nível 3 — Profissional</text>
    <text x="501" y="58" font-size="9.5" fill="#f0a500" font-family="monospace">□ Emoção dominante no trade</text>
    <text x="501" y="74" font-size="9.5" fill="#f0a500" font-family="monospace">□ Análise causa-raiz do erro</text>
    <text x="501" y="90" font-size="9.5" fill="#f0a500" font-family="monospace">□ Métrica semanal atualizada</text>
    <text x="501" y="106" font-size="9.5" fill="#f0a500" font-family="monospace">□ Win rate acumulado mês</text>
    <text x="501" y="122" font-size="9.5" fill="#f0a500" font-family="monospace">□ Aprendizado em 1 frase</text>
    <text x="598" y="148" text-anchor="middle" font-size="9" fill="#f0a500" font-family="sans-serif" font-weight="600">Meta TMP: Nível 3</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> Os 3 Níveis do Diário — Do Básico ao Profissional</h2>
<p>Você começa no nível que sua rotina atual suporta — e evolui. O pior diário é o que não existe:</p>

<div class="steps">
  <div class="step-card" style="border-left:3px solid var(--green2)">
    <div class="step-num" style="background:linear-gradient(135deg,#005C3A,#00b87a)">1</div>
    <div class="step-content">
      <h4>NÍVEL BÁSICO — Sobrevivência (5 campos obrigatórios)</h4>
      <p>Data · Ativo · Entrada · Stop Loss · Resultado. Leva 30 segundos. Garante os dados mínimos para análise. <strong>Comece aqui se está começando agora.</strong></p>
    </div>
  </div>
  <div class="step-card" style="border-left:3px solid var(--gold)">
    <div class="step-num" style="background:linear-gradient(135deg,#7B5C00,#f0a500)">2</div>
    <div class="step-content">
      <h4>NÍVEL INTERMEDIÁRIO — Análise (+ contexto, razão, lição)</h4>
      <p>Adiciona: Razão técnica (1 frase) · Contexto macro · Invalidação · Lição aprendida. Leva 3–5 minutos. Começa a revelar padrões de comportamento e de setup.</p>
    </div>
  </div>
  <div class="step-card" style="border-left:3px solid var(--bright)">
    <div class="step-num" style="background:linear-gradient(135deg,#0A3060,#3d8fef)">3</div>
    <div class="step-content">
      <h4>NÍVEL PROFISSIONAL — Sistema Completo (todos os campos + métricas)</h4>
      <p>Template completo abaixo. Leva 5–8 minutos. Revela padrões estatisticamente significativos. Permite otimização do sistema ao longo do tempo.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">3</span> Template Profissional Completo — Campo por Campo</h2>
<p>Cada campo tem um propósito específico. Entender o "por quê" de cada um faz você preenchê-lo com mais precisão:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Campo</th><th>Por Que Existe</th><th>Como Preencher</th><th>Exemplo Real — XRP 23/02/2026</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em">📅 Data e Hora</td>
    <td>Permite cruzar com contexto macro do dia. Identifica horários de melhor/pior performance.</td>
    <td>Data + hora exata + fuso horário</td>
    <td>23/02/2026 · 07:30 · UTC-3</td>
  </tr>
  <tr>
    <td class="td-em">💱 Ativo e Exchange</td>
    <td>Permite comparar performance por ativo. Identifica em quais mercados você performa melhor.</td>
    <td>Par completo + nome da exchange</td>
    <td>XRP/USDT · Binance Spot</td>
  </tr>
  <tr>
    <td class="td-em">📌 Tipo de Trade</td>
    <td>Separa Long vs Short vs Paper. Compara performance por direção.</td>
    <td>Long / Short / Paper + sub-tipo: contra-tendência / tendência</td>
    <td>Long · Contra-tendência (bounce em downtrend)</td>
  </tr>
  <tr>
    <td class="td-em td-gold">💵 Preço de Entrada</td>
    <td>Base para cálculo de R:R real vs planejado.</td>
    <td>Preço exato executado (não o planejado)</td>
    <td class="td-gold">$1.3480</td>
  </tr>
  <tr>
    <td class="td-em td-red">🛑 Stop Loss</td>
    <td>Define o risco máximo. Permite calcular o tamanho correto da posição.</td>
    <td>Preço do stop + % de distância + $ de risco absoluto</td>
    <td class="td-red">$1.3200 · −2.1% · −$75</td>
  </tr>
  <tr>
    <td class="td-em td-green">🎯 Take Profits</td>
    <td>Força o trader a definir objetivos antes de entrar — elimina ganância no momento do trade.</td>
    <td>TP1, TP2, TP3 com preço + % + R:R calculado</td>
    <td class="td-green">TP1: $1.4275 (+5.7%, R:R 1:2.7) · TP2: $1.6000 (+18.7%, R:R 1:8.9)</td>
  </tr>
  <tr>
    <td class="td-em">💰 Tamanho da Posição</td>
    <td>Verifica se o sizing respeita o processo. Identifica se há overexposure.</td>
    <td>Capital alocado em $ + % do portfólio total</td>
    <td>$1.500 · 15% do portfólio · Risco real: $75 (0.75% do capital)</td>
  </tr>
  <tr>
    <td class="td-em">🔍 Razão Técnica</td>
    <td>Força articulação clara da tese. Se não cabe em 1 frase, a tese não está clara o suficiente.</td>
    <td>1 frase máxima: "[indicador] + [suporte/resistência] + [contexto]"</td>
    <td>Divergência RSI bullish 1H + suporte @ 3 TFs ($1.33) + volume 0.02x (sem vendedores)</td>
  </tr>
  <tr>
    <td class="td-em">📰 Contexto Macro</td>
    <td>Permite identificar se perdas se correlacionam com contextos macro adversos.</td>
    <td>F&amp;G Index + BTC tendência + Dominância + eventos do dia</td>
    <td>F&amp;G: 5/100 · BTC: $64.7k (zona crítica) · Dominância: 56.6% · Tarifas Trump</td>
  </tr>
  <tr>
    <td class="td-em">🚨 Invalidação</td>
    <td>Define objetivamente quando a tese está errada — elimina "talvez ainda volte".</td>
    <td>Condição específica e mensurável (não "se cair muito")</td>
    <td>Close 4H &lt; $1.3200 OU BTC fechar &lt; $62k OU notícia fundamental negativa</td>
  </tr>
  <tr>
    <td class="td-em">📊 Resultado Final</td>
    <td>Base para cálculo de métricas. Inclui ganhos parciais realizados.</td>
    <td>Resultado em $ + % sobre posição + R realizado</td>
    <td class="td-green">+$85.50 · +5.7% · +0.79R (saída parcial TP1)</td>
  </tr>
  <tr>
    <td class="td-em">🧠 Lição Extraída</td>
    <td>O campo mais importante. Transforma cada trade em conhecimento aplicável.</td>
    <td>1 insight concreto e acionável — não genérico como "ser mais disciplinado"</td>
    <td>Volume 0.02x = bounce sem convicção → reduzir tamanho 40% quando volume &lt; 0.1x</td>
  </tr>
  <tr>
    <td class="td-em">⭐ Qualidade do Processo</td>
    <td>Avaliação independente do resultado — reforça o Pilar 1 do mindset.</td>
    <td>Nota de 1 a 5 para adesão ao processo (não para o resultado)</td>
    <td>4/5 — entrada boa, mas entrei antes de BTC confirmar estabilidade</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> As Métricas do Diário — O Que Calcular Semanalmente</h2>
<p>O diário só tem valor quando você extrai as métricas dele. Calcule semanalmente e mensalmente:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Métrica</th><th>Fórmula</th><th>Referência Mínima</th><th>O Que Revela</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-bright">Win Rate</td>
    <td>Trades Positivos ÷ Total × 100</td>
    <td class="td-green">≥ 40%</td>
    <td>Taxa de acerto bruta. Isolada não diz nada — sempre analisar com R:R.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">R:R Médio</td>
    <td>Média de (Ganho ÷ Risco) em todos os trades</td>
    <td class="td-green">≥ 1 : 2</td>
    <td>Qualidade dos setups escolhidos. Abaixo de 1:2 com 40% acerto = sistema perdedor.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--green)">Profit Factor</td>
    <td>Total Ganho ÷ Total Perdido</td>
    <td class="td-green">≥ 1.5 (ideal: &gt; 2.0)</td>
    <td>&gt; 1 = sistema lucrativo. &lt; 1 = sistema perdedor. &gt; 2 = excelente.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Max Drawdown</td>
    <td>Pico mais alto → vale mais fundo (em %)</td>
    <td class="td-gold">≤ 15%</td>
    <td>Mede a dor máxima suportada. Drawdown &gt; 25% geralmente gera decisões emocionais ruins.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--cyan)">Expectância</td>
    <td>(Win% × Ganho Médio) − (Loss% × Perda Média)</td>
    <td class="td-green">&gt; 0.2R por trade</td>
    <td>O "edge" real do sistema. Se negativo, o sistema está destruindo capital.</td>
  </tr>
  <tr>
    <td class="td-em td-purple">Streak Máximo</td>
    <td>Maior sequência de perdas consecutivas</td>
    <td class="td-gold">&lt; 6 seguidas</td>
    <td>Avisa quando reduzir sizing. ≥ 5 perdas seguidas: reduzir tamanho 50% até recuperar.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> O Processo de Revisão Mensal — 3 Passos</h2>
<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Calcule as 6 Métricas (20 min)</h4>
      <p>Win Rate, R:R Médio, Profit Factor, Max Drawdown, Expectância, Streak Máximo. Compare com o mês anterior. A tendência importa mais do que o número isolado — você está melhorando?</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Caça ao Padrão (20 min)</h4>
      <p>Filtre seus trades por: horário do dia · dia da semana · contexto de F&amp;G · BTC tendência · ativo operado · tipo (long/short) · setup usado. <strong>Em qual filtro você perde mais sistematicamente?</strong> Esse é seu maior ponto de melhora.</p>
      <div class="callout callout-info" style="margin-top:8px">
        <div class="callout-title">💡 Padrão Comum Descoberto por Traders</div>
        <p>A maioria descobre que perde mais: nas primeiras 30 min do dia (ansiedade), quando F&amp;G &lt; 20 (mercado caótico), em longs quando Dominância BTC &gt; 58%. Você nunca saberia isso sem o diário.</p>
      </div>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Define 1 Único Ajuste (5 min)</h4>
      <p>Apenas <strong>1 mudança por mês</strong>. Não 5, não 10. Uma. "A partir de amanhã, não opero quando F&amp;G &lt; 15." "A partir de amanhã, não abro posição nas primeiras 30 min da sessão." Ajustes cirúrgicos criam evolução mensurável. Mudanças em massa criam caos.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">6</span> Ferramentas para o Diário — Do Grátis ao Avançado</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Ferramenta</th><th>Tipo</th><th>Melhor Para</th><th>Limitação</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em">Caderno físico</td>
    <td>Analógico</td>
    <td>Iniciantes. Conexão com o processo. Ritual de escrita.</td>
    <td>Difícil calcular métricas. Não filtrável.</td>
  </tr>
  <tr>
    <td class="td-em td-green">Google Sheets / Excel</td>
    <td>Planilha</td>
    <td>Intermediários. Cálculo automático de métricas. Filtros.</td>
    <td>Requer setup inicial. Sem interface dedicada.</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Notion</td>
    <td>Database</td>
    <td>Quem gosta de organização visual + filtros + dashboards.</td>
    <td>Curva de aprendizado inicial.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">TraderSync / Edgewonk</td>
    <td>Dedicado</td>
    <td>Traders avançados. Importa trades da corretora automaticamente.</td>
    <td>Pago. Configuração necessária.</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-success">
  <div class="callout-title">🏆 Recomendação Trade Master Pro</div>
  <p><strong>Meses 1–3:</strong> Comece com Google Sheets. Crie uma aba com o template completo deste módulo. Foque em preencher todos os campos, mesmo que demore 8 minutos por trade.<br><br>
  <strong>Meses 4+:</strong> Se fizer 3+ trades/semana, considere TraderSync ou Edgewonk para importação automática e análise estatística mais profunda.<br><br>
  <strong>O critério de sucesso do diário:</strong> Você consegue responder em 30 segundos: "Qual é minha Win Rate do último mês? Qual é meu maior padrão de perda?" Se não consegue, o diário não está cumprindo sua função.</p>
</div>

<h2><span class="h2-num">7</span> Sua Tarefa Agora — Não Saia Sem Fazer Isso</h2>
<div class="callout callout-gold">
  <div class="callout-title">📝 Ação Imediata — Primeiros 10 Minutos</div>
  <p>Abra agora uma planilha, Notion ou caderno. Crie os 12 campos do template desta aula. Preencha com o <strong>último trade que você fez</strong> — mesmo que seja de memória, mesmo que seja incompleto. Comece agora, melhore depois. A perfeição é inimiga do começo.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que minha memória não é suficiente — o diário é o único dado real</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Escolhi minha ferramenta de diário (caderno / planilha / Notion)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Criei o template com os 12 campos desta aula</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Preenchi pelo menos 1 trade de memória no template</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Defini qual dia da semana vou calcular minhas métricas (sugiro: domingo)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei calcular as 6 métricas: Win Rate, R:R Médio, Profit Factor, Max Drawdown, Expectância, Streak</div></div>
</div>`,

  "noticias": `
<div class="blockquote">
  <div class="blockquote-text">O mercado desconta o futuro. Mas antes de descontar qualquer coisa, ele reage ao que os participantes percebem. Quem lê notícias com método lê o mercado antes do mercado.</div>
  <div class="blockquote-author">— Princípio da Análise Fundamentalista Moderna</div>
</div>

<h2><span class="h2-num">1</span> Por Que Notícias São Parte da Análise — Não Ruído</h2>
<p>Existe um debate antigo no trading: análise técnica vs análise fundamentalista. Traders técnicos puros dizem que "tudo está no gráfico". Fundamentalistas dizem que o gráfico é só consequência dos fundamentos. <strong>Ambos têm razão pela metade.</strong></p>
<p>O mercado cripto é especialmente sensível a notícias porque ainda não tem o "floor" de avaliação das empresas tradicionais (dividendos, fluxo de caixa, ativos tangíveis). O preço de XRP, BTC ou qualquer criptomoeda é, em grande parte, a <strong>narrativa percebida pelo mercado</strong> em um determinado momento. Quem entende as notícias antes do mercado precificar tem vantagem real.</p>

<div class="callout callout-info">
  <div class="callout-title">💡 A Diferença Entre Ler Notícias e Analisar Notícias</div>
  <p>
  <strong>Ler notícias:</strong> "XRP despencou 12%. Parece ruim."<br>
  <strong>Analisar notícias:</strong> "Queda de 12% após realizações de $1.93B em perdas na chain indica capitulação de longo prazo — historicamente, capitulações em escala são eventos de esgotamento vendedor. Impacto: curto prazo negativo, médio prazo neutro-positivo."<br><br>
  A diferença está no <strong>Sistema de Classificação</strong> que você vai aprender nesta aula.
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">SCN — Sistema de Classificação de Notícias</div>
  <div class="pillars-grid-tmpl scn-grid">
    <div class="pillar-c" style="--p-color: var(--red)">
      <div class="p-title">① IMPACTO</div>
      <div class="p-desc" style="text-align:left;font-family:var(--font-mono);font-size:13px">
        <span style="color:var(--red)">Alto</span> — move mercado<br>
        <span style="color:var(--gold)">Médio</span> — confirma viés<br>
        <span style="color:var(--gray3)">Baixo</span> — ruído<br><br>
        <span style="font-family:var(--font-body, sans-serif);color:var(--gray3);font-size:11px">Apenas Alto/Médio entram na análise</span>
      </div>
    </div>
    <div class="pillar-c" style="--p-color: var(--bright)">
      <div class="p-title">② TIMING</div>
      <div class="p-desc" style="text-align:left;font-family:var(--font-mono);font-size:13px">
        <span style="color:var(--red)">Imediato</span> — &lt;24h<br>
        <span style="color:var(--gold)">Curto prazo</span> — &lt;1 sem<br>
        <span style="color:var(--bright)">Médio prazo</span> — 1–4 sem<br>
        <span style="color:var(--gray3)">Longo prazo</span> — meses<br><br>
        <span style="font-family:var(--font-body, sans-serif);color:var(--gray3);font-size:11px">Define quando age no trade</span>
      </div>
    </div>
    <div class="pillar-c" style="--p-color: var(--green)">
      <div class="p-title">③ FONTE</div>
      <div class="p-desc" style="text-align:left;font-family:var(--font-mono);font-size:13px">
        <span style="color:var(--green)">Primária</span> — SEC, Fed<br>
        <span style="color:var(--bright)">Confiável</span> — CoinDesk<br>
        <span style="color:var(--gold)">Média</span> — Twitter/X<br>
        <span style="color:var(--red)">Anônima</span> — descartar<br><br>
        <span style="font-family:var(--font-body, sans-serif);color:var(--gray3);font-size:11px">Fonte anônima = 0pts<br>Primária = 3pts</span>
      </div>
    </div>
    <div class="pillar-c" style="--p-color: var(--purple)">
      <div class="p-title">④ VIÉS</div>
      <div class="p-desc" style="text-align:left;font-family:var(--font-mono);font-size:13px">
        <span style="color:var(--green)">Bullish</span> — positivo<br>
        <span style="color:var(--gray3)">Neutro</span> — informativo<br>
        <span style="color:var(--red)">Bearish</span> — negativo<br><br>
        <span style="font-family:var(--font-body, sans-serif);color:var(--gray3);font-size:11px">Conflito Macro vs Técnica = cuidado<br><br><span style="color:var(--purple);font-weight:700">Score final:</span> Imp + Timing + Fonte</span>
      </div>
    </div>
  </div>
</div>
<h2><span class="h2-num">2</span> O Sistema de Classificação de Notícias (SCN)</h2>
<p>O SCN é o framework que transforma notícias brutas em inteligência de mercado estruturada. Ele avalia cada notícia em <strong>3 dimensões independentes</strong>, gerando um score de impacto:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Dimensão</th><th>O Que Avalia</th><th>Escala</th><th>Exemplos</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-bright">1. IMPACTO</td>
    <td>Magnitude do efeito potencial no preço</td>
    <td>Alto / Médio / Baixo</td>
    <td>
      <span class="td-red">Alto:</span> Decisão da SEC, hack de exchange, regulação nova<br>
      <span class="td-gold">Médio:</span> Parceria institucional, adoção por banco regional<br>
      <span class="td-green">Baixo:</span> Post de influencer, rumor não confirmado
    </td>
  </tr>
  <tr>
    <td class="td-em td-gold">2. TIMING</td>
    <td>Em qual horizonte temporal o impacto se materializa</td>
    <td>Imediato / Curto / Médio / Longo</td>
    <td>
      <span class="td-red">Imediato (0–24h):</span> Hack confirmado, regulação repentina<br>
      <span class="td-amber">Curto (1–7 dias):</span> Earnings, eventos agendados<br>
      <span class="td-gold">Médio (1–4 semanas):</span> Parceria anunciada<br>
      <span class="td-green">Longo (meses):</span> Mudança de lei, adoção institucional
    </td>
  </tr>
  <tr>
    <td class="td-em td-green">3. FONTE</td>
    <td>Confiabilidade e autoridade da fonte</td>
    <td>⭐⭐⭐⭐⭐ até ⭐</td>
    <td>
      ⭐⭐⭐⭐⭐ Fontes oficiais (SEC, Fed, empresa diretamente)<br>
      ⭐⭐⭐⭐ Mídia financeira tier-1 (Bloomberg, Reuters, FT)<br>
      ⭐⭐⭐ Mídia cripto especializada (CoinDesk, TheBlock)<br>
      ⭐⭐ Analistas com histórico verificável<br>
      ⭐ Twitter, Reddit, Telegram (não confirmados)
    </td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> As 5 Categorias de Notícias Cripto — Com Peso Real</h2>
<p>Nem toda notícia afeta o mercado da mesma forma. Esta tabela mostra o peso médio histórico de cada categoria no movimento de preço:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Categoria</th><th>Peso no Preço</th><th>Exemplos</th><th>Prazo de Impacto</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em" style="color:var(--red)">🏛️ Regulatória</td>
    <td class="td-red td-em">Muito Alto (até ±30%)</td>
    <td>SEC proibindo exchange, ETF aprovado, lei cripto em país grande</td>
    <td>Imediato → Curto</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--amber)">🏦 Institucional</td>
    <td class="td-amber td-em">Alto (±10–20%)</td>
    <td>BlackRock comprando, banco adotando como reserva, ETF de empresa</td>
    <td>Imediato → Médio</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--gold)">⛓️ On-Chain / Macro</td>
    <td class="td-gold td-em">Médio-Alto (±5–15%)</td>
    <td>Grandes realizações, fluxos de whale, halving próximo</td>
    <td>Curto → Médio</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--bright)">🤝 Adoção / Parceria</td>
    <td class="td-blue td-em">Médio (±3–10%)</td>
    <td>Banco usando XRPL, empresa integrando pagamentos, parceria tech</td>
    <td>Médio → Longo</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--gray2)">📱 Sentimento / Social</td>
    <td style="color:var(--gray2)" class="td-em">Baixo-Médio (±1–5%)</td>
    <td>Tweet de influencer, post viral, narrativa de comunidade</td>
    <td>Imediato → Curto (efêmero)</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Como Classificar Uma Notícia em 60 Segundos</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Identifique o Sujeito (5 seg)</h4>
      <p>Quem é o protagonista da notícia? <strong>BTC</strong> (afeta todo o mercado) · <strong>Ativo específico</strong> (XRP, ETH etc.) · <strong>Setor</strong> (DeFi, Layer 2) · <strong>Macro</strong> (Fed, inflação, geopolítica). O sujeito define o escopo do impacto.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Classifique nos 3 Eixos (20 seg)</h4>
      <p>Aplique rapidamente: <strong>Impacto</strong> (alto/médio/baixo) · <strong>Timing</strong> (imediato/curto/médio/longo) · <strong>Fonte</strong> (⭐⭐⭐⭐⭐). Registre em 3 palavras: "Alto · Imediato · Oficial".</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Determine o Viés (15 seg)</h4>
      <p>A notícia é <span class="td-green">BULLISH</span> (positiva para o preço), <span class="td-red">BEARISH</span> (negativa) ou <span style="color:var(--gray2)">NEUTRO</span> (informacional sem viés claro)? Atenção: uma notícia bearish no curto prazo pode ser bullish no médio (ex: capitulação + realizações em escala = fundo potencial).</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Integre na Análise (20 seg)</h4>
      <p>Como essa notícia muda sua leitura dos cenários? Ela aumenta ou diminui a probabilidade do cenário bearish/bullish? Requer ajuste no tamanho da posição ou no prazo dos TPs? Registe em 1 frase de ação.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> Armadilhas Comuns na Leitura de Notícias</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">⚠️</div>
  <div class="rule-content">
    <h4>"Comprei na Notícia, Vendi na Realidade"</h4>
    <p>O mercado frequentemente sobe <em>antes</em> da notícia positiva (quando insiders e bots já precificaram) e <em>cai</em> quando a notícia é confirmada oficialmente. Isso acontece porque os primeiros compradores vendem para os "atrasados" que chegam depois da notícia. Exemplo clássico: ETF de BTC aprovado → preço cai no dia do anúncio após subir semanas antes.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">⚠️</div>
  <div class="rule-content">
    <h4>Confirmation Bias — Buscando Notícias Que Confirmam Sua Posição</h4>
    <p>Se você já está long em XRP, tende a dar mais peso para notícias positivas e minimizar as negativas. O SCN combate isso com avaliação objetiva de impacto/timing/fonte, independente de suas posições abertas. <strong>Analise antes de posicionar, não depois.</strong></p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">⚠️</div>
  <div class="rule-content">
    <h4>Notícias de Alta Frequência — O Ruído dos Segundos</h4>
    <p>No mercado cripto, notícias aparecem a cada minuto. A maioria é ruído sem impacto real no swing trade (horizonte de 1–21 dias). O método TMP foca em notícias de impacto médio a longo — as que realmente mudam a narrativa do ativo, não as que fazem o preço oscilar 0.5% por 10 minutos.</p>
  </div>
</div>

<h2><span class="h2-num">6</span> Síntese Final da Análise de Notícias</h2>
<p>Depois de classificar todas as notícias do dia, você precisa sintetizar em uma única visão integrada. Use este framework de 2 linhas:</p>

<div class="formula">
  Fundamentos [Prazo] = [Viés] porque [Notícia Principal]<br>
  <span style="font-size:12px;color:var(--gray3)">Exemplo: "Fundamentos médio prazo = POSITIVO porque SBI Holdings alocou $64.5M em bonds XRP"</span><br>
  <span style="font-size:12px;color:var(--gray3)">Exemplo: "Fundamentos curto prazo = NEGATIVO porque $1.93B realizados em perdas + tarifas Trump"</span>
</div>

<div class="callout callout-gold">
  <div class="callout-title">💡 Regra de Ouro da Análise de Notícias</div>
  <p>Quando fundamentos de <strong>curto prazo são negativos</strong> mas fundamentos de <strong>médio/longo prazo são positivos</strong>, você tem o setup mais poderoso do método TMP: <em>entrada contra-tendência em suporte, com vento macro favorável no médio prazo.</em> Foi exatamente o contexto de XRP em 23/02/2026.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo as 3 dimensões do SCN: Impacto, Timing e Fonte</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei classificar uma notícia em 60 segundos usando os 4 passos</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo o fenômeno "comprou na notícia, vendeu na realidade"</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei sintetizar múltiplas notícias em uma visão de curto vs médio prazo</div></div>
</div>`,

  "fontes": `
<div class="blockquote">
  <div class="blockquote-text">A vantagem do analista não está em ter mais informação — está em processar informação mais rapidamente e com mais precisão do que o mercado.</div>
  <div class="blockquote-author">— Howard Marks · Oaktree Capital</div>
</div>

<h2><span class="h2-num">1</span> O Problema da Sobrecarga de Informação</h2>
<p>O mercado cripto gera mais de 100.000 notícias por dia. Twitter, Telegram, Discord, Reddit, sites de notícias, YouTube, newsletters — uma enxurrada de informação onde <strong>99% é ruído e 1% é sinal</strong>. O trader amador tenta processar tudo e fica paralítico ou reativo. O analista profissional tem uma lista curada de 15–20 fontes que cobrem exatamente o que importa.</p>

<div class="kpi-row kpi-row-3">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">100k+</div><div class="kpi-label">Notícias cripto por dia</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">20 min</div><div class="kpi-label">Tempo ideal de pesquisa diária no TMP</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">15–20</div><div class="kpi-label">Fontes suficientes para cobertura completa</div></div>
</div>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Fontes que Parecem Profissionais mas São Perigosas</div>
  <p>
  <strong>Grupos de Telegram de "calls":</strong> Coordenam pump and dump. Você é o exit liquidity.<br>
  <strong>Influencers com "portfólio público":</strong> Mostram ganhos, escondem perdas. Sobrevivorship bias extremo.<br>
  <strong>Notícias de sites desconhecidos com headlines sensacionalistas:</strong> "XRP vai a $100 em 2026 — especialista revela." Clickbait puro.<br>
  <strong>Previsões de preço sem fundamentação:</strong> Qualquer previsão de preço cripto sem modelo é especulação vestida de análise.
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Pirâmide de Fontes — Confiabilidade por Camada</div>
  <div class="pyramid-wrapper">
    <div class="pyramid-layer layer-1">
      <div class="p-stars">★★★★★</div>
      <div class="p-core">Primárias</div>
      <div class="p-info">
        <div class="p-main-text" style="color:var(--green)">SEC · Fed · CVM</div>
        <div class="p-sub-text">Comunicados oficiais</div>
      </div>
    </div>
    <div class="pyramid-layer layer-2">
      <div class="p-stars">★★★★</div>
      <div class="p-core">Confiáveis</div>
      <div class="p-info">
        <div class="p-main-text" style="color:var(--bright)">CoinDesk · Reuters</div>
        <div class="p-sub-text">Jornalismo verificado</div>
      </div>
    </div>
    <div class="pyramid-layer layer-3">
      <div class="p-stars">★★★</div>
      <div class="p-core">Monitorar</div>
      <div class="p-info">
        <div class="p-main-text" style="color:var(--gold)">Twitter/X · Telegram</div>
        <div class="p-sub-text">Confirmar antes de agir</div>
      </div>
    </div>
    <div class="pyramid-layer layer-4">
      <div class="p-stars">★</div>
      <div class="p-core">Ruído — Ignorar</div>
      <div class="p-info">
        <div class="p-main-text" style="color:var(--red)">Reddit · TikTok · "influencers"</div>
        <div class="p-sub-text">Fontes anônimas</div>
      </div>
    </div>
  </div>
</div>
<h2><span class="h2-num">2</span> As 4 Categorias de Fontes Essenciais</h2>

<h3>Categoria 1 — Notícias Gerais e Macro ⭐⭐⭐⭐⭐</h3>
<p>Onde as notícias de maior impacto acontecem primeiro, antes de chegar nos sites cripto:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Fonte</th><th>Por Que Usar</th><th>O Que Monitorar</th><th>Frequência</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em">Bloomberg / Reuters</td>
    <td>Tier-1 global. Notícias institucionais e regulatórias chegam aqui primeiro.</td>
    <td>Seção de crypto/digital assets + macro (Fed, inflação)</td>
    <td>Diária (manhã)</td>
  </tr>
  <tr>
    <td class="td-em">CoinDesk</td>
    <td>Maior site de jornalismo cripto do mundo. Cobertura regulatória profunda.</td>
    <td>Notícias principais + coluna Markets</td>
    <td>Diária</td>
  </tr>
  <tr>
    <td class="td-em">The Block</td>
    <td>Jornalismo investigativo cripto. Dados de mercado + análise institucional.</td>
    <td>Research reports + breaking news</td>
    <td>Diária</td>
  </tr>
  <tr>
    <td class="td-em">Cointelegraph</td>
    <td>Volume alto de notícias. Útil para cobertura ampla do ecossistema.</td>
    <td>Filtrar por impacto — muito ruído, mas cobre tudo</td>
    <td>2–3× semana</td>
  </tr>
  <tr>
    <td class="td-em">Decrypt</td>
    <td>Jornalismo de qualidade com foco em regulação e adoção mainstream.</td>
    <td>Seção de política + regulação</td>
    <td>2–3× semana</td>
  </tr>
</tbody>
</table>
</div>

<h3>Categoria 2 — Dados On-Chain e Analytics ⭐⭐⭐⭐⭐</h3>
<p>Onde você vê o dinheiro real movendo na blockchain — não interpretações, dados brutos:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Ferramenta</th><th>O Que Mostra</th><th>Uso Principal no TMP</th><th>Plano</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-cyan">Glassnode</td>
    <td>Métricas on-chain profissionais: SOPR, NUPL, realized cap, exchange flows.</td>
    <td>Detectar capitulação (SOPR &lt; 1 = realizações em perda em escala)</td>
    <td>Freemium (básico grátis)</td>
  </tr>
  <tr>
    <td class="td-em td-bright">CryptoQuant</td>
    <td>Exchange flows em tempo real, whale alerts, funding rates, open interest.</td>
    <td>Monitorar inflows/outflows de exchanges para confirmar viés</td>
    <td>Freemium</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Nansen</td>
    <td>Wallets rotuladas de whales e instituições. "Smart money" rastreado.</td>
    <td>Ver o que wallets de fundos profissionais estão fazendo</td>
    <td>Pago (trial grátis)</td>
  </tr>
  <tr>
    <td class="td-em td-green">Token Terminal</td>
    <td>Métricas fundamentalistas de protocolos (revenue, TVL, P/E on-chain).</td>
    <td>Avaliar saúde fundamental do projeto além do preço</td>
    <td>Freemium</td>
  </tr>
  <tr>
    <td class="td-em">Dune Analytics</td>
    <td>Dashboards customizados de dados on-chain criados pela comunidade.</td>
    <td>Métricas específicas de XRP, XRPL volumes, DEX activity</td>
    <td>Grátis</td>
  </tr>
</tbody>
</table>
</div>

<h3>Categoria 3 — Monitoramento de Whales ⭐⭐⭐⭐</h3>
<p>Grandes movimentos de capital são o sinal mais confiável de mudança de tendência no curto prazo:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Ferramenta</th><th>O Que Alerta</th><th>Como Usar no TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em">Whale Alert (Twitter/@whale_alert)</td>
    <td>Transações acima de limites definidos (ex: +$1M em crypto)</td>
    <td>Ativar notificações para XRP &gt; $10M. Entrada em exchange = bearish. Saída = bullish.</td>
  </tr>
  <tr>
    <td class="td-em">WhaleWatcher</td>
    <td>Compras/vendas de grandes wallets em exchanges</td>
    <td>Monitorar no período pré-entrada para confirmar não há whale vendendo</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Santiment</td>
    <td>Movimentos de top holders + sentiment social + on-chain combinados</td>
    <td>Divergência entre sentiment social (bullish) e holders vendendo = trap</td>
  </tr>
</tbody>
</table>
</div>

<h3>Categoria 4 — Sentimento e Contexto Macro ⭐⭐⭐⭐</h3>
<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Ferramenta</th><th>O Que Mostra</th><th>Uso no TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Alternative.me Fear & Greed</td>
    <td>Índice 0–100 de medo/ganância do mercado cripto</td>
    <td>Verificar diariamente antes de qualquer análise. &lt; 20 = zona de atenção.</td>
  </tr>
  <tr>
    <td class="td-em">TradingView</td>
    <td>Dominância BTC, gráficos macro, correlações entre ativos</td>
    <td>BTC.D (dominância) + BTC/USDT análise macro diária</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">CoinGlass</td>
    <td>Liquidações em tempo real, open interest, funding rates, long/short ratio</td>
    <td>Antes de entrar: verificar se há desequilíbrio de liquidações que favorece seu lado</td>
  </tr>
  <tr>
    <td class="td-em">Coingecko / CMC</td>
    <td>Dados básicos: market cap, volume, variações</td>
    <td>Verificar volume anômalo em ativos específicos + trending coins</td>
  </tr>
  <tr>
    <td class="td-em">Economic Calendar (Forex Factory)</td>
    <td>Calendário de eventos macro (Fed, CPI, payroll, PIB)</td>
    <td>Verificar semanalmente. Não abrir novas posições em dias de Fed decision.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> O Processo de Pesquisa Diária em 4 Etapas — 20 Minutos</h2>
<p>Este é o protocolo que você executa todo dia antes de qualquer análise técnica:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>COLETA — 8 minutos</h4>
      <p>Abra as seguintes fontes nesta ordem e cole as manchetes relevantes no seu documento de análise:</p>
      <ul>
        <li><strong>Fear &amp; Greed Index</strong> — anote o valor e a tendência (subindo/caindo vs ontem)</li>
        <li><strong>CoinDesk ou The Block</strong> — 3 manchetes principais do dia</li>
        <li><strong>Whale Alert (Twitter)</strong> — alguma movimentação grande nas últimas 12h no seu ativo?</li>
        <li><strong>CryptoQuant</strong> — exchange flows: inflow ou outflow dominando?</li>
        <li><strong>BTC performance</strong> — variação 24h, em relação a suporte/resistência crítico</li>
      </ul>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>TRIAGEM — 5 minutos</h4>
      <p>Aplique o SCN (Sistema de Classificação) em cada notícia relevante. Para cada uma, anote:</p>
      <ul>
        <li>Impacto: Alto / Médio / Baixo</li>
        <li>Timing: Imediato / Curto / Médio / Longo</li>
        <li>Fonte: ⭐ de 1 a 5</li>
        <li>Viés: Bullish / Bearish / Neutro</li>
      </ul>
      <p><strong>Descarte imediatamente</strong> notícias de fonte ⭐ ou ⭐⭐ sem confirmação de fonte superior.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>INTERPRETAÇÃO — 5 minutos</h4>
      <p>Faça a síntese integrada das notícias classificadas:</p>
      <ul>
        <li>Qual é a narrativa dominante hoje? (medo? ganância? incerteza? euforia?)</li>
        <li>Há conflito entre curto e médio prazo? (bearish agora, bullish depois?)</li>
        <li>Alguma notícia muda fundamentalmente a tese do ativo que você monitora?</li>
        <li>Existe evento de risco nas próximas 48h que exige cautela extra?</li>
      </ul>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>INTEGRAÇÃO — 2 minutos</h4>
      <p>Escreva 2 frases finais que integram tudo:</p>
      <p style="font-family:var(--font-mono);font-size:13px;color:var(--cyan);margin-top:8px;line-height:1.8">
        "Macro [prazo]: [viés] — [razão principal]"<br>
        "Impacto no setup [ativo]: [aumenta/diminui/mantém probabilidade]"
      </p>
      <p style="margin-top:8px">Essas 2 frases vão diretamente para o campo "Contexto Macro" do seu diário de trading.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Configurando Seus Alertas — Passivo Inteligente</h2>
<p>Além da pesquisa ativa diária, configure alertas passivos que te notificam quando algo relevante acontece — sem precisar ficar monitorando 24/7:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Alerta</th><th>Ferramenta</th><th>Configuração Recomendada</th><th>O Que Fazer Quando Dispara</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">Whale Move — XRP</td>
    <td>Whale Alert (Twitter)</td>
    <td>Notificação para transações XRP &gt; $10M</td>
    <td>Verificar direção: exchange (bearish) ou saída (bullish). Ajustar posição se necessário.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">BTC Preço Crítico</td>
    <td>TradingView</td>
    <td>Alertas nos suportes/resistências críticos semanais do BTC</td>
    <td>Revisão imediata de todas as posições abertas em altcoins.</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Fear &amp; Greed Extremo</td>
    <td>Alternative.me (app)</td>
    <td>Notificação quando F&amp;G ≤ 15 ou ≥ 85</td>
    <td>Zona de atenção especial. Revisar exposição total ao mercado.</td>
  </tr>
  <tr>
    <td class="td-em td-green">Exchange Inflow Anômalo</td>
    <td>CryptoQuant</td>
    <td>Alerta para inflows &gt; 2× média de 7 dias</td>
    <td>Sinal bearish de curto prazo. Reavaliar longs abertos.</td>
  </tr>
  <tr>
    <td class="td-em">Notícia Regulatória</td>
    <td>Google Alerts</td>
    <td>"XRP SEC" + "crypto regulation" + "Bitcoin ETF"</td>
    <td>Classificar com SCN imediatamente e ajustar tese se necessário.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> Seu Setup de Pesquisa — Implementação Prática</h2>

<div class="callout callout-success">
  <div class="callout-title">🛠️ Configure Isso Hoje — Leva 30 Minutos</div>
  <p>
  <strong>1. Crie uma pasta de favoritos chamada "TMP Research"</strong> com todas as fontes listadas nesta aula separadas por categoria.<br><br>
  <strong>2. Crie um template de documento de análise diária</strong> com campos: Data · F&amp;G · BTC variação · 3 notícias classificadas (SCN) · Síntese macro curto prazo · Síntese macro médio prazo.<br><br>
  <strong>3. Configure os 5 alertas</strong> listados na tabela acima — especialmente Whale Alert no Twitter e alertas de preço BTC no TradingView.<br><br>
  <strong>4. Defina 1 horário fixo</strong> para sua pesquisa diária (sugestão: 9h da manhã, antes da abertura das principais sessões). Consistência de horário é mais importante do que a ferramenta usada.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo as 4 categorias de fontes e o papel de cada uma</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Criei minha pasta de favoritos TMP Research com as fontes essenciais</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Configurei o alerta do Whale Alert para XRP &gt; $10M</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Tenho alerta de preço no TradingView nos níveis críticos do BTC desta semana</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Defini meu horário fixo de pesquisa diária (escreva: ___h)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Consigo executar o processo de 4 etapas em 20 minutos</div></div>
</div>`,

  "exemplo-noticias": `
<div class="blockquote">
  <div class="blockquote-text">O que separa a teoria da prática é o número de vezes que você aplica a teoria no mundo real. Um exemplo concreto vale mais do que dez explicações abstratas.</div>
  <div class="blockquote-author">— Richard Feynman · adaptado</div>
</div>

<h2><span class="h2-num">1</span> Contexto — O Dia da Análise</h2>
<p>Esta aula é 100% prática. Vamos dissecar ao vivo a análise de notícias realizada em <strong>23 de fevereiro de 2026</strong> para XRP/USDT. Todos os dados são reais. Você vai ver como o Sistema de Classificação de Notícias e o Processo de 4 Etapas se aplicam em condições reais de mercado.</p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">$1.3301</div><div class="kpi-label">Preço XRP no momento da análise</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">5/100</div><div class="kpi-label">Fear & Greed Index — Medo Extremo</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--amber)">56.6%</div><div class="kpi-label">Dominância BTC — Bitcoin Season</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">136k+</div><div class="kpi-label">Traders liquidados nas 24h anteriores</div></div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Impacto de Notícias no Tempo — 23/02/2026</div>
  <svg viewBox="0 0 720 185" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- Timeline axis -->
    <line x1="40" y1="95" x2="695" y2="95" stroke="#1e3a5f" stroke-width="1.5"/>
    <!-- Arrow -->
    <polygon points="690,90 700,95 690,100" fill="#1e3a5f"/>
    <text x="360" y="175" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Horizonte de impacto no preço</text>

    <!-- Time labels -->
    <text x="80" y="110" text-anchor="middle" font-size="9" fill="#607d8b" font-family="monospace">Imediato</text>
    <text x="240" y="110" text-anchor="middle" font-size="9" fill="#607d8b" font-family="monospace">24–72h</text>
    <text x="400" y="110" text-anchor="middle" font-size="9" fill="#607d8b" font-family="monospace">1–2 semanas</text>
    <text x="580" y="110" text-anchor="middle" font-size="9" fill="#607d8b" font-family="monospace">1+ mês</text>

    <!-- Event 1: Tarifas Trump (bearish, immediate) -->
    <circle cx="80" cy="95" r="8" fill="#e8394a"/>
    <line x1="80" y1="87" x2="80" y2="40" stroke="#e8394a" stroke-width="1.5" stroke-dasharray="4,2"/>
    <rect x="18" y="18" width="124" height="22" rx="5" fill="#0a1628" stroke="#e8394a" stroke-width="1"/>
    <text x="80" y="33" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="sans-serif">Tarifas Trump → Bearish</text>

    <!-- Event 2: BTC liquidações (bearish, immediate) -->
    <circle cx="165" cy="95" r="6" fill="#e8394a" opacity=".8"/>
    <line x1="165" y1="89" x2="165" y2="55" stroke="#e8394a" stroke-width="1.2" stroke-dasharray="4,2"/>
    <rect x="115" y="42" width="100" height="22" rx="5" fill="#0a1628" stroke="#e8394a" stroke-width="1" opacity=".8"/>
    <text x="165" y="57" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="sans-serif">$417M liquidados</text>

    <!-- Event 3: Realizações XRP (bearish short) -->
    <circle cx="260" cy="95" r="7" fill="#f0a500"/>
    <line x1="260" y1="87" x2="260" y2="40" stroke="#f0a500" stroke-width="1.3" stroke-dasharray="4,2"/>
    <rect x="198" y="18" width="124" height="22" rx="5" fill="#0a1628" stroke="#f0a500" stroke-width="1"/>
    <text x="260" y="33" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="sans-serif">Realizações $1.93B</text>

    <!-- Event 4: SBI Holdings (bullish MP) -->
    <circle cx="480" cy="95" r="8" fill="#00d68f"/>
    <line x1="480" y1="87" x2="480" y2="40" stroke="#00d68f" stroke-width="1.5" stroke-dasharray="4,2"/>
    <rect x="418" y="18" width="124" height="22" rx="5" fill="#0a1628" stroke="#00d68f" stroke-width="1"/>
    <text x="480" y="33" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="sans-serif">SBI $64.5M → Bullish MP</text>

    <!-- Event 5: F&G = 5 (contrarian bullish) -->
    <circle cx="600" cy="95" r="7" fill="#3d8fef"/>
    <line x1="600" y1="87" x2="600" y2="55" stroke="#3d8fef" stroke-width="1.3" stroke-dasharray="4,2"/>
    <rect x="540" y="42" width="120" height="22" rx="5" fill="#0a1628" stroke="#3d8fef" stroke-width="1"/>
    <text x="600" y="57" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="sans-serif">F&amp;G=5 → Contrarian Bull</text>

    <!-- Legend -->
    <circle cx="50" cy="155" r="5" fill="#e8394a"/>
    <text x="60" y="159" font-size="9" fill="#607d8b" font-family="sans-serif">Bearish</text>
    <circle cx="120" cy="155" r="5" fill="#f0a500"/>
    <text x="130" y="159" font-size="9" fill="#607d8b" font-family="sans-serif">Neutro/Alerta</text>
    <circle cx="210" cy="155" r="5" fill="#00d68f"/>
    <text x="220" y="159" font-size="9" fill="#607d8b" font-family="sans-serif">Bullish (médio prazo)</text>
    <circle cx="350" cy="155" r="5" fill="#3d8fef"/>
    <text x="360" y="159" font-size="9" fill="#607d8b" font-family="sans-serif">Contrário / Longo prazo</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> Etapa 1 — Coleta: As 5 Notícias do Dia</h2>
<p>Após varrer as fontes (CoinDesk, Glassnode, The Block, Twitter, CryptoQuant), as 5 notícias de maior relevância para XRP identificadas foram:</p>

<div class="callout callout-warn" style="margin-bottom:12px">
  <div class="callout-title">📰 NOTÍCIA 1 — Glassnode / CryptoQuant</div>
  <p><strong>"Realizações de perdas em XRP atingem $1.93 bilhão — maior volume de sell-off em meses"</strong></p>
  <p style="margin-top:8px;font-size:13px">Holders realizando perdas em escala massiva. On-chain confirmado. Fonte tier-1.</p>
</div>

<div class="callout callout-info" style="margin-bottom:12px">
  <div class="callout-title">📰 NOTÍCIA 2 — The Block / Bloomberg</div>
  <p><strong>"SBI Holdings (Japão) anuncia emissão de bonds tokenizados no XRPL — $64.5 milhões"</strong></p>
  <p style="margin-top:8px;font-size:13px">Maior banco de investimento japonês usando a rede XRP para tokenização. Adoção institucional real.</p>
</div>

<div class="callout callout-gold" style="margin-bottom:12px">
  <div class="callout-title">📰 NOTÍCIA 3 — CoinDesk</div>
  <p><strong>"Rumor: JPMorgan estaria avaliando uso do XRPL para liquidação de pagamentos interbancários"</strong></p>
  <p style="margin-top:8px;font-size:13px">Não confirmado. Fonte secundária citando "pessoas familiarizadas com o assunto". JPMorgan não comentou.</p>
</div>

<div class="callout callout-info" style="margin-bottom:12px">
  <div class="callout-title">📰 NOTÍCIA 4 — Decrypt / XRPL Foundation</div>
  <p><strong>"Tesourarias em XRPL atingem $299.9 milhões em ativos tokenizados — crescimento de 34% em 30 dias"</strong></p>
  <p style="margin-top:8px;font-size:13px">Dado on-chain oficial. Crescimento acelerado de Real World Assets (RWA) na rede XRP.</p>
</div>

<div class="callout callout-warn" style="margin-bottom:12px">
  <div class="callout-title">📰 NOTÍCIA 5 — Reuters / Bloomberg</div>
  <p><strong>"Trump anuncia novas tarifas de 25% sobre importações do México e Canadá — mercados em queda"</strong></p>
  <p style="margin-top:8px;font-size:13px">Evento macro global. Afeta risk-off em todos os ativos, incluindo crypto. Impacto imediato confirmado: BTC caiu ~5% na hora do anúncio.</p>
</div>

<h2><span class="h2-num">3</span> Etapa 2 — Triagem: Aplicando o SCN em Cada Notícia</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>#</th><th>Notícia</th><th>Impacto</th><th>Timing</th><th>Fonte</th><th>Viés</th><th>Score Final</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em">1</td>
    <td>Realizações $1.93B</td>
    <td class="td-red td-em">ALTO</td>
    <td class="td-amber">Imediato→Curto</td>
    <td class="td-green">⭐⭐⭐⭐⭐</td>
    <td class="td-red td-em">BEARISH CP</td>
    <td>Bearish confirmado, on-chain real</td>
  </tr>
  <tr>
    <td class="td-em">2</td>
    <td>SBI Holdings bonds $64.5M</td>
    <td class="td-gold td-em">MÉDIO-ALTO</td>
    <td class="td-green">Médio→Longo</td>
    <td class="td-green">⭐⭐⭐⭐⭐</td>
    <td class="td-green td-em">BULLISH MP</td>
    <td>Bullish estrutural, adoção real</td>
  </tr>
  <tr>
    <td class="td-em">3</td>
    <td>Rumor JPMorgan XRPL</td>
    <td style="color:var(--gray2)" class="td-em">BAIXO*</td>
    <td style="color:var(--gray2)">Incerto</td>
    <td class="td-red">⭐⭐</td>
    <td style="color:var(--gray2)" class="td-em">NEUTRO</td>
    <td class="td-red">DESCARTADO — fonte fraca, não confirmado</td>
  </tr>
  <tr>
    <td class="td-em">4</td>
    <td>Tesourarias XRPL $299.9M</td>
    <td class="td-gold td-em">MÉDIO</td>
    <td class="td-green">Médio→Longo</td>
    <td class="td-green">⭐⭐⭐⭐⭐</td>
    <td class="td-green td-em">BULLISH LP</td>
    <td>Bullish estrutural, on-chain verificado</td>
  </tr>
  <tr>
    <td class="td-em">5</td>
    <td>Tarifas Trump México/Canadá</td>
    <td class="td-red td-em">ALTO</td>
    <td class="td-red">Imediato</td>
    <td class="td-green">⭐⭐⭐⭐⭐</td>
    <td class="td-red td-em">BEARISH CP</td>
    <td>Bearish macro imediato, risco-off global</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">🔍 Por Que a Notícia 3 (JPMorgan) Foi Descartada</div>
  <p>Muitos traders teriam ficado eufóricos com "JPMorgan + XRPL". Mas ao aplicar o SCN: <strong>Fonte = ⭐⭐</strong> (reportagem citando anônimos, sem confirmação oficial). <strong>Impacto real = ZERO até confirmação</strong>. Rumores não confirmados de fonte fraca têm 3 resultados possíveis: (1) confirmação → bullish, (2) desmentido → neutro-bearish, (3) silêncio → esquecido. Tratar como notícia real é um erro clássico que cria posições baseadas em ilusão.</p>
</div>

<h2><span class="h2-num">4</span> Etapa 3 — Interpretação: Construindo a Narrativa</h2>
<p>Com as 4 notícias válidas classificadas, chegamos ao momento de síntese — onde o analista separa curto prazo de médio/longo prazo:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Horizonte</th><th>Narrativa</th><th>Peso</th><th>Justificativa</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">Curto Prazo (1–7 dias)</td>
    <td class="td-red">NEGATIVO / BEARISH</td>
    <td class="td-red">Forte</td>
    <td>Realizações $1.93B (capitulação em curso) + Tarifas Trump (risk-off global) + F&amp;G 5/100 + 136k liquidações. Duas notícias bearish de alto impacto e fonte tier-1 confirmadas.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Médio Prazo (2–6 semanas)</td>
    <td class="td-gold">NEUTRO → POSITIVO</td>
    <td class="td-gold">Moderado</td>
    <td>Capitulação em escala ($1.93B realizados) historicamente precede fundos. Tarifas podem reverter com negociação. Sentimento extremamente negativo = contrarian signal.</td>
  </tr>
  <tr>
    <td class="td-em td-green">Longo Prazo (meses)</td>
    <td class="td-green">POSITIVO / BULLISH</td>
    <td class="td-green">Alto</td>
    <td>SBI Holdings $64.5M em bonds XRPL + Tesourarias crescendo 34%/mês = adoção real, não especulativa. Fundamentos do projeto XRP se fortalecem independente do preço de curto prazo.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> Etapa 4 — Integração: O Impacto na Análise e nos Cenários</h2>
<p>Como essas notícias afetaram a construção dos cenários probabilísticos do dia?</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">↓</div>
  <div class="rule-content">
    <h4>Impacto no Cenário Bearish (levou de 50% → 55%)</h4>
    <p>As realizações de $1.93B + tarifas Trump + F&amp;G extremo reforçaram o cenário de continuação do downtrend. Aumentamos 5 pontos de probabilidade para o bearish porque o macro imediato está claramente contra. Alvos mantidos: $1.2821 → $1.20 → $1.1172.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">↔</div>
  <div class="rule-content">
    <h4>Impacto no Cenário Neutro/Range (mantido em 25%)</h4>
    <p>A incerteza macro (tarifas podem ser negociadas, capitulação pode estar em fim de ciclo) justifica manter probabilidade de range. Zona de range definida: $1.2821 – $1.4837.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">↑</div>
  <div class="rule-content">
    <h4>Impacto no Cenário Bullish (mantido em 20%)</h4>
    <p>F&amp;G em 5/100 é contrarian extremo. Capitulação $1.93B pode ser o evento de "lavagem" final antes de reversão. SBI Holdings reforça fundamentos. Mantemos 20% de probabilidade para reversão — mas exigimos <strong>5 filtros confirmados</strong> antes de qualquer entrada long.</p>
  </div>
</div>

<h2><span class="h2-num">6</span> A Decisão Final — Entrar ou Não Entrar?</h2>

<div class="callout callout-warn">
  <div class="callout-title">🔴 Conclusão da Análise de Notícias</div>
  <p>
  <strong>Macro curto prazo:</strong> NEGATIVO — dois eventos bearish de alto impacto e fonte oficial confirmados.<br>
  <strong>Macro médio prazo:</strong> NEUTRO → POSITIVO — capitulação + fundamentos sólidos = divergência temporal.<br>
  <strong>Impacto no setup:</strong> O contexto macro desfavorável de curto prazo <strong>reprova o Filtro 4</strong> dos 5 Filtros de Confirmação. Isso significa que mesmo com suporte técnico sólido em $1.3301, a análise de notícias sozinha já impede a entrada de capital máximo.<br><br>
  <strong>Ação:</strong> Aguardar estabilização de BTC acima de $65.7k E F&amp;G voltando acima de 20 antes de considerar entrada long em XRP. Monitorar ativamente, mas não operar ainda.
  </p>
</div>

<div class="callout callout-success">
  <div class="callout-title">💡 A Lição Mais Importante Desta Aula</div>
  <p>Note que chegamos à conclusão de <strong>NÃO ENTRAR</strong> usando apenas a análise de notícias — sem sequer abrir o gráfico. Isso demonstra o poder da Fase 1 do método: quando o contexto macro está suficientemente claro (negativo de curto prazo), você economiza tempo, energia e capital simplesmente ficando de fora. A análise técnica nas próximas fases <em>confirmará</em> essa decisão — mas a decisão estratégica já estava tomada aqui.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendi como o SCN classifica cada notícia nas 3 dimensões com dados reais</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendi por que o rumor JPMorgan foi descartado apesar de parecer positivo</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei separar impacto de curto prazo vs médio/longo prazo nas notícias</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendi como notícias afetam diretamente as probabilidades dos 3 cenários</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Vou replicar este processo na próxima notícia relevante do meu ativo principal</div></div>
</div>`,

  "fg": `
<div class="blockquote">
  <div class="blockquote-text">Seja ganancioso quando os outros têm medo. E tenha medo quando os outros são gananciosos.</div>
  <div class="blockquote-author">— Warren Buffett · o princípio do investidor contrário</div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Fear &amp; Greed Index — Escala e Interpretação</div>
  <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Gauge arc segments -->
    <!-- Extreme Fear: 0-20 red -->
    <path d="M 180,160 A 140,140 0 0,1 83,90" fill="none" stroke="#c0392b" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Fear: 20-40 orange -->
    <path d="M 83,90 A 140,140 0 0,1 155,26" fill="none" stroke="#e67e22" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Neutral: 40-60 yellow -->
    <path d="M 155,26 A 140,140 0 0,1 265,26" fill="none" stroke="#f1c40f" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Greed: 60-80 light green -->
    <path d="M 265,26 A 140,140 0 0,1 337,90" fill="none" stroke="#27ae60" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Extreme Greed: 80-100 bright green -->
    <path d="M 337,90 A 140,140 0 0,1 240,160" fill="none" stroke="#00d68f" stroke-width="28" stroke-linecap="round" opacity=".85"/>

    <!-- Inner white arc -->
    <path d="M 180,160 A 140,140 0 0,1 240,160" fill="none" stroke="#0d1f3c" stroke-width="30" opacity=".0"/>

    <!-- Needle (pointing to ~5 — extreme fear, XRP case) -->
    <!-- Needle at ~5 = almost full left, angle ~183deg from right -->
    <line x1="210" y1="160" x2="80" y2="152" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <circle cx="210" cy="160" r="8" fill="#0d1f3c" stroke="white" stroke-width="2"/>

    <!-- Center value -->
    <text x="210" y="148" text-anchor="middle" font-size="28" fill="white" font-family="sans-serif" font-weight="900">5</text>
    <text x="210" y="168" text-anchor="middle" font-size="11" fill="#c0392b" font-family="sans-serif" font-weight="700">MEDO EXTREMO</text>

    <!-- Scale labels on arc -->
    <text x="42" y="170" font-size="10" fill="#c0392b" font-family="sans-serif" text-anchor="middle">0</text>
    <text x="55" y="80" font-size="10" fill="#e67e22" font-family="sans-serif" text-anchor="middle">25</text>
    <text x="210" y="18" font-size="10" fill="#f1c40f" font-family="sans-serif" text-anchor="middle">50</text>
    <text x="365" y="80" font-size="10" fill="#27ae60" font-family="sans-serif" text-anchor="middle">75</text>
    <text x="378" y="170" font-size="10" fill="#00d68f" font-family="sans-serif" text-anchor="middle">100</text>

    <!-- Zone labels below -->
    <text x="62" y="185" font-size="9.5" fill="#c0392b" font-family="sans-serif" text-anchor="middle">Medo</text>
    <text x="62" y="196" font-size="9.5" fill="#c0392b" font-family="sans-serif" text-anchor="middle">Extremo</text>
    <text x="118" y="192" font-size="9.5" fill="#e67e22" font-family="sans-serif" text-anchor="middle">Medo</text>
    <text x="210" y="192" font-size="9.5" fill="#f1c40f" font-family="sans-serif" text-anchor="middle">Neutro</text>
    <text x="302" y="192" font-size="9.5" fill="#27ae60" font-family="sans-serif" text-anchor="middle">Ganância</text>
    <text x="358" y="185" font-size="9.5" fill="#00d68f" font-family="sans-serif" text-anchor="middle">Ganância</text>
    <text x="358" y="196" font-size="9.5" fill="#00d68f" font-family="sans-serif" text-anchor="middle">Extrema</text>

    <!-- Contrarian rule box -->
    <rect x="430" y="30" width="270" height="140" rx="8" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="565" y="52" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">Regra Contrária do TMP</text>
    <line x1="445" y1="60" x2="685" y2="60" stroke="#1e3a5f" stroke-width="1"/>

    <circle cx="450" cy="82" r="4" fill="#00d68f"/>
    <text x="460" y="86" font-size="10" fill="#607d8b" font-family="sans-serif">F&amp;G <tspan fill="#00d68f" font-weight="700">0–20</tspan> = Medo Extremo</text>
    <text x="460" y="100" font-size="10" fill="#00d68f" font-family="sans-serif">→ Bullish de médio prazo</text>

    <circle cx="450" cy="120" r="4" fill="#e8394a"/>
    <text x="460" y="124" font-size="10" fill="#607d8b" font-family="sans-serif">F&amp;G <tspan fill="#e8394a" font-weight="700">80–100</tspan> = Ganância Extrema</text>
    <text x="460" y="138" font-size="10" fill="#e8394a" font-family="sans-serif">→ Bearish de médio prazo</text>

    <text x="565" y="160" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">XRP 23/02/2026: F&amp;G = 5 → sinal contrário bullish MP</text>
  </svg>
</div>


<h2><span class="h2-num">1</span> O Que é o Fear & Greed Index — E Por Que Funciona</h2>
<p>O Fear & Greed Index é o termômetro emocional do mercado cripto. Vai de <strong>0 (Terror Extremo)</strong> a <strong>100 (Ganância Extrema)</strong> e é calculado diariamente pela plataforma Alternative.me com base em 6 variáveis ponderadas.</p>
<p>Ele funciona porque captura algo que os gráficos técnicos sozinhos não mostram: o <strong>estado psicológico coletivo</strong> dos participantes do mercado. E esse estado coletivo é sistematicamente previsível nos extremos — quando todos têm medo, o fundo está próximo; quando todos são gananciosos, o topo está próximo.</p>

<div class="kpi-row kpi-row-3">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">5/100</div><div class="kpi-label">XRP 23/02/2026 — Terror Extremo</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">6</div><div class="kpi-label">Variáveis que compõem o índice</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">diário</div><div class="kpi-label">Frequência de atualização</div></div>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Fear &amp; Greed Index — Escala e Interpretação</div>
  <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Gauge arc segments -->
    <!-- Extreme Fear: 0-20 red -->
    <path d="M 180,160 A 140,140 0 0,1 83,90" fill="none" stroke="#c0392b" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Fear: 20-40 orange -->
    <path d="M 83,90 A 140,140 0 0,1 155,26" fill="none" stroke="#e67e22" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Neutral: 40-60 yellow -->
    <path d="M 155,26 A 140,140 0 0,1 265,26" fill="none" stroke="#f1c40f" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Greed: 60-80 light green -->
    <path d="M 265,26 A 140,140 0 0,1 337,90" fill="none" stroke="#27ae60" stroke-width="28" stroke-linecap="round" opacity=".85"/>
    <!-- Extreme Greed: 80-100 bright green -->
    <path d="M 337,90 A 140,140 0 0,1 240,160" fill="none" stroke="#00d68f" stroke-width="28" stroke-linecap="round" opacity=".85"/>

    <!-- Inner white arc -->
    <path d="M 180,160 A 140,140 0 0,1 240,160" fill="none" stroke="#0d1f3c" stroke-width="30" opacity=".0"/>

    <!-- Needle (pointing to ~5 — extreme fear, XRP case) -->
    <!-- Needle at ~5 = almost full left, angle ~183deg from right -->
    <line x1="210" y1="160" x2="80" y2="152" stroke="white" stroke-width="3" stroke-linecap="round"/>
    <circle cx="210" cy="160" r="8" fill="#0d1f3c" stroke="white" stroke-width="2"/>

    <!-- Center value -->
    <text x="210" y="148" text-anchor="middle" font-size="28" fill="white" font-family="sans-serif" font-weight="900">5</text>
    <text x="210" y="168" text-anchor="middle" font-size="11" fill="#c0392b" font-family="sans-serif" font-weight="700">MEDO EXTREMO</text>

    <!-- Scale labels on arc -->
    <text x="42" y="170" font-size="10" fill="#c0392b" font-family="sans-serif" text-anchor="middle">0</text>
    <text x="55" y="80" font-size="10" fill="#e67e22" font-family="sans-serif" text-anchor="middle">25</text>
    <text x="210" y="18" font-size="10" fill="#f1c40f" font-family="sans-serif" text-anchor="middle">50</text>
    <text x="365" y="80" font-size="10" fill="#27ae60" font-family="sans-serif" text-anchor="middle">75</text>
    <text x="378" y="170" font-size="10" fill="#00d68f" font-family="sans-serif" text-anchor="middle">100</text>

    <!-- Zone labels below -->
    <text x="62" y="185" font-size="9.5" fill="#c0392b" font-family="sans-serif" text-anchor="middle">Medo</text>
    <text x="62" y="196" font-size="9.5" fill="#c0392b" font-family="sans-serif" text-anchor="middle">Extremo</text>
    <text x="118" y="192" font-size="9.5" fill="#e67e22" font-family="sans-serif" text-anchor="middle">Medo</text>
    <text x="210" y="192" font-size="9.5" fill="#f1c40f" font-family="sans-serif" text-anchor="middle">Neutro</text>
    <text x="302" y="192" font-size="9.5" fill="#27ae60" font-family="sans-serif" text-anchor="middle">Ganância</text>
    <text x="358" y="185" font-size="9.5" fill="#00d68f" font-family="sans-serif" text-anchor="middle">Ganância</text>
    <text x="358" y="196" font-size="9.5" fill="#00d68f" font-family="sans-serif" text-anchor="middle">Extrema</text>

    <!-- Contrarian rule box -->
    <rect x="430" y="30" width="270" height="140" rx="8" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="565" y="52" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">Regra Contrária do TMP</text>
    <line x1="445" y1="60" x2="685" y2="60" stroke="#1e3a5f" stroke-width="1"/>

    <circle cx="450" cy="82" r="4" fill="#00d68f"/>
    <text x="460" y="86" font-size="10" fill="#607d8b" font-family="sans-serif">F&amp;G <tspan fill="#00d68f" font-weight="700">0–20</tspan> = Medo Extremo</text>
    <text x="460" y="100" font-size="10" fill="#00d68f" font-family="sans-serif">→ Bullish de médio prazo</text>

    <circle cx="450" cy="120" r="4" fill="#e8394a"/>
    <text x="460" y="124" font-size="10" fill="#607d8b" font-family="sans-serif">F&amp;G <tspan fill="#e8394a" font-weight="700">80–100</tspan> = Ganância Extrema</text>
    <text x="460" y="138" font-size="10" fill="#e8394a" font-family="sans-serif">→ Bearish de médio prazo</text>

    <text x="565" y="160" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">XRP 23/02/2026: F&amp;G = 5 → sinal contrário bullish MP</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> Como o Índice É Calculado — As 6 Variáveis</h2>
<p>Entender a composição do índice permite usá-lo com muito mais precisão:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Variável</th><th>Peso</th><th>O Que Mede</th><th>Fonte</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Volatilidade</td>
    <td class="td-gold">25%</td>
    <td>Volatilidade atual vs média de 30/90 dias. Alta volatilidade = medo.</td>
    <td>Dados de preço BTC</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Volume de Mercado / Momentum</td>
    <td class="td-gold">25%</td>
    <td>Volume de compra vs venda + momentum de preço. Alto volume comprador = ganância.</td>
    <td>Exchanges spot + futuros</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Mídias Sociais</td>
    <td class="td-bright">15%</td>
    <td>Sentimento e volume de menções cripto no Twitter. Picos de menção = ganância.</td>
    <td>Twitter API</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Dominância BTC</td>
    <td class="td-bright">10%</td>
    <td>Alta dominância BTC = fuga para "porto seguro" cripto = medo de altcoins.</td>
    <td>CoinMarketCap</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Tendências Google</td>
    <td class="td-cyan">10%</td>
    <td>Buscas por "Bitcoin crash", "crypto buy" etc. revela interesse do público geral.</td>
    <td>Google Trends</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--gray2)">Pesquisas (Surveys)</td>
    <td style="color:var(--gray2)">15%</td>
    <td>Pesquisas semanais de sentimento com traders. (Temporariamente desativado.)</td>
    <td>Alternative.me</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-info">
  <div class="callout-title">💡 Por Que Isso Importa Para Você</div>
  <p>Quando o índice está em Medo Extremo (0–24), <strong>volatilidade subiu muito</strong> + <strong>volume vendedor dominou</strong> + <strong>sentimento social é negativo</strong>. Isso cria uma confluência onde ativos sólidos ficam "desconto" — vendidos por holders em pânico que precisam de liquidez ou não aguentam a pressão psicológica. Exatamente a janela que o método TMP caça.</p>
</div>

<h2><span class="h2-num">3</span> Manual Completo de Interpretação — 5 Faixas com Estratégia</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Faixa</th><th>Estado</th><th>Psicologia do Mercado</th><th>O Que Está Acontecendo</th><th>Estratégia TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">0 – 24</td>
    <td style="font-size:18px">😱</td>
    <td class="td-red td-em">Terror Extremo</td>
    <td>Capitulação em massa. Liquidações em cascata. Holders de longo prazo vendendo com prejuízo. Mídia com headlines apocalípticas.</td>
    <td><strong style="color:var(--green)">Zona de atenção máxima para compra.</strong> Monitore suportes confluentes. Exija 5 filtros antes de entrar. Reduza tamanho de posição 30% pela volatilidade alta.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:#e67e22">25 – 44</td>
    <td style="font-size:18px">😨</td>
    <td style="color:#e67e22" class="td-em">Medo</td>
    <td>Pessimismo dominante, mas não extremo. Mercado em recuperação parcial ou lateralização após queda. Holders incertos.</td>
    <td><strong style="color:var(--amber)">Setups de compra começam a aparecer.</strong> R:R melhora com o pessimismo ainda presente. Confluência técnica + fundamentalista requerida.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">45 – 54</td>
    <td style="font-size:18px">😐</td>
    <td class="td-cyan td-em">Neutro</td>
    <td>Indecisão coletiva. Mercado em equilíbrio temporário entre compradores e vendedores. Geralmente precede movimento direcional.</td>
    <td><strong style="color:var(--cyan)">Aguardar rompimento de range com volume.</strong> Menor confiabilidade de setups. Reduzir exposição até definição de direção.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">55 – 74</td>
    <td style="font-size:18px">😊</td>
    <td class="td-gold td-em">Ganância</td>
    <td>Bull market em andamento. Otimismo crescente. Novas entradas no mercado. Volume comprador dominante. FOMO ainda não extremo.</td>
    <td><strong style="color:var(--gold)">Gerenciar posições compradas ativamente.</strong> Trailing stop obrigatório. Realizar lucros parciais em resistências. Evitar novas entradas agressivas.</td>
  </tr>
  <tr>
    <td class="td-em td-red">75 – 100</td>
    <td style="font-size:18px">🤑</td>
    <td class="td-red td-em">Ganância Extrema</td>
    <td>Euforia máxima. Todo mundo "entrando no cripto". Mídia positiva demais. Valorizações desproporcionais. Narrativas de "novo paradigma".</td>
    <td><strong style="color:var(--red)">Zona de perigo máxima.</strong> NUNCA aumentar longs aqui. Considerar realizações significativas. Preparar para correção forte. Shortear só com confirmação técnica clara.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> O Índice Como Indicador Contrário — Dados Históricos</h2>
<p>O poder real do F&G é ser <strong>contrário</strong>: os extremos historicamente marcam fundos e topos. Não com precisão cirúrgica de timing — mas com alta confiabilidade de direção no médio prazo.</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Data</th><th>F&G na Época</th><th>Evento</th><th>Resultado 30 dias depois</th></tr></thead>
<tbody>
  <tr>
    <td>Mar/2020</td>
    <td class="td-red td-em">8 — Terror Extremo</td>
    <td>Crash COVID. BTC caiu de $9k para $3.8k em 48h.</td>
    <td class="td-green td-em">+130% (BTC voltou para $9k e seguiu)</td>
  </tr>
  <tr>
    <td>Jul/2021</td>
    <td class="td-red td-em">10 — Terror Extremo</td>
    <td>China proibiu mineração. BTC caiu de $64k para $29k.</td>
    <td class="td-green td-em">+68% (BTC subiu para $48k)</td>
  </tr>
  <tr>
    <td>Nov/2021</td>
    <td class="td-red td-em">84 — Ganância Extrema</td>
    <td>BTC no ATH de $69k. "Bitcoin a $1 milhão" virou meme.</td>
    <td class="td-red td-em">−45% (inicio do bear market 2022)</td>
  </tr>
  <tr>
    <td>Jun/2022</td>
    <td class="td-red td-em">6 — Terror Extremo</td>
    <td>Colapso LUNA. BTC caiu de $30k para $17k. FTX semanas depois.</td>
    <td class="td-gold">Fundo confirmado 6 meses depois em $15.5k</td>
  </tr>
  <tr>
    <td>Fev/2026</td>
    <td class="td-red td-em">5 — Terror Extremo</td>
    <td>136k traders liquidados. XRP @ $1.33 após queda de $3.66.</td>
    <td class="td-cyan td-em">→ Analisando no nosso estudo de caso XRP</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Limitações Importantes — Não Use Isolado</div>
  <p>
  <strong>Timing impreciso:</strong> F&G = 5 pode durar dias ou semanas antes do fundo real. O índice indica <em>zona</em>, não dia exato.<br><br>
  <strong>Não distingue ativos:</strong> O índice reflete BTC e o mercado geral — um ativo específico pode estar em tendência contrária ao sentimento geral.<br><br>
  <strong>Bear markets prolongados:</strong> Em bear markets severos (2022), F&G pode ficar na zona de medo por meses. "Está barato" não significa "vai subir agora".<br><br>
  <strong>Regra TMP:</strong> F&G é um <em>filtro de contexto</em>, não um sinal de entrada. Sempre combine com análise técnica (suporte + indicadores) e análise de notícias.
  </p>
</div>

<h2><span class="h2-num">5</span> Como Usar F&G na Prática Diária — Protocolo</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Consulte Diariamente — Antes de Qualquer Gráfico</h4>
      <p>Acesse <strong>alternative.me/crypto/fear-and-greed-index/</strong> toda manhã. Anote o valor atual E a tendência dos últimos 7 dias (subindo? caindo? estável?). A tendência importa tanto quanto o valor absoluto.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Ajuste Seu Viés de Análise</h4>
      <p>
        <strong style="color:var(--red)">F&G 0–24:</strong> Analise com viés de reversão. Procure sinais de exaustão vendedora. Qualquer setup long tem vento de médio prazo a favor.<br>
        <strong style="color:var(--gray2)">F&G 25–74:</strong> Analise sem viés pré-definido. Siga o que a técnica mostrar.<br>
        <strong style="color:var(--red)">F&G 75–100:</strong> Analise com ceticismo para longs. Qualquer setup de compra exige mais confirmações.
      </p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Ajuste o Tamanho da Posição Conforme o F&G</h4>
      <div class="data-table-wrap" style="margin-top:8px">
      <table class="data-table">
      <thead><tr><th>F&G</th><th>Ajuste de Sizing</th><th>Razão</th></tr></thead>
      <tbody>
        <tr><td class="td-red">0–15</td><td>−30% do tamanho normal</td><td>Volatilidade extrema. Stop mais largo necessário. Preservar capital.</td></tr>
        <tr><td style="color:#e67e22">16–30</td><td>−15% do tamanho normal</td><td>Ainda volátil. Cautela mantida.</td></tr>
        <tr><td class="td-cyan">31–69</td><td>100% normal</td><td>Ambiente controlado para o método.</td></tr>
        <tr><td class="td-gold">70–84</td><td>−20% do tamanho normal</td><td>Risco de reversão crescente.</td></tr>
        <tr><td class="td-red">85–100</td><td>−40% do tamanho normal</td><td>Mercado superaquecido. Máxima cautela.</td></tr>
      </tbody>
      </table>
      </div>
    </div>
  </div>
</div>

<h2><span class="h2-num">6</span> Análise Real — F&G = 5 em 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Contexto Completo do Dia</div>
  <p>
  <strong>F&G:</strong> 5/100 — Terror Extremo total<br>
  <strong>BTC:</strong> −8% na semana, tentando segurar $64.7k<br>
  <strong>Liquidações 24h:</strong> $417M — 136.000+ traders liquidados<br>
  <strong>XRP:</strong> −62% desde o ATH de $3.66 (jan/2026), tentando segurar $1.33<br><br>
  <strong>O que F&G = 5 nos disse:</strong>
  </p>
  <ul style="margin-top:8px;font-size:14px">
    <li>Capitulação em andamento — holders vendendo com prejuízo em escala</li>
    <li>Volatilidade muito acima da média — stops mais largos necessários</li>
    <li>Contrarian signal de médio prazo ativo — zona historicamente associada a fundos</li>
    <li>Ajuste de sizing aplicado: −30% do tamanho normal para qualquer entrada</li>
    <li>Não é sinal de entrada imediata — é sinal de monitoramento ativo aguardando confirmação técnica</li>
  </ul>
</div>

<div class="callout callout-success">
  <div class="callout-title">✅ Como o F&G Moldou a Análise do Dia</div>
  <p>Com F&G em 5, ajustamos a probabilidade do cenário bullish de "improvável" para "baixa mas real" (20%). Não porque F&G = 5 seja sinal de compra — mas porque contextos de Terror Extremo historicamente precedem fundos de médio prazo. Combinado com suporte técnico confluente em $1.33, criou-se o contexto de <strong>monitoramento de reversão com tamanho reduzido</strong>. A entrada só seria válida se 5 filtros técnicos confirmassem — o que veremos nas próximas fases.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei as 6 variáveis que compõem o F&G e o peso de cada uma</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo as 5 faixas e a estratégia TMP para cada uma</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei ajustar o tamanho da posição baseado no F&G atual</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Adicionei alternative.me na minha rotina diária de análise</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendi as limitações: F&G é filtro de contexto, não sinal de entrada isolado</div></div>
</div>`,

  "dominancia": `
<div class="blockquote">
  <div class="blockquote-text">No cripto, a posição do Bitcoin no mercado não é apenas um dado — é o termômetro que revela em que fase do ciclo estamos e quanto risco o mercado está disposto a aceitar.</div>
  <div class="blockquote-author">— Willy Woo · Analista On-Chain</div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">BTC Dominance — Regimes e Impacto nas Altcoins</div>
  <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Chart area -->
    <rect x="10" y="10" width="700" height="140" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Zone bands -->
    <!-- >60% - extreme bitcoin season -->
    <rect x="10" y="10" width="700" height="28" rx="3" fill="#f0a500" opacity=".07"/>
    <text x="18" y="27" font-size="9.5" fill="#f0a500" font-family="monospace">&gt;60% — Bitcoin Season Extremo</text>

    <!-- 54-60% - bitcoin season -->
    <rect x="10" y="38" width="700" height="35" rx="0" fill="#f0a500" opacity=".04"/>
    <text x="18" y="55" font-size="9.5" fill="#f0a500" font-family="monospace">54–60% — Bitcoin Season (altcoins sofrem)</text>

    <!-- 48-54% - neutral -->
    <rect x="10" y="73" width="700" height="28" rx="0" fill="#607d8b" opacity=".06"/>
    <text x="18" y="90" font-size="9.5" fill="#607d8b" font-family="monospace">48–54% — Neutro</text>

    <!-- 42-48% - altcoin season -->
    <rect x="10" y="101" width="700" height="28" rx="0" fill="#00d68f" opacity=".06"/>
    <text x="18" y="118" font-size="9.5" fill="#00d68f" font-family="monospace">42–48% — Altcoin Season</text>

    <!-- <42% - extreme altcoin -->
    <rect x="10" y="129" width="700" height="21" rx="0" fill="#00d68f" opacity=".09"/>
    <text x="18" y="143" font-size="9.5" fill="#00d68f" font-family="monospace">&lt;42% — Altcoin Season Extremo</text>

    <!-- BTC.D Line -->
    <polyline points="25,80 70,78 110,75 150,72 190,68 230,58 265,50 290,46 310,46 330,50 360,55 380,60 400,62 420,60 450,57 475,53 500,50 520,48 540,52 565,53 580,51 600,49 625,47 650,48 680,48 700,48"
      fill="none" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- Current XRP point annotation -->
    <circle cx="680" cy="48" r="5" fill="#e8394a"/>
    <text x="618" y="43" font-size="9.5" fill="#e8394a" font-family="sans-serif">56.6% agora</text>

    <!-- Y-axis labels -->
    <text x="700" y="17" font-size="9" fill="#f0a500" font-family="monospace" text-anchor="end">60%</text>
    <text x="700" y="45" font-size="9" fill="#f0a500" font-family="monospace" text-anchor="end">54%</text>
    <text x="700" y="80" font-size="9" fill="#607d8b" font-family="monospace" text-anchor="end">50%</text>
    <text x="700" y="108" font-size="9" fill="#00d68f" font-family="monospace" text-anchor="end">46%</text>

    <!-- Impact table below -->
    <rect x="10" y="158" width="700" height="34" rx="5" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="90" y="170" text-anchor="middle" font-size="9.5" fill="#f0a500" font-family="sans-serif">BTC.D &gt;54%</text>
    <text x="90" y="183" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Fuja de altcoins</text>
    <line x1="170" y1="160" x2="170" y2="192" stroke="#1e3a5f" stroke-width="1"/>
    <text x="250" y="170" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">48–54%</text>
    <text x="250" y="183" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Neutro — seletivo</text>
    <line x1="340" y1="160" x2="340" y2="192" stroke="#1e3a5f" stroke-width="1"/>
    <text x="430" y="170" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="sans-serif">42–48%</text>
    <text x="430" y="183" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Altcoin season</text>
    <line x1="520" y1="160" x2="520" y2="192" stroke="#1e3a5f" stroke-width="1"/>
    <text x="615" y="170" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="sans-serif">BTC.D &lt;42%</text>
    <text x="615" y="183" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Altcoins dominam</text>
  </svg>
</div>


<h2><span class="h2-num">1</span> O Que é a Dominância do Bitcoin</h2>
<p>A Dominância do Bitcoin (BTC.D) é o percentual do market cap total do mercado cripto que pertence ao Bitcoin. Se o market cap total é $2 trilhões e o Bitcoin vale $1.2 trilhão, a dominância é 60%.</p>
<p>É uma das métricas mais importantes para o método TMP porque revela <strong>onde o dinheiro grande está se posicionando</strong> — em segurança relativa (BTC) ou em risco elevado (altcoins). Essa dinâmica determina diretamente se você deve focar em BTC ou em altcoins como XRP no momento.</p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--amber)">56.6%</div><div class="kpi-label">Dominância BTC em 23/02/2026</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">~40%</div><div class="kpi-label">Dominância mínima histórica (jan/2018)</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">~73%</div><div class="kpi-label">Dominância máxima recente (2023)</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">50%</div><div class="kpi-label">Linha divisória Bitcoin vs Altcoin Season</div></div>
</div>

<h2><span class="h2-num">2</span> Os 5 Regimes de Mercado Baseados em Dominância</h2>
<p>Cada nível de dominância cria um ambiente diferente — com implicações diretas em quais ativos operar e em qual direção:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Dominância BTC</th><th>Regime</th><th>O Que Está Acontecendo</th><th>Estratégia TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">&gt; 60%</td>
    <td class="td-em">🟠 Bitcoin Season Extremo</td>
    <td>Fuga para "porto seguro" cripto. Capital saindo de altcoins para BTC. Geralmente em bear market ou crise.</td>
    <td><strong>Foco total em BTC.</strong> Altcoins em downtrend severo. XRP e similares em risco máximo. Reduzir ou zerar exposição a altcoins.</td>
  </tr>
  <tr>
    <td class="td-em td-amber">55 – 60%</td>
    <td class="td-em">🟡 Bitcoin Season</td>
    <td>BTC performando melhor que altcoins. Capital concentrado. Altcoins lateralizando ou caindo levemente vs BTC.</td>
    <td><strong>Preferência por BTC.</strong> Altcoins de alta capitalização (ETH, XRP) só com setup técnico muito claro. Reduzir tamanho em altcoins 20–30%.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">50 – 55%</td>
    <td class="td-em">⚪ Zona de Transição</td>
    <td>Equilíbrio instável. Capital se redistribuindo. Muitas altcoins seguindo BTC sem descorrelação.</td>
    <td><strong>Monitorar tendência.</strong> Se dominância caindo → preparar para altcoin season. Se subindo → aumentar cautela em altcoins.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">45 – 50%</td>
    <td class="td-em">🟢 Altcoin Season</td>
    <td>Capital fluindo de BTC para altcoins. Altcoins superando BTC em performance. Bull market mais amplo.</td>
    <td><strong>Ampliar exposição a altcoins de qualidade.</strong> XRP, ETH, SOL com maior potencial. Manter BTC como âncora mas alocar mais em alts.</td>
  </tr>
  <tr>
    <td class="td-em td-green">&lt; 45%</td>
    <td class="td-em">🔵 Altcoin Season Extremo</td>
    <td>Euforia em altcoins. Capital em rotação máxima. ATHs em múltiplas altcoins. Risco de pico de ciclo.</td>
    <td><strong>Máxima atenção ao ciclo.</strong> Excelente para longs bem posicionados, mas aproximação de topo. Trailing stops apertados. Preparar rotação de volta para BTC.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> A Relação Dinâmica BTC × Altcoins</h2>
<p>Não é suficiente olhar o nível absoluto de dominância — a <strong>tendência</strong> (subindo, caindo ou lateralizando) é igualmente importante:</p>

<div class="indicator-grid">
  <div class="indicator-card" style="border-color:var(--red)">
    <div class="ic-header"><div class="ic-icon">📉</div><div class="ic-name" style="color:var(--red)">BTC CAINDO + BTC.D SUBINDO</div></div>
    <div class="ic-value" style="color:var(--red)">MÁXIMO RISCO</div>
    <div class="ic-desc">O pior cenário para altcoins. BTC cai e ainda assim domina mais — altcoins caem mais rápido que BTC. Sair de altcoins imediatamente.</div>
  </div>
  <div class="indicator-card" style="border-color:var(--amber)">
    <div class="ic-header"><div class="ic-icon">📊</div><div class="ic-name" style="color:var(--amber)">BTC CAINDO + BTC.D CAINDO</div></div>
    <div class="ic-value" style="color:var(--amber)">RISCO MODERADO</div>
    <div class="ic-desc">BTC cai mas altcoins caem menos — sinal de que capital está fluindo de BTC para alts. Pode ser início de altcoin season mesmo com BTC fraco.</div>
  </div>
  <div class="indicator-card" style="border-color:var(--gold)">
    <div class="ic-header"><div class="ic-icon">📈</div><div class="ic-name" style="color:var(--gold)">BTC SUBINDO + BTC.D SUBINDO</div></div>
    <div class="ic-value" style="color:var(--gold)">BTC SEASON ATIVO</div>
    <div class="ic-desc">BTC sobe e domina mais. Capital concentrado. Altcoins ficam para trás ou sobem menos. Focar em BTC ou reduzir altcoins.</div>
  </div>
  <div class="indicator-card" style="border-color:var(--green)">
    <div class="ic-header"><div class="ic-icon">🚀</div><div class="ic-name" style="color:var(--green)">BTC SUBINDO + BTC.D CAINDO</div></div>
    <div class="ic-value" style="color:var(--green)">MELHOR CENÁRIO</div>
    <div class="ic-desc">BTC sobe E altcoins sobem mais que BTC. Rotação para altcoins em andamento. Altcoin season confirmando. Melhor ambiente para XRP e similares.</div>
  </div>
</div>

<h2><span class="h2-num">4</span> Dominância e o Ciclo de 4 Anos do Bitcoin</h2>
<p>A dominância BTC segue padrões históricos ligados ao ciclo do halving:</p>

<div class="steps">
  <div class="step-card" style="border-left:3px solid var(--red)">
    <div class="step-num" style="background:linear-gradient(135deg,#600,#e8394a)">1</div>
    <div class="step-content">
      <h4>Fase Bear Market — Dominância Alta (60–75%)</h4>
      <p>Após topo de ciclo, capital foge de altcoins para BTC (mais "seguro") ou para USDT/stablecoins. Dominância sobe. Altcoins perdem 70–90% vs BTC. Duração: 12–18 meses.</p>
    </div>
  </div>
  <div class="step-card" style="border-left:3px solid var(--gold)">
    <div class="step-num" style="background:linear-gradient(135deg,#7B5C00,#f0a500)">2</div>
    <div class="step-content">
      <h4>Fase Acumulação BTC — Dominância Estável (55–65%)</h4>
      <p>BTC estabiliza. Smart money acumula BTC silenciosamente. Altcoins estagnadas. Dominância se mantém alta. Fase de paciência — preparar watchlist de altcoins.</p>
    </div>
  </div>
  <div class="step-card" style="border-left:3px solid var(--bright)">
    <div class="step-num" style="background:linear-gradient(135deg,#0A3060,#3d8fef)">3</div>
    <div class="step-content">
      <h4>Fase Bull BTC — Dominância Subindo Depois Caindo (50–60%)</h4>
      <p>BTC lidera a alta. Dominância sobe brevemente enquanto capital entra via BTC. Depois começa a cair à medida que capital rotaciona para ETH e large caps. Momento de preparar altcoins.</p>
    </div>
  </div>
  <div class="step-card" style="border-left:3px solid var(--green)">
    <div class="step-num" style="background:linear-gradient(135deg,#005C3A,#00d68f)">4</div>
    <div class="step-content">
      <h4>Fase Altcoin Season — Dominância Caindo (40–50%)</h4>
      <p>Capital em rotação máxima para altcoins. BTC lateraliza ou sobe menos. XRP, SOL, AVAX, altcoins diversas explodindo. Dominância no mínimo do ciclo. Topo próximo quando &lt; 42%.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> Análise Real — Dominância 56.6% em 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Leitura da Dominância no Dia da Análise</div>
  <p>
  <strong>Dominância BTC:</strong> 56.6% — Bitcoin Season ativo<br>
  <strong>Tendência:</strong> Subindo (era ~53% em jan/2026 durante a alta de XRP para $3.66)<br>
  <strong>Regime:</strong> Capital voltando para BTC após euforia de altcoins em janeiro<br><br>
  <strong>O que isso nos disse:</strong><br>
  ✗ Ambiente desfavorável para longs em altcoins — capital em Bitcoin Season<br>
  ✗ XRP em downtrend estrutural amplificado pela dominância BTC alta<br>
  ✓ Se dominância começar a cair de 56.6% → sinal antecipado de próximo movimento positivo em XRP<br>
  ✓ Monitorar BTC.D como indicador líder — reversão aqui precede reversão em XRP
  </p>
</div>

<div class="callout callout-info">
  <div class="callout-title">🔧 Como Acompanhar BTC.D no TradingView</div>
  <p>No TradingView, busque por <strong>"BTC.D"</strong> (ou "BTCDOMUSDT"). Configure alerta quando BTC.D cruzar abaixo de 54% — isso sinaliza início de fluxo para altcoins. Configure também alerta se BTC.D romper acima de 60% — sinal de fuga para segurança, momento de reduzir altcoins.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 5 regimes de mercado baseados em dominância BTC</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei interpretar a combinação BTC subindo/caindo × BTC.D subindo/caindo</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo como a dominância segue o ciclo de 4 anos do halving</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Configurei alerta de BTC.D &lt; 54% e &gt; 60% no TradingView</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei ajustar exposição a altcoins conforme o regime de dominância atual</div></div>
</div>`,

  "onchain": `
<div class="blockquote">
  <div class="blockquote-text">A blockchain é o único mercado do mundo onde você pode ver o caixa completo de todos os participantes em tempo real. Ignorar esses dados é como jogar poker sem olhar as cartas que estão na mesa.</div>
  <div class="blockquote-author">— Willy Woo · adaptado</div>
</div>

<h2><span class="h2-num">1</span> Por Que Dados On-Chain São Únicos</h2>
<p>No mercado de ações, você não sabe o que grandes fundos estão comprando até 45 dias depois (quando precisam declarar). No mercado de títulos, fluxos de capital são opacos por definição. No <strong>mercado cripto, tudo é público em tempo real</strong>. Cada transação, cada wallet, cada movimento de exchange está disponível na blockchain para qualquer um consultar.</p>
<p>Isso cria uma vantagem analítica sem precedente: você pode literalmente <strong>ver o dinheiro grande se movendo antes que o preço reaja</strong>. On-chain não é magia — é leitura de dados.</p>

<div class="callout callout-info">
  <div class="callout-title">💡 On-Chain vs Sentimento vs Técnica — A Hierarquia</div>
  <p>
  <strong>Análise Técnica:</strong> Mostra o que o preço fez e onde está. Lagging (baseado no passado).<br>
  <strong>Sentimento (F&G, redes sociais):</strong> Mostra como os traders se sentem agora. Leading em extremos.<br>
  <strong>On-Chain:</strong> Mostra o que o dinheiro real está fazendo — independente do sentimento declarado. Mais confiável que qualquer pesquisa.<br><br>
  <strong>Regra TMP:</strong> Quando on-chain e sentimento apontam para direções opostas, <em>on-chain ganha</em>.
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">On-Chain — Fluxo de Exchange e Sinais</div>
  <svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <defs>
      <marker id="arrowB" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#3d8fef"/></marker>
      <marker id="arrowGr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#00d68f"/></marker>
      <marker id="arrowRd" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#e8394a"/></marker>
    </defs>
    <!-- Wallets box -->
    <rect x="20" y="70" width="120" height="60" rx="8" fill="#0a1628" stroke="#3d8fef" stroke-width="1.5"/>
    <text x="80" y="96" text-anchor="middle" font-size="11" fill="#3d8fef" font-family="sans-serif">🏦</text>
    <text x="80" y="112" text-anchor="middle" font-size="10" fill="#3d8fef" font-family="sans-serif" font-weight="700">Wallets</text>
    <text x="80" y="124" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">HODLers</text>

    <!-- Exchange box (center) -->
    <rect x="290" y="55" width="140" height="90" rx="8" fill="#0a1628" stroke="#f0a500" stroke-width="2"/>
    <rect x="290" y="55" width="140" height="28" rx="8" fill="#f0a500" opacity=".12"/>
    <text x="360" y="74" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">EXCHANGE</text>
    <text x="360" y="95" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Binance · Coinbase</text>
    <text x="360" y="110" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Kraken · OKX</text>
    <text x="360" y="135" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">Volume on-chain</text>

    <!-- Miners box -->
    <rect x="20" y="10" width="120" height="45" rx="8" fill="#0a1628" stroke="#9c27b0" stroke-width="1.5"/>
    <text x="80" y="36" text-anchor="middle" font-size="10" fill="#9c27b0" font-family="sans-serif" font-weight="700">⛏️ Miners</text>
    <text x="80" y="49" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Pressão venda</text>

    <!-- Whales box -->
    <rect x="20" y="135" width="120" height="45" rx="8" fill="#0a1628" stroke="#e8394a" stroke-width="1.5"/>
    <text x="80" y="161" text-anchor="middle" font-size="10" fill="#e8394a" font-family="sans-serif" font-weight="700">🐳 Whales</text>
    <text x="80" y="174" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Alertas $1M+</text>

    <!-- Arrows: inflow = bearish (to exchange) -->
    <line x1="142" y1="95" x2="286" y2="95" stroke="#e8394a" stroke-width="2" marker-end="url(#arrowRd)"/>
    <text x="214" y="88" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif" font-weight="700">Inflow</text>
    <text x="214" y="100" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif">→ Venda iminente</text>

    <!-- Arrows: outflow = bullish (from exchange) -->
    <line x1="286" y1="108" x2="142" y2="108" stroke="#00d68f" stroke-width="2" marker-end="url(#arrowGr)"/>
    <text x="214" y="120" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif" font-weight="700">Outflow</text>
    <text x="214" y="132" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">→ Acumulação</text>

    <!-- Result boxes -->
    <rect x="500" y="20" width="205" height="68" rx="7" fill="#0a1628" stroke="#e8394a" stroke-width="1.2"/>
    <text x="602" y="40" text-anchor="middle" font-size="10" fill="#e8394a" font-family="sans-serif" font-weight="700">Inflow alto = ⚠️ Bearish</text>
    <text x="602" y="56" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Holders movem para vender</text>
    <text x="602" y="70" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">XRP 23/02: $1.93B (alto!)</text>

    <rect x="500" y="105" width="205" height="68" rx="7" fill="#0a1628" stroke="#00d68f" stroke-width="1.2"/>
    <text x="602" y="125" text-anchor="middle" font-size="10" fill="#00d68f" font-family="sans-serif" font-weight="700">Outflow alto = 🟢 Bullish</text>
    <text x="602" y="141" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Saem de exchanges</text>
    <text x="602" y="155" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">→ Cold wallets (HODL)</text>

    <!-- Miners arrow -->
    <line x1="140" y1="33" x2="288" y2="70" stroke="#9c27b0" stroke-width="1.2" stroke-dasharray="4,2" opacity=".7" marker-end="url(#arrowB)"/>
    <!-- Whales arrow -->
    <line x1="140" y1="158" x2="288" y2="130" stroke="#e8394a" stroke-width="1.2" stroke-dasharray="4,2" opacity=".7"/>
  </svg>
</div>
<h2><span class="h2-num">2</span> Exchange Flows — O Dado Mais Imediato</h2>
<p>O fluxo de criptoativos entrando e saindo das exchanges é o indicador on-chain mais direto para o trader de swing trade. A lógica é simples:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Movimento</th><th>Significado</th><th>Sinal</th><th>Por Quê</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">Grande Inflow para Exchange</td>
    <td class="td-red">Holders transferindo para exchange</td>
    <td class="td-red td-em">BEARISH — curto prazo</td>
    <td>Quando você quer guardar, deixa na wallet. Quando quer vender, manda para exchange. Grande entrada = intenção de venda crescente.</td>
  </tr>
  <tr>
    <td class="td-em td-green">Grande Outflow de Exchange</td>
    <td class="td-green">Compradores sacando para carteira própria</td>
    <td class="td-green td-em">BULLISH — curto/médio prazo</td>
    <td>Sacar para carteira = "não vou vender tão cedo". Outflow grande = compra com convicção de manutenção. Reduz supply disponível para venda.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Fluxo Estável / Baixo</td>
    <td class="td-cyan">Equilíbrio entre compradores e vendedores</td>
    <td class="td-cyan td-em">NEUTRO</td>
    <td>Sem pressão direcional clara. Seguir o que a análise técnica indicar.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Inflow Anômalo (2× média)</td>
    <td class="td-gold">Evento de liquidação forçada ou whale saindo</td>
    <td class="td-red td-em">BEARISH FORTE — imediato</td>
    <td>Inflows 2× acima da média de 7 dias indicam pressão vendedora excepcional. Ação imediata: revisar posições long abertas.</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">📊 Exchange Flow Real — XRP 23/02/2026</div>
  <p>
  Dados CryptoQuant mostraram: <strong>$31M em XRP enviados para Binance</strong> nas 12h anteriores à análise.<br>
  Classificação: <strong>Inflow significativo → BEARISH curto prazo</strong><br>
  Por que não foi "inflow anômalo": média de 7 dias para XRP era ~$25M/dia. $31M = 24% acima da média. Significativo, mas não catastrófico.<br>
  Impacto na análise: Reforçou o cenário bearish, mas não mudou probabilidades drasticamente. Combinado com realizações $1.93B = pressão vendedora confirmada on-chain.
  </p>
</div>

<h2><span class="h2-num">3</span> SOPR — Rastreando Se Holders Estão Vendendo com Lucro ou Prejuízo</h2>
<p>O <strong>SOPR (Spent Output Profit Ratio)</strong> é um dos indicadores on-chain mais poderosos para identificar capitulação e reversões. Mede se as moedas movimentadas estão sendo vendidas com lucro (SOPR &gt; 1) ou com prejuízo (SOPR &lt; 1).</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>SOPR</th><th>Significa</th><th>Sinal de Mercado</th><th>Implicação para o Trader</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">SOPR &lt; 1.0</td>
    <td>Holders vendendo com PREJUÍZO médio</td>
    <td class="td-red td-em">Capitulação em andamento</td>
    <td>Quem ainda não vendeu está "aguentando". Os fracos já saíram. Potencial de fundo próximo — mas aguardar confirmação técnica antes de entrar.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">SOPR ≈ 1.0</td>
    <td>Vendas no break-even</td>
    <td class="td-cyan td-em">Zona de transição</td>
    <td>Mercado equilibrado entre realizações de lucro e prejuízo. Neutro. Aguardar definição de direção.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">SOPR levemente acima de 1.0 e subindo</td>
    <td>Holders vendendo com pequeno lucro crescente</td>
    <td class="td-green td-em">Recuperação saudável</td>
    <td>Mercado saindo da zona de perda. Compradores absorvendo as realizações. Sinal positivo de transição para bull.</td>
  </tr>
  <tr>
    <td class="td-em td-red">SOPR muito acima de 1.0 (euforia)</td>
    <td>Todos vendendo com lucro enorme</td>
    <td class="td-red td-em">Topo potencial</td>
    <td>Grandes realizações de lucro em escala. Pressão vendedora estrutural. Reduzir posições.</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-gold">
  <div class="callout-title">🔗 Conexão com o Caso XRP 23/02/2026</div>
  <p>As realizações de perdas de $1.93B relatadas pelo Glassnode correspondem diretamente a um SOPR &lt; 1 em escala para XRP. Isso confirmou on-chain o que o F&G = 5 estava sugerindo via sentimento: capitulação real, não apenas percepção. Quando SOPR &lt; 1 coincide com F&G extremo + suporte técnico confluente, temos a combinação mais poderosa de fundo que o método TMP reconhece.</p>
</div>

<h2><span class="h2-num">4</span> Whale Alerts — Rastreando o Dinheiro Grande</h2>
<p>Whales são carteiras com grandes quantidades de criptomoedas. Seus movimentos frequentemente antecedem movimentos de preço significativos — especialmente em ativos como XRP onde a concentração de supply ainda é relativamente alta.</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">🐋</div>
    <div class="step-content">
      <h4>Movimentos que Exigem Ação Imediata</h4>
      <ul>
        <li><strong style="color:var(--red)">Whale &gt; 50M tokens → exchange:</strong> Reduzir longs 30–50% imediatamente. Intenção de venda de grande porte.</li>
        <li><strong style="color:var(--red)">Múltiplas whales em 1h → mesmo exchange:</strong> Coordenação possível. Sair temporariamente. Verificar news.</li>
        <li><strong style="color:var(--green)">Whale &gt; 100M tokens ← saindo de exchange:</strong> Bullish forte. Compra com convicção de manutenção.</li>
        <li><strong style="color:var(--gold)">Whale transferindo entre wallets próprias:</strong> Neutro. Reorganização interna. Não sinaliza venda.</li>
      </ul>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">📊</div>
    <div class="step-content">
      <h4>Como Distinguir Whale para Exchange vs Whale entre Wallets</h4>
      <p>No Whale Alert, o formato mostra origem e destino. <strong>"Unknown wallet → Binance"</strong> = inflow de exchange = bearish. <strong>"Unknown wallet → Unknown wallet"</strong> = transferência interna = neutro. <strong>"Binance → Unknown wallet"</strong> = outflow = bullish. As ferramentas Nansen e Arkham Intelligence identificam rótulos de wallets conhecidas (fundos, exchanges, projetos).</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> O Checklist On-Chain Completo — 10 Itens Diários</h2>
<p>Este checklist integra todos os dados on-chain em uma rotina de 5 minutos:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>#</th><th>Item</th><th>Onde Verificar</th><th>O Que Registrar</th></tr></thead>
<tbody>
  <tr><td class="td-gold td-em">1</td><td>Exchange Inflow XRP (últimas 24h)</td><td>CryptoQuant</td><td>Volume vs média 7 dias. Acima de 2×: alerta bearish.</td></tr>
  <tr><td class="td-gold td-em">2</td><td>Exchange Outflow XRP (últimas 24h)</td><td>CryptoQuant</td><td>Outflow dominando = bullish acumulação.</td></tr>
  <tr><td class="td-gold td-em">3</td><td>Whale Alerts XRP (últimas 12h)</td><td>Twitter @whale_alert</td><td>Direção e tamanho. Classificar conforme protocolo.</td></tr>
  <tr><td class="td-gold td-em">4</td><td>SOPR Bitcoin (proxy do mercado)</td><td>Glassnode (free tier)</td><td>Acima ou abaixo de 1.0? Tendência subindo ou caindo?</td></tr>
  <tr><td class="td-gold td-em">5</td><td>BTC Exchange Reserve</td><td>CryptoQuant</td><td>Reservas nas exchanges subindo (bearish) ou caindo (bullish)?</td></tr>
  <tr><td class="td-gold td-em">6</td><td>Funding Rate de Futuros</td><td>CoinGlass</td><td>Muito positivo = longs pagando demais = risco de squeeze. Negativo = shorts dominam.</td></tr>
  <tr><td class="td-gold td-em">7</td><td>Open Interest (OI)</td><td>CoinGlass</td><td>OI subindo com preço = tendência forte. OI caindo com preço = liquidações.</td></tr>
  <tr><td class="td-gold td-em">8</td><td>Long/Short Ratio</td><td>CoinGlass / Binance</td><td>Ratio muito unilateral = lado dominante está vulnerável a squeeze.</td></tr>
  <tr><td class="td-gold td-em">9</td><td>Liquidações 24h</td><td>CoinGlass</td><td>Longs ou shorts dominando liquidações? Assimetria revela onde está a pressão.</td></tr>
  <tr><td class="td-gold td-em">10</td><td>Stablecoin Supply em Exchanges</td><td>CryptoQuant</td><td>Stablecoins subindo em exchanges = munição para compra. Bullish para o mercado geral.</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">6</span> Síntese On-Chain — Conectando Tudo na Análise XRP 23/02/2026</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Dado On-Chain</th><th>Valor Encontrado</th><th>Sinal</th><th>Impacto na Análise</th></tr></thead>
<tbody>
  <tr><td class="td-em">Realizações de Perdas</td><td class="td-red">$1.93B (SOPR &lt; 1 em escala)</td><td class="td-red">Bearish CP</td><td>Capitulação confirmada. Reforça bearish curto prazo, mas cria fundo potencial médio prazo.</td></tr>
  <tr><td class="td-em">Exchange Inflow XRP</td><td class="td-red">$31M (24% acima da média)</td><td class="td-red">Bearish CP</td><td>Pressão vendedora imediata confirmada. Reforça cautela para longs.</td></tr>
  <tr><td class="td-em">Liquidações 24h</td><td class="td-red">$417M (136k traders)</td><td class="td-red">Bearish CP / Bullish MP</td><td>Evento de flush. Historicamente esgota vendedores forçados. Condição necessária mas não suficiente para reversão.</td></tr>
  <tr><td class="td-em">Funding Rate</td><td class="td-green">Negativo (−0.01%)</td><td class="td-green">Bullish CP</td><td>Shorts pagando longs. Mercado excessivamente short = potencial short squeeze se BTC estabilizar.</td></tr>
  <tr><td class="td-em">Long/Short Ratio</td><td class="td-red">35% long / 65% short</td><td class="td-cyan">Neutro → Bullish CP</td><td>Maioria apostando em queda. Combustível para rally se catalisador aparecer.</td></tr>
  <tr><td class="td-em">Stablecoins em Exchanges</td><td class="td-green">Subindo +12% em 7 dias</td><td class="td-green">Bullish MP</td><td>Capital líquido acumulando em exchanges. "Pólvora seca" para próxima oportunidade de compra.</td></tr>
</tbody>
</table>
</div>

<div class="callout callout-success">
  <div class="callout-title">✅ Conclusão da Análise On-Chain — XRP 23/02/2026</div>
  <p>Os dados on-chain pintaram um quadro preciso: <strong>bearish imediato confirmado</strong> (inflow, realizações, liquidações) mas com <strong>sinais de exaustão dos vendedores</strong> (funding negativo, shorts dominando, stablecoins acumulando). Isso é classicamente o perfil de um fundo em formação — não indica entrada imediata, mas sugere que o próximo movimento relevante de médio prazo tende a ser para cima assim que o suporte técnico se confirmar e o macro melhorar.<br><br>
  <strong>A decisão final:</strong> Monitoramento ativo. Aguardar confirmação técnica (Fase 2) antes de qualquer entrada. Os dados on-chain forneceram contexto valioso, mas não substituem a confirmação técnica para timing de entrada.</p>
</div>

<div class="callout callout-gold">
  <div class="callout-title">🏁 Parabéns — Você Concluiu a Fase 1: Inteligência de Mercado</div>
  <p>Você agora domina o processo completo de análise que precede qualquer gráfico: mindset profissional, diário estruturado, classificação de notícias, fontes confiáveis, Fear & Greed Index, dominância BTC e dados on-chain. Isso é o que 95% dos traders nunca aprendem — e é por isso que 95% dos traders perdem dinheiro.<br><br>
  <strong>Na Fase 2</strong>, você vai aprender a ler o gráfico com precisão cirúrgica: estrutura de preço, suportes/resistências, Fibonacci, e o sistema Swing Trade Master Pro. Com a Fase 1 como fundação, a técnica vai fazer muito mais sentido.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a diferença entre on-chain e sentimento — e por que on-chain prevalece</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei interpretar exchange inflows e outflows como sinais bearish/bullish</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo o SOPR e o que SOPR &lt; 1 em escala significa (capitulação)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei o protocolo de ação para whale alerts &gt; 50M tokens</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Configurei o checklist de 10 itens on-chain para minha rotina diária</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Consigo sintetizar dados on-chain em viés direcional (bullish/bearish CP e MP)</div></div>
</div>`,

  "estrutura": `
<div class="blockquote">
  <div class="blockquote-text">O preço não sobe nem desce aleatoriamente. Ele segue estruturas. Aprender a lê-las é aprender o idioma nativo do mercado.</div>
  <div class="blockquote-author">— Al Brooks · Price Action Trading</div>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 12px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Os 3 Estados do Mercado</div>
  <svg viewBox="0 0 720 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <defs>
      <marker id="arrowG" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#00d68f"/>
      </marker>
      <marker id="arrowR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#e8394a"/>
      </marker>
      <marker id="arrowC" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#00c4e8"/>
      </marker>
    </defs>

    <!-- UPTREND panel -->
    <rect x="10" y="8" width="218" height="152" rx="8" fill="#0a1628" stroke="#005C3A" stroke-width="1.2"/>
    <text x="119" y="28" text-anchor="middle" font-size="11" fill="#00d68f" font-family="sans-serif" font-weight="700" letter-spacing=".08em">UPTREND ▲</text>
    <!-- Zigzag uptrend path -->
    <polyline points="30,128 60,108 80,118 115,88 135,100 170,62 190,75 210,48"
      fill="none" stroke="#00d68f" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- HH labels -->
    <circle cx="115" cy="88" r="3.5" fill="#00d68f" opacity=".7"/>
    <text x="117" y="82" font-size="9.5" fill="#00d68f" font-family="monospace">HH</text>
    <circle cx="170" cy="62" r="3.5" fill="#00d68f"/>
    <text x="172" y="56" font-size="9.5" fill="#00d68f" font-family="monospace">HH</text>
    <circle cx="210" cy="48" r="3.5" fill="#00d68f"/>
    <text x="212" y="42" font-size="9.5" fill="#00d68f" font-family="monospace">HH</text>
    <!-- HL labels -->
    <circle cx="60" cy="108" r="3.5" fill="#00d68f" opacity=".6"/>
    <text x="62" y="122" font-size="9.5" fill="#00d68f" font-family="monospace">HL</text>
    <circle cx="135" cy="100" r="3.5" fill="#00d68f" opacity=".6"/>
    <text x="137" y="114" font-size="9.5" fill="#00d68f" font-family="monospace">HL</text>
    <circle cx="190" cy="75" r="3.5" fill="#00d68f" opacity=".6"/>
    <text x="192" y="89" font-size="9.5" fill="#00d68f" font-family="monospace">HL</text>
    <text x="119" y="152" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Higher Highs + Higher Lows</text>

    <!-- DOWNTREND panel -->
    <rect x="251" y="8" width="218" height="152" rx="8" fill="#0a1628" stroke="#600" stroke-width="1.2"/>
    <text x="360" y="28" text-anchor="middle" font-size="11" fill="#e8394a" font-family="sans-serif" font-weight="700" letter-spacing=".08em">DOWNTREND ▼</text>
    <polyline points="265,48 295,68 315,55 350,85 370,72 405,110 425,98 448,128"
      fill="none" stroke="#e8394a" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- LH labels -->
    <circle cx="265" cy="48" r="3.5" fill="#e8394a"/>
    <text x="267" y="43" font-size="9.5" fill="#e8394a" font-family="monospace">LH</text>
    <circle cx="315" cy="55" r="3.5" fill="#e8394a"/>
    <text x="317" y="50" font-size="9.5" fill="#e8394a" font-family="monospace">LH</text>
    <circle cx="370" cy="72" r="3.5" fill="#e8394a"/>
    <text x="372" y="67" font-size="9.5" fill="#e8394a" font-family="monospace">LH</text>
    <circle cx="425" cy="98" r="3.5" fill="#e8394a"/>
    <text x="427" y="93" font-size="9.5" fill="#e8394a" font-family="monospace">LH</text>
    <!-- LL labels -->
    <circle cx="295" cy="68" r="3.5" fill="#e8394a" opacity=".6"/>
    <text x="297" y="82" font-size="9.5" fill="#e8394a" font-family="monospace">LL</text>
    <circle cx="350" cy="85" r="3.5" fill="#e8394a" opacity=".6"/>
    <text x="352" y="99" font-size="9.5" fill="#e8394a" font-family="monospace">LL</text>
    <circle cx="405" cy="110" r="3.5" fill="#e8394a" opacity=".6"/>
    <text x="407" y="124" font-size="9.5" fill="#e8394a" font-family="monospace">LL</text>
    <circle cx="448" cy="128" r="3.5" fill="#e8394a" opacity=".6"/>
    <text x="450" y="142" font-size="9.5" fill="#e8394a" font-family="monospace">LL</text>
    <text x="360" y="152" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Lower Highs + Lower Lows</text>

    <!-- RANGE panel -->
    <rect x="492" y="8" width="218" height="152" rx="8" fill="#0a1628" stroke="#004a5c" stroke-width="1.2"/>
    <text x="601" y="28" text-anchor="middle" font-size="11" fill="#00c4e8" font-family="sans-serif" font-weight="700" letter-spacing=".08em">RANGE ↔</text>
    <!-- Resistance line -->
    <line x1="505" y1="72" x2="698" y2="72" stroke="#e8394a" stroke-width="1" stroke-dasharray="5,3" opacity=".6"/>
    <text x="700" y="76" font-size="9" fill="#e8394a" font-family="monospace">R</text>
    <!-- Support line -->
    <line x1="505" y1="118" x2="698" y2="118" stroke="#00d68f" stroke-width="1" stroke-dasharray="5,3" opacity=".6"/>
    <text x="700" y="122" font-size="9" fill="#00d68f" font-family="monospace">S</text>
    <!-- Range oscillation -->
    <polyline points="512,118 532,72 552,118 572,72 592,112 612,72 632,118 652,78 672,118"
      fill="none" stroke="#00c4e8" stroke-width="2.2" stroke-linejoin="round" opacity=".9"/>
    <!-- Dots at peaks/troughs -->
    <circle cx="532" cy="72" r="3" fill="#e8394a" opacity=".8"/>
    <circle cx="572" cy="72" r="3" fill="#e8394a" opacity=".8"/>
    <circle cx="612" cy="72" r="3" fill="#e8394a" opacity=".8"/>
    <circle cx="652" cy="78" r="3" fill="#e8394a" opacity=".7"/>
    <circle cx="552" cy="118" r="3" fill="#00d68f" opacity=".8"/>
    <circle cx="592" cy="112" r="3" fill="#00d68f" opacity=".7"/>
    <circle cx="632" cy="118" r="3" fill="#00d68f" opacity=".8"/>
    <circle cx="672" cy="118" r="3" fill="#00d68f" opacity=".8"/>
    <text x="601" y="152" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Máximas e Mínimas Similares</text>
  </svg>
</div>

<h2><span class="h2-num">1</span> Por Que Estrutura de Preço Antes de Qualquer Indicador</h2>
<p>Antes de aplicar qualquer indicador — ADX, RSI, MACD, Ichimoku — você precisa entender o terreno em que está pisando. <strong>Estrutura de preço é o mapa do mercado</strong>. Indicadores são ferramentas que ajudam a navegar esse mapa. Usar indicadores sem entender estrutura é como usar GPS em um território sem estradas.</p>
<p>Estrutura de preço revela três coisas fundamentais que nenhum indicador pode fornecer sozinho: <strong>onde o preço está</strong> na sequência histórica de movimentos, <strong>para onde tende a ir</strong> com base nos padrões de máximas e mínimas, e <strong>onde estão as zonas de decisão</strong> — os pontos onde compradores e vendedores vão se enfrentar.</p>

<div class="kpi-row kpi-row-3">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">HH + HL</div><div class="kpi-label">Higher Highs + Higher Lows = Uptrend estrutural</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">LH + LL</div><div class="kpi-label">Lower Highs + Lower Lows = Downtrend estrutural</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">Igual</div><div class="kpi-label">Máximas e mínimas similares = Range / Consolidação</div></div>
</div>

<h2><span class="h2-num">2</span> Os 3 Estados do Mercado — Diagnóstico Primário</h2>
<p>O mercado existe em exatamente 3 estados em qualquer timeframe. Identificar corretamente o estado atual é a decisão mais importante antes de qualquer análise:</p>

<div class="steps">
  <div class="step-card" style="border-left: 3px solid var(--green)">
    <div class="step-num" style="background: linear-gradient(135deg,#005C3A,#00d68f)">▲</div>
    <div class="step-content">
      <h4>Estado 1 — UPTREND (Tendência de Alta)</h4>
      <p><strong>Definição técnica:</strong> Sequência de Higher Highs (HH) e Higher Lows (HL) — cada máxima é mais alta que a anterior, cada mínima é mais alta que a anterior.</p>
      <p><strong>O que significa:</strong> Compradores estão no controle. Cada pullback é absorvido por nova demanda. O mercado está em modo "escada para cima".</p>
      <p><strong>Estratégia TMP:</strong> Buscar longs nos pullbacks para suporte (HL em formação). Nunca shortear contra a estrutura sem razão excepcional.</p>
      <p><strong>Exemplo XRP:</strong> Out/2024 → Jan/2026: XRP de $0.52 → $3.66 com estrutura clássica de HH+HL em todos os timeframes.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--red)">
    <div class="step-num" style="background: linear-gradient(135deg,#600,#e8394a)">▼</div>
    <div class="step-content">
      <h4>Estado 2 — DOWNTREND (Tendência de Baixa)</h4>
      <p><strong>Definição técnica:</strong> Sequência de Lower Highs (LH) e Lower Lows (LL) — cada máxima é mais baixa que a anterior, cada mínima é mais baixa que a anterior.</p>
      <p><strong>O que significa:</strong> Vendedores estão no controle. Cada rally é vendido por nova oferta.</p>
      <p><strong>Estratégia TMP:</strong> Buscar shorts nos rallies para resistência (LH em formação). Longs contra-tendência apenas em suportes confluentes com sizing reduzido e confirmação de múltiplos filtros.</p>
      <p><strong>Exemplo XRP:</strong> Jan/2026 → Fev/2026: XRP de $3.66 → $1.33 com estrutura LH+LL clara em Daily e 4H.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--cyan)">
    <div class="step-num" style="background: linear-gradient(135deg,#004a5c,#00c4e8)">↔</div>
    <div class="step-content">
      <h4>Estado 3 — RANGE / CONSOLIDAÇÃO</h4>
      <p><strong>Definição técnica:</strong> Máximas e mínimas similares — o preço oscila entre duas zonas horizontais sem fazer progresso direcional.</p>
      <p><strong>O que significa:</strong> Equilíbrio temporário entre compradores e vendedores. Acumulação ou distribuição em andamento.</p>
      <p><strong>Estratégia TMP:</strong> Operar o range (comprar na base, vender no topo) com alvos reduzidos. Ou aguardar o rompimento com volume para entrar na nova tendência.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">3</span> Processo de Leitura Estrutural — 4 Etapas</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Identifique as Máximas e Mínimas Significativas</h4>
      <p>Comece no <strong>Daily</strong>. Marque as últimas 5–8 máximas e mínimas relevantes — pontos onde o preço claramente inverteu e criou movimento substancial (afastamento de pelo menos 3–5% antes do retorno).</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Determine o Estado Atual no Timeframe Maior</h4>
      <p>Compare sequencialmente: <strong>HH+HL = uptrend · LH+LL = downtrend · similar = range</strong>. Esta é a estrutura macro — o contexto em que todos os outros timeframes operam.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Analise no Timeframe de Entrada (4H e 1H)</h4>
      <p>Repita o processo. A estrutura menor deve ser analisada dentro do contexto da estrutura maior. Um uptrend no 1H dentro de um downtrend no Daily é um rally contra-tendência — não uma inversão real.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Localize o Preço na Estrutura</h4>
      <p>Onde o preço está agora em relação à estrutura? Próximo a uma mínima anterior (potencial suporte)? No meio de um impulso? Perto de uma máxima anterior (potencial resistência)? Esta localização define o <strong>contexto de risco</strong> de qualquer entrada.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Impulso vs Correção — A Dinâmica Dentro da Tendência</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Característica</th><th>Impulso (Favor da Tendência)</th><th>Correção (Contra a Tendência)</th></tr></thead>
<tbody>
  <tr><td class="td-em">Velocidade</td><td class="td-green">Rápido, velas grandes</td><td class="td-gold">Lento, velas menores, hesitante</td></tr>
  <tr><td class="td-em">Volume</td><td class="td-green">Alto — participação ampla</td><td class="td-gold">Baixo — poucos participantes</td></tr>
  <tr><td class="td-em">O Que Fazer</td><td class="td-green">Segurar posições. Não fechar no meio do impulso.</td><td class="td-gold">Monitorar S/R. Preparar entrada no fim da correção.</td></tr>
  <tr><td class="td-em">Sinal de Esgotamento</td><td class="td-red">Volume caindo no impulso = fraqueza</td><td class="td-green">Volume caindo na correção = fim próximo</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> Quebra de Estrutura (BoS) — O Sinal de Mudança</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">BoS</div>
  <div class="rule-content">
    <h4>Quebra de Estrutura Bearish</h4>
    <p>Em um uptrend, o preço falha em fazer novo HH e quebra abaixo do último HL. Essa quebra é a primeira evidência de que vendedores ganharam controle. <strong>Exemplo XRP:</strong> A quebra abaixo de $2.90 em jan/2026 foi o primeiro sinal estrutural que o uptrend havia terminado.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">BoS</div>
  <div class="rule-content">
    <h4>Quebra de Estrutura Bullish</h4>
    <p>Em um downtrend, o preço falha em fazer novo LL e quebra acima do último LH. <strong>Para XRP em fev/2026:</strong> Precisaria quebrar acima de $1.65–$1.70 para confirmar BoS bullish no 4H.</p>
  </div>
</div>

<h2><span class="h2-num">6</span> Estrutura XRP — 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Leitura Estrutural Completa</div>
  <p>
  <strong>Daily:</strong> LH+LL confirmados desde jan/2026. Downtrend estrutural claro. ATH $3.66 → $1.33 = −63.7%.<br>
  <strong>4H:</strong> LH+LL também confirmados. Rally até $1.48 rejeitado (criou novo LH). Preço testando $1.33.<br>
  <strong>1H:</strong> Formação de mínimas similares na zona $1.30–$1.34. Micro-range em consolidação dentro do downtrend maior.<br>
  <strong>Conclusão:</strong> Downtrend em todos os timeframes. Preço no suporte estrutural histórico. Entrada long = contra-tendência de alto risco, requer todos os filtros ativos.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei identificar os 3 estados: uptrend (HH+HL), downtrend (LH+LL), range</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Aplico o processo de 4 etapas de leitura estrutural num gráfico real</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a diferença entre impulso e correção dentro de uma tendência</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei identificar uma Quebra de Estrutura (BoS) e o que ela significa</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Confirmei o downtrend de XRP em todos os timeframes em 23/02/2026</div></div>
</div>`,

  "sr": `
<div class="blockquote">
  <div class="blockquote-text">Suportes e resistências não são linhas no gráfico. São zonas de memória coletiva do mercado — onde decisões de compra e venda se concentraram no passado e tendem a se repetir no futuro.</div>
  <div class="blockquote-author">— Martin Pring · Technical Analysis Explained</div>
</div>

<h2><span class="h2-num">1</span> O Que São Suportes e Resistências</h2>
<p>Suporte é uma zona de preço onde a demanda historicamente superou a oferta, impedindo que o preço caísse mais. Resistência é o oposto — onde a oferta superou a demanda. Eles funcionam pela <strong>memória coletiva dos participantes</strong>: traders que compraram em $1.33 vão comprar de novo nessa zona se o preço retornar; traders que perderam a oportunidade de vender em $2.50 vão vender quando o preço voltar.</p>

<div class="callout callout-info">
  <div class="callout-title">💡 A Regra da Inversão — Suporte Vira Resistência</div>
  <p>Quando um suporte é rompido com força, ele se torna resistência. Quando uma resistência é rompida com força, ela se torna suporte. <strong>Por quê:</strong> Traders que compraram no suporte e viram ele quebrar ficaram "presos". Quando o preço retorna ao nível, eles vendem para sair no break-even — criando pressão vendedora.<br><br>
  <strong>Para XRP:</strong> A zona de $1.65–$1.70 que foi suporte em out/2024 agora funciona como resistência no downtrend de fev/2026.</p>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Suportes e Resistências — Zonas e Regra da Inversão</div>
  <svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Chart area -->
    <rect x="10" y="10" width="700" height="208" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Resistance zone 1 (top) -->
    <rect x="10" y="42" width="700" height="14" fill="#e8394a" opacity=".09" rx="2"/>
    <line x1="10" y1="49" x2="710" y2="49" stroke="#e8394a" stroke-width="1.5" stroke-dasharray="6,3" opacity=".7"/>
    <text x="620" y="44" font-size="10" fill="#e8394a" font-family="monospace">R2  $1.93</text>

    <!-- Resistance zone 2 -->
    <rect x="10" y="88" width="700" height="12" fill="#e8394a" opacity=".07" rx="2"/>
    <line x1="10" y1="94" x2="710" y2="94" stroke="#e8394a" stroke-width="1.2" stroke-dasharray="5,3" opacity=".6"/>
    <text x="620" y="89" font-size="10" fill="#e8394a" font-family="monospace">R1  $1.65</text>

    <!-- INVERSION ZONE — was support, now resistance -->
    <rect x="10" y="128" width="700" height="14" fill="#f0a500" opacity=".1" rx="2"/>
    <line x1="10" y1="135" x2="710" y2="135" stroke="#f0a500" stroke-width="2" stroke-dasharray="6,3"/>
    <text x="580" y="129" font-size="10" fill="#f0a500" font-family="monospace">INVERSÃO $1.48</text>
    <!-- Inversion label -->
    <text x="14" y="129" font-size="9" fill="#f0a500" font-family="sans-serif">Suporte → Resistência</text>

    <!-- Support zone (main - S1) -->
    <rect x="10" y="175" width="700" height="16" fill="#00d68f" opacity=".1" rx="2"/>
    <line x1="10" y1="183" x2="710" y2="183" stroke="#00d68f" stroke-width="2" stroke-dasharray="6,3" opacity=".8"/>
    <text x="605" y="178" font-size="10" fill="#00d68f" font-family="monospace">S1 ⭐ $1.33</text>
    <text x="14" y="196" font-size="9" fill="#00d68f" font-family="sans-serif" opacity=".8">Suporte S1 — Máxima Confluência</text>

    <!-- Price path -->
    <!-- Rise to resistance at $1.48 (then inversion) -->
    <polyline points="20,183 55,178 80,165 100,150 120,138 145,128"
      fill="none" stroke="#00d68f" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- Rejection at inversion, small bounce -->
    <polyline points="145,128 160,120 180,115 200,110 220,105 240,98"
      fill="none" stroke="#3d8fef" stroke-width="2.2"/>
    <!-- Second resistance test at R1 -->
    <polyline points="240,98 260,92 280,88 300,86"
      fill="none" stroke="#3d8fef" stroke-width="2.2"/>
    <!-- Rejection and pullback -->
    <polyline points="300,86 320,92 340,100 360,112 380,128"
      fill="none" stroke="#e8394a" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- Price respects inversion zone (now resistance) -->
    <polyline points="380,128 395,128 410,130 420,140"
      fill="none" stroke="#e8394a" stroke-width="2.2" opacity=".7"/>
    <!-- Price bounces back to support S1 -->
    <polyline points="420,140 440,158 460,170 480,178 500,181"
      fill="none" stroke="#e8394a" stroke-width="2.2"/>
    <!-- Support S1 holds — bounce -->
    <polyline points="500,181 515,178 530,168 550,155 570,140 590,128"
      fill="none" stroke="#00d68f" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- Annotation arrows -->
    <!-- Rejection at inversion -->
    <circle cx="145" cy="128" r="5" fill="none" stroke="#f0a500" stroke-width="1.5"/>
    <text x="100" y="120" font-size="8.5" fill="#f0a500" font-family="sans-serif">Rejeição</text>

    <!-- S1 bounce annotation -->
    <circle cx="500" cy="181" r="5" fill="none" stroke="#00d68f" stroke-width="1.5"/>
    <text x="455" y="210" font-size="8.5" fill="#00d68f" font-family="sans-serif">Suporte S1 segura</text>

    <!-- False break dot -->
    <circle cx="300" cy="86" r="5" fill="none" stroke="#e8394a" stroke-width="1.5"/>
    <text x="305" y="80" font-size="8.5" fill="#e8394a" font-family="sans-serif">Rejeição R1</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> Os 6 Tipos de S/R — Hierarquia de Força</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">S1</div>
  <div class="rule-content">
    <h4>🏆 Alta Confluência — Força Máxima</h4>
    <p>Zona onde múltiplos tipos coincidem: máxima/mínima histórica + Fibonacci 61.8% + VPVR + nível psicológico redondo. <strong>Esses são os alvos e stops ideais do método TMP.</strong><br>
    <strong>Exemplo XRP:</strong> Zona $1.30–$1.35 em 23/02/2026: mínima histórica 2024 + Fibonacci 78.6% + nível psicológico + VPVR de alto volume.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">S2</div>
  <div class="rule-content">
    <h4>📊 Máximas e Mínimas Estruturais — Força Alta</h4>
    <p>Pontos de reversão anteriores onde o preço mudou de direção significativamente. Daily = máxima prioridade. 4H = segunda prioridade. Stop loss: 0.5–1% além do nível (margem para false break).</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">S3</div>
  <div class="rule-content">
    <h4>📏 Níveis de Fibonacci — Força Alta</h4>
    <p>Retracements de 38.2%, 50%, 61.8%, 78.6% definem onde correções tendem a pausar ou reverter. <strong>Fibonacci 61.8% (golden ratio)</strong> é o nível mais respeitado em todos os mercados globais.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">S4</div>
  <div class="rule-content">
    <h4>📦 Zonas de Volume (VPVR) — Força Alta</h4>
    <p>HVN (High Volume Node) = zona de consolidação com muitas negociações históricas. LVN (Low Volume Node) = vácuo de liquidez, preço passa rapidamente. HVNs são os suportes/resistências mais robustos.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">S5</div>
  <div class="rule-content">
    <h4>🔢 Níveis Psicológicos Redondos — Força Média</h4>
    <p>Números redondos ($1.00, $1.50, $2.00) funcionam como S/R porque traders e algoritmos concentram ordens nesses preços. $1.00 para XRP = nível de importância simbólica máxima.</p>
  </div>
</div>
<div class="rule-card">
  <div class="rule-num" style="color:var(--gray2)">S6</div>
  <div class="rule-content">
    <h4>📐 Médias Móveis Dinâmicas — Força Variável</h4>
    <p><strong>EMA 200 Daily</strong> é o suporte/resistência dinâmico de maior importância. Acima = território de alta. Abaixo = território de baixa. As EMAs 20, 50, 100 são suportes/resistências de curto e médio prazo.</p>
  </div>
</div>

<h2><span class="h2-num">3</span> Como Traçar S/R — Protocolo Visual</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Daily — Visão Macro (3+ meses)</h4>
      <p>Marque ATH, ATL, máximas/mínimas significativas e zonas de consolidação longa. Use retângulos/caixas — suportes são zonas, não linhas.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>4H — Refine os Limites</h4>
      <p>Com as zonas Daily marcadas, vá para o 4H e refine as fronteiras exatas. Identifique sub-níveis. Essas são as zonas de stop e target mais usadas no swing trade.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Identifique Confluências</h4>
      <p>Para cada zona: quantos tipos de S/R coincidem? Máxima anterior + Fibonacci + VPVR = zona de alta confluência (S1). Apenas uma referência = zona fraca.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Sistema de Cores</h4>
      <p><strong style="color:var(--gold)">🟡 Ouro</strong> = S/R principal (3+ confluências) · <strong style="color:var(--bright)">🔵 Azul</strong> = secundário (2 confluências) · <strong style="color:var(--gray2)">⚪ Cinza</strong> = referência menor</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Comportamento do Preço em Zonas de S/R</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Comportamento</th><th>O Que Significa</th><th>Ação TMP</th></tr></thead>
<tbody>
  <tr><td class="td-em td-green">Velas de reversão em suporte (doji, martelo, engolfo)</td><td>Compradores absorvendo oferta. Suporte válido.</td><td>Sinal de entrada potencial. Aguardar confirmação dos filtros.</td></tr>
  <tr><td class="td-em td-red">Velas de força bearish chegando no suporte</td><td>Suporte sob pressão. Risco de rompimento.</td><td>NÃO entrar long ainda. Aguardar estabilização.</td></tr>
  <tr><td class="td-em td-gold">False break — passa brevemente abaixo e volta</td><td>Stop hunt. Liquidação antes de reversão.</td><td>Entrada long após fechar de volta acima = setup de alta probabilidade.</td></tr>
  <tr><td class="td-em td-red">Rompimento com volume alto + fechamento abaixo</td><td>Suporte rompido — vira resistência.</td><td>Sair de longs. Próximo suporte = novo alvo bearish.</td></tr>
  <tr><td class="td-em td-cyan">Múltiplos testes sem romper</td><td>Suporte forte com demanda latente. Acumulação possível.</td><td>Zona de compra progressiva com stops bem definidos.</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> Mapa de S/R — XRP 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Todos os Níveis Mapeados</div>
  <p><strong style="color:var(--red)">RESISTÊNCIAS:</strong></p>
  <ul style="font-size:13px;margin:8px 0">
    <li><strong style="color:var(--amber)">$1.43–$1.48</strong> — LH estrutural 4H + Fib 50% (S2)</li>
    <li><strong style="color:var(--amber)">$1.65–$1.70</strong> — Suporte rompido + Fib 61.8% (S1)</li>
    <li><strong style="color:var(--red)">$1.93–$2.00</strong> — LH Daily + nível psicológico + VPVR HVN (S1)</li>
    <li><strong style="color:var(--red)">$2.50–$2.60</strong> — LH Daily anterior + distribuição</li>
  </ul>
  <p><strong style="color:var(--green)">SUPORTES:</strong></p>
  <ul style="font-size:13px;margin:0">
    <li><strong style="color:var(--gold)">$1.30–$1.35 ⭐</strong> — Preço atual. Mínima histórica 2024 + VPVR + Fib 78.6% (S1 máxima força)</li>
    <li><strong style="color:var(--gold)">$1.10–$1.15</strong> — Zona de acumulação 2024 + nível psicológico (S2)</li>
    <li><strong style="color:var(--red)">$0.95–$1.00</strong> — Nível psicológico $1.00 (suporte de último recurso)</li>
  </ul>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a Regra da Inversão: suporte rompido vira resistência</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 6 tipos de S/R e sua hierarquia de força</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Apliquei o protocolo de 4 etapas para traçar S/R no TradingView</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 5 comportamentos de preço em zonas de S/R e a ação correta em cada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Tracei o mapa completo de S/R de XRP com todos os níveis no TradingView</div></div>
</div>`,

  "fib": `
<div class="blockquote">
  <div class="blockquote-text">Leonardo Fibonacci descobriu na natureza a proporção que governa galáxias, conchas e flores. Séculos depois, descobrimos que ela também governa os movimentos dos mercados financeiros.</div>
  <div class="blockquote-author">— Robert Fischer · Fibonacci Applications in Financial Markets</div>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 12px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Fibonacci Retracement — Anatomia dos Níveis</div>
  <svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Chart background area -->
    <rect x="90" y="15" width="480" height="225" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Price path: impulse UP then retracement -->
    <!-- Uptrend -->
    <polyline points="100,225 200,180 230,190 310,130 340,142 420,80 450,92 520,45"
      fill="none" stroke="#3d8fef" stroke-width="1.5" stroke-dasharray="4,3" opacity=".5"/>
    <!-- High A point -->
    <circle cx="520" cy="45" r="5" fill="#3d8fef"/>
    <text x="527" y="43" font-size="10" fill="#3d8fef" font-family="monospace" font-weight="bold">A (100%)</text>
    <!-- Low B point -->
    <circle cx="100" cy="225" r="5" fill="#3d8fef"/>
    <text x="52" y="229" font-size="10" fill="#3d8fef" font-family="monospace" font-weight="bold">B (0%)</text>

    <!-- Fibonacci levels (horizontal lines) -->
    <!-- Height range: y=45 (top/100%) to y=225 (bottom/0%), total=180px -->
    <!-- 0% = y=225, 23.6% = y=182, 38.2% = y=156, 50% = y=135, 61.8% = y=114, 78.6% = y=84, 100% = y=45 -->

    <!-- 0% -->
    <line x1="90" y1="225" x2="570" y2="225" stroke="#607d8b" stroke-width="0.8" stroke-dasharray="3,4" opacity=".5"/>
    <text x="578" y="229" font-size="10" fill="#607d8b" font-family="monospace">0%</text>

    <!-- 23.6% -->
    <line x1="90" y1="182" x2="570" y2="182" stroke="#3d8fef" stroke-width="1" stroke-dasharray="4,3" opacity=".7"/>
    <text x="578" y="186" font-size="10" fill="#3d8fef" font-family="monospace">23.6%</text>
    <text x="30" y="186" font-size="9" fill="#3d8fef" font-family="sans-serif" opacity=".8">Raso</text>

    <!-- 38.2% -->
    <line x1="90" y1="156" x2="570" y2="156" stroke="#00c4e8" stroke-width="1.2" stroke-dasharray="4,3"/>
    <text x="578" y="160" font-size="10" fill="#00c4e8" font-family="monospace">38.2%</text>
    <text x="22" y="160" font-size="9" fill="#00c4e8" font-family="sans-serif">Saudável</text>

    <!-- 50% (psychological) -->
    <line x1="90" y1="135" x2="570" y2="135" stroke="#f0a500" stroke-width="1.3" stroke-dasharray="4,3"/>
    <text x="578" y="139" font-size="10" fill="#f0a500" font-family="monospace">50%</text>
    <text x="18" y="139" font-size="9" fill="#f0a500" font-family="sans-serif">Psicológico</text>

    <!-- 61.8% GOLDEN RATIO — thicker, highlighted -->
    <rect x="90" y="110" width="480" height="16" fill="#f0a500" opacity=".08" rx="2"/>
    <line x1="90" y1="118" x2="570" y2="118" stroke="#f0a500" stroke-width="2.5"/>
    <text x="578" y="122" font-size="10.5" fill="#f0a500" font-family="monospace" font-weight="bold">61.8% ⭐</text>
    <text x="8" y="116" font-size="9.5" fill="#f0a500" font-family="sans-serif" font-weight="700">Golden</text>
    <text x="8" y="127" font-size="9.5" fill="#f0a500" font-family="sans-serif" font-weight="700">Ratio</text>

    <!-- 78.6% -->
    <line x1="90" y1="84" x2="570" y2="84" stroke="#e8394a" stroke-width="1.2" stroke-dasharray="4,3"/>
    <text x="578" y="88" font-size="10" fill="#e8394a" font-family="monospace">78.6%</text>
    <text x="22" y="88" font-size="9" fill="#e8394a" font-family="sans-serif">Profundo</text>

    <!-- 100% -->
    <line x1="90" y1="45" x2="570" y2="45" stroke="#607d8b" stroke-width="0.8" stroke-dasharray="3,4" opacity=".5"/>
    <text x="578" y="49" font-size="10" fill="#607d8b" font-family="monospace">100%</text>

    <!-- Retracement price path (the actual pullback) -->
    <polyline points="520,45 560,70 540,75 530,90 545,95 525,125 540,130 510,155"
      fill="none" stroke="#e8394a" stroke-width="2" stroke-linejoin="round" opacity=".85"/>

    <!-- Bounce from golden zone indicator -->
    <circle cx="510" cy="155" r="5" fill="#00d68f"/>
    <text x="465" y="170" font-size="9.5" fill="#00d68f" font-family="sans-serif" font-weight="700">↩ Bounce na Golden Zone</text>

    <!-- Legend bottom -->
    <text x="310" y="252" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">A = ponto inicial do impulso · B = fim do impulso · retracement = correção medida entre A e B</text>
  </svg>
</div>

<h2><span class="h2-num">1</span> Fibonacci — Por Que Funciona nos Mercados</h2>
<p>A sequência de Fibonacci produz razões que aparecem repetidamente na natureza. Os mercados financeiros, como sistemas de comportamento humano coletivo, também exibem essas proporções — não porque sejam "mágicas", mas porque <strong>são usadas por suficientes participantes que se tornam profecias auto-realizáveis</strong>. Quando milhões de traders e algoritmos colocam ordens nos mesmos níveis de Fibonacci, esses níveis se tornam zonas de reação reais.</p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">23.6%</div><div class="kpi-label">Correção superficial — tendência forte</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">38.2%</div><div class="kpi-label">Correção saudável e normal</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">61.8%</div><div class="kpi-label">Golden Ratio — o mais respeitado</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">78.6%</div><div class="kpi-label">Retracement profundo — tendência fraca</div></div>
</div>

<h2><span class="h2-num">2</span> Como Desenhar Corretamente no TradingView</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Identifique o Impulso a Medir</h4>
      <p>No Daily ou 4H, identifique o movimento direcional mais recente e significativo. <strong>Quanto maior o impulso, mais confiáveis os níveis.</strong> Em downtrend: do último High para o Low mais recente.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Use a Ferramenta Correta</h4>
      <p>No TradingView: <strong>"Fibonacci Retracement"</strong>. Para downtrend: clique na máxima (A) e arraste até a mínima (B). Para uptrend: clique na mínima (A) e arraste até a máxima (B). Certifique-se que 0% está no início do impulso e 100% no fim.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Identifique Confluências</h4>
      <p>Os níveis mais poderosos coincidem com outros S/R. Fibonacci 61.8% + mínima anterior + VPVR = zona de alta confluência. Use o sistema de cores da aula anterior.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Configure Extensões para Alvos</h4>
      <p>Extensões (127.2%, 161.8%, 261.8%) marcam onde o próximo impulso tende a ir. <strong>TP1 = 127.2% · TP2 = 161.8% · TP3 = 261.8%</strong></p>
    </div>
  </div>
</div>

<h2><span class="h2-num">3</span> Os Níveis — Significado Prático</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Nível</th><th>Tipo de Correção</th><th>O Que Indica</th><th>Setup TMP</th></tr></thead>
<tbody>
  <tr><td class="td-em td-bright">23.6%</td><td>Muito superficial</td><td>Tendência extremamente forte.</td><td>Entrada rápida para traders agressivos.</td></tr>
  <tr><td class="td-em td-cyan">38.2%</td><td>Saudável e normal</td><td>Tendência forte com consolidação saudável.</td><td>Zona de entrada válida em tendências fortes.</td></tr>
  <tr><td class="td-em td-gold">50%</td><td>Retracement médio</td><td>Nível psicológico importante — não é Fib puro.</td><td>Zona de observação. Resposta real de mercado.</td></tr>
  <tr><td class="td-em" style="color:var(--gold)">61.8% ⭐</td><td>Profundo mas saudável</td><td>Golden Ratio — o mais importante. Zone of Value.</td><td><strong>Setup de maior prioridade no TMP.</strong> R:R de 1:3 a 1:6 quando com confluência.</td></tr>
  <tr><td class="td-em td-red">78.6%</td><td>Muito profundo</td><td>Tendência enfraquecida. Estrutura comprometida.</td><td>Entrada apenas com confirmação forte. Sizing −30%.</td></tr>
  <tr><td class="td-em td-red">100%</td><td>Reteste completo</td><td>Impulso original anulado. Tendência provavelmente invertida.</td><td>Reconsiderar a tese. Revisar análise estrutural.</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> A Golden Zone — O Setup de Maior Prioridade</h2>

<div class="callout callout-gold">
  <div class="callout-title">⭐ Setup Golden Zone — Os 5 Ingredientes</div>
  <p>Para ser um setup de alta convicção no TMP:</p>
  <ol style="margin-top:8px;font-size:14px;line-height:2.2">
    <li><strong>Preço na Golden Zone</strong> (50%–61.8% de retracement de impulso significativo)</li>
    <li><strong>Confluência de S/R</strong> (mínima anterior, VPVR ou nível psicológico coincidindo)</li>
    <li><strong>Estrutura do TF maior a favor</strong> (correção esperada nesse ponto pelo Daily)</li>
    <li><strong>Vela de reversão</strong> (martelo, engolfo, doji + confirmação no próximo candle)</li>
    <li><strong>Volume caindo na correção</strong> (vendedores perdendo força na zona)</li>
  </ol>
  <p style="margin-top:10px"><strong>R:R típico: 1:3 a 1:6.</strong></p>
</div>

<h2><span class="h2-num">5</span> Fibonacci em XRP 23/02/2026 — Números Reais</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Análise Fibonacci Completa</div>
  <p>
  <strong>Impulso medido:</strong> ATH $3.66 → Mínima $1.3301 = −63.7%<br><br>
  <strong>Resistências (retracements do rally de retorno):</strong><br>
  • Fib 23.6% = <strong style="color:var(--amber)">$1.88</strong><br>
  • Fib 38.2% = <strong style="color:var(--amber)">$2.22</strong><br>
  • Fib 50% = <strong style="color:var(--gold)">$2.50</strong> (zona de decisão)<br>
  • Fib 61.8% = <strong style="color:var(--gold)">$2.77</strong> (Golden Zone — resistência principal)<br><br>
  <strong>Extensões do bounce local ($1.33 → $1.43):</strong><br>
  • Ext 127.2% = <strong style="color:var(--cyan)">$1.48</strong> (TP1)<br>
  • Ext 161.8% = <strong style="color:var(--green)">$1.65</strong> (TP2 — coincide com resistência estrutural!)<br>
  • Ext 200% = <strong style="color:var(--green)">$1.93</strong> (TP3 — coincide com LH Daily!)<br><br>
  <strong style="color:var(--gold)">Confluência poderosa:</strong> extensões Fibonacci coincidem com resistências estruturais da aula anterior — validação cruzada do mapa completo.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que Fibonacci funciona (profecia auto-realizável)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei desenhar retracement corretamente no TradingView (A → B)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo os 4 níveis: 23.6% / 38.2% / 61.8% Golden / 78.6%</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei usar extensões 127.2% / 161.8% / 200% para TP1, TP2 e TP3</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 5 ingredientes do setup Golden Zone e seu R:R de 1:3 a 1:6</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Apliquei o Fibonacci em XRP e confirmei confluência com os S/R da aula anterior</div></div>
</div>`,

  "padroes": `
<div class="blockquote">
  <div class="blockquote-text">Padrões gráficos são o idioma do mercado. Cada formação é uma frase que o preço está escrevendo. Aprenda a ler esse idioma e o mercado vai contar histórias para você antes que a maioria perceba.</div>
  <div class="blockquote-author">— Thomas Bulkowski · Encyclopedia of Chart Patterns</div>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 12px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Padrões de Velas — Anatomia Visual</div>
  <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- MARTELO (Hammer) -->
    <rect x="50" y="10" width="130" height="180" rx="7" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="115" y="26" text-anchor="middle" font-size="10.5" fill="#00d68f" font-family="sans-serif" font-weight="700">Martelo</text>
    <text x="115" y="38" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Reversão de Alta</text>
    <!-- Previous bearish candles (context) -->
    <line x1="73" y1="55" x2="73" y2="115" stroke="#e8394a" stroke-width="1" opacity=".5"/>
    <rect x="67" y="60" width="12" height="48" fill="#e8394a" opacity=".5" rx="1"/>
    <line x1="88" y1="58" x2="88" y2="120" stroke="#e8394a" stroke-width="1" opacity=".5"/>
    <rect x="82" y="65" width="12" height="48" fill="#e8394a" opacity=".5" rx="1"/>
    <!-- Hammer candle -->
    <line x1="107" y1="95" x2="107" y2="155" stroke="#00d68f" stroke-width="1.5"/>
    <rect x="100" y="95" width="14" height="18" fill="#00d68f" rx="1"/>
    <!-- Long lower shadow -->
    <line x1="107" y1="113" x2="107" y2="155" stroke="#00d68f" stroke-width="1.8"/>
    <!-- Labels -->
    <text x="125" y="99" font-size="8.5" fill="#607d8b" font-family="monospace">corpo</text>
    <text x="118" y="145" font-size="8" fill="#00d68f" font-family="monospace">sombra</text>
    <text x="118" y="154" font-size="8" fill="#00d68f" font-family="monospace">longa</text>
    <text x="115" y="178" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">em suporte + vol baixo</text>

    <!-- ENGOLFO DE ALTA (Bullish Engulfing) -->
    <rect x="195" y="10" width="130" height="180" rx="7" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="260" y="26" text-anchor="middle" font-size="10.5" fill="#00d68f" font-family="sans-serif" font-weight="700">Engolfo de Alta</text>
    <text x="260" y="38" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Reversão Forte</text>
    <!-- Bearish candle -->
    <line x1="232" y1="65" x2="232" y2="140" stroke="#e8394a" stroke-width="1.5"/>
    <rect x="224" y="72" width="16" height="56" fill="#e8394a" rx="1"/>
    <!-- Bullish engulfing candle (bigger) -->
    <line x1="258" y1="60" x2="258" y2="148" stroke="#00d68f" stroke-width="1.5"/>
    <rect x="249" y="65" width="18" height="72" fill="#00d68f" rx="1"/>
    <!-- Arrows showing engulf -->
    <line x1="241" y1="72" x2="247" y2="65" stroke="#00d68f" stroke-width="1" opacity=".7" stroke-dasharray="2,2"/>
    <line x1="241" y1="128" x2="247" y2="137" stroke="#00d68f" stroke-width="1" opacity=".7" stroke-dasharray="2,2"/>
    <text x="260" y="178" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">2º vela engole a 1ª</text>

    <!-- DOJI -->
    <rect x="340" y="10" width="130" height="180" rx="7" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="405" y="26" text-anchor="middle" font-size="10.5" fill="#f0a500" font-family="sans-serif" font-weight="700">Doji</text>
    <text x="405" y="38" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Indecisão</text>
    <!-- Doji candle -->
    <line x1="405" y1="65" x2="405" y2="145" stroke="#f0a500" stroke-width="2"/>
    <rect x="393" y="103" width="24" height="2" fill="#f0a500" rx="1"/>
    <text x="432" y="107" font-size="8.5" fill="#f0a500" font-family="monospace">open=close</text>
    <text x="405" y="178" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">abertura ≈ fechamento</text>

    <!-- ESTRELA DA MANHÃ (Morning Star) -->
    <rect x="485" y="10" width="100" height="180" rx="7" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="535" y="24" text-anchor="middle" font-size="10" fill="#00d68f" font-family="sans-serif" font-weight="700">Estrela Manhã</text>
    <text x="535" y="35" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Reversão 3 velas</text>
    <!-- Candle 1: big bearish -->
    <line x1="507" y1="50" x2="507" y2="120" stroke="#e8394a" stroke-width="1.5"/>
    <rect x="500" y="55" width="14" height="58" fill="#e8394a" rx="1"/>
    <!-- Candle 2: small doji/star -->
    <line x1="527" y1="118" x2="527" y2="140" stroke="#f0a500" stroke-width="1.5"/>
    <rect x="522" y="124" width="10" height="8" fill="#f0a500" rx="1"/>
    <!-- Candle 3: big bullish -->
    <line x1="548" y1="80" x2="548" y2="140" stroke="#00d68f" stroke-width="1.5"/>
    <rect x="541" y="80" width="14" height="52" fill="#00d68f" rx="1"/>
    <text x="535" y="178" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Bear → Doji → Bull</text>

    <!-- ESTRELA CADENTE (Shooting Star) -->
    <rect x="598" y="10" width="108" height="180" rx="7" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="652" y="26" text-anchor="middle" font-size="10.5" fill="#e8394a" font-family="sans-serif" font-weight="700">Estrela Cadente</text>
    <text x="652" y="38" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Reversão de Baixa</text>
    <!-- Previous bullish candles (context) -->
    <line x1="621" y1="80" x2="621" y2="140" stroke="#00d68f" stroke-width="1" opacity=".5"/>
    <rect x="615" y="90" width="12" height="45" fill="#00d68f" opacity=".5" rx="1"/>
    <!-- Shooting star candle -->
    <line x1="647" y1="55" x2="647" y2="135" stroke="#e8394a" stroke-width="1.8"/>
    <!-- Long upper shadow -->
    <line x1="647" y1="55" x2="647" y2="110" stroke="#e8394a" stroke-width="1.8"/>
    <rect x="640" y="110" width="14" height="18" fill="#e8394a" rx="1"/>
    <text x="665" y="68" font-size="8" fill="#e8394a" font-family="monospace">sombra</text>
    <text x="665" y="77" font-size="8" fill="#e8394a" font-family="monospace">longa</text>
    <text x="652" y="178" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">em resistência + vol alto</text>
  </svg>
</div>

<h2><span class="h2-num">1</span> Por Que Padrões Gráficos Funcionam</h2>
<p>Padrões gráficos são formações repetíveis de preço que refletem a psicologia coletiva dos participantes do mercado em situações similares. Eles funcionam porque o comportamento humano sob pressão financeira é previsível — medo, ganância, indecisão e capitulação produzem as mesmas formas visuais repetidamente ao longo do tempo e entre diferentes ativos.</p>
<p>No método TMP, padrões gráficos são usados como <strong>contexto adicional de confluência</strong> — nunca como sinal isolado. Um padrão de reversão em uma zona de suporte principal + Fibonacci 61.8% + indicadores confirmando = setup de alta convicção. Um padrão sem contexto = ruído.</p>

<div class="callout callout-info">
  <div class="callout-title">💡 A Regra dos 3 Contextos</div>
  <p>Um padrão gráfico só tem valor quando está em um dos 3 contextos corretos:<br>
  <strong>1. Em zona de suporte/resistência significativa</strong> (confirmação de S/R)<br>
  <strong>2. Em nível de Fibonacci relevante</strong> (confirmação de retracement)<br>
  <strong>3. Após impulso com divergência de indicador</strong> (confirmação de exaustão)<br><br>
  Padrão sem contexto = informação incompleta. Padrão com 2+ contextos = sinal de alta qualidade.</p>
</div>

<h2><span class="h2-num">2</span> Padrões de Velas — Os Mais Importantes para Swing Trade</h2>
<p>Padrões de uma ou duas velas são os sinais de entrada mais imediatos e acionáveis no método TMP:</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">🔨</div>
  <div class="rule-content">
    <h4>Martelo (Hammer) — Reversão de Alta</h4>
    <p><strong>Anatomia:</strong> Corpo pequeno no topo da vela + pavio inferior longo (pelo menos 2× o corpo) + pavio superior mínimo ou ausente.<br>
    <strong>Psicologia:</strong> Vendedores empurraram o preço para baixo durante a sessão, mas compradores reagiram com força e fecharam perto da máxima — vitória dos compradores na batalha do candle.<br>
    <strong>Contexto ideal:</strong> Em suporte significativo após downtrend ou correção.<br>
    <strong>Confirmação:</strong> Candle seguinte fechando acima do martelo confirma o sinal. Entrar na abertura do candle de confirmação.<br>
    <strong>Stop loss:</strong> Abaixo do pavio inferior do martelo (−0.5% além).</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">📈</div>
  <div class="rule-content">
    <h4>Engolfo de Alta (Bullish Engulfing) — Reversão de Alta</h4>
    <p><strong>Anatomia:</strong> Duas velas — primeira vermelha (bearish), segunda verde (bullish) que engloba completamente o corpo da primeira.<br>
    <strong>Psicologia:</strong> Vendedores dominaram no primeiro candle, mas compradores responderam com muito mais força — revertendo todo o movimento anterior e indo além. Mudança de controle clara e visível.<br>
    <strong>Contexto ideal:</strong> Em suporte + Fibonacci + após queda com volume crescente.<br>
    <strong>Força:</strong> Quanto maior a segunda vela em relação à primeira, mais poderoso o sinal.<br>
    <strong>Stop loss:</strong> Abaixo da mínima da vela engolfada.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">⚖️</div>
  <div class="rule-content">
    <h4>Doji — Indecisão / Alerta de Reversão</h4>
    <p><strong>Anatomia:</strong> Abertura e fechamento quase iguais. Corpo muito pequeno ou inexistente. Pavios variados.<br>
    <strong>Psicologia:</strong> Compradores e vendedores completamente equilibrados. Nenhum lado venceu. Esse equilíbrio em uma zona de S/R sinaliza exaustão do movimento anterior.<br>
    <strong>Contexto crítico:</strong> Doji isolado = neutro. Doji em suporte após queda longa = alerta de reversão. Doji em resistência após alta longa = alerta de reversão bearish.<br>
    <strong>Regra TMP:</strong> Aguardar confirmação do próximo candle antes de agir. Doji + candle de confirmação = sinal válido.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">⭐</div>
  <div class="rule-content">
    <h4>Estrela da Manhã (Morning Star) — Reversão de Alta Forte</h4>
    <p><strong>Anatomia:</strong> 3 velas — (1) vela vermelha grande, (2) pequena vela de indecisão com gap abaixo, (3) vela verde grande que fecha acima do meio da primeira.<br>
    <strong>Psicologia:</strong> Vendedores exaustos (vela 1) → mercado em dúvida (vela 2) → compradores assumem o controle com força (vela 3). Narrativa de reversão completa em 3 atos.<br>
    <strong>Força:</strong> Um dos padrões de reversão de alta mais confiáveis do mercado cripto quando em contexto correto.<br>
    <strong>Stop loss:</strong> Abaixo da mínima da vela central (vela 2).</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">📉</div>
  <div class="rule-content">
    <h4>Estrela Cadente (Shooting Star) — Reversão de Baixa</h4>
    <p><strong>Anatomia:</strong> Corpo pequeno na base da vela + pavio superior longo (pelo menos 2× o corpo) + pavio inferior mínimo.<br>
    <strong>Psicologia:</strong> Compradores tentaram um rally durante a sessão, mas vendedores rejeitaram com força e fecharam perto da mínima — vitória dos vendedores.<br>
    <strong>Contexto ideal:</strong> Em resistência após uptrend ou rally em downtrend.<br>
    <strong>Para XRP:</strong> Apareceu nos rallies para $1.48 durante o downtrend de fev/2026 — confirmando a resistência.</p>
  </div>
</div>

<h2><span class="h2-num">3</span> Padrões de Continuação — Consolidação Antes do Próximo Impulso</h2>
<p>Padrões de continuação indicam que o mercado está fazendo uma pausa antes de continuar na direção da tendência. No swing trade, esses são os setups de entrada ideais dentro de uma tendência estabelecida:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Padrão</th><th>Forma</th><th>Sinal</th><th>Entrada</th><th>Alvo</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-green">Bandeira de Alta (Bull Flag)</td>
    <td>Forte impulso de alta + consolidação em canal ligeiramente descendente</td>
    <td class="td-green">Bullish — continuação após rompimento</td>
    <td>Rompimento da resistência do canal com volume</td>
    <td>Extensão igual ao mastro da bandeira a partir do rompimento</td>
  </tr>
  <tr>
    <td class="td-em td-red">Bandeira de Baixa (Bear Flag)</td>
    <td>Forte queda + consolidação em canal ligeiramente ascendente</td>
    <td class="td-red">Bearish — continuação após rompimento</td>
    <td>Rompimento do suporte do canal com volume</td>
    <td>Extensão igual ao mastro a partir do rompimento</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Triângulo Simétrico</td>
    <td>Compressão de máximas e mínimas em triângulo convergente</td>
    <td class="td-cyan">Neutro até rompimento — direção define viés</td>
    <td>Rompimento de qualquer lado com volume elevado</td>
    <td>Extensão igual à base do triângulo</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Cunha (Wedge)</td>
    <td>Compressão com inclinação — cunha de alta em downtrend = bearish</td>
    <td>Oposto à inclinação: cunha ascendente = bearish, descendente = bullish</td>
    <td>Rompimento contra a inclinação com volume</td>
    <td>Retorno ao início da cunha</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Padrões de Reversão — Mudança de Tendência</h2>
<p>Esses padrões sinalizam que a tendência atual pode estar se esgotando. São os mais importantes para o setup de <em>contra-tendência</em> que o método TMP usa em momentos de capitulação:</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">W</div>
  <div class="rule-content">
    <h4>Fundo Duplo (Double Bottom / "W") — Reversão de Alta</h4>
    <p><strong>Forma:</strong> Duas mínimas em nível similar separadas por um pico intermediário. Formato visual de "W".<br>
    <strong>Psicologia:</strong> O mercado testou um suporte, subiu, voltou a testar o mesmo suporte e voltou novamente — confirmando que compradores estão defendendo ativamente aquele nível.<br>
    <strong>Confirmação:</strong> Rompimento acima do pico intermediário (neckline) com volume elevado. Somente após esse rompimento o padrão está confirmado — antes, é apenas especulação.<br>
    <strong>Alvo:</strong> Distância do fundo até o neckline, projetada para cima a partir do rompimento.<br>
    <strong>Para XRP:</strong> Mínimas em $1.33 em datas diferentes criam potencial de Double Bottom se o preço romper $1.48 com volume.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">M</div>
  <div class="rule-content">
    <h4>Topo Duplo (Double Top / "M") — Reversão de Baixa</h4>
    <p><strong>Forma:</strong> Dois picos em nível similar separados por um vale intermediário. Formato visual de "M".<br>
    <strong>Psicologia:</strong> O mercado tentou superar uma resistência duas vezes e falhou — confirmando que vendedores estão defendendo ativamente aquele nível.<br>
    <strong>Confirmação:</strong> Rompimento abaixo do vale intermediário (neckline) com volume.<br>
    <strong>Para XRP jan/2026:</strong> O padrão de Double Top em $3.55–$3.66 antecipou a queda subsequente para $1.33.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">H&S</div>
  <div class="rule-content">
    <h4>Ombro-Cabeça-Ombro (H&S) — Reversão de Alta para Baixa</h4>
    <p><strong>Forma:</strong> Três picos — o central (cabeça) mais alto que os dois laterais (ombros). Neckline conecta os vales entre os picos.<br>
    <strong>Psicologia:</strong> Tendência de alta perde força progressivamente — cada tentativa de nova máxima é menos convicta. Os compradores estão se esgotando.<br>
    <strong>Confirmação:</strong> Rompimento abaixo da neckline com volume. Esse é o sinal de entrada short ou saída de longs.<br>
    <strong>Alvo:</strong> Distância da cabeça à neckline, projetada para baixo a partir do rompimento.<br>
    <strong>Dica:</strong> Inverso (iH&S) é padrão de reversão bullish — 3 fundos com o central mais baixo.</p>
  </div>
</div>

<h2><span class="h2-num">5</span> Guia Rápido de Identificação — Flowchart</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Pergunta</th><th>Sim</th><th>Não</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em">Estamos em tendência estabelecida?</td>
    <td class="td-green">→ Buscar padrões de CONTINUAÇÃO (flags, triângulos)</td>
    <td class="td-gold">→ Mercado em range — avaliar padrões de REVERSÃO</td>
  </tr>
  <tr>
    <td class="td-em">Padrão está em zona de S/R significativa?</td>
    <td class="td-green">→ Padrão ganha peso. Checar confluência Fibonacci.</td>
    <td class="td-red">→ Padrão isolado. Baixa confiabilidade. Ignorar ou reduzir sizing muito.</td>
  </tr>
  <tr>
    <td class="td-em">Volume confirma o padrão?</td>
    <td class="td-green">→ Sinal válido. Avaliar indicadores (Filtro STMP).</td>
    <td class="td-red">→ Padrão suspeito. Aguardar volume antes de entrar.</td>
  </tr>
  <tr>
    <td class="td-em">Padrão de reversão — há confirmação de indicadores?</td>
    <td class="td-green">→ Setup de alta convicção. R:R mínimo 1:2.5.</td>
    <td class="td-gold">→ Aguardar confirmação. Não antecipar reversão sem dados.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">6</span> Padrões Identificados em XRP — 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Leitura de Padrões no Gráfico XRP do Dia</div>
  <p>
  <strong>Daily:</strong> Potencial Fundo Duplo em formação — mínima de jan/2026 (~$1.30) e mínima atual de fev/2026 (~$1.33) em nível similar. Neckline = $1.48. <strong>Padrão NÃO confirmado</strong> — precisa romper $1.48 com volume para ativar.<br><br>
  <strong>4H:</strong> Bear Flag completada — impulso de queda de $1.93 → $1.33 + consolidação lateral $1.33–$1.43. Rompimento do flag abaixo de $1.33 = continuação bearish para $1.20–$1.10.<br><br>
  <strong>1H:</strong> Padrão de indecisão: série de Doji e martelos em $1.30–$1.35. Volume caindo na zona = exaustão vendedora imediata. Sinal de potencial bounce técnico — mas sem confirmação de reversão estrutural ainda.<br><br>
  <strong>Conclusão de padrões:</strong> Conflito entre Daily (potencial reversão em construção) e 4H (continuação bearish possível). Esse conflito reforça a necessidade de aguardar o rompimento confirmatório antes de qualquer entrada significativa.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a Regra dos 3 Contextos — padrão sem contexto é ruído</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei identificar os 5 padrões de velas: martelo, engolfo, doji, estrela da manhã, estrela cadente</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Reconheço padrões de continuação: bandeiras, triângulos e cunhas</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo padrões de reversão: Double Bottom (W), Double Top (M), H&S</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Apliquei o flowchart de identificação nos gráficos de XRP desta sessão</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo por que o Daily e 4H conflitam em 23/02/2026 e o que esperar antes de entrar</div></div>
</div>`,

  "stmp-overview": `
<div class="blockquote">
  <div class="blockquote-text">Não existe indicador perfeito. Existe um sistema de indicadores que, usado em conjunto, cria um contexto suficientemente claro para que as probabilidades estejam a seu favor.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> O Que é o Swing Trade Master Pro (STMP)</h2>
<p>O Swing Trade Master Pro é o <strong>sistema de indicadores técnicos proprietário do método TMP</strong>. Ele integra 8 componentes distintos em um único painel visual que fornece uma leitura clara e objetiva do estado técnico do ativo em qualquer timeframe.</p>
<p>O STMP não é um indicador de entrada mecânica — não vai piscar verde e dizer "compre agora". Ele é um <strong>sistema de pontuação técnica</strong> que elimina a subjetividade da análise e transforma leituras qualitativas ("parece estar subindo") em leituras quantitativas ("6 de 8 componentes bullish = alta probabilidade de continuação").</p>

<div class="callout callout-gold">
  <div class="callout-title">⭐ O Princípio Central do STMP</div>
  <p>Cada componente isolado tem limitações. Juntos, eles criam <strong>confluência técnica mensurável</strong>. A regra fundamental: quanto mais componentes apontando na mesma direção, maior a probabilidade do setup e mais capital você pode alocar com segurança.</p>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Sistema STMP — 8 Componentes &amp; Scorecard</div>
  <svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Central label -->
    <circle cx="210" cy="110" r="62" fill="#0a1628" stroke="#f0a500" stroke-width="2"/>
    <text x="210" y="105" text-anchor="middle" font-size="13" fill="#f0a500" font-family="sans-serif" font-weight="900">STMP</text>
    <text x="210" y="121" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Score /8</text>

    <!-- 8 components arranged in circle -->
    <!-- 1. HTF Trend (top) -->
    <line x1="210" y1="48" x2="210" y2="72" stroke="#3d8fef" stroke-width="1.5" opacity=".6"/>
    <rect x="165" y="18" width="90" height="30" rx="6" fill="#0a1628" stroke="#3d8fef" stroke-width="1.5"/>
    <text x="210" y="31" text-anchor="middle" font-size="9.5" fill="#3d8fef" font-family="sans-serif" font-weight="700">HTF Trend</text>
    <text x="210" y="43" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Direção</text>

    <!-- 2. ADX (top-right) -->
    <line x1="252" y1="68" x2="272" y2="50" stroke="#00c4e8" stroke-width="1.5" opacity=".6"/>
    <rect x="272" y="20" width="76" height="30" rx="6" fill="#0a1628" stroke="#00c4e8" stroke-width="1.5"/>
    <text x="310" y="33" text-anchor="middle" font-size="9.5" fill="#00c4e8" font-family="sans-serif" font-weight="700">ADX</text>
    <text x="310" y="45" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Força</text>

    <!-- 3. RSI (right) -->
    <line x1="272" y1="110" x2="300" y2="110" stroke="#9c27b0" stroke-width="1.5" opacity=".6"/>
    <rect x="300" y="95" width="76" height="30" rx="6" fill="#0a1628" stroke="#9c27b0" stroke-width="1.5"/>
    <text x="338" y="108" text-anchor="middle" font-size="9.5" fill="#9c27b0" font-family="sans-serif" font-weight="700">RSI</text>
    <text x="338" y="120" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Momentum</text>

    <!-- 4. MACD (bottom-right) -->
    <line x1="252" y1="152" x2="272" y2="170" stroke="#e8394a" stroke-width="1.5" opacity=".6"/>
    <rect x="272" y="170" width="76" height="30" rx="6" fill="#0a1628" stroke="#e8394a" stroke-width="1.5"/>
    <text x="310" y="183" text-anchor="middle" font-size="9.5" fill="#e8394a" font-family="sans-serif" font-weight="700">MACD</text>
    <text x="310" y="195" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Momentum</text>

    <!-- 5. Ichimoku (bottom) -->
    <line x1="210" y1="172" x2="210" y2="200" stroke="#00d68f" stroke-width="1.5" opacity=".6"/>
    <rect x="162" y="192" width="96" height="24" rx="6" fill="#0a1628" stroke="#00d68f" stroke-width="1.5"/>
    <text x="210" y="208" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="sans-serif" font-weight="700">Ichimoku</text>

    <!-- 6. Volume (bottom-left) -->
    <line x1="168" y1="152" x2="150" y2="170" stroke="#f0a500" stroke-width="1.5" opacity=".6"/>
    <rect x="74" y="168" width="76" height="30" rx="6" fill="#0a1628" stroke="#f0a500" stroke-width="1.5"/>
    <text x="112" y="181" text-anchor="middle" font-size="9.5" fill="#f0a500" font-family="sans-serif" font-weight="700">Volume</text>
    <text x="112" y="193" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Confirmação</text>

    <!-- 7. Estrutura (left) -->
    <line x1="148" y1="110" x2="120" y2="110" stroke="#00c4e8" stroke-width="1.5" opacity=".6"/>
    <rect x="44" y="95" width="76" height="30" rx="6" fill="#0a1628" stroke="#00c4e8" stroke-width="1.5"/>
    <text x="82" y="108" text-anchor="middle" font-size="9.5" fill="#00c4e8" font-family="sans-serif" font-weight="700">Estrutura</text>
    <text x="82" y="120" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Preço</text>

    <!-- 8. S/R + Fib (top-left) -->
    <line x1="168" y1="68" x2="150" y2="50" stroke="#3d8fef" stroke-width="1.5" opacity=".6"/>
    <rect x="74" y="20" width="76" height="30" rx="6" fill="#0a1628" stroke="#3d8fef" stroke-width="1.5"/>
    <text x="112" y="33" text-anchor="middle" font-size="9.5" fill="#3d8fef" font-family="sans-serif" font-weight="700">S/R + Fib</text>
    <text x="112" y="45" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Localização</text>

    <!-- Score bar on right side -->
    <rect x="430" y="18" width="272" height="184" rx="8" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="566" y="38" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">Score → Sizing</text>
    <line x1="438" y1="46" x2="694" y2="46" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Score rows -->
    <rect x="438" y="52" width="256" height="18" rx="3" fill="#e8394a" opacity=".1"/>
    <text x="446" y="65" font-size="10" fill="#e8394a" font-family="monospace">0–2 filtros</text>
    <text x="672" y="65" font-size="10" fill="#e8394a" font-family="monospace" text-anchor="end">NÃO OPERAR</text>

    <rect x="438" y="74" width="256" height="18" rx="3" fill="#e67e22" opacity=".08"/>
    <text x="446" y="87" font-size="10" fill="#e67e22" font-family="monospace">3 filtros</text>
    <text x="672" y="87" font-size="10" fill="#e67e22" font-family="monospace" text-anchor="end">Marginal</text>

    <rect x="438" y="96" width="256" height="18" rx="3" fill="#f0a500" opacity=".08"/>
    <text x="446" y="109" font-size="10" fill="#f0a500" font-family="monospace">4 filtros (mínimo)</text>
    <text x="672" y="109" font-size="10" fill="#f0a500" font-family="monospace" text-anchor="end">40% sizing</text>

    <rect x="438" y="118" width="256" height="18" rx="3" fill="#00c4e8" opacity=".08"/>
    <text x="446" y="131" font-size="10" fill="#00c4e8" font-family="monospace">5 filtros</text>
    <text x="672" y="131" font-size="10" fill="#00c4e8" font-family="monospace" text-anchor="end">70% sizing</text>

    <rect x="438" y="140" width="256" height="18" rx="3" fill="#00d68f" opacity=".1"/>
    <text x="446" y="153" font-size="10" fill="#00d68f" font-family="monospace">6 filtros</text>
    <text x="672" y="153" font-size="10" fill="#00d68f" font-family="monospace" text-anchor="end">100% sizing</text>

    <rect x="438" y="162" width="256" height="18" rx="3" fill="#f0a500" opacity=".12"/>
    <text x="446" y="175" font-size="10" fill="#f0a500" font-family="monospace" font-weight="700">7–8 filtros ⭐</text>
    <text x="672" y="175" font-size="10" fill="#f0a500" font-family="monospace" text-anchor="end" font-weight="700">100–120%</text>

    <text x="566" y="198" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">XRP 23/02: 3/8 → não qualifica</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> Os 8 Componentes do Sistema STMP</h2>
<p>Cada componente responde a uma pergunta específica sobre o estado do ativo:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>#</th><th>Componente</th><th>Pergunta que Responde</th><th>Sinal Bullish</th><th>Sinal Bearish</th></tr></thead>
<tbody>
  <tr>
    <td class="td-gold td-em">1</td>
    <td class="td-em td-bright">HTF Trend</td>
    <td>Qual é a tendência do timeframe superior?</td>
    <td class="td-green">BULL (verde)</td>
    <td class="td-red">BEAR (vermelho)</td>
  </tr>
  <tr>
    <td class="td-gold td-em">2</td>
    <td class="td-em td-bright">ADX</td>
    <td>Qual é a força da tendência atual?</td>
    <td class="td-green">&gt; 25 na direção bullish</td>
    <td class="td-red">&gt; 25 na direção bearish</td>
  </tr>
  <tr>
    <td class="td-gold td-em">3</td>
    <td class="td-em td-bright">RSI</td>
    <td>O ativo está sobrecomprado, sobrevendido ou com divergência?</td>
    <td class="td-green">&lt; 35 sobrevendido ou divergência bullish</td>
    <td class="td-red">&gt; 65 sobrecomprado ou divergência bearish</td>
  </tr>
  <tr>
    <td class="td-gold td-em">4</td>
    <td class="td-em td-bright">MACD</td>
    <td>O momentum está acelerando ou desacelerando?</td>
    <td class="td-green">Cruzamento bullish ou histograma crescendo positivo</td>
    <td class="td-red">Cruzamento bearish ou histograma crescendo negativo</td>
  </tr>
  <tr>
    <td class="td-gold td-em">5</td>
    <td class="td-em td-bright">Ichimoku Cloud</td>
    <td>Preço está em zona de suporte ou resistência de médio prazo?</td>
    <td class="td-green">Preço acima da nuvem, nuvem verde à frente</td>
    <td class="td-red">Preço abaixo da nuvem, nuvem vermelha à frente</td>
  </tr>
  <tr>
    <td class="td-gold td-em">6</td>
    <td class="td-em td-bright">Volume</td>
    <td>O movimento atual tem participação real do mercado?</td>
    <td class="td-green">Volume alto em impulso de alta + baixo na correção</td>
    <td class="td-red">Volume alto em impulso de baixa + baixo no rally</td>
  </tr>
  <tr>
    <td class="td-gold td-em">7</td>
    <td class="td-em td-bright">Estrutura de Preço</td>
    <td>Máximas e mínimas confirmam a direção?</td>
    <td class="td-green">HH + HL formando</td>
    <td class="td-red">LH + LL formando</td>
  </tr>
  <tr>
    <td class="td-gold td-em">8</td>
    <td class="td-em td-bright">S/R + Fibonacci</td>
    <td>O preço está em zona de suporte ou resistência confluente?</td>
    <td class="td-green">Em suporte de alta confluência</td>
    <td class="td-red">Em resistência de alta confluência</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> O Sistema de Pontuação — Filtros e Decisão</h2>
<p>O coração do STMP é seu sistema de pontuação. Cada componente recebe um score baseado em seu estado atual, e a soma define a qualidade e o sizing do trade:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Score (Filtros Ativos)</th><th>Qualidade do Setup</th><th>Ação TMP</th><th>Sizing</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">0 – 2 filtros</td>
    <td class="td-red">Setup inexistente ou fraco</td>
    <td class="td-red">NÃO OPERAR. Sem edge identificável.</td>
    <td>0% — fora do mercado</td>
  </tr>
  <tr>
    <td class="td-em" style="color:#e67e22">3 filtros</td>
    <td style="color:#e67e22">Setup marginal</td>
    <td style="color:#e67e22">Apenas paper trade ou observação. Não operar capital real.</td>
    <td>0% — aguardar</td>
  </tr>
  <tr>
    <td class="td-em td-gold">4 filtros</td>
    <td class="td-gold">Setup mínimo aceitável</td>
    <td>Entrada possível com sizing muito reduzido e stop rigoroso.</td>
    <td>40% do tamanho normal</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">5 filtros</td>
    <td class="td-cyan">Setup de qualidade</td>
    <td>Entrada válida. Setup padrão do método TMP. R:R mínimo 1:2.</td>
    <td>70% do tamanho normal</td>
  </tr>
  <tr>
    <td class="td-em td-green">6 filtros</td>
    <td class="td-green">Setup de alta qualidade</td>
    <td>Entrada com confiança. Tamanho completo. R:R mínimo 1:3.</td>
    <td>100% do tamanho normal</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--gold)">7–8 filtros ⭐</td>
    <td style="color:var(--gold)">Setup de convicção máxima</td>
    <td><strong>Setup raro e de alta prioridade.</strong> Todas as confluências alinhadas. R:R pode chegar 1:5+.</td>
    <td>100–120% (se permitido pelo risco total)</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Os 5 Filtros de Decisão — O Framework de Entrada</h2>
<p>O STMP condensa os 8 componentes em <strong>5 filtros de decisão</strong> que precisam ser verificados sequencialmente antes de qualquer entrada. Se qualquer filtro falhar, o trade não acontece:</p>

<div class="steps">
  <div class="step-card" style="border-left: 3px solid var(--gold)">
    <div class="step-num" style="background: linear-gradient(135deg,#7B5C00,#f0a500)">F1</div>
    <div class="step-content">
      <h4>Filtro 1 — Contexto Macro (Fase 1)</h4>
      <p>O contexto fundamental e de sentimento favorece a direção do trade?<br>
      <strong>Checklists:</strong> F&G compatível com a direção (não abrir long quando F&G &gt; 80) · Dominância BTC não contra o trade · Notícias sem evento de risco imediato.<br>
      <strong>Se reprovar:</strong> Trade cancelado — independente dos outros filtros.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--bright)">
    <div class="step-num" style="background: linear-gradient(135deg,#0A3060,#3d8fef)">F2</div>
    <div class="step-content">
      <h4>Filtro 2 — Estrutura e Localização</h4>
      <p>O preço está em localização estruturalmente válida?<br>
      <strong>Checklists:</strong> Em zona de suporte/resistência de alta confluência · Não no meio de nenhum range sem clara direção · Fibonacci confirma a zona · Estrutura de TF maior compatível.<br>
      <strong>Se reprovar:</strong> Aguardar o preço chegar em zona válida.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--cyan)">
    <div class="step-num" style="background: linear-gradient(135deg,#004a5c,#00c4e8)">F3</div>
    <div class="step-content">
      <h4>Filtro 3 — HTF Trend + ADX</h4>
      <p>A tendência de maior timeframe confirma a direção e tem força suficiente?<br>
      <strong>Checklists:</strong> HTF Trend = BULL para long (ou BEAR para short) · ADX &gt; 20 (tendência existente) · Se ADX &gt; 50, cautela com entrada pois pode estar próximo de reversão.<br>
      <strong>Exceção:</strong> Longs contra-tendência (HTF BEAR) permitidos apenas com todos os outros filtros ativos + sizing −40%.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--green)">
    <div class="step-num" style="background: linear-gradient(135deg,#005C3A,#00d68f)">F4</div>
    <div class="step-content">
      <h4>Filtro 4 — RSI + MACD</h4>
      <p>O momentum confirma a direção e não está em zona de risco?<br>
      <strong>Checklists:</strong> RSI &lt; 40 para longs (sobrevendido ou neutro) · MACD não em cruzamento bearish ativo · Divergência bullish de RSI presente = bônus de convicção · RSI &gt; 65 = não abrir long.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--purple)">
    <div class="step-num" style="background: linear-gradient(135deg,#3C1080,#7c5cbf)">F5</div>
    <div class="step-content">
      <h4>Filtro 5 — Ichimoku + Padrão de Vela</h4>
      <p>A nuvem Ichimoku e o padrão de vela confirmam a entrada?<br>
      <strong>Checklists:</strong> Preço na nuvem ou testando suporte da nuvem (zona de valor) · Nuvem futura do tipo correto (kumo twist favorável) · Padrão de vela de reversão presente (martelo, engolfo, morning star).<br>
      <strong>Nota:</strong> Ichimoku e padrão de vela são filtros de <em>timing</em> — confirmam o <em>quando</em> entrar dentro da zona identificada.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> Como Aplicar o STMP na Prática — O Checklist Unificado</h2>

<div class="callout callout-gold">
  <div class="callout-title">📋 Checklist STMP — Preencher Antes de Cada Entrada</div>
  <p style="font-family: var(--font-mono); font-size: 13px; line-height: 2.2; color: var(--gray1)">
  <span style="color:var(--gold)">CONTEXTO MACRO (F1)</span><br>
  □ F&G: ___ / compatível com direção? ___<br>
  □ BTC.D: ___ / regime favorável? ___<br>
  □ Notícias: evento de risco nas próximas 24h? ___<br><br>
  <span style="color:var(--bright)">ESTRUTURA E LOCALIZAÇÃO (F2)</span><br>
  □ Zona de S/R: ___ / força: ___<br>
  □ Fibonacci: nível ___ / confluência: ___<br>
  □ Estrutura Daily: uptrend / downtrend / range<br><br>
  <span style="color:var(--cyan)">HTF TREND + ADX (F3)</span><br>
  □ HTF Trend 1H: ___ / 4H: ___ / Daily: ___<br>
  □ ADX: ___ / força: ___<br><br>
  <span style="color:var(--green)">RSI + MACD (F4)</span><br>
  □ RSI: ___ / estado: ___<br>
  □ Divergência RSI: sim / não<br>
  □ MACD: cruzamento ___ / histograma: ___<br><br>
  <span style="color:var(--purple)">ICHIMOKU + VELA (F5)</span><br>
  □ Preço vs Nuvem: acima / dentro / abaixo<br>
  □ Kumo Twist: favorável? ___<br>
  □ Padrão de vela: ___<br><br>
  <span style="color:var(--gold)">DECISÃO</span><br>
  □ Filtros aprovados: ___ / 5<br>
  □ Score STMP (componentes bullish): ___ / 8<br>
  □ Sizing: ___ % do normal<br>
  □ Entrada: ___ / Stop: ___ / TP1: ___ / TP2: ___ / TP3: ___
  </p>
</div>

<h2><span class="h2-num">6</span> Scorecard STMP — XRP 23/02/2026</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Componente</th><th>Estado em 23/02/2026</th><th>Score Long</th><th>Observação</th></tr></thead>
<tbody>
  <tr><td class="td-em">HTF Trend</td><td class="td-red">BEAR em 1H, 4H e Daily</td><td class="td-red">✗ Contra</td><td>Downtrend estrutural em todos os TFs</td></tr>
  <tr><td class="td-em">ADX</td><td class="td-red">Daily 40.6 BEAR · 4H 23.4 · 1H 33.3</td><td class="td-gold">⚠️ Parcial</td><td>ADX alto mas caindo no 4H = enfraquecimento</td></tr>
  <tr><td class="td-em">RSI</td><td class="td-green">~28 no 1H (sobrevendido) + divergência bullish</td><td class="td-green">✓ Favor</td><td>Divergência RSI + sobrevendido = sinal positivo</td></tr>
  <tr><td class="td-em">MACD</td><td class="td-gold">Conflito — 1H possível cruzamento bullish, 4H ainda bearish</td><td class="td-gold">⚠️ Neutro</td><td>Não confirma claramente nenhum lado</td></tr>
  <tr><td class="td-em">Ichimoku</td><td class="td-red">Preço abaixo da nuvem em todos os TFs</td><td class="td-red">✗ Contra</td><td>Território bearish na nuvem</td></tr>
  <tr><td class="td-em">Volume</td><td class="td-green">Muito baixo na zona = 0.02× da média</td><td class="td-green">✓ Favor</td><td>Sem vendedores com convicção = exaustão</td></tr>
  <tr><td class="td-em">Estrutura</td><td class="td-red">LH + LL — downtrend ativo</td><td class="td-red">✗ Contra</td><td>Potencial Double Bottom em formação (não confirmado)</td></tr>
  <tr><td class="td-em">S/R + Fibonacci</td><td class="td-green">Em suporte de alta confluência $1.30–$1.35 + Fib 78.6%</td><td class="td-green">✓ Favor</td><td>Zona de máxima importância estrutural</td></tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">🔍 Resultado do Scorecard — XRP 23/02/2026</div>
  <p><strong>Componentes a favor de long:</strong> RSI (divergência), Volume (exaustão), S/R (suporte confluente) = <strong>3/8</strong><br>
  <strong>Componentes contra:</strong> HTF Trend, Ichimoku, Estrutura = <strong>3/8</strong><br>
  <strong>Componentes neutros:</strong> ADX (enfraquecendo), MACD (conflito) = <strong>2/8</strong><br><br>
  <strong>Score total para long: 3/8 — setup abaixo do mínimo de 5 filtros.</strong><br>
  <strong>Conclusão do STMP:</strong> Trade long não qualificado pelo sistema. Monitoramento ativo. Aguardar confirmação adicional — especialmente HTF Trend virando para BULL no 1H e MACD cruzando bullish no 4H. Quando 2 componentes adicionais confirmarem, o score sobe para 5/8 e o setup se torna válido.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 8 componentes do STMP e a pergunta que cada um responde</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo a tabela de scoring: &lt; 4 = não operar, 5 = qualidade, 7–8 = convicção máxima</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei aplicar os 5 filtros de decisão sequencialmente antes de qualquer entrada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Preenchi o Checklist STMP completo para XRP em 23/02/2026</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que o score 3/8 invalida o trade long nesse momento</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei o que precisa mudar para o setup atingir 5/8 e se tornar válido</div></div>
</div>`,

  "adx": `
<div class="blockquote">
  <div class="blockquote-text">A direção sem força não é tendência — é oscilação. A força sem direção não é oportunidade — é ruído. O ADX mede a força. Você já tem a direção. Juntos, formam o filtro mais poderoso do sistema.</div>
  <div class="blockquote-author">— J. Welles Wilder Jr. · Conceitos de Sistemas de Trading</div>
</div>

<h2><span class="h2-num">1</span> ADX — A Física da Tendência</h2>
<p>O ADX (Average Directional Index) foi criado por J. Welles Wilder em 1978 e é considerado um dos poucos indicadores verdadeiramente atemporais da análise técnica. Sua proposta é única e precisa: <strong>medir a FORÇA da tendência, não sua direção</strong>.</p>
<p>Esse detalhe — força, não direção — é o que torna o ADX tão valioso e tão mal compreendido. Um ADX alto de 45 em mercado bearish significa "downtrend muito forte" — não "subida iminente". O ADX apenas diz se o mercado está em tendência clara ou em lateralização confusa. A direção vem do HTF Trend e dos outros componentes do STMP.</p>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ O Erro Mais Cometido com o ADX</div>
  <p>Traders iniciantes veem ADX subindo e pensam "a tendência de alta está ficando mais forte". <strong>Errado.</strong> ADX subindo apenas significa que a tendência — qualquer que seja a direção — está ficando mais forte. Um ADX subindo de 20 para 40 em um downtrend significa que a queda está acelerando.<br><br>
  <strong>Regra absoluta:</strong> Sempre leia ADX em conjunto com o HTF Trend. ADX sem HTF Trend é informação incompleta.</p>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">ADX — Faixas de Força e Leitura de Tendência</div>
  <svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Chart bg -->
    <rect x="10" y="10" width="700" height="190" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Strength bands (horizontal) -->
    <!-- >50 band -->
    <rect x="10" y="10" width="700" height="28" rx="3" fill="#e8394a" opacity=".08"/>
    <text x="18" y="28" font-size="10" fill="#e8394a" font-family="monospace" font-weight="700">&gt;50 — Muito Forte (atenção reversão)</text>

    <!-- 30-50 band -->
    <rect x="10" y="38" width="700" height="40" rx="0" fill="#00d68f" opacity=".06"/>
    <text x="18" y="55" font-size="10" fill="#00d68f" font-family="monospace" font-weight="700">30–50 — Tendência Forte (sizing 100%)</text>

    <!-- 20-30 band -->
    <rect x="10" y="78" width="700" height="40" rx="0" fill="#f0a500" opacity=".05"/>
    <text x="18" y="95" font-size="10" fill="#f0a500" font-family="monospace">20–30 — Tendência Moderada (60–70%)</text>

    <!-- 15-20 band -->
    <rect x="10" y="118" width="700" height="30" rx="0" fill="#607d8b" opacity=".08"/>
    <text x="18" y="136" font-size="10" fill="#607d8b" font-family="monospace">15–20 — Emergindo (30% sizing)</text>

    <!-- <15 band -->
    <rect x="10" y="148" width="700" height="52" rx="0" fill="#e8394a" opacity=".05"/>
    <text x="18" y="168" font-size="10" fill="#e8394a" font-family="monospace">&#60;15 — Choppy (NÃO OPERAR)</text>

    <!-- ADX line (value rises then falls) -->
    <polyline points="30,190 70,180 110,165 150,148 190,130 230,105 270,75 310,52 340,38 370,45 400,60 430,72 470,88 510,105 550,120 580,135 610,148 640,158 670,165 695,170"
      fill="none" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- +DI line -->
    <polyline points="30,185 80,172 130,158 180,138 220,115 260,88 300,62 340,45 380,48 420,58 460,72 500,88 540,105 580,120 620,135 660,148 695,158"
      fill="none" stroke="#00d68f" stroke-width="1.5" opacity=".8" stroke-dasharray="4,2"/>

    <!-- -DI line -->
    <polyline points="30,172 80,165 130,158 180,155 220,150 260,145 300,145 340,148 380,142 420,132 460,122 500,112 540,105 580,100 620,96 660,92 695,90"
      fill="none" stroke="#e8394a" stroke-width="1.5" opacity=".8" stroke-dasharray="4,2"/>

    <!-- Annotation: peak -->
    <circle cx="340" cy="38" r="5" fill="none" stroke="#f0a500" stroke-width="1.5"/>
    <text x="295" y="33" font-size="9" fill="#f0a500" font-family="sans-serif">ADX 40.6 (XRP)</text>

    <!-- Key threshold lines -->
    <line x1="10" y1="38" x2="710" y2="38" stroke="#e8394a" stroke-width="0.7" opacity=".4"/>
    <line x1="10" y1="78" x2="710" y2="78" stroke="#00d68f" stroke-width="0.7" opacity=".4"/>
    <line x1="10" y1="118" x2="710" y2="118" stroke="#f0a500" stroke-width="0.7" opacity=".4"/>
    <line x1="10" y1="148" x2="710" y2="148" stroke="#607d8b" stroke-width="0.7" opacity=".4"/>

    <!-- Y-axis labels -->
    <text x="695" y="36" font-size="9" fill="#e8394a" font-family="monospace" text-anchor="end">50</text>
    <text x="695" y="76" font-size="9" fill="#00d68f" font-family="monospace" text-anchor="end">30</text>
    <text x="695" y="116" font-size="9" fill="#f0a500" font-family="monospace" text-anchor="end">20</text>
    <text x="695" y="146" font-size="9" fill="#607d8b" font-family="monospace" text-anchor="end">15</text>

    <!-- Legend -->
    <line x1="18" y1="202" x2="42" y2="202" stroke="#f0a500" stroke-width="2.5"/>
    <text x="46" y="206" font-size="9.5" fill="#f0a500" font-family="sans-serif">ADX (força)</text>
    <line x1="130" y1="202" x2="154" y2="202" stroke="#00d68f" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="158" y="206" font-size="9.5" fill="#00d68f" font-family="sans-serif">+DI (força alta)</text>
    <line x1="270" y1="202" x2="294" y2="202" stroke="#e8394a" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="298" y="206" font-size="9.5" fill="#e8394a" font-family="sans-serif">−DI (força baixa)</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> Os 3 Componentes do ADX — Entendendo a Mecânica</h2>
<p>O indicador ADX completo tem 3 linhas, cada uma com função distinta:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Linha</th><th>O Que É</th><th>Como Ler</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">ADX (linha principal)</td>
    <td>Média da força direcional — não tem direção, apenas magnitude</td>
    <td>Quanto mais alto, mais forte a tendência. &gt; 25 = tendência real. &lt; 20 = mercado lateralizado.</td>
  </tr>
  <tr>
    <td class="td-em td-green">+DI (linha verde)</td>
    <td>Directional Indicator positivo — força dos movimentos de alta</td>
    <td>+DI acima do −DI = compradores mais fortes. Cruzamento +DI acima = momentum bullish crescente.</td>
  </tr>
  <tr>
    <td class="td-em td-red">−DI (linha vermelha)</td>
    <td>Directional Indicator negativo — força dos movimentos de baixa</td>
    <td>−DI acima do +DI = vendedores mais fortes. Cruzamento −DI acima = momentum bearish crescente.</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-info">
  <div class="callout-title">💡 Como Usar as 3 Linhas Juntas</div>
  <p>
  <strong>Melhor cenário para long:</strong> ADX &gt; 25 subindo + +DI acima de −DI + HTF BULL = tendência de alta forte e acelerando.<br>
  <strong>Sinal de inversão antecipado:</strong> ADX alto + cruzamento de −DI acima de +DI = força mudando para os vendedores — considerar sair de longs.<br>
  <strong>Mercado inadequado:</strong> ADX &lt; 20 com +DI e −DI entrelaçados = lateralização sem direção. Qualquer entrada tem baixa probabilidade.
  </p>
</div>

<h2><span class="h2-num">3</span> As 5 Faixas do ADX — Manual de Interpretação Completo</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>ADX</th><th>Força da Tendência</th><th>Ambiente de Mercado</th><th>Setup Recomendado</th><th>Sizing TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em" style="color:var(--gray2)">&lt; 15</td>
    <td style="color:var(--gray2)">Tendência inexistente</td>
    <td>Mercado em choppy mode. Máximas e mínimas aleatórias. Indicadores de tendência não funcionam.</td>
    <td class="td-red">NÃO operar com sistema de tendência. Apenas range trade puro ou ficar fora.</td>
    <td class="td-red">0% — aguardar</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">15 – 20</td>
    <td class="td-cyan">Tendência emergindo (ou morrendo)</td>
    <td>Transição entre lateralização e tendência. Pode ser início de novo movimento ou fim de um.</td>
    <td class="td-gold">Observação apenas. Se cruzando 20 de baixo para cima com DI confirmando = entrar com sizing reduzido.</td>
    <td class="td-gold">30% do normal</td>
  </tr>
  <tr>
    <td class="td-em td-gold">20 – 30</td>
    <td class="td-gold">Tendência fraca a moderada</td>
    <td>Tendência estabelecida mas sem grande força. Pullbacks frequentes e profundos. Correções de 50%+ comuns.</td>
    <td>Setups válidos com confirmação de outros indicadores. Stop mais largo — correções mais profundas.</td>
    <td class="td-gold">60–70% do normal</td>
  </tr>
  <tr>
    <td class="td-em td-bright">30 – 50</td>
    <td class="td-bright">Tendência forte</td>
    <td>Tendência clara e consistente. Pullbacks menores. Melhor ambiente para operar seguindo a tendência.</td>
    <td class="td-green">Setup ideal. Opera na direção do HTF Trend com confiança. Trailing stop ativo.</td>
    <td class="td-green">100% do normal</td>
  </tr>
  <tr>
    <td class="td-em td-gold">&gt; 50</td>
    <td class="td-gold">Tendência muito forte — atenção</td>
    <td>Movimento direcional extremamente forte. Comum em crises, notícias de impacto ou início de nova tendência primária.</td>
    <td class="td-gold">Opera na direção mas com atenção a reversões abruptas. ADX acima de 60 frequentemente precede exaustão e virada.</td>
    <td>80% do normal — stop mais apertado</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> ADX Multi-Timeframe — A Leitura que o STMP Usa</h2>
<p>No método TMP, o ADX é lido em <strong>três timeframes simultâneos</strong>. A leitura cruzada é muito mais poderosa do que qualquer timeframe isolado:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Combinação TFs</th><th>Leitura</th><th>Implicação</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-green">Daily &gt; 30 BULL + 4H &gt; 25 BULL + 1H qualquer BULL</td>
    <td class="td-green">Tendência de alta forte em todos os TFs</td>
    <td class="td-green">Melhor ambiente possível para longs. Score STMP alto garantido nessa componente. Sizing máximo.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Daily &gt; 30 BEAR + 4H &gt; 25 BEAR + 1H BEAR</td>
    <td class="td-red">Tendência de baixa forte em todos os TFs</td>
    <td class="td-red">Pior ambiente possível para longs. Exatamente o cenário XRP 23/02/2026. Longs apenas com sizing reduzido 40% e todos os outros filtros ativos.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Daily &gt; 25 BEAR + 4H &lt; 20 + 1H &lt; 20</td>
    <td class="td-gold">Tendência baixista diária com TFs menores lateralizando</td>
    <td class="td-gold">Potencial de fundo. TFs menores perdendo momentum bearish. Monitorar para entrada contra-tendência.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Daily &lt; 20 + 4H &lt; 20 + 1H &lt; 20</td>
    <td class="td-cyan">Lateralização em todos os TFs</td>
    <td class="td-cyan">Range trade apenas. Sistema de tendência não aplicável. Aguardar ADX retomar &gt; 20 com DI confirmando.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> Estratégias com ADX — Aplicação Prática</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">▶</div>
  <div class="rule-content">
    <h4>Estratégia 1 — Entrada no Início de Tendência (ADX 20 → 30)</h4>
    <p><strong>Quando usar:</strong> ADX cruzando acima de 20 de baixo para cima + +DI ou −DI cruzando com gap crescente + HTF Trend confirmando.<br>
    <strong>Vantagem:</strong> Melhor R:R — você entra no início do movimento, com todo o potencial à frente.<br>
    <strong>Desvantagem:</strong> Mais falsos sinais — nem todo cruzamento de 20 vira tendência forte.<br>
    <strong>Sizing:</strong> 70% do normal com aumento progressivo conforme ADX sobe e confirma.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">⏸</div>
  <div class="rule-content">
    <h4>Estratégia 2 — Pullback em Tendência Forte (ADX 30–50)</h4>
    <p><strong>Quando usar:</strong> ADX entre 30–50 + HTF Trend firme + preço corrigindo para S/R ou Fibonacci 38.2–61.8%.<br>
    <strong>Vantagem:</strong> Alta probabilidade — mercado está provadamente em tendência, você entra no pullback saudável.<br>
    <strong>Desvantagem:</strong> Correção pode ser mais profunda do que o esperado se ADX cair.<br>
    <strong>Sizing:</strong> 100% do normal. Este é o setup ideal do método TMP.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">⚡</div>
  <div class="rule-content">
    <h4>Estratégia 3 — Contra-Tendência em ADX Caindo de &gt; 40</h4>
    <p><strong>Quando usar:</strong> ADX estava &gt; 40 e agora está caindo + DI cruzando + preço em suporte confluente de alta importância.<br>
    <strong>Vantagem:</strong> Excelente R:R quando correto — preço normalmente corre bastante no sentido contrário à tendência exausta.<br>
    <strong>Desvantagem:</strong> Alto risco — pode ser apenas pullback antes de continuação. Exige confirmação máxima de outros filtros.<br>
    <strong>Sizing:</strong> 40–60% do normal. Stop rigoroso.</p>
  </div>
</div>

<h2><span class="h2-num">6</span> Análise ADX Real — XRP 23/02/2026 em Detalhe</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Leitura ADX Multi-Timeframe do Dia</div>
  <p>
  <strong>Daily ADX: 40.6 BEAR</strong><br>
  Downtrend muito forte no timeframe principal. +DI claramente abaixo de −DI com gap grande. Tendência de queda desde $3.66 bem estabelecida e ainda acelerada. Contraindicação clara para longs de alta convicção.<br><br>
  <strong>4H ADX: 23.4 BEAR</strong><br>
  Tendência bearish presente mas fraca no intermediário. ADX próximo de 20 e caindo — sinal de enfraquecimento do downtrend no prazo de dias. +DI e −DI começando a convergir. Sinal de potencial exaustão no 4H.<br><br>
  <strong>1H ADX: 33.3 — ambíguo (HTF lendo BULL)</strong><br>
  O HTF Trend do 1H marcando BULL enquanto ADX = 33.3 é um sinal interessante: pode ser início de micro-pullback bearish (o 1H deu "bull" por bounce técnico de curto prazo dentro do downtrend maior). Não confundir com reversão estrutural.<br><br>
  <strong>Interpretação consolidada:</strong><br>
  A divergência entre Daily (ADX 40.6 BEAR — tendência forte) e 4H (ADX 23.4 BEAR — tendência enfraquecendo) é o sinal mais importante. Em análise multi-timeframe, quando o TF maior ainda tem força mas o TF intermediário está perdendo momentum, estamos na zona onde bounces técnicos acontecem — sem necessariamente significar reversão.<br><br>
  <strong>Para o trade:</strong> ADX contribui com score NEUTRO/PARCIAL no STMP — não reprova, mas também não aprova com convicção. A combinação correta seria Daily ADX caindo de 40 para &lt; 30 + 4H ADX virando para &lt; 20 + HTF Trend 4H mudando para BULL. Quando isso acontecer, o Filtro 3 do STMP será aprovado e o setup long ganhará validade significativa.
  </p>
</div>

<div class="callout callout-success">
  <div class="callout-title">🎯 O Que Monitorar nos Próximos Dias (Pós-Análise)</div>
  <p>Para o setup long em XRP se qualificar no ADX, monitorar:<br>
  1. Daily ADX caindo abaixo de 35 — downtrend perdendo força<br>
  2. 4H ADX caindo abaixo de 20 — mercado intermediário perdendo direcionalidade bearish<br>
  3. Cruzamento de +DI acima de −DI no 4H — primeiros compradores ganhando força<br>
  4. 1H ADX subindo acima de 25 com HTF BULL confirmado — não apenas bounce, mas momentum real<br><br>
  Quando 3 de 4 condições estiverem presentes, o Filtro 3 do STMP estará aprovado.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a distinção fundamental: ADX mede FORÇA, não direção</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei ler as 3 linhas: ADX + +DI + −DI em conjunto</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo as 5 faixas: &lt;15 choppy / 15–20 emergindo / 20–30 fraca / 30–50 forte / &gt;50 muito forte</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei aplicar as 3 estratégias ADX: início de tendência / pullback / contra-tendência exausta</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendi a leitura multi-TF de XRP e a divergência Daily (40.6) vs 4H (23.4 caindo)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei as 4 condições a monitorar para o ADX qualificar o setup long em XRP</div></div>
</div>`,

  "rsi-macd": `
<div class="blockquote">
  <div class="blockquote-text">O RSI não diz quando comprar. Diz quando o mercado está exausto. O MACD não diz onde o preço vai. Diz se o momentum está a seu favor. Combinados, formam o detector de oportunidades mais poderoso do método.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> RSI — O Termômetro do Momentum</h2>
<p>O RSI (Relative Strength Index), criado por J. Welles Wilder em 1978, mede a velocidade e magnitude das mudanças de preço em uma escala de 0 a 100. No método TMP, o RSI tem duas funções principais: <strong>identificar zonas de sobrecompra/sobrevenda</strong> e — ainda mais poderoso — <strong>detectar divergências</strong> que antecedem reversões.</p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">14</div><div class="kpi-label">Período padrão recomendado TMP</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">&lt; 35</div><div class="kpi-label">Zona sobrevendida — potencial long</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">50</div><div class="kpi-label">Linha da vida — acima = bullish</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">&gt; 65</div><div class="kpi-label">Zona sobrecomprada — cautela com longs</div></div>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">ADX — Faixas de Força e Leitura de Tendência</div>
  <svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Chart bg -->
    <rect x="10" y="10" width="700" height="190" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Strength bands (horizontal) -->
    <!-- >50 band -->
    <rect x="10" y="10" width="700" height="28" rx="3" fill="#e8394a" opacity=".08"/>
    <text x="18" y="28" font-size="10" fill="#e8394a" font-family="monospace" font-weight="700">&gt;50 — Muito Forte (atenção reversão)</text>

    <!-- 30-50 band -->
    <rect x="10" y="38" width="700" height="40" rx="0" fill="#00d68f" opacity=".06"/>
    <text x="18" y="55" font-size="10" fill="#00d68f" font-family="monospace" font-weight="700">30–50 — Tendência Forte (sizing 100%)</text>

    <!-- 20-30 band -->
    <rect x="10" y="78" width="700" height="40" rx="0" fill="#f0a500" opacity=".05"/>
    <text x="18" y="95" font-size="10" fill="#f0a500" font-family="monospace">20–30 — Tendência Moderada (60–70%)</text>

    <!-- 15-20 band -->
    <rect x="10" y="118" width="700" height="30" rx="0" fill="#607d8b" opacity=".08"/>
    <text x="18" y="136" font-size="10" fill="#607d8b" font-family="monospace">15–20 — Emergindo (30% sizing)</text>

    <!-- <15 band -->
    <rect x="10" y="148" width="700" height="52" rx="0" fill="#e8394a" opacity=".05"/>
    <text x="18" y="168" font-size="10" fill="#e8394a" font-family="monospace">&#60;15 — Choppy (NÃO OPERAR)</text>

    <!-- ADX line (value rises then falls) -->
    <polyline points="30,190 70,180 110,165 150,148 190,130 230,105 270,75 310,52 340,38 370,45 400,60 430,72 470,88 510,105 550,120 580,135 610,148 640,158 670,165 695,170"
      fill="none" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- +DI line -->
    <polyline points="30,185 80,172 130,158 180,138 220,115 260,88 300,62 340,45 380,48 420,58 460,72 500,88 540,105 580,120 620,135 660,148 695,158"
      fill="none" stroke="#00d68f" stroke-width="1.5" opacity=".8" stroke-dasharray="4,2"/>

    <!-- -DI line -->
    <polyline points="30,172 80,165 130,158 180,155 220,150 260,145 300,145 340,148 380,142 420,132 460,122 500,112 540,105 580,100 620,96 660,92 695,90"
      fill="none" stroke="#e8394a" stroke-width="1.5" opacity=".8" stroke-dasharray="4,2"/>

    <!-- Annotation: peak -->
    <circle cx="340" cy="38" r="5" fill="none" stroke="#f0a500" stroke-width="1.5"/>
    <text x="295" y="33" font-size="9" fill="#f0a500" font-family="sans-serif">ADX 40.6 (XRP)</text>

    <!-- Key threshold lines -->
    <line x1="10" y1="38" x2="710" y2="38" stroke="#e8394a" stroke-width="0.7" opacity=".4"/>
    <line x1="10" y1="78" x2="710" y2="78" stroke="#00d68f" stroke-width="0.7" opacity=".4"/>
    <line x1="10" y1="118" x2="710" y2="118" stroke="#f0a500" stroke-width="0.7" opacity=".4"/>
    <line x1="10" y1="148" x2="710" y2="148" stroke="#607d8b" stroke-width="0.7" opacity=".4"/>

    <!-- Y-axis labels -->
    <text x="695" y="36" font-size="9" fill="#e8394a" font-family="monospace" text-anchor="end">50</text>
    <text x="695" y="76" font-size="9" fill="#00d68f" font-family="monospace" text-anchor="end">30</text>
    <text x="695" y="116" font-size="9" fill="#f0a500" font-family="monospace" text-anchor="end">20</text>
    <text x="695" y="146" font-size="9" fill="#607d8b" font-family="monospace" text-anchor="end">15</text>

    <!-- Legend -->
    <line x1="18" y1="202" x2="42" y2="202" stroke="#f0a500" stroke-width="2.5"/>
    <text x="46" y="206" font-size="9.5" fill="#f0a500" font-family="sans-serif">ADX (força)</text>
    <line x1="130" y1="202" x2="154" y2="202" stroke="#00d68f" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="158" y="206" font-size="9.5" fill="#00d68f" font-family="sans-serif">+DI (força alta)</text>
    <line x1="270" y1="202" x2="294" y2="202" stroke="#e8394a" stroke-width="1.5" stroke-dasharray="4,2"/>
    <text x="298" y="206" font-size="9.5" fill="#e8394a" font-family="sans-serif">−DI (força baixa)</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> Leitura Completa do RSI — 5 Zonas</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>RSI</th><th>Zona</th><th>Psicologia do Mercado</th><th>Ação TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">0–25</td>
    <td class="td-red">Sobrevendido Extremo</td>
    <td>Capitulação total. Vendedores exaustos. Comum em eventos de crash.</td>
    <td class="td-green">Zona de compra contrária. Aguardar vela de reversão + confirmação. Sizing reduzido pela volatilidade.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:#e67e22">25–40</td>
    <td style="color:#e67e22">Sobrevendido</td>
    <td>Pressão vendedora dominante mas momentum bearish perdendo força.</td>
    <td>Zona de entrada para longs com contexto técnico favorável. Melhor R:R do ciclo bearish.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">40–60</td>
    <td class="td-cyan">Zona Neutra</td>
    <td>Equilíbrio entre compradores e vendedores. Indecisão.</td>
    <td>Aguardar rompimento da zona neutra para definir viés. Menor confiabilidade de setups aqui.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">60–75</td>
    <td class="td-gold">Sobrecomprado</td>
    <td>Momentum bullish forte. Compradores no controle. Tendência de alta em andamento.</td>
    <td>Gerenciar longs abertos com trailing stop. Não abrir novas posições compradas aqui sem correção.</td>
  </tr>
  <tr>
    <td class="td-em td-red">75–100</td>
    <td class="td-red">Sobrecomprado Extremo</td>
    <td>Euforia. Máximo desequilíbrio. Frequentemente precede correções fortes.</td>
    <td class="td-red">NUNCA abrir longs aqui. Realizar lucros parciais. Preparar trailing stop apertado.</td>
  </tr>
</tbody>
</table>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">RSI — Zonas e Divergência Bullish</div>
  <svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Price panel -->
    <text x="18" y="22" font-size="10" fill="#607d8b" font-family="sans-serif" font-weight="700">PREÇO</text>
    <rect x="10" y="28" width="700" height="90" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Price path — downtrend with two lows (lower low in price) -->
    <polyline points="30,50 80,58 110,65 140,75 160,68 190,80 210,72 240,88 260,80 290,95 310,88 340,105 360,98 385,115"
      fill="none" stroke="#3d8fef" stroke-width="2" stroke-linejoin="round"/>

    <!-- Lower Low 1 in price -->
    <circle cx="340" cy="105" r="5" fill="#e8394a"/>
    <text x="330" y="100" font-size="9" fill="#e8394a" font-family="monospace">LL1</text>

    <!-- Lower Low 2 in price (LOWER) -->
    <circle cx="385" cy="115" r="5" fill="#e8394a"/>
    <text x="375" y="110" font-size="9" fill="#e8394a" font-family="monospace">LL2</text>

    <!-- Divergence arrow on price -->
    <line x1="340" y1="105" x2="385" y2="115" stroke="#e8394a" stroke-width="1.5" stroke-dasharray="4,3" opacity=".7"/>
    <text x="352" y="128" font-size="9" fill="#e8394a" font-family="sans-serif">preço faz LL mais baixo</text>

    <!-- RSI panel -->
    <text x="18" y="142" font-size="10" fill="#607d8b" font-family="sans-serif" font-weight="700">RSI (14)</text>
    <rect x="10" y="148" width="700" height="82" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- RSI zones -->
    <rect x="10" y="148" width="700" height="16" fill="#e8394a" opacity=".06" rx="3"/><!-- overbought -->
    <rect x="10" y="214" width="700" height="16" fill="#00d68f" opacity=".07" rx="3"/><!-- oversold -->

    <!-- RSI threshold lines -->
    <line x1="10" y1="164" x2="710" y2="164" stroke="#e8394a" stroke-width="1" stroke-dasharray="5,3" opacity=".5"/>
    <text x="15" y="161" font-size="9" fill="#e8394a" font-family="monospace">70</text>
    <line x1="10" y1="191" x2="710" y2="191" stroke="#607d8b" stroke-width="1" stroke-dasharray="5,3" opacity=".4"/>
    <text x="15" y="188" font-size="9" fill="#607d8b" font-family="monospace">50</text>
    <line x1="10" y1="214" x2="710" y2="214" stroke="#00d68f" stroke-width="1" stroke-dasharray="5,3" opacity=".5"/>
    <text x="15" y="228" font-size="9" fill="#00d68f" font-family="monospace">30</text>

    <!-- RSI path — downtrend but making HIGHER LOW (divergence) -->
    <polyline points="30,172 80,178 110,185 140,194 160,188 190,198 210,192 240,208 260,202 290,218 310,212 340,222 360,216 385,212"
      fill="none" stroke="#9c27b0" stroke-width="2" stroke-linejoin="round"/>

    <!-- RSI Low 1 -->
    <circle cx="340" cy="222" r="5" fill="#00d68f"/>
    <text x="330" y="235" font-size="9" fill="#00d68f" font-family="monospace">HL1</text>

    <!-- RSI Low 2 (HIGHER — divergence!) -->
    <circle cx="385" cy="212" r="5" fill="#00d68f"/>
    <text x="375" y="228" font-size="9" fill="#00d68f" font-family="monospace">HL2</text>

    <!-- Divergence arrow on RSI — going UP -->
    <line x1="340" y1="222" x2="385" y2="212" stroke="#00d68f" stroke-width="2" stroke-dasharray="4,2"/>

    <!-- DIVERGÊNCIA label -->
    <rect x="430" y="188" width="168" height="38" rx="6" fill="#00d68f" opacity=".12" stroke="#00d68f" stroke-width="1"/>
    <text x="514" y="204" text-anchor="middle" font-size="10.5" fill="#00d68f" font-family="sans-serif" font-weight="700">DIVERGÊNCIA BULLISH</text>
    <text x="514" y="218" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">RSI faz mínima MAIOR</text>

    <!-- Connector lines for divergence explanation -->
    <line x1="386" y1="115" x2="430" y2="196" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,3" opacity=".5"/>
    <line x1="386" y1="212" x2="430" y2="210" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,3" opacity=".5"/>
  </svg>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">RSI — Zonas e Divergência Bullish</div>
  <svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Price panel -->
    <text x="18" y="22" font-size="10" fill="#607d8b" font-family="sans-serif" font-weight="700">PREÇO</text>
    <rect x="10" y="28" width="700" height="90" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Price path — downtrend with two lows (lower low in price) -->
    <polyline points="30,50 80,58 110,65 140,75 160,68 190,80 210,72 240,88 260,80 290,95 310,88 340,105 360,98 385,115"
      fill="none" stroke="#3d8fef" stroke-width="2" stroke-linejoin="round"/>

    <!-- Lower Low 1 in price -->
    <circle cx="340" cy="105" r="5" fill="#e8394a"/>
    <text x="330" y="100" font-size="9" fill="#e8394a" font-family="monospace">LL1</text>

    <!-- Lower Low 2 in price (LOWER) -->
    <circle cx="385" cy="115" r="5" fill="#e8394a"/>
    <text x="375" y="110" font-size="9" fill="#e8394a" font-family="monospace">LL2</text>

    <!-- Divergence arrow on price -->
    <line x1="340" y1="105" x2="385" y2="115" stroke="#e8394a" stroke-width="1.5" stroke-dasharray="4,3" opacity=".7"/>
    <text x="352" y="128" font-size="9" fill="#e8394a" font-family="sans-serif">preço faz LL mais baixo</text>

    <!-- RSI panel -->
    <text x="18" y="142" font-size="10" fill="#607d8b" font-family="sans-serif" font-weight="700">RSI (14)</text>
    <rect x="10" y="148" width="700" height="82" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- RSI zones -->
    <rect x="10" y="148" width="700" height="16" fill="#e8394a" opacity=".06" rx="3"/><!-- overbought -->
    <rect x="10" y="214" width="700" height="16" fill="#00d68f" opacity=".07" rx="3"/><!-- oversold -->

    <!-- RSI threshold lines -->
    <line x1="10" y1="164" x2="710" y2="164" stroke="#e8394a" stroke-width="1" stroke-dasharray="5,3" opacity=".5"/>
    <text x="15" y="161" font-size="9" fill="#e8394a" font-family="monospace">70</text>
    <line x1="10" y1="191" x2="710" y2="191" stroke="#607d8b" stroke-width="1" stroke-dasharray="5,3" opacity=".4"/>
    <text x="15" y="188" font-size="9" fill="#607d8b" font-family="monospace">50</text>
    <line x1="10" y1="214" x2="710" y2="214" stroke="#00d68f" stroke-width="1" stroke-dasharray="5,3" opacity=".5"/>
    <text x="15" y="228" font-size="9" fill="#00d68f" font-family="monospace">30</text>

    <!-- RSI path — downtrend but making HIGHER LOW (divergence) -->
    <polyline points="30,172 80,178 110,185 140,194 160,188 190,198 210,192 240,208 260,202 290,218 310,212 340,222 360,216 385,212"
      fill="none" stroke="#9c27b0" stroke-width="2" stroke-linejoin="round"/>

    <!-- RSI Low 1 -->
    <circle cx="340" cy="222" r="5" fill="#00d68f"/>
    <text x="330" y="235" font-size="9" fill="#00d68f" font-family="monospace">HL1</text>

    <!-- RSI Low 2 (HIGHER — divergence!) -->
    <circle cx="385" cy="212" r="5" fill="#00d68f"/>
    <text x="375" y="228" font-size="9" fill="#00d68f" font-family="monospace">HL2</text>

    <!-- Divergence arrow on RSI — going UP -->
    <line x1="340" y1="222" x2="385" y2="212" stroke="#00d68f" stroke-width="2" stroke-dasharray="4,2"/>

    <!-- DIVERGÊNCIA label -->
    <rect x="430" y="188" width="168" height="38" rx="6" fill="#00d68f" opacity=".12" stroke="#00d68f" stroke-width="1"/>
    <text x="514" y="204" text-anchor="middle" font-size="10.5" fill="#00d68f" font-family="sans-serif" font-weight="700">DIVERGÊNCIA BULLISH</text>
    <text x="514" y="218" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">RSI faz mínima MAIOR</text>

    <!-- Connector lines for divergence explanation -->
    <line x1="386" y1="115" x2="430" y2="196" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,3" opacity=".5"/>
    <line x1="386" y1="212" x2="430" y2="210" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,3" opacity=".5"/>
  </svg>
</div>

<h2><span class="h2-num">3</span> Divergências de RSI — O Sinal Mais Poderoso</h2>
<p>A divergência acontece quando o preço e o RSI se movem em direções opostas. É o sinal mais antecipado de reversão disponível — pode aparecer 5 a 15 candles antes da virada de preço.</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">↗</div>
  <div class="rule-content">
    <h4>Divergência Bullish — O Mais Importante no TMP</h4>
    <p><strong>O que é:</strong> Preço faz mínima mais baixa (LL), mas RSI faz mínima mais alta (HL).<br>
    <strong>O que indica:</strong> Mesmo com o preço caindo para uma nova mínima, os vendedores precisaram de menos força para fazer isso — exaustão vendedora. Momentum baixista perdendo força.<br>
    <strong>Contexto ideal:</strong> Em zona de suporte confluente + Fibonacci 61.8–78.6% + F&G em medo extremo.<br>
    <strong>Confirmação:</strong> Aguardar fechamento do candle de divergência + vela de reversão no próximo período.<br>
    <strong>Para XRP 23/02/2026:</strong> RSI no 1H mostrando divergência bullish na zona $1.30–$1.35 — mínima de preço mais baixa vs RSI fazendo mínima mais alta. Um dos sinais mais relevantes do dia.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">↘</div>
  <div class="rule-content">
    <h4>Divergência Bearish — Alerta de Topo</h4>
    <p><strong>O que é:</strong> Preço faz máxima mais alta (HH), mas RSI faz máxima mais baixa (LH).<br>
    <strong>O que indica:</strong> Mesmo com o preço atingindo nova máxima, os compradores precisaram de mais esforço e o momentum está se esgotando. Alta perdendo força.<br>
    <strong>Contexto ideal:</strong> Em zona de resistência confluente + Fibonacci 61.8% de extensão + F&G em ganância extrema.<br>
    <strong>Para XRP jan/2026:</strong> Divergência bearish nos rallies próximo de $3.66 antecipou o topo e a reversão de −63%.</p>
  </div>
</div>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Armadilhas das Divergências — Erros Comuns</div>
  <p>
  <strong>Divergência sem contexto de S/R:</strong> No meio de uma tendência forte, divergências são frequentemente "falsas" — o preço continua na mesma direção. Sempre exija confluência de suporte/resistência.<br><br>
  <strong>Antecipar demais:</strong> Divergência não significa "entra agora". Significa "fique atento". O preço pode continuar caindo por vários candles antes de reverter. Aguardar o candle de confirmação é obrigatório.<br><br>
  <strong>Divergência escondida (hidden divergence):</strong> RSI faz mínima mais baixa enquanto preço faz mínima mais alta = continuação da tendência de alta. Divergência na direção oposta = sinal de continuação, não de reversão.
  </p>
</div>

<h2><span class="h2-num">4</span> MACD — Mapa do Momentum</h2>
<p>O MACD (Moving Average Convergence Divergence) mede a relação entre duas médias móveis exponenciais (geralmente 12 e 26 períodos) para mostrar se o momentum está acelerando ou desacelerando. No método TMP, são monitoradas três informações do MACD:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Componente MACD</th><th>O Que É</th><th>Sinal Bullish</th><th>Sinal Bearish</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-bright">Linha MACD (azul)</td>
    <td>Diferença entre EMA 12 e EMA 26</td>
    <td class="td-green">Acima da linha de sinal + subindo</td>
    <td class="td-red">Abaixo da linha de sinal + caindo</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Linha de Sinal (laranja)</td>
    <td>EMA 9 da linha MACD — suavização</td>
    <td class="td-green">MACD cruzando acima = cruzamento bullish</td>
    <td class="td-red">MACD cruzando abaixo = cruzamento bearish</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Histograma</td>
    <td>Diferença entre MACD e linha de sinal</td>
    <td class="td-green">Barras positivas crescendo = momentum bullish acelerando</td>
    <td class="td-red">Barras negativas crescendo = momentum bearish acelerando</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> Os 4 Sinais de MACD Que o TMP Usa</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Cruzamento Bullish — Entrada na Tendência</h4>
      <p>MACD cruza acima da linha de sinal + histograma vira positivo. <strong>Mais confiável quando acontece abaixo da linha zero</strong> (após downtrend). Menos confiável em mercados laterais onde gera muitos falsos sinais.</p>
      <p><strong>Como usar no TMP:</strong> Confirmar que o cruzamento ocorre em zona de suporte + RSI não sobrecomprado. Não entrar apenas pelo cruzamento — usar como confirmação de momentum.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Histograma Crescendo — Momentum Acelerando</h4>
      <p>Barras do histograma aumentando progressivamente indica que o momentum na direção atual está se fortalecendo. <strong>O momento ideal para entrada é quando o histograma está crescendo mas ainda pequeno</strong> — você pega o início do impulso antes de ficar "caro".</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Divergência de MACD — Semelhante ao RSI</h4>
      <p>Preço faz nova mínima mas histograma do MACD faz mínima menos negativa = divergência bullish. Quando combina com divergência de RSI ao mesmo tempo, o sinal se torna muito mais poderoso — dupla divergência é um dos setups mais raros e confiáveis.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>MACD Acima/Abaixo de Zero — Regime de Mercado</h4>
      <p>MACD acima da linha zero = EMA 12 acima da EMA 26 = bull regime de médio prazo. MACD abaixo de zero = bear regime. <strong>Regra TMP:</strong> Longs com MACD abaixo de zero são contra-tendência de médio prazo — exigem sizing reduzido 20%.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">6</span> RSI + MACD Combinados — A Leitura Sinérgica</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>RSI</th><th>MACD</th><th>Leitura Combinada</th><th>Ação TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-green">&lt; 35 + divergência bullish</td>
    <td class="td-green">Cruzamento bullish ou histograma virando positivo</td>
    <td class="td-green td-em">MÁXIMA CONFLUÊNCIA BULLISH</td>
    <td>Setup de entrada de alta convicção. Score STMP alto. Sizing máximo permitido pelo risco.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">&lt; 40 sobrevendido</td>
    <td class="td-gold">MACD ainda caindo mas histograma desacelerando</td>
    <td class="td-gold">BULLISH EM CONSTRUÇÃO</td>
    <td>Aguardar cruzamento MACD para confirmar. RSI dá o alerta, MACD dá a confirmação.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">50–65 neutro-bullish</td>
    <td class="td-red">Cruzamento bearish recente</td>
    <td class="td-red">CONFLITO — momentum perdendo força</td>
    <td>Cautela. Não abrir long. O MACD está avisando que a alta pode não continuar.</td>
  </tr>
  <tr>
    <td class="td-em td-red">&gt; 70 sobrecomprado</td>
    <td class="td-red">Divergência bearish no histograma</td>
    <td class="td-red td-em">MÁXIMA CONFLUÊNCIA BEARISH</td>
    <td>Sair de longs existentes. Considerar short com confirmação de S/R de resistência.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">7</span> RSI + MACD em XRP 23/02/2026 — Leitura Real</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Análise Completa do Dia</div>
  <p>
  <strong>RSI 1H: ~28</strong> — Sobrevendido extremo. Divergência bullish confirmada: preço fez nova mínima em ~$1.33 mas RSI fez mínima mais alta do que na mínima anterior de $1.30. Sinal positivo claro.<br><br>
  <strong>RSI 4H: ~35</strong> — Zona sobrevendida. Sem divergência clara no 4H ainda — as mínimas do RSI estão acompanhando as mínimas do preço. Sinal neutro no 4H.<br><br>
  <strong>RSI Daily: ~30</strong> — Sobrevendido no timeframe principal. Não há divergência clara no Daily, mas nível muito próximo do piso histórico para este ativo.<br><br>
  <strong>MACD 1H:</strong> Ainda abaixo de zero, mas histograma desacelerando (barras negativas ficando menores). Sem cruzamento bullish ainda — mas preparando.<br><br>
  <strong>MACD 4H:</strong> Abaixo de zero com histograma ainda negativo e sem sinal de reversão iminente.<br><br>
  <strong>Síntese para o STMP (Filtro 4):</strong> RSI fornece sinal positivo (sobrevendido + divergência no 1H). MACD ainda não confirma. Score: RSI ✓ / MACD ⚠️. Filtro 4 aprovado parcialmente — aguardar cruzamento bullish do MACD para aumentar convicção.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo as 5 zonas do RSI com as ações TMP para cada uma</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei identificar divergência bullish e bearish no RSI com precisão</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 3 componentes do MACD: linha, sinal e histograma</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 4 sinais de MACD que o TMP usa: cruzamento, histograma, divergência, regime</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo a leitura sinérgica RSI + MACD combinados em 4 cenários</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Analisei RSI e MACD de XRP 23/02/2026 e entendi o score parcial do Filtro 4</div></div>
</div>`,

  "ichimoku": `
<div class="blockquote">
  <div class="blockquote-text">O Ichimoku não é um indicador — é um sistema completo de análise de mercado criado para revelar suporte, resistência, momentum e tendência em uma única visão. Aqueles que o dominam veem o mercado de uma dimensão que a maioria não consegue acessar.</div>
  <div class="blockquote-author">— Goichi Hosoda · Ichimoku Kinko Hyo, 1969</div>
</div>

<h2><span class="h2-num">1</span> Ichimoku — O Sistema Completo em Uma Visão</h2>
<p>O Ichimoku Kinko Hyo (literalmente "gráfico de equilíbrio em um olhar") foi desenvolvido pelo jornalista japonês Goichi Hosoda ao longo de 20 anos de pesquisa, publicado em 1969. É um dos poucos sistemas de indicadores que integra simultaneamente <strong>tendência, momentum, suporte, resistência e timing</strong> em uma única visualização.</p>
<p>No método TMP, o Ichimoku serve principalmente como <strong>Filtro 5 de timing</strong> — ele confirma se o momento de entrada dentro da zona identificada pelos filtros anteriores é correto. A Nuvem (Kumo) é sua ferramenta mais poderosa.</p>

<div class="kpi-row kpi-row-3">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">5</div><div class="kpi-label">Componentes que formam o sistema</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">Kumo</div><div class="kpi-label">A Nuvem — componente mais importante</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">26</div><div class="kpi-label">Períodos projetados à frente pela nuvem</div></div>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Ichimoku — Os 5 Componentes e a Nuvem</div>
  <svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Chart area -->
    <rect x="10" y="10" width="700" height="210" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- KUMO (Cloud) filled area between Span A and Span B -->
    <!-- Red cloud (bearish: Span B > Span A) -->
    <polygon points="150,150 200,145 250,148 300,155 350,158 400,152 450,145"
      fill="#e8394a" opacity=".12"/>
    <polygon points="150,100 200,95 250,90 300,88 350,85 400,80 450,75
                     450,145 400,152 350,158 300,155 250,148 200,145 150,150"
      fill="#e8394a" opacity=".07"/>

    <!-- Green cloud (bullish: Span A > Span B) - future projection -->
    <polygon points="450,75 500,65 550,58 600,52 650,48
                     650,90 600,95 550,100 500,100 450,100"
      fill="#00d68f" opacity=".1"/>
    <polygon points="450,75 500,65 550,58 600,52 650,48
                     650,90 600,95 550,100 500,100 450,100"
      fill="#00d68f" opacity=".06"/>

    <!-- Kumo Twist indicator -->
    <circle cx="450" cy="87" r="6" fill="none" stroke="#f0a500" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="455" y="72" font-size="9" fill="#f0a500" font-family="sans-serif">Kumo Twist</text>

    <!-- Span A (green edge of cloud) -->
    <polyline points="150,100 200,95 250,90 300,88 350,85 400,80 450,75 500,65 550,58 600,52 650,48"
      fill="none" stroke="#00d68f" stroke-width="1.5" opacity=".8"/>

    <!-- Span B (red edge of cloud) -->
    <polyline points="150,150 200,145 250,148 300,155 350,158 400,152 450,145 500,100 550,100 600,95 650,90"
      fill="none" stroke="#e8394a" stroke-width="1.5" opacity=".8"/>

    <!-- Kijun-Sen (Base Line - blue, thicker) -->
    <polyline points="30,170 80,165 130,160 180,155 230,148 280,140 330,130 380,115 430,102 480,88 530,78 580,68 640,60"
      fill="none" stroke="#3d8fef" stroke-width="2.2"/>

    <!-- Tenkan-Sen (Conversion Line - red thin) -->
    <polyline points="30,175 60,168 90,155 120,148 150,138 180,128 210,118 240,108 270,98 300,90 330,82 360,74 390,66 420,60 450,54 480,50 510,45 540,42 570,38 610,36 650,34"
      fill="none" stroke="#e8394a" stroke-width="1.5" opacity=".9"/>

    <!-- Price line (above cloud = bullish zone) -->
    <polyline points="550,28 570,24 590,22 610,18 630,16 650,14"
      fill="none" stroke="#f0a500" stroke-width="2.5"/>

    <!-- Chikou Span (lagging, dotted) -->
    <polyline points="30,145 80,140 130,130 180,118 230,108 280,98 330,90 380,82 430,74 480,68 530,60 580,55"
      fill="none" stroke="#9c27b0" stroke-width="1.5" stroke-dasharray="5,3" opacity=".8"/>

    <!-- Vertical "current time" line -->
    <line x1="530" y1="15" x2="530" y2="215" stroke="#607d8b" stroke-width="1" stroke-dasharray="4,4" opacity=".4"/>
    <text x="534" y="25" font-size="9" fill="#607d8b" font-family="sans-serif" opacity=".7">Agora</text>
    <text x="555" y="25" font-size="9" fill="#00d68f" font-family="sans-serif" opacity=".7">← 26 períodos →</text>

    <!-- Zones labels -->
    <text x="620" y="22" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">Preço</text>

    <!-- Legend -->
    <rect x="15" y="170" width="690" height="44" rx="5" fill="#0a1628" opacity=".7"/>
    <!-- Tenkan -->
    <line x1="22" y1="183" x2="45" y2="183" stroke="#e8394a" stroke-width="2"/>
    <text x="48" y="187" font-size="9.5" fill="#e8394a" font-family="sans-serif">Tenkan-Sen (9)</text>
    <!-- Kijun -->
    <line x1="150" y1="183" x2="173" y2="183" stroke="#3d8fef" stroke-width="2.5"/>
    <text x="176" y="187" font-size="9.5" fill="#3d8fef" font-family="sans-serif">Kijun-Sen (26)</text>
    <!-- Span A -->
    <line x1="295" y1="183" x2="318" y2="183" stroke="#00d68f" stroke-width="2"/>
    <text x="321" y="187" font-size="9.5" fill="#00d68f" font-family="sans-serif">Span A</text>
    <!-- Span B -->
    <line x1="390" y1="183" x2="413" y2="183" stroke="#e8394a" stroke-width="1.5" opacity=".8"/>
    <text x="416" y="187" font-size="9.5" fill="#e8394a" font-family="sans-serif">Span B</text>
    <!-- Chikou -->
    <line x1="486" y1="183" x2="509" y2="183" stroke="#9c27b0" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="512" y="187" font-size="9.5" fill="#9c27b0" font-family="sans-serif">Chikou Span</text>

    <!-- Zone labels -->
    <text x="22" y="203" font-size="9" fill="#00d68f" font-family="sans-serif" opacity=".8">🟢 Acima da nuvem = território bullish</text>
    <text x="250" y="203" font-size="9" fill="#f0a500" font-family="sans-serif" opacity=".8">🟡 Dentro da nuvem = indefinição</text>
    <text x="470" y="203" font-size="9" fill="#e8394a" font-family="sans-serif" opacity=".8">🔴 Abaixo da nuvem = território bearish</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> Os 5 Componentes — Anatomia Completa</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Linha</th><th>Nome Japonês</th><th>Cálculo</th><th>O Que Representa</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-bright">Linha de Conversão</td>
    <td>Tenkan-Sen</td>
    <td>(Máx 9 + Mín 9) / 2</td>
    <td>Média do equilíbrio de curto prazo. Funciona como EMA rápida. Cruzamento com Kijun = sinal de momentum.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Linha Base</td>
    <td>Kijun-Sen</td>
    <td>(Máx 26 + Mín 26) / 2</td>
    <td><strong>O suporte/resistência dinâmico mais importante do Ichimoku.</strong> Preço acima = bullish. Abaixo = bearish. Representa o equilíbrio de médio prazo.</td>
  </tr>
  <tr>
    <td class="td-em td-green">Span A (borda superior da nuvem)</td>
    <td>Senkou Span A</td>
    <td>(Tenkan + Kijun) / 2, deslocado 26 à frente</td>
    <td>Borda superior/inferior da nuvem. Quando Span A > Span B = nuvem verde (bullish).</td>
  </tr>
  <tr>
    <td class="td-em td-red">Span B (borda inferior da nuvem)</td>
    <td>Senkou Span B</td>
    <td>(Máx 52 + Mín 52) / 2, deslocado 26 à frente</td>
    <td>Borda mais lenta da nuvem. Calculada sobre 52 períodos = visão de longo prazo do equilíbrio.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Linha de Atraso</td>
    <td>Chikou Span</td>
    <td>Preço de fechamento atual, deslocado 26 atrás</td>
    <td>Confirmação de tendência. Acima dos preços de 26 períodos atrás = bullish. Abaixo = bearish.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> A Nuvem (Kumo) — O Componente Central</h2>
<p>A Nuvem é o elemento mais poderoso do Ichimoku e o que mais usamos no método TMP. Ela funciona simultaneamente como <strong>suporte/resistência dinâmico</strong>, <strong>indicador de tendência</strong> e <strong>projeção futura</strong>.</p>

<div class="steps">
  <div class="step-card" style="border-left: 3px solid var(--green)">
    <div class="step-num" style="background: linear-gradient(135deg,#005C3A,#00d68f)">☁️</div>
    <div class="step-content">
      <h4>Preço ACIMA da Nuvem — Território Bullish</h4>
      <p>O preço está em território de alta. A nuvem funciona como suporte dinâmico. Longs são favorecidos. <strong>Quanto mais distante o preço estiver acima da nuvem, mais forte a tendência de alta.</strong> Pullbacks para testar a borda superior da nuvem são oportunidades de entrada na tendência.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--red)">
    <div class="step-num" style="background: linear-gradient(135deg,#600,#e8394a)">☁️</div>
    <div class="step-content">
      <h4>Preço ABAIXO da Nuvem — Território Bearish</h4>
      <p>O preço está em território de baixa. A nuvem funciona como resistência dinâmica. Shorts são favorecidos. <strong>Para XRP em 23/02/2026:</strong> preço bem abaixo da nuvem em todos os timeframes — bearish confirmado pelo Ichimoku. Qualquer rally vai encontrar a nuvem como resistência.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--gold)">
    <div class="step-num" style="background: linear-gradient(135deg,#7B5C00,#f0a500)">☁️</div>
    <div class="step-content">
      <h4>Preço DENTRO da Nuvem — Zona de Indefinição</h4>
      <p>O preço está em território de transição. Alta turbulência e sinais conflitantes. <strong>Regra TMP:</strong> Não abrir posições novas com preço dentro da nuvem — aguardar o rompimento de qualquer lado antes de agir. A nuvem é uma zona de batalha entre compradores e vendedores.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Os 3 Sinais Principais do Ichimoku no TMP</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">①</div>
  <div class="rule-content">
    <h4>Kumo Twist — O Sinal de Mudança de Tendência</h4>
    <p><strong>O que é:</strong> Quando o Span A e o Span B se cruzam na nuvem futura — a nuvem muda de cor (de verde para vermelho ou vice-versa).<br>
    <strong>Por que importa:</strong> O Kumo Twist é projetado 26 períodos à frente, então você pode ver a tendência mudando <em>antes</em> de acontecer. Uma nuvem que vai virar verde em 26 candles sinaliza que o mercado está se preparando para uma fase bullish.<br>
    <strong>Como usar:</strong> Quando um Kumo Twist de vermelho para verde está próximo + preço em suporte de alta confluência = setup de reversão de alta convicção.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">②</div>
  <div class="rule-content">
    <h4>TK Cross — Sinal de Momentum</h4>
    <p><strong>O que é:</strong> Tenkan-Sen cruzando acima do Kijun-Sen = TK Cross bullish. Abaixo = bearish.<br>
    <strong>Força do sinal:</strong> Depende de onde ocorre. <strong>Acima da nuvem:</strong> forte sinal bullish. <strong>Dentro da nuvem:</strong> neutro — aguardar. <strong>Abaixo da nuvem:</strong> fraco — pode ser apenas bounce temporário.<br>
    <strong>Uso no TMP:</strong> TK Cross bullish acima da nuvem = Filtro 5 totalmente aprovado. Abaixo da nuvem = apenas alerta, não confirmação.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">③</div>
  <div class="rule-content">
    <h4>Chikou Span — Confirmação de Tendência</h4>
    <p><strong>O que é:</strong> A linha de preço deslocada 26 períodos atrás. Quando está acima dos preços históricos de 26 períodos atrás = confirmação bullish. Abaixo = bearish.<br>
    <strong>Uso prático:</strong> Verificar rapidamente: o Chikou está livre (sem interferência de preços acima) ou encontra resistência? Chikou livre = tendência mais limpa. Chikou bloqueado por preços históricos = resistência à frente.<br>
    <strong>Para XRP:</strong> Chikou abaixo dos preços de 26 períodos atrás = bearish confirmado em todos os timeframes.</p>
  </div>
</div>

<h2><span class="h2-num">5</span> Kijun-Sen — O Suporte/Resistência Dinâmico Mais Respeitado</h2>
<p>A Linha Base (Kijun-Sen) é o suporte/resistência dinâmico mais importante do sistema Ichimoku e tem múltiplos usos práticos no TMP:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Uso</th><th>Como Aplicar</th><th>Exemplo</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Stop Loss Dinâmico</td>
    <td>Em trades de tendência, use a Kijun como referência de stop. Se o preço fechar abaixo da Kijun em tendência de alta = saída ou redução de posição.</td>
    <td>Long em XRP: stop abaixo da Kijun do 4H enquanto posição segura.</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Zona de Retorno</td>
    <td>Em tendências fortes, o preço frequentemente faz pullback até a Kijun antes de continuar. A Kijun é o "imã" para o preço após impulsos fortes.</td>
    <td>Após spike de alta, aguardar retorno à Kijun para entrar na tendência com melhor preço.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Filtro de Direção</td>
    <td>Preço acima da Kijun = viés bullish. Abaixo = viés bearish. Mais simples que a nuvem para decisão rápida.</td>
    <td>XRP 23/02/2026: abaixo da Kijun em todos os TFs = viés bearish confirmado.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">6</span> Ichimoku em XRP 23/02/2026 — Análise Completa</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Leitura Ichimoku Multi-Timeframe</div>
  <p>
  <strong>Daily:</strong><br>
  • Preço ($1.3301) MUITO ABAIXO da nuvem (nuvem está entre $1.85–$2.10)<br>
  • Nuvem vermelha (Span B &gt; Span A) — bearish estrutural<br>
  • Kijun Daily em ~$2.15 — resistência dinâmica forte<br>
  • Chikou Span bem abaixo dos preços históricos — tendência bearish confirmada<br>
  • Nuvem futura: ainda vermelha nas próximas 4–6 semanas = sem Kumo Twist bullish próximo<br><br>
  <strong>4H:</strong><br>
  • Preço abaixo da nuvem (nuvem em $1.48–$1.55)<br>
  • Nuvem vermelha, porém menos espessa — sinal de enfraquecimento do bearish<br>
  • Kijun 4H em ~$1.43 — resistência imediata confirmada<br>
  • Kumo Twist potencial: se preço se estabilizar, Span A pode cruzar Span B nas próximas 2 semanas<br><br>
  <strong>1H:</strong><br>
  • Preço tentando se aproximar da nuvem inferior (~$1.38)<br>
  • TK Cross bullish em formação — Tenkan-Sen começando a virar acima do Kijun-Sen<br>
  • Primeiro sinal positivo do Ichimoku no curto prazo<br><br>
  <strong>Score STMP (Filtro 5):</strong> Ichimoku reprovado em Daily e 4H. Aprovado parcialmente no 1H (TK Cross em formação). <strong>Resultado: Filtro 5 não aprovado</strong> — apenas sinal de alerta para monitoramento.
  </p>
</div>

<div class="callout callout-success">
  <div class="callout-title">🎯 O Que Monitorar para o Ichimoku Aprovar</div>
  <p>
  <strong>1H:</strong> TK Cross bullish confirmado (Tenkan acima do Kijun com candle de fechamento) + preço tocando a nuvem inferior do 1H em ~$1.38<br>
  <strong>4H:</strong> Preço rompendo acima da nuvem do 4H em $1.48–$1.55 com volume + Kumo Twist verde se formando<br>
  <strong>Daily:</strong> Preço acima da Kijun Daily (~$2.15) — somente isso significaria reversão estrutural completa<br><br>
  Quando 1H e 4H aprovarem Ichimoku, o Filtro 5 estará ativo e o setup long estará a 1 confirmação da entrada válida.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 5 componentes do Ichimoku e o que cada um representa</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 3 territórios da nuvem: acima (bullish), dentro (indefinição), abaixo (bearish)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei usar o Kumo Twist como sinal antecipado de mudança de tendência</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo o TK Cross e os 3 contextos que determinam sua força</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei usar a Kijun-Sen como stop dinâmico, zona de retorno e filtro de direção</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Analisei Ichimoku de XRP e entendi por que o Filtro 5 não foi aprovado em 23/02/2026</div></div>
</div>`,

  "decisao": `
<div class="blockquote">
  <div class="blockquote-text">A decisão de trade não acontece no momento em que você aperta o botão. Ela acontece nos dias anteriores, na preparação, na definição dos critérios, no processo que você seguiu antes de chegar lá. O botão é apenas a execução de uma decisão já tomada com qualidade.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> O Processo de Decisão — A Culminação das Fases 1 e 2</h2>
<p>Chegamos ao ponto de integração de tudo que você aprendeu. O processo de decisão de trade no método TMP não é uma intuição, um "sentimento" ou um impulso — é um <strong>protocolo estruturado e reproduzível</strong> que você executa da mesma forma em cada trade, independente das emoções do momento.</p>
<p>A grande maioria das perdas no trading não acontece porque o trader fez uma análise errada. Acontece porque o trader <strong>tomou uma decisão sem seguir nenhum processo</strong> — entrou por FOMO, saiu por pânico, moveu o stop por esperança. O processo de decisão é a vacina contra esses comportamentos.</p>

<div class="callout callout-gold">
  <div class="callout-title">⭐ A Regra das 3 Perguntas — Antes de Qualquer Trade</div>
  <p>
  <strong>1. "Qual é o contexto?"</strong> — Fase 1 respondeu. F&G, dominância, notícias, dados on-chain.<br>
  <strong>2. "O que o gráfico está dizendo?"</strong> — Fase 2 respondeu. Estrutura, S/R, Fibonacci, indicadores, STMP.<br>
  <strong>3. "Este trade faz sentido dado o contexto e o gráfico?"</strong> — Esta aula responde.<br><br>
  Se você não consegue responder as 3 perguntas com clareza antes de entrar, não entra.
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Scorecard de Decisão — XRP 23/02/2026</div>
  <svg viewBox="0 0 720 215" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- Score bar visual -->
    <!-- 12 criteria as segmented bar -->
    <rect x="20" y="15" width="680" height="28" rx="6" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <!-- 4 approved (green) -->
    <rect x="22" y="17" width="224" height="24" rx="5" fill="#00d68f" opacity=".25"/>
    <!-- 4 partial (gold) -->
    <rect x="248" y="17" width="224" height="24" rx="0" fill="#f0a500" opacity=".2"/>
    <!-- 4 failed (red) -->
    <rect x="474" y="17" width="224" height="24" rx="5" fill="#e8394a" opacity=".2"/>
    <text x="134" y="33" text-anchor="middle" font-size="10" fill="#00d68f" font-family="sans-serif" font-weight="700">4 ✓ Aprovados</text>
    <text x="360" y="33" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">4 ⚠️ Parciais</text>
    <text x="586" y="33" text-anchor="middle" font-size="10" fill="#e8394a" font-family="sans-serif" font-weight="700">4 ✗ Reprovados</text>

    <!-- Criteria grid -->
    <!-- Col 1 -->
    <rect x="20" y="52" width="220" height="18" rx="3" fill="#00d68f" opacity=".08"/>
    <text x="28" y="65" font-size="9" fill="#607d8b" font-family="monospace">✓ S/R S1 confluente $1.33</text>
    <rect x="20" y="73" width="220" height="18" rx="3"/>
    <text x="28" y="86" font-size="9" fill="#607d8b" font-family="monospace">✓ Fibonacci 78.6% em $1.33</text>
    <rect x="20" y="94" width="220" height="18" rx="3" fill="#00d68f" opacity=".08"/>
    <text x="28" y="107" font-size="9" fill="#607d8b" font-family="monospace">✓ R:R &gt;1:2 calculado</text>
    <rect x="20" y="115" width="220" height="18" rx="3"/>
    <text x="28" y="128" font-size="9" fill="#607d8b" font-family="monospace">✓ F&amp;G = 5 (contrarian)</text>

    <!-- Col 2 -->
    <rect x="250" y="52" width="220" height="18" rx="3" fill="#f0a500" opacity=".07"/>
    <text x="258" y="65" font-size="9" fill="#607d8b" font-family="monospace">⚠️ F&amp;G alta volatilidade</text>
    <rect x="250" y="73" width="220" height="18" rx="3"/>
    <text x="258" y="86" font-size="9" fill="#607d8b" font-family="monospace">⚠️ ADX 4H caindo</text>
    <rect x="250" y="94" width="220" height="18" rx="3" fill="#f0a500" opacity=".07"/>
    <text x="258" y="107" font-size="9" fill="#607d8b" font-family="monospace">⚠️ MACD desacelerando</text>
    <rect x="250" y="115" width="220" height="18" rx="3"/>
    <text x="258" y="128" font-size="9" fill="#607d8b" font-family="monospace">⚠️ Padrão vela sem engolfo</text>

    <!-- Col 3 - critical failures -->
    <rect x="480" y="52" width="220" height="18" rx="3" fill="#e8394a" opacity=".07"/>
    <text x="488" y="65" font-size="9" fill="#607d8b" font-family="monospace">✗ BTC.D 56.6% adverso ⛔</text>
    <rect x="480" y="73" width="220" height="18" rx="3"/>
    <text x="488" y="86" font-size="9" fill="#607d8b" font-family="monospace">✗ Tarifas Trump macro ⛔</text>
    <rect x="480" y="94" width="220" height="18" rx="3" fill="#e8394a" opacity=".07"/>
    <text x="488" y="107" font-size="9" fill="#607d8b" font-family="monospace">✗ HTF Trend BEAR Daily ⛔</text>
    <rect x="480" y="115" width="220" height="18" rx="3"/>
    <text x="488" y="128" font-size="9" fill="#607d8b" font-family="monospace">✗ Ichimoku abaixo nuvem</text>

    <!-- Score box -->
    <rect x="20" y="145" width="680" height="55" rx="7" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="200" y="165" text-anchor="middle" font-size="11" fill="#607d8b" font-family="sans-serif">Score:</text>
    <text x="290" y="168" text-anchor="middle" font-size="18" fill="#e8394a" font-family="sans-serif" font-weight="900">4/12</text>
    <line x1="340" y1="148" x2="340" y2="198" stroke="#1e3a5f" stroke-width="1"/>
    <text x="530" y="162" text-anchor="middle" font-size="10.5" fill="#e8394a" font-family="sans-serif" font-weight="700">NÃO QUALIFICA</text>
    <text x="530" y="178" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">3 critérios críticos (⛔) reprovados</text>
    <text x="530" y="192" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">→ Aguardar BTC.D + macro + HTF</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> O Scorecard Completo de Decisão — 12 Critérios</h2>
<p>Este é o checklist definitivo do método TMP. Cada critério recebe ✓ (aprovado), ⚠️ (parcial) ou ✗ (reprovado). O trade só acontece com score mínimo de 8/12 e nenhum critério crítico reprovado:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>#</th><th>Critério</th><th>Crítico?</th><th>XRP 23/02/2026</th></tr></thead>
<tbody>
  <tr>
    <td class="td-gold td-em">1</td>
    <td class="td-em">F&G compatível com a direção</td>
    <td class="td-red">✓ CRÍTICO</td>
    <td class="td-gold">⚠️ F&G=5 — favorece long de médio prazo mas indica alta volatilidade</td>
  </tr>
  <tr>
    <td class="td-gold td-em">2</td>
    <td class="td-em">BTC.D não adversa ao trade</td>
    <td class="td-red">✓ CRÍTICO</td>
    <td class="td-red">✗ BTC.D 56.6% — Bitcoin Season adverso para altcoins</td>
  </tr>
  <tr>
    <td class="td-gold td-em">3</td>
    <td class="td-em">Nenhum evento macro de risco iminente</td>
    <td class="td-red">✓ CRÍTICO</td>
    <td class="td-red">✗ Tarifas Trump recém anunciadas — risco macro elevado</td>
  </tr>
  <tr>
    <td class="td-gold td-em">4</td>
    <td class="td-em">Preço em zona de S/R de alta confluência</td>
    <td class="td-red">✓ CRÍTICO</td>
    <td class="td-green">✓ Zona $1.30–$1.35 — suporte S1 máxima confluência</td>
  </tr>
  <tr>
    <td class="td-gold td-em">5</td>
    <td class="td-em">Fibonacci confirma a zona</td>
    <td></td>
    <td class="td-green">✓ Fib 78.6% em $1.33 — zona de retracement confirmada</td>
  </tr>
  <tr>
    <td class="td-gold td-em">6</td>
    <td class="td-em">HTF Trend compatível (ou aceitável se contra-tendência)</td>
    <td class="td-red">✓ CRÍTICO</td>
    <td class="td-red">✗ BEAR em todos os TFs — contra-tendência exige sizing −40%</td>
  </tr>
  <tr>
    <td class="td-gold td-em">7</td>
    <td class="td-em">ADX indica enfraquecimento do movimento adverso</td>
    <td></td>
    <td class="td-gold">⚠️ Daily 40.6 mas 4H 23.4 e caindo — enfraquecimento parcial</td>
  </tr>
  <tr>
    <td class="td-gold td-em">8</td>
    <td class="td-em">RSI em zona favorável ou com divergência</td>
    <td></td>
    <td class="td-green">✓ RSI ~28 + divergência bullish no 1H — sinal positivo claro</td>
  </tr>
  <tr>
    <td class="td-gold td-em">9</td>
    <td class="td-em">MACD confirmando ou em construção</td>
    <td></td>
    <td class="td-gold">⚠️ Histograma desacelerando no 1H mas sem cruzamento ainda</td>
  </tr>
  <tr>
    <td class="td-gold td-em">10</td>
    <td class="td-em">Ichimoku não contradiz a entrada</td>
    <td></td>
    <td class="td-red">✗ Preço abaixo da nuvem em todos os TFs — bearish confirmado</td>
  </tr>
  <tr>
    <td class="td-gold td-em">11</td>
    <td class="td-em">Padrão de vela de reversão presente</td>
    <td></td>
    <td class="td-gold">⚠️ Martelos e dojis formando mas sem engolfo de confirmação ainda</td>
  </tr>
  <tr>
    <td class="td-gold td-em">12</td>
    <td class="td-em">R:R mínimo de 1:2 calculado</td>
    <td class="td-red">✓ CRÍTICO</td>
    <td class="td-green">✓ Stop $1.2821, TP1 $1.48 = R:R 1:2.1 — mínimo aprovado</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">📊 Score Final XRP 23/02/2026 — Long Setup</div>
  <p>
  <strong>✓ Aprovados:</strong> 4 (S/R, Fibonacci, RSI, R:R)<br>
  <strong>⚠️ Parciais:</strong> 4 (F&G, ADX, MACD, Padrão de Vela)<br>
  <strong>✗ Reprovados:</strong> 4 (BTC.D, Macro, HTF Trend, Ichimoku)<br><br>
  <strong>Score: 4/12 aprovados + 4/12 parciais = NÃO QUALIFICA para entrada imediata.</strong><br><br>
  <strong>3 critérios críticos reprovados</strong> (BTC.D, Macro, HTF Trend). Isso por si só invalida o trade.<br><br>
  <strong>Conclusão:</strong> Monitoramento ativo. Aguardar os critérios 2, 3 e 6 melhorarem — ou seja: BTC.D começar a cair, ambiente macro estabilizar e HTF Trend do 1H/4H virarem para BULL.
  </p>
</div>

<h2><span class="h2-num">3</span> A Construção da Posição — Entrada Escalonada</h2>
<p>Quando o score qualifica (8/12 mínimo, sem críticos reprovados), o método TMP não entra com 100% da posição de uma vez. A entrada é <strong>escalonada em 3 momentos</strong> para reduzir risco e melhorar o preço médio:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Entrada 1 — 40% da Posição (Teste)</h4>
      <p><strong>Quando:</strong> Score atingiu mínimo (8/12) + vela de reversão de confirmação fechou acima do nível de entrada.<br>
      <strong>Por que 40%:</strong> Confirma que você está correto antes de comprometer capital total. Se o trade vai contra de imediato, a perda é limitada.<br>
      <strong>Stop loss:</strong> Posicionado na zona de invalidação da análise (abaixo do suporte confluente).</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Entrada 2 — 40% da Posição (Confirmação)</h4>
      <p><strong>Quando:</strong> Após o preço se afastar do ponto de entrada e confirmar momentum na direção + HTF Trend começando a mudar a favor + MACD cruzamento confirmado.<br>
      <strong>Por que aguardar:</strong> A confirmação de momentum reduz drasticamente a probabilidade de false break. Você paga um preço ligeiramente pior em troca de muito mais certeza.<br>
      <strong>Ajuste de stop:</strong> Mover stop para break-even da Entrada 1 antes de adicionar Entrada 2.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Entrada 3 — 20% da Posição (Pirâmide)</h4>
      <p><strong>Quando:</strong> Apenas se os TPs 1 e 2 já foram alcançados E a tendência claramente se confirmou. Esta é a posição de "deixar correr" para o TP3 de longo prazo.<br>
      <strong>Sizing conservador:</strong> Somente 20% porque o preço já se moveu, reduzindo o R:R da entrada neste ponto. É para maximizar ganhos, não para adicionar risco.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Definindo Alvos (TPs) e Invalidação (Stop)</h2>
<p>Antes de entrar, você define <strong>todos</strong> os níveis com precisão. A lógica de cada nível deve estar documentada no diário:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Nível</th><th>Como Definir</th><th>Lógica</th><th>Exemplo XRP Long</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">Stop Loss</td>
    <td>Abaixo do suporte mais próximo − 0.5–1% (margem para false break)</td>
    <td>Onde a análise está provadamente errada. O preço aqui invalida a tese.</td>
    <td class="td-red"><strong>$1.2821</strong> — abaixo da mínima histórica do suporte S1</td>
  </tr>
  <tr>
    <td class="td-em td-bright">TP1 (30% da posição)</td>
    <td>Fibonacci extensão 127.2% ou próxima resistência de S2</td>
    <td>Primeira realização de lucro. Garante que o trade seja lucrativo.</td>
    <td class="td-bright"><strong>$1.48</strong> — Fib 127.2% + LH estrutural 4H</td>
  </tr>
  <tr>
    <td class="td-em td-gold">TP2 (50% da posição)</td>
    <td>Fibonacci extensão 161.8% ou próxima resistência de S1</td>
    <td>Realização principal. Cobre o objetivo central do setup.</td>
    <td class="td-gold"><strong>$1.65</strong> — Fib 161.8% + suporte invertido 2024</td>
  </tr>
  <tr>
    <td class="td-em td-green">TP3 (20% da posição)</td>
    <td>Fibonacci extensão 200–261.8% ou resistência maior</td>
    <td>Posição residual para capturar movimento maior. Trailing stop ativo.</td>
    <td class="td-green"><strong>$1.93</strong> — Fib 200% + LH Daily + VPVR HVN</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> O Gerenciamento Ativo da Posição</h2>
<p>Depois de entrar, o trabalho não acabou — ele apenas mudou de natureza:</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">📌</div>
  <div class="rule-content">
    <h4>Após TP1 Atingido — Break-Even e Trailing</h4>
    <p>Ao atingir TP1: realizar 30% da posição + mover stop para o preço de entrada (break-even) da posição restante. Agora você não pode mais perder dinheiro neste trade — o pior resultado é breakeven. Isso libera confiança psicológica para deixar a posição restante correr.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">📌</div>
  <div class="rule-content">
    <h4>Após TP2 Atingido — Trailing Stop na Kijun</h4>
    <p>Realizar 50% da posição + mover stop para acompanhar a Kijun-Sen (linha base Ichimoku). A Kijun é o suporte dinâmico de médio prazo — se o preço fechar abaixo dela, a tendência está comprometida e você sai do trade com o lucro do restante protegido.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">🚫</div>
  <div class="rule-content">
    <h4>Regras Absolutas de Gestão — Nunca Violar</h4>
    <p>
    <strong>Nunca mover o stop na direção contrária</strong> ao preço para "dar mais espaço" — isso é medo disfarçado de estratégia. Se o stop foi calculado corretamente, deixe-o onde está.<br>
    <strong>Nunca adicionar à posição perdedora</strong> — never "averaging down". Se o preço foi ao stop, a análise estava errada. Sair, reanalisar do zero, reentrara com nova análise.<br>
    <strong>Nunca segurar além do stop</strong> por "esperança". O stop não é uma sugestão — é um contrato você com você mesmo feito antes da emoção do trade.
    </p>
  </div>
</div>

<h2><span class="h2-num">6</span> Documentação Obrigatória — O Diário Pós-Trade</h2>
<p>Imediatamente após fechar o trade (ou se o stop for atingido), preencha o diário com:</p>

<div class="callout callout-info">
  <div class="callout-title">📋 Template de Documentação Pós-Trade</div>
  <p style="font-family: var(--font-mono); font-size: 13px; line-height: 2.2; color: var(--gray1)">
  Data/Hora de saída: ___<br>
  Resultado: ✓ TP alcançado / ✗ Stop atingido / ↔ Saída manual<br>
  P&L em R (Risk): ___ R (ex: +2.3R = ganhei 2.3× o risco)<br>
  Score STMP na entrada: ___ /12<br>
  O que funcionou: ___<br>
  O que não funcionou: ___<br>
  Segui o processo? Sim / Não — Se não, onde desviei?: ___<br>
  Qualidade do processo (1–10, independente do resultado): ___<br>
  Aprendizado para o próximo trade: ___
  </p>
</div>

<div class="callout callout-gold">
  <div class="callout-title">🏁 Fase 2 Concluída — Análise Técnica Cirúrgica</div>
  <p>Você domina agora a Fase 2 completa: estrutura de preço, suportes e resistências, Fibonacci, padrões gráficos, o sistema STMP com seus 8 componentes e 5 filtros, ADX multi-timeframe, RSI com divergências, MACD sinérgico, Ichimoku completo e o processo de decisão integrado. Combinado com a Fase 1, você tem o mesmo arsenal analítico que analistas profissionais levam anos para desenvolver.<br><br>
  <strong>Na Fase 3</strong>, você vai aprender a construir cenários probabilísticos precisos — transformando a análise em planos de ação com probabilidades numéricas para cada cenário possível.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo as 3 perguntas fundamentais que precedem qualquer decisão de trade</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei aplicar o Scorecard de 12 critérios e entendo o mínimo de 8/12 sem críticos reprovados</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Compreendo a entrada escalonada em 3 momentos (40% + 40% + 20%)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei definir Stop Loss, TP1, TP2 e TP3 com lógica técnica documentada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizei as 3 regras absolutas de gestão que nunca posso violar</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Preenchi o template de documentação pós-trade para o caso XRP desta análise</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Concluí a Fase 2 — estou pronto para a Fase 3: Cenários e Probabilidades</div></div>
</div>`,

  "mtf": `
<div class="blockquote">
  <div class="blockquote-text">O trader que analisa apenas um timeframe vê o mercado como um cego que toca apenas uma parte do elefante — e acha que sabe o que está diante dele. A análise multi-timeframe revela o animal inteiro.</div>
  <div class="blockquote-author">— Bob Volman · Forex Price Action Scalping</div>
</div>

<h2><span class="h2-num">1</span> O Que é Análise Multi-Timeframe e Por Que é Obrigatória</h2>
<p>A Análise Multi-Timeframe (MTF) é o processo de examinar o mesmo ativo em diferentes intervalos de tempo antes de qualquer decisão de trade. É obrigatória porque o preço de qualquer ativo existe simultaneamente em múltiplos contextos temporais — e um sinal que parece perfeito no 1H pode ser completamente insignificante ou até perigoso quando visto no Daily.</p>
<p>A grande maioria das perdas desnecessárias no swing trade acontece por um único motivo: <strong>o trader entrou num setup "perfeito" no timeframe de entrada sem verificar o que o timeframe maior estava dizendo</strong>. O MTF elimina esse erro estrutural.</p>

<div class="callout callout-info">
  <div class="callout-title">💡 A Metáfora da Câmera</div>
  <p>
  Imagine que você está fotografando uma cena. O <strong>Daily</strong> é o ângulo grande — você vê toda a paisagem, a direção geral do terreno, as montanhas ao fundo. O <strong>4H</strong> é o zoom médio — você vê os caminhos e obstáculos próximos. O <strong>1H</strong> é o close-up — você vê o detalhe de onde colocar o próximo passo.<br><br>
  Entrar num trade olhando apenas o 1H é tentar caminhar em terreno desconhecido olhando apenas para onde seus pés estão — sem ver o precipício dois metros à frente.
  </p>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Análise Multi-Timeframe — Hierarquia e Fluxo</div>
  <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- DAILY box -->
    <rect x="30" y="20" width="180" height="160" rx="10" fill="#0a1628" stroke="#f0a500" stroke-width="2"/>
    <rect x="30" y="20" width="180" height="36" rx="10" fill="#f0a500" opacity=".15"/>
    <text x="120" y="44" text-anchor="middle" font-size="13" fill="#f0a500" font-family="sans-serif" font-weight="700">DAILY</text>
    <text x="120" y="60" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" opacity=".8">O Juiz</text>
    <!-- Mini chart daily -->
    <polyline points="50,130 65,120 75,125 90,108 100,115 115,95 125,100 140,82 150,88 165,70 175,75 190,60"
      fill="none" stroke="#f0a500" stroke-width="1.5" opacity=".6"/>
    <text x="120" y="155" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Tendência + S/R macro</text>
    <text x="120" y="168" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Contexto principal</text>

    <!-- Arrow 1 -->
    <line x1="212" y1="100" x2="265" y2="100" stroke="#3d8fef" stroke-width="2"/>
    <polygon points="262,95 272,100 262,105" fill="#3d8fef"/>
    <text x="238" y="92" text-anchor="middle" font-size="9" fill="#3d8fef" font-family="sans-serif">Zoom in</text>

    <!-- 4H box -->
    <rect x="274" y="20" width="172" height="160" rx="10" fill="#0a1628" stroke="#3d8fef" stroke-width="2"/>
    <rect x="274" y="20" width="172" height="36" rx="10" fill="#3d8fef" opacity=".15"/>
    <text x="360" y="44" text-anchor="middle" font-size="13" fill="#3d8fef" font-family="sans-serif" font-weight="700">4H</text>
    <text x="360" y="60" text-anchor="middle" font-size="10" fill="#3d8fef" font-family="sans-serif" opacity=".8">O Diretor</text>
    <!-- Mini chart 4H -->
    <polyline points="290,140 305,128 315,132 328,115 338,120 350,100 360,105 372,88 382,93 395,75 408,80 430,62"
      fill="none" stroke="#3d8fef" stroke-width="1.5" opacity=".6"/>
    <text x="360" y="155" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Setup + indicadores</text>
    <text x="360" y="168" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Qualificação do trade</text>

    <!-- Arrow 2 -->
    <line x1="448" y1="100" x2="498" y2="100" stroke="#00c4e8" stroke-width="2"/>
    <polygon points="495,95 505,100 495,105" fill="#00c4e8"/>
    <text x="473" y="92" text-anchor="middle" font-size="9" fill="#00c4e8" font-family="sans-serif">Zoom in</text>

    <!-- 1H box -->
    <rect x="508" y="20" width="172" height="160" rx="10" fill="#0a1628" stroke="#00c4e8" stroke-width="2"/>
    <rect x="508" y="20" width="172" height="36" rx="10" fill="#00c4e8" opacity=".12"/>
    <text x="594" y="44" text-anchor="middle" font-size="13" fill="#00c4e8" font-family="sans-serif" font-weight="700">1H</text>
    <text x="594" y="60" text-anchor="middle" font-size="10" fill="#00c4e8" font-family="sans-serif" opacity=".8">O Executor</text>
    <!-- Mini chart 1H — more detailed -->
    <polyline points="522,140 532,132 538,136 545,120 550,124 558,108 564,112 572,95 578,99 586,82 592,87 600,70 606,75 614,60 620,64 628,50 636,54 648,42 658,45 668,32"
      fill="none" stroke="#00c4e8" stroke-width="1.5" opacity=".6"/>
    <!-- Entry arrow -->
    <circle cx="628" cy="50" r="5" fill="#00d68f"/>
    <text x="594" y="155" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Timing + vela confirmação</text>
    <text x="594" y="168" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif" font-weight="700">Ponto de entrada</text>

    <!-- Rule label -->
    <text x="360" y="195" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Daily define contexto → 4H identifica setup → 1H executa a entrada</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> A Hierarquia dos Timeframes no Método TMP</h2>
<p>O método TMP usa uma hierarquia definida de 3 timeframes com papéis distintos e complementares:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Timeframe</th><th>Papel no TMP</th><th>O Que Define</th><th>Frequência de Análise</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Daily (1D)</td>
    <td class="td-gold td-em">Contexto Macro — O Juiz</td>
    <td>Tendência primária, S/R macro, ADX estrutural, posição vs Ichimoku Cloud. <strong>Define o viés geral que nenhum TF menor pode contradizer.</strong></td>
    <td>Análise completa 1× por dia (manhã)</td>
  </tr>
  <tr>
    <td class="td-em td-bright">4H (4 horas)</td>
    <td class="td-bright td-em">Contexto Intermediário — O Diretor</td>
    <td>Tendência de médio prazo, zonas de S/R operacionais, ADX de qualidade, setups em formação. <strong>Onde os setups são identificados e qualificados.</strong></td>
    <td>Análise de setup 2–4× por dia</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">1H (1 hora)</td>
    <td class="td-cyan td-em">Contexto de Entrada — O Executor</td>
    <td>Timing preciso de entrada, padrão de vela de confirmação, RSI/MACD no ponto exato, ajuste fino de stop. <strong>Onde a entrada é executada dentro da zona identificada no 4H.</strong></td>
    <td>Monitoramento contínuo quando setup qualificado</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ A Regra de Ouro do MTF</div>
  <p><strong>Nunca entre num trade onde o Daily está contra você sem reduzir o sizing em pelo menos 40%.</strong> Isso é válido mesmo que o 4H e o 1H estejam perfeitamente alinhados. O Daily é o juiz supremo — quando ele diz BEAR, qualquer long é um nado contra a maré. Às vezes você vai ganhar nadando contra a maré, mas em média você vai se cansar e se afogar.</p>
</div>

<h2><span class="h2-num">3</span> Os 4 Cenários MTF — Como Cada Combinação Impacta o Trade</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Daily</th><th>4H</th><th>1H</th><th>Cenário</th><th>Ação TMP para Long</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-green">BULL</td>
    <td class="td-green">BULL</td>
    <td class="td-green">BULL</td>
    <td class="td-green td-em">🟢 Alinhamento Total</td>
    <td class="td-green">Setup de máxima qualidade. Sizing 100%. R:R esperado mais alto. Todos os TFs confirmando — raro e poderoso.</td>
  </tr>
  <tr>
    <td class="td-em td-green">BULL</td>
    <td class="td-green">BULL</td>
    <td class="td-red">BEAR</td>
    <td class="td-gold td-em">🟡 Pullback em Uptrend</td>
    <td>Aguardar o 1H virar BULL novamente. O pullback é uma oportunidade de entrada melhor — não um alerta de reversão. Preparar ordem no S/R de 4H.</td>
  </tr>
  <tr>
    <td class="td-em td-green">BULL</td>
    <td class="td-red">BEAR</td>
    <td class="td-red">BEAR</td>
    <td class="td-gold td-em">🟡 Correção Profunda em Uptrend</td>
    <td>Aguardar. Correção mais profunda em andamento. Identificar suporte macro do Daily onde o 4H pode reverter. Entrada somente quando 4H virar BULL.</td>
  </tr>
  <tr>
    <td class="td-em td-red">BEAR</td>
    <td class="td-red">BEAR</td>
    <td class="td-red">BEAR</td>
    <td class="td-red td-em">🔴 Alinhamento Bearish Total</td>
    <td class="td-red">Ambiente hostil para longs. Sizing máximo −40% se entrar. Apenas em suporte S1 de máxima confluência com todos os filtros STMP ativos. XRP 23/02/2026 estava aqui.</td>
  </tr>
  <tr>
    <td class="td-em td-red">BEAR</td>
    <td class="td-red">BEAR</td>
    <td class="td-green">BULL</td>
    <td class="td-gold td-em">🟡 Bounce em Downtrend</td>
    <td>O 1H BULL é apenas um bounce técnico dentro do downtrend maior. Tratar como oportunidade de scalp limitado (TP1 máximo) ou ignorar. NÃO confundir com reversão.</td>
  </tr>
  <tr>
    <td class="td-em td-red">BEAR</td>
    <td class="td-green">BULL</td>
    <td class="td-green">BULL</td>
    <td class="td-cyan td-em">⚪ Rally em Downtrend</td>
    <td>4H e 1H alinhados bullish mas Daily ainda bearish = rally contra-tendência. Pode ser início de reversão ou armadilha. Exigir confirmação no Daily (HTF Trend virando) antes de tamanho completo.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Zoom In / Zoom Out — A Técnica de Navegação</h2>
<p>O processo correto de análise MTF nunca começa no timeframe de entrada. Ele sempre começa no maior e vai descendo progressivamente:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Zoom Out — Daily (Contexto e Direção)</h4>
      <p>Primeira pergunta: "Qual é o estado estrutural do mercado neste ativo?" Identifique: tendência (uptrend/downtrend/range), S/R macro, posição vs Ichimoku Cloud, ADX Daily, HTF Trend Daily. Escreva uma frase: <em>"Daily está em [estado] com preço [localização]."</em></p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Zoom Intermediário — 4H (Qualificação do Setup)</h4>
      <p>Segunda pergunta: "Existe um setup se formando em uma zona válida?" O 4H deve mostrar: preço chegando em S/R de qualidade + indicadores favoráveis (RSI não sobrecomprado + MACD em construção + ADX 4H compatível). Se sim, marque a zona de entrada potencial.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Zoom In — 1H (Timing de Entrada)</h4>
      <p>Terceira pergunta: "Qual é o melhor momento para entrar dentro desta zona?" O 1H fornece: padrão de vela de confirmação, cruzamento de indicadores de curto prazo, volume no ponto de entrada. A entrada só acontece quando o 1H confirmar dentro da zona identificada no 4H.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Verificação Final — Voltar ao Daily</h4>
      <p>Antes de executar: volte ao Daily e confirme que nada mudou. "O contexto macro ainda é compatível com esta entrada?" Se sim, execute. Esta verificação final evita entrar num momento em que um candle Daily impactante acaba de fechar.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> S/R Multi-Timeframe — Hierarquia de Força</h2>
<p>Um suporte/resistência ganha muito mais poder quando aparece em múltiplos timeframes simultaneamente. Esta é a hierarquia:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Origem do S/R</th><th>Força</th><th>Uso no TMP</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Visível no Daily + 4H + 1H</td>
    <td class="td-gold td-em">⭐⭐⭐⭐⭐ Máxima</td>
    <td>Zonas de stop e target de máxima prioridade. Entrar com sizing completo quando todas as confluências presentes.</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Visível no Daily + 4H</td>
    <td class="td-bright td-em">⭐⭐⭐⭐ Alta</td>
    <td>Zonas operacionais principais. Setups de alta qualidade. Tamanho normal com bom R:R.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Visível apenas no 4H</td>
    <td class="td-cyan td-em">⭐⭐⭐ Moderada</td>
    <td>Zonas de suporte/resistência intermediárias. Válidas para setups padrão. Stops mais largos podem ser necessários.</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--gray2)">Visível apenas no 1H</td>
    <td style="color:var(--gray2)" class="td-em">⭐⭐ Baixa</td>
    <td>Apenas para timing de entrada dentro de uma zona de TF maior. Nunca como base de análise principal.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">6</span> MTF Real — XRP 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Análise Multi-Timeframe Completa do Dia</div>
  <p>
  <strong>Daily — O Juiz:</strong><br>
  Estado: Downtrend estrutural (LH+LL desde jan/2026). ADX 40.6 BEAR. HTF Trend BEAR. Preço muito abaixo da nuvem Ichimoku. Posição: em suporte S1 histórico $1.30–$1.35.<br>
  Veredicto Daily: <span style="color:var(--red)">BEAR — contra longs</span><br><br>

  <strong>4H — O Diretor:</strong><br>
  Estado: Downtrend (LH+LL). ADX 23.4 BEAR e caindo. HTF Trend BEAR. Preço abaixo da nuvem 4H. Rally até $1.48 rejeitado (LH). Consolidação na zona $1.33–$1.43.<br>
  Veredicto 4H: <span style="color:var(--red)">BEAR enfraquecendo</span> — sinal de possível exaustão<br><br>

  <strong>1H — O Executor:</strong><br>
  Estado: Micro-range. HTF Trend 1H marcando BULL (bounce técnico). RSI ~28 + divergência bullish. MACD histograma desacelerando. Padrões de reversão (doji, martelos) em formação.<br>
  Veredicto 1H: <span style="color:var(--gold)">BULL técnico de curto prazo</span> — bounce em downtrend maior<br><br>

  <strong>Cenário MTF identificado:</strong> Daily BEAR + 4H BEAR enfraquecendo + 1H BULL = "Bounce em Downtrend" (cenário 5 da tabela). Tratar como potencial de scalp limitado (TP1 = $1.48) ou aguardar 4H confirmar reversão antes de posição maior. <strong>NÃO confundir com reversão estrutural.</strong>
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo o papel de cada TF: Daily (Juiz), 4H (Diretor), 1H (Executor)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo os 6 cenários MTF e a ação correta em cada combinação</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Aplico o processo Zoom Out → Intermediário → Zoom In antes de qualquer trade</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a hierarquia de força de S/R por timeframe</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Classifiquei XRP 23/02/2026 como "Bounce em Downtrend" e entendi as implicações</div></div>
</div>`,

  "mtf-protocol": `
<div class="blockquote">
  <div class="blockquote-text">Um protocolo não é uma restrição — é uma liberdade. Quando você tem um processo claro, sua mente está livre para analisar, não para improvisar. A criatividade no trading é sua maior inimiga. O processo é seu maior aliado.</div>
  <div class="blockquote-author">— Mark Douglas · Trading in the Zone</div>
</div>

<h2><span class="h2-num">1</span> O Protocolo MTF — Da Teoria à Execução Diária</h2>
<p>Nas aulas anteriores você aprendeu os conceitos do Multi-Timeframe. Agora vamos transformar esses conceitos em um <strong>protocolo de execução diária</strong> — um processo passo a passo que você segue da mesma forma todos os dias, independente das condições de mercado ou do seu estado emocional do momento.</p>
<p>O protocolo MTF é o elo que conecta a análise à ação. Ele garante que você nunca pule etapas, nunca analise de forma inconsistente e nunca tome decisões baseadas em informação incompleta.</p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">3</div><div class="kpi-label">Fases do protocolo</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">45 min</div><div class="kpi-label">Tempo de análise completa</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">diário</div><div class="kpi-label">Frequência de execução</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">1 doc</div><div class="kpi-label">Resultado: documento de análise estruturado</div></div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Protocolo MTF — Fluxo das 3 Fases (45 min)</div>
  <svg viewBox="0 0 720 165" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <defs>
      <marker id="arrFw" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#3d8fef"/></marker>
    </defs>
    <!-- Phase 1 box -->
    <rect x="15" y="15" width="192" height="130" rx="8" fill="#0a1628" stroke="#f0a500" stroke-width="1.8"/>
    <rect x="15" y="15" width="192" height="30" rx="8" fill="#f0a500" opacity=".12"/>
    <text x="111" y="34" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">Fase 1 — Contexto</text>
    <text x="111" y="47" text-anchor="middle" font-size="9.5" fill="#f0a500" font-family="sans-serif">20 minutos</text>
    <text x="25" y="70" font-size="9" fill="#607d8b" font-family="sans-serif">📊 F&amp;G + BTC variação</text>
    <text x="25" y="85" font-size="9" fill="#607d8b" font-family="sans-serif">📰 2–4 notícias SCN</text>
    <text x="25" y="100" font-size="9" fill="#607d8b" font-family="sans-serif">🐳 Whale alerts 12h</text>
    <text x="25" y="115" font-size="9" fill="#607d8b" font-family="sans-serif">🔗 Exchange flows</text>
    <rect x="25" y="126" width="172" height="14" rx="4" fill="#f0a500" opacity=".15"/>
    <text x="111" y="137" text-anchor="middle" font-size="9" fill="#f0a500" font-family="sans-serif">→ Viés macro definido</text>

    <!-- Arrow 1 -->
    <line x1="209" y1="80" x2="263" y2="80" stroke="#3d8fef" stroke-width="2" marker-end="url(#arrFw)"/>
    <text x="236" y="73" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="sans-serif">Fase 1</text>
    <text x="236" y="95" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="sans-serif">ok?</text>

    <!-- Phase 2 box -->
    <rect x="265" y="15" width="192" height="130" rx="8" fill="#0a1628" stroke="#3d8fef" stroke-width="1.8"/>
    <rect x="265" y="15" width="192" height="30" rx="8" fill="#3d8fef" opacity=".12"/>
    <text x="361" y="34" text-anchor="middle" font-size="11" fill="#3d8fef" font-family="sans-serif" font-weight="700">Fase 2 — Técnica</text>
    <text x="361" y="47" text-anchor="middle" font-size="9.5" fill="#3d8fef" font-family="sans-serif">15 minutos</text>
    <text x="275" y="70" font-size="9" fill="#607d8b" font-family="sans-serif">📅 Daily: HTF+ADX+Ichimoku</text>
    <text x="275" y="85" font-size="9" fill="#607d8b" font-family="sans-serif">⏰ 4H: Setup qualificado?</text>
    <text x="275" y="100" font-size="9" fill="#607d8b" font-family="sans-serif">⏱️ 1H: Timing + vela</text>
    <text x="275" y="115" font-size="9" fill="#607d8b" font-family="sans-serif">📐 Entrada/Stop/TP calc</text>
    <rect x="275" y="126" width="172" height="14" rx="4" fill="#3d8fef" opacity=".15"/>
    <text x="361" y="137" text-anchor="middle" font-size="9" fill="#3d8fef" font-family="sans-serif">→ Zona de entrada mapeada</text>

    <!-- Arrow 2 -->
    <line x1="459" y1="80" x2="513" y2="80" stroke="#3d8fef" stroke-width="2" marker-end="url(#arrFw)"/>
    <text x="486" y="73" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="sans-serif">Fase 2</text>
    <text x="486" y="95" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="sans-serif">ok?</text>

    <!-- Phase 3 box -->
    <rect x="515" y="15" width="192" height="130" rx="8" fill="#0a1628" stroke="#00d68f" stroke-width="1.8"/>
    <rect x="515" y="15" width="192" height="30" rx="8" fill="#00d68f" opacity=".10"/>
    <text x="611" y="34" text-anchor="middle" font-size="11" fill="#00d68f" font-family="sans-serif" font-weight="700">Fase 3 — Decisão</text>
    <text x="611" y="47" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="sans-serif">10 minutos</text>
    <text x="525" y="70" font-size="9" fill="#607d8b" font-family="sans-serif">📋 Score STMP 12 crit.</text>
    <text x="525" y="85" font-size="9" fill="#607d8b" font-family="sans-serif">💰 Sizing calculado</text>
    <text x="525" y="100" font-size="9" fill="#607d8b" font-family="sans-serif">📝 Registra no diário</text>
    <text x="525" y="115" font-size="9" fill="#607d8b" font-family="sans-serif">🔔 Alertas configurados</text>
    <rect x="525" y="126" width="172" height="14" rx="4" fill="#00d68f" opacity=".15"/>
    <text x="611" y="137" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">→ ENTRAR / AGUARDAR</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> Fase 1 do Protocolo — Contexto (Fase 1 do Método, 20 min)</h2>
<p>Antes de abrir qualquer gráfico, o contexto macro deve estar claro:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Pesquisa de Fontes (8 min)</h4>
      <p>Seguindo o protocolo da Aula 5 (Fontes): Fear & Greed + CoinDesk headlines + Whale Alerts das últimas 12h + CryptoQuant exchange flows + BTC variação 24h. Registrar em documento de análise do dia.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Classificação SCN (5 min)</h4>
      <p>Para cada notícia relevante: aplicar Sistema de Classificação (Impacto / Timing / Fonte / Viés). Descartar ruídos. Manter 2–4 notícias com real impacto.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Síntese Macro (7 min)</h4>
      <p>Escrever 2 frases obrigatórias: <em>"Macro curto prazo: [viés] — [razão]"</em> e <em>"Macro médio prazo: [viés] — [razão]"</em>. Verificar BTC.D regime atual. Decidir: contexto favorável / neutro / adverso para o trade pretendido.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">3</span> Fase 2 do Protocolo — Análise Técnica MTF (15 min)</h2>
<p>Com o contexto macro definido, iniciar a análise técnica no Daily e descer progressivamente:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Daily — Estrutura e Contexto (5 min)</h4>
      <p>
      <strong>O que registrar:</strong><br>
      • Estado estrutural: uptrend (HH+HL) / downtrend (LH+LL) / range<br>
      • HTF Trend Daily: BULL / BEAR<br>
      • ADX Daily: valor + direção (subindo/caindo)<br>
      • Posição vs Ichimoku Cloud: acima / dentro / abaixo<br>
      • S/R principais: suportes e resistências do Daily marcados<br>
      • Próximo nível crítico acima e abaixo do preço atual
      </p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">5</div>
    <div class="step-content">
      <h4>4H — Qualificação do Setup (6 min)</h4>
      <p>
      <strong>O que registrar:</strong><br>
      • Estado estrutural 4H: confirma ou diverge do Daily?<br>
      • ADX 4H: valor + força da tendência<br>
      • RSI 4H: zona + divergência presente?<br>
      • MACD 4H: estado (cruzamento, histograma, regime)<br>
      • Padrões em formação: flag, triângulo, reversão?<br>
      • Zona de entrada potencial: identificada sim/não
      </p>
    </div>
  </div>
  <div class="step-card">
    <td class="step-num">6</td>
    <div class="step-content">
      <h4>1H — Timing de Entrada (4 min)</h4>
      <p>
      <strong>O que registrar:</strong><br>
      • RSI 1H: sobrevendido / sobrecomprado / divergência?<br>
      • MACD 1H: cruzamento ou em construção?<br>
      • Padrão de vela: martelo / engolfo / doji + confirmação?<br>
      • Ichimoku 1H: TK Cross / nuvem / Chikou?<br>
      • Ponto de entrada preciso: preço de entrada, stop, TP1/TP2/TP3
      </p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Fase 3 do Protocolo — Decisão e Execução (10 min)</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">7</div>
    <div class="step-content">
      <h4>Scorecard STMP (5 min)</h4>
      <p>Preencher os 12 critérios do scorecard com base na análise das fases 1 e 2. Contar: aprovados / parciais / reprovados. Verificar critérios críticos. Score ≥ 8/12 sem críticos reprovados = qualifica para entrada.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">8</div>
    <div class="step-content">
      <h4>Cálculo de Risco e Sizing (3 min)</h4>
      <p>
      <strong>Fórmula:</strong> Risco por trade = 1–2% do portfólio total.<br>
      <strong>Cálculo do tamanho:</strong> Tamanho = (Portfólio × % Risco) ÷ (Entrada − Stop Loss)<br>
      <strong>Verificar:</strong> R:R mínimo de 1:2 calculado. Ajustar sizing pelos modificadores: F&G extremo (−30%), contra-tendência Daily (−40%), score 5/12 (−30%).<br>
      <strong>Resultado:</strong> Quantidade exata a comprar e o custo total da posição.
      </p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">9</div>
    <div class="step-content">
      <h4>Execução e Registro (2 min)</h4>
      <p>Se score qualifica: executar Entrada 1 (40% da posição) + configurar alerta para Entrada 2 + configurar ordens de TP1, TP2, TP3 na exchange. Registrar no diário: data/hora, preço de entrada, stop, TPs, score STMP, razão da entrada em 1 frase.</p>
      <p>Se score NÃO qualifica: registrar "monitoramento ativo" + o que precisa mudar para qualificar. Configurar alertas nos níveis críticos. Aguardar sem operar.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> O Documento de Análise Diária — Template Completo</h2>

<div class="callout callout-gold">
  <div class="callout-title">📋 Template — Preencher Todo Dia de Análise</div>
  <p style="font-family: var(--font-mono); font-size: 12px; line-height: 2; color: var(--gray1)">
  <span style="color:var(--gold)">═══ ANÁLISE DIÁRIA TMP ═══</span><br>
  Data: ___ / Horário: ___<br>
  Ativo principal: ___ / Preço atual: ___<br><br>

  <span style="color:var(--bright)">── CONTEXTO MACRO ──</span><br>
  Fear & Greed: ___ / Tendência F&G 7d: ___<br>
  BTC variação 24h: ___ / Estado: ___<br>
  BTC.D: ___ / Regime: ___<br>
  Notícia 1: ___ → SCN: [Imp] [Tim] [Fonte] [Viés]<br>
  Notícia 2: ___ → SCN: [Imp] [Tim] [Fonte] [Viés]<br>
  Exchange Flow: ___ / Whale alerts: ___<br>
  Macro CP: ___ | Macro MP: ___<br><br>

  <span style="color:var(--cyan)">── ANÁLISE TÉCNICA ──</span><br>
  Daily → Estrutura: ___ / HTF: ___ / ADX: ___ / Nuvem: ___<br>
  4H → Estrutura: ___ / HTF: ___ / ADX: ___ / RSI: ___ / MACD: ___<br>
  1H → RSI: ___ / MACD: ___ / Vela: ___ / Ichimoku: ___<br>
  Zona de entrada: ___ / Stop: ___ / TP1: ___ / TP2: ___ / TP3: ___<br><br>

  <span style="color:var(--green)">── DECISÃO ──</span><br>
  Score STMP: ___ /12 (✓: ___ / ⚠️: ___ / ✗: ___)<br>
  Critérios críticos reprovados: ___<br>
  Sizing calculado: ___ / Modificadores aplicados: ___<br>
  R:R calculado: 1:___<br>
  Decisão: □ ENTRAR (E1 = ___) / □ AGUARDAR (falta: ___) / □ NÃO OPERAR<br><br>

  <span style="color:var(--gray2)">Notas adicionais: ___</span>
  </p>
</div>

<h2><span class="h2-num">6</span> Protocolo Aplicado — XRP 23/02/2026 Completo</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Documento de Análise Real do Dia</div>
  <p style="font-size:13px;line-height:2">
  <strong>Data:</strong> 23/02/2026 / <strong>Horário:</strong> 09h00 / <strong>Ativo:</strong> XRP/USDT / <strong>Preço:</strong> $1.3301<br><br>
  <strong>MACRO:</strong> F&G = 5 (Terror Extremo, caindo). BTC −3.2% 24h. BTC.D 56.6% (Bitcoin Season). Realizações XRP $1.93B (bearish CP). SBI Holdings $64.5M XRPL (bullish MP). Tarifas Trump (bearish imediato). Macro CP: NEGATIVO. Macro MP: NEUTRO→POSITIVO.<br><br>
  <strong>TÉCNICA:</strong><br>
  Daily: Downtrend LH+LL / HTF BEAR / ADX 40.6 BEAR / Abaixo da nuvem / S1 em $1.30–$1.35<br>
  4H: Downtrend / HTF BEAR / ADX 23.4 caindo / RSI ~35 sem divergência / MACD bearish desacelerando<br>
  1H: Bounce técnico / HTF BULL / RSI ~28 + divergência bullish / MACD desacelerando / Martelos em formação<br>
  Zona: $1.33 / Stop: $1.2821 / TP1: $1.48 / TP2: $1.65 / TP3: $1.93<br><br>
  <strong>DECISÃO:</strong> Score 4/12 ✓ + 4/12 ⚠️ + 4/12 ✗. 3 críticos reprovados (BTC.D, Macro, HTF Daily). <strong>→ AGUARDAR.</strong> Falta: BTC.D cair &lt;54%, macro estabilizar, 4H HTF virar BULL.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo as 3 fases do protocolo: Contexto (20min) + Técnica (15min) + Decisão (10min)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Salvei o template de análise diária para usar a partir de amanhã</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei calcular o sizing com a fórmula: (Portfólio × %Risco) ÷ (Entrada − Stop)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo quando registrar "ENTRAR" vs "AGUARDAR" vs "NÃO OPERAR"</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Preenchi o documento completo para XRP 23/02/2026 como exercício prático</div></div>
</div>`,

  "mtf-matrix": `
<div class="blockquote">
  <div class="blockquote-text">Uma matriz não é uma planilha. É uma forma de pensar — um sistema que transforma múltiplas variáveis em uma decisão clara. Quando você domina a Matriz MTF, você não analisa o mercado. Você o lê.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> O Que é a Matriz MTF</h2>
<p>A Matriz MTF é o <strong>instrumento de síntese final</strong> do método TMP — o ponto onde toda a análise multi-timeframe converge em uma única tabela visual que mostra, de forma objetiva e sem ambiguidade, o estado completo do ativo nos três timeframes e a decisão resultante.</p>
<p>Ela elimina a subjetividade: em vez de "parece que está subindo no 1H então talvez entro", você tem uma grade com valores objetivos que produz uma pontuação. A decisão não é sua — é do processo. Você é apenas o executor.</p>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Matriz MTF — Resultado XRP 23/02/2026 (Score = −5)</div>
  <svg viewBox="0 0 720 205" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- Header row -->
    <rect x="10" y="10" width="180" height="26" rx="4" fill="#1e3a5f" opacity=".5"/>
    <text x="100" y="27" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif" font-weight="700">Dimensão</text>
    <rect x="196" y="10" width="155" height="26" rx="4" fill="#f0a500" opacity=".12"/>
    <text x="273" y="27" text-anchor="middle" font-size="10.5" fill="#f0a500" font-family="sans-serif" font-weight="700">Daily ×3</text>
    <rect x="357" y="10" width="155" height="26" rx="4" fill="#3d8fef" opacity=".12"/>
    <text x="434" y="27" text-anchor="middle" font-size="10.5" fill="#3d8fef" font-family="sans-serif" font-weight="700">4H ×3</text>
    <rect x="518" y="10" width="120" height="26" rx="4" fill="#00c4e8" opacity=".10"/>
    <text x="578" y="27" text-anchor="middle" font-size="10.5" fill="#00c4e8" font-family="sans-serif" font-weight="700">1H ×3</text>
    <rect x="644" y="10" width="66" height="26" rx="4" fill="#1e3a5f" opacity=".5"/>
    <text x="677" y="27" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif" font-weight="700">Total</text>

    <!-- Rows: Estrutura, HTF, ADX, RSI, MACD, Ichimoku, S/R -->
    <!-- helper: y positions for 7 rows -->
    <!-- y = 42, 62, 82, 102, 122, 142, 162 -->
    <!-- Row 1: Estrutura -->
    <text x="18" y="55" font-size="9.5" fill="#607d8b" font-family="sans-serif">Estrutura</text>
    <rect x="196" y="40" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="273" y="53" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">LH+LL  −1</text>
    <rect x="357" y="40" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="434" y="53" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">LH+LL  −1</text>
    <rect x="518" y="40" width="120" height="18" rx="3" fill="#f0a500" opacity=".12"/>
    <text x="578" y="53" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">Range  0</text>
    <text x="677" y="53" text-anchor="middle" font-size="9.5" fill="#e8394a" font-family="monospace" font-weight="700">−6</text>

    <!-- Row 2: HTF -->
    <text x="18" y="75" font-size="9.5" fill="#607d8b" font-family="sans-serif">HTF Trend</text>
    <rect x="196" y="60" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="273" y="73" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">BEAR  −1</text>
    <rect x="357" y="60" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="434" y="73" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">BEAR  −1</text>
    <rect x="518" y="60" width="120" height="18" rx="3" fill="#00d68f" opacity=".12"/>
    <text x="578" y="73" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">BULL  +1</text>
    <text x="677" y="73" text-anchor="middle" font-size="9.5" fill="#e8394a" font-family="monospace" font-weight="700">−3</text>

    <!-- Row 3: ADX -->
    <text x="18" y="95" font-size="9.5" fill="#607d8b" font-family="sans-serif">ADX</text>
    <rect x="196" y="80" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="273" y="93" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">40.6 Bear  −1</text>
    <rect x="357" y="80" width="155" height="18" rx="3" fill="#f0a500" opacity=".12"/>
    <text x="434" y="93" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">23 caindo  0</text>
    <rect x="518" y="80" width="120" height="18" rx="3" fill="#f0a500" opacity=".12"/>
    <text x="578" y="93" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">33  0</text>
    <text x="677" y="93" text-anchor="middle" font-size="9.5" fill="#e8394a" font-family="monospace" font-weight="700">−2</text>

    <!-- Row 4: RSI -->
    <text x="18" y="115" font-size="9.5" fill="#607d8b" font-family="sans-serif">RSI</text>
    <rect x="196" y="100" width="155" height="18" rx="3" fill="#00d68f" opacity=".12"/>
    <text x="273" y="113" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">~30 sob  +1</text>
    <rect x="357" y="100" width="155" height="18" rx="3" fill="#00d68f" opacity=".12"/>
    <text x="434" y="113" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">~35 sob  +1</text>
    <rect x="518" y="100" width="120" height="18" rx="3" fill="#00d68f" opacity=".15"/>
    <text x="578" y="113" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">28+div  +1</text>
    <text x="677" y="113" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="monospace" font-weight="700">+6</text>

    <!-- Row 5: MACD -->
    <text x="18" y="135" font-size="9.5" fill="#607d8b" font-family="sans-serif">MACD</text>
    <rect x="196" y="120" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="273" y="133" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">Bearish  −1</text>
    <rect x="357" y="120" width="155" height="18" rx="3" fill="#f0a500" opacity=".12"/>
    <text x="434" y="133" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">Desacel  0</text>
    <rect x="518" y="120" width="120" height="18" rx="3" fill="#f0a500" opacity=".12"/>
    <text x="578" y="133" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">Desacel  0</text>
    <text x="677" y="133" text-anchor="middle" font-size="9.5" fill="#e8394a" font-family="monospace" font-weight="700">−2</text>

    <!-- Row 6: Ichimoku -->
    <text x="18" y="155" font-size="9.5" fill="#607d8b" font-family="sans-serif">Ichimoku</text>
    <rect x="196" y="140" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="273" y="153" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">Abaixo  −1</text>
    <rect x="357" y="140" width="155" height="18" rx="3" fill="#e8394a" opacity=".15"/>
    <text x="434" y="153" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace">Abaixo  −1</text>
    <rect x="518" y="140" width="120" height="18" rx="3" fill="#f0a500" opacity=".12"/>
    <text x="578" y="153" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">Próximo  0</text>
    <text x="677" y="153" text-anchor="middle" font-size="9.5" fill="#e8394a" font-family="monospace" font-weight="700">−4</text>

    <!-- Row 7: S/R -->
    <text x="18" y="175" font-size="9.5" fill="#607d8b" font-family="sans-serif">S/R Posição</text>
    <rect x="196" y="160" width="155" height="18" rx="3" fill="#00d68f" opacity=".12"/>
    <text x="273" y="173" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">Suporte  +1</text>
    <rect x="357" y="160" width="155" height="18" rx="3" fill="#00d68f" opacity=".12"/>
    <text x="434" y="173" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">Suporte  +1</text>
    <rect x="518" y="160" width="120" height="18" rx="3" fill="#00d68f" opacity=".12"/>
    <text x="578" y="173" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">Suporte  +1</text>
    <text x="677" y="173" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="monospace" font-weight="700">+6</text>

    <!-- Total row -->
    <rect x="644" y="185" width="66" height="18" rx="4" fill="#e8394a" opacity=".2"/>
    <text x="677" y="197" text-anchor="middle" font-size="11" fill="#e8394a" font-family="monospace" font-weight="900">−5</text>
    <text x="400" y="197" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Score −5 → Adverso → NÃO OPERAR long</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> A Estrutura da Matriz — 7 Dimensões × 3 Timeframes</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Dimensão</th><th>Daily</th><th>4H</th><th>1H</th><th>Peso</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">1. Estrutura</td>
    <td>HH+HL / LH+LL / Range</td>
    <td>HH+HL / LH+LL / Range</td>
    <td>HH+HL / LH+LL / Range</td>
    <td class="td-gold td-em">×3</td>
  </tr>
  <tr>
    <td class="td-em td-bright">2. HTF Trend</td>
    <td>BULL / BEAR</td>
    <td>BULL / BEAR</td>
    <td>BULL / BEAR</td>
    <td class="td-bright td-em">×3</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">3. ADX</td>
    <td>&lt;20 / 20–30 / 30–50 / &gt;50</td>
    <td>&lt;20 / 20–30 / 30–50 / &gt;50</td>
    <td>&lt;20 / 20–30 / 30–50 / &gt;50</td>
    <td class="td-cyan td-em">×2</td>
  </tr>
  <tr>
    <td class="td-em td-green">4. RSI</td>
    <td>Zona + Divergência</td>
    <td>Zona + Divergência</td>
    <td>Zona + Divergência</td>
    <td class="td-green td-em">×2</td>
  </tr>
  <tr>
    <td class="td-em" style="color:var(--amber)">5. MACD</td>
    <td>Bull / Bear / Neutro</td>
    <td>Bull / Bear / Neutro</td>
    <td>Bull / Bear / Neutro</td>
    <td style="color:var(--amber)" class="td-em">×2</td>
  </tr>
  <tr>
    <td class="td-em td-red">6. Ichimoku</td>
    <td>Acima / Dentro / Abaixo da nuvem</td>
    <td>Acima / Dentro / Abaixo da nuvem</td>
    <td>Acima / Dentro / Abaixo da nuvem</td>
    <td class="td-red td-em">×2</td>
  </tr>
  <tr>
    <td class="td-em td-gold">7. S/R Posição</td>
    <td>Suporte / Resistência / Meio</td>
    <td>Suporte / Resistência / Meio</td>
    <td>Suporte / Resistência / Meio</td>
    <td class="td-gold td-em">×2</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> Sistema de Pontuação da Matriz</h2>
<p>Cada célula da matriz recebe uma pontuação de acordo com sua leitura para o trade pretendido (long ou short):</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Estado</th><th>Pontuação para Long</th><th>Pontuação para Short</th></tr></thead>
<tbody>
  <tr><td class="td-em td-green">Claramente favorável</td><td class="td-green">+1</td><td class="td-red">−1</td></tr>
  <tr><td class="td-em td-gold">Neutro / Ambíguo</td><td class="td-gold">0</td><td class="td-gold">0</td></tr>
  <tr><td class="td-em td-red">Claramente desfavorável</td><td class="td-red">−1</td><td class="td-green">+1</td></tr>
</tbody>
</table>
</div>

<p>O score máximo possível é <strong>+21</strong> (todas as 7 dimensões × 3 TFs favoráveis com peso máximo) e mínimo <strong>−21</strong>. Na prática:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Score Matriz</th><th>Qualidade do Setup</th><th>Ação TMP</th><th>Sizing</th></tr></thead>
<tbody>
  <tr><td class="td-em td-red">−21 a −8</td><td class="td-red">Setup inverso — trade oposto se qualifica</td><td class="td-red">NÃO entrar na direção pretendida</td><td>0%</td></tr>
  <tr><td class="td-em" style="color:#e67e22">−7 a 0</td><td style="color:#e67e22">Adverso a neutro</td><td style="color:#e67e22">Aguardar. Mercado não está alinhado.</td><td>0%</td></tr>
  <tr><td class="td-em td-gold">+1 a +6</td><td class="td-gold">Fraco — abaixo do mínimo</td><td>Monitorar. Não operar ainda.</td><td>0%</td></tr>
  <tr><td class="td-em td-cyan">+7 a +10</td><td class="td-cyan">Mínimo aceitável</td><td>Entrada possível com sizing reduzido.</td><td>50%</td></tr>
  <tr><td class="td-em td-bright">+11 a +15</td><td class="td-bright">Bom setup</td><td>Entrada com tamanho normal. R:R sólido.</td><td>80–100%</td></tr>
  <tr><td class="td-em td-gold">+16 a +21</td><td class="td-gold td-em">Setup de convicção máxima</td><td><strong>Entrada com tamanho aumentado.</strong> Raro e poderoso.</td><td>100–120%</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> A Matriz Preenchida — XRP Long em 23/02/2026</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Dimensão</th><th>Daily</th><th>Score D</th><th>4H</th><th>Score 4H</th><th>1H</th><th>Score 1H</th><th>Peso</th><th>Total</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em">Estrutura</td>
    <td class="td-red">LH+LL (Bear)</td>
    <td class="td-red">−1</td>
    <td class="td-red">LH+LL (Bear)</td>
    <td class="td-red">−1</td>
    <td class="td-gold">Range/Micro</td>
    <td class="td-gold">0</td>
    <td class="td-gold">×3</td>
    <td class="td-red">−6</td>
  </tr>
  <tr>
    <td class="td-em">HTF Trend</td>
    <td class="td-red">BEAR</td>
    <td class="td-red">−1</td>
    <td class="td-red">BEAR</td>
    <td class="td-red">−1</td>
    <td class="td-green">BULL</td>
    <td class="td-green">+1</td>
    <td class="td-gold">×3</td>
    <td class="td-red">−3</td>
  </tr>
  <tr>
    <td class="td-em">ADX</td>
    <td class="td-red">40.6 Bear forte</td>
    <td class="td-red">−1</td>
    <td class="td-gold">23.4 fraco/caindo</td>
    <td class="td-gold">0</td>
    <td class="td-gold">33.3 ambíguo</td>
    <td class="td-gold">0</td>
    <td class="td-cyan">×2</td>
    <td class="td-red">−2</td>
  </tr>
  <tr>
    <td class="td-em">RSI</td>
    <td class="td-gold">~30 sobrevendido</td>
    <td class="td-green">+1</td>
    <td class="td-gold">~35 sobrevendido</td>
    <td class="td-green">+1</td>
    <td class="td-green">~28 + divergência</td>
    <td class="td-green">+1</td>
    <td class="td-green">×2</td>
    <td class="td-green">+6</td>
  </tr>
  <tr>
    <td class="td-em">MACD</td>
    <td class="td-red">Bearish</td>
    <td class="td-red">−1</td>
    <td class="td-gold">Desacelerando</td>
    <td class="td-gold">0</td>
    <td class="td-gold">Desacelerando</td>
    <td class="td-gold">0</td>
    <td style="color:var(--amber)">×2</td>
    <td class="td-red">−2</td>
  </tr>
  <tr>
    <td class="td-em">Ichimoku</td>
    <td class="td-red">Abaixo da nuvem</td>
    <td class="td-red">−1</td>
    <td class="td-red">Abaixo da nuvem</td>
    <td class="td-red">−1</td>
    <td class="td-gold">Próximo da nuvem</td>
    <td class="td-gold">0</td>
    <td class="td-red">×2</td>
    <td class="td-red">−4</td>
  </tr>
  <tr>
    <td class="td-em">S/R Posição</td>
    <td class="td-green">Suporte S1</td>
    <td class="td-green">+1</td>
    <td class="td-green">Suporte S1</td>
    <td class="td-green">+1</td>
    <td class="td-green">Suporte confluente</td>
    <td class="td-green">+1</td>
    <td class="td-gold">×2</td>
    <td class="td-green">+6</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">📊 Score Final da Matriz</div>
  <p>
  <strong>Soma ponderada:</strong> −6 −3 −2 +6 −2 −4 +6 = <strong>−5</strong><br><br>
  <strong>Interpretação:</strong> Score −5 = "Adverso a neutro" → <strong>NÃO OPERAR</strong> long neste momento.<br><br>
  O RSI e S/R fornecem suporte técnico (+12 pontos combinados), mas a estrutura bearish dominante em Daily e 4H, combinada com Ichimoku adverso, sobrepõe os sinais positivos.<br><br>
  <strong>Conclusão da Matriz:</strong> Confirma o scorecard STMP — aguardar. A Matriz é objetiva e removeu qualquer ambiguidade: mesmo com 3 dimensões favoráveis, o setup long não qualifica neste momento.<br><br>
  <strong>Para qualificar:</strong> Estrutura precisa mudar para pelo menos neutro no 4H (+3 pts) e HTF Trend 4H virar BULL (+3 pts). Isso elevaria o score para +1, ainda abaixo do mínimo de +7. Adicionalmente o MACD 4H cruzando bullish (+2 pts) completaria o mínimo.
  </p>
</div>

<h2><span class="h2-num">5</span> Usando a Matriz no Dia a Dia — Workflow Rápido</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">⚡</div>
    <div class="step-content">
      <h4>Versão Rápida (5 minutos) — Triagem Diária</h4>
      <p>Preencha apenas as 3 dimensões mais críticas: Estrutura, HTF Trend e S/R Posição. Se o score parcial já for muito negativo (abaixo de −6), o trade não qualifica sem preencher o resto. Isso filtra 80% dos dias sem trade em menos de 5 minutos.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">📊</div>
    <div class="step-content">
      <h4>Versão Completa (10 minutos) — Quando Setup em Formação</h4>
      <p>Quando a triagem rápida dá score ≥ +3 (setup potencial), preencha todas as 7 dimensões. O score completo define sizing e confiança. Configure a planilha uma vez no Google Sheets e reutilize diariamente — apenas atualize os valores.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">📅</div>
    <div class="step-content">
      <h4>Rastreamento Histórico — Aprenda Com os Dados</h4>
      <p>Salve a matriz de cada dia que você analisou. Após 30 dias, você terá dados suficientes para identificar: em quais scores você ganhou mais (calibração do sistema para seu ativo), quais dimensões foram mais preditivas, quais timeframes foram mais confiáveis no seu estilo de trade.</p>
    </div>
  </div>
</div>

<div class="callout callout-success">
  <div class="callout-title">🏁 Fase 2 — Módulo MTF Concluído</div>
  <p>Você domina agora a análise multi-timeframe completa: a hierarquia de TFs, os 6 cenários de combinação, o protocolo de 45 minutos com documento estruturado e a Matriz MTF com sistema de pontuação objetivo. Combinado com tudo que você aprendeu nas aulas anteriores, você tem um sistema analítico completo e reproduzível.<br><br>
  <strong>Na Fase 3</strong>, você vai transformar toda essa análise em <strong>cenários probabilísticos quantificados</strong> — aprendendo a construir os 3 cenários (bullish, bearish, neutro) com probabilidades numéricas precisas, e como cada cenário define seu plano de ação.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a estrutura da Matriz: 7 dimensões × 3 timeframes com pesos diferentes</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei o sistema de pontuação: +1 favorável / 0 neutro / −1 desfavorável por célula</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo a tabela de scores: &lt;+7 não operar / +7–10 mínimo / +11–15 bom / &gt;+16 máxima convicção</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Preenchi a Matriz para XRP long em 23/02/2026 e confirmei score −5 (não operar)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei quantos pontos precisam mudar e em quais dimensões para o setup qualificar</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Criei minha planilha da Matriz MTF no Google Sheets para uso diário</div></div>
</div>`,

  "probabilidade": `
<div class="blockquote">
  <div class="blockquote-text">O trading não é sobre ter certeza. É sobre ter razão com a frequência suficiente para que, quando você estiver errado, as perdas sejam pequenas, e quando você estiver certo, os ganhos sejam grandes. Isso é pensar em probabilidades.</div>
  <div class="blockquote-author">— George Soros · Soros on Soros</div>
</div>

<h2><span class="h2-num">1</span> Por Que Pensar em Probabilidades Muda Tudo</h2>
<p>A transição mais importante na evolução de um trader não é aprender um novo indicador ou estratégia. É a mudança de mentalidade de <strong>"vou ganhar nesse trade"</strong> para <strong>"esse trade tem X% de probabilidade de atingir meu alvo, e Y% de probabilidade de atingir meu stop"</strong>.</p>
<p>Essa mudança é fundamental porque elimina o ego do processo de decisão. Quando você pensa em probabilidades, uma perda não é um fracasso pessoal — é o resultado esperado de um cenário que você já havia calculado com antecedência. Você não perdeu porque foi burro. Você perdeu porque o cenário de menor probabilidade se materializou, exatamente como os dados indicavam que poderia acontecer.</p>

<div class="callout callout-gold">
  <div class="callout-title">💡 A Diferença entre o Trader Amador e o Profissional</div>
  <p>
  <strong>Trader amador:</strong> "Estou certo? Estou errado? Esse trade vai me fazer rico ou me arruinar?"<br>
  <strong>Trader profissional:</strong> "Dado meu processo de análise, esse setup tem ~65% de probabilidade de atingir TP1 com R:R de 1:2.5. Isso significa que em 100 trades similares, minha expectativa é de +62.5R. Vou executar."<br><br>
  O profissional não sabe o resultado do próximo trade. Mas sabe que seu processo, repetido consistentemente, é lucrativo no longo prazo. Isso elimina a ansiedade do resultado individual.
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Expectativa Matemática — Por Que Win Rate Sozinho Não Basta</div>
  <svg viewBox="0 0 720 185" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- System A: high win rate but low RR -->
    <rect x="15" y="15" width="215" height="155" rx="8" fill="#0a1628" stroke="#e8394a" stroke-width="1.5"/>
    <rect x="15" y="15" width="215" height="28" rx="8" fill="#e8394a" opacity=".1"/>
    <text x="122" y="34" text-anchor="middle" font-size="10.5" fill="#e8394a" font-family="sans-serif" font-weight="700">Sistema A — Intuitivo</text>
    <text x="25" y="62" font-size="10" fill="#607d8b" font-family="monospace">Win Rate:   <tspan fill="#00d68f">70%</tspan></text>
    <text x="25" y="80" font-size="10" fill="#607d8b" font-family="monospace">R:R médio: <tspan fill="#e8394a">1:0.8</tspan></text>
    <text x="25" y="98" font-size="10" fill="#607d8b" font-family="monospace">50 trades/mês</text>
    <line x1="25" y1="108" x2="200" y2="108" stroke="#1e3a5f" stroke-width="1"/>
    <text x="25" y="126" font-size="10" fill="#607d8b" font-family="monospace">Expectativa:</text>
    <text x="122" y="142" text-anchor="middle" font-size="12" fill="#e8394a" font-family="monospace" font-weight="700">(0.70×0.8)−(0.30×1)</text>
    <text x="122" y="158" text-anchor="middle" font-size="12" fill="#e8394a" font-family="monospace" font-weight="700">= −0.04R/trade</text>

    <!-- vs label -->
    <text x="253" y="98" text-anchor="middle" font-size="14" fill="#607d8b" font-family="sans-serif" font-weight="700">VS</text>

    <!-- System B: lower win rate but good RR -->
    <rect x="284" y="15" width="215" height="155" rx="8" fill="#0a1628" stroke="#00d68f" stroke-width="2"/>
    <rect x="284" y="15" width="215" height="28" rx="8" fill="#00d68f" opacity=".10"/>
    <text x="391" y="34" text-anchor="middle" font-size="10.5" fill="#00d68f" font-family="sans-serif" font-weight="700">Sistema B — TMP</text>
    <text x="294" y="62" font-size="10" fill="#607d8b" font-family="monospace">Win Rate:   <tspan fill="#f0a500">52%</tspan></text>
    <text x="294" y="80" font-size="10" fill="#607d8b" font-family="monospace">R:R médio: <tspan fill="#00d68f">1:2.5</tspan></text>
    <text x="294" y="98" font-size="10" fill="#607d8b" font-family="monospace">8 trades/mês</text>
    <line x1="294" y1="108" x2="490" y2="108" stroke="#1e3a5f" stroke-width="1"/>
    <text x="294" y="126" font-size="10" fill="#607d8b" font-family="monospace">Expectativa:</text>
    <text x="391" y="142" text-anchor="middle" font-size="12" fill="#00d68f" font-family="monospace" font-weight="700">(0.52×2.5)−(0.48×1)</text>
    <text x="391" y="158" text-anchor="middle" font-size="12" fill="#00d68f" font-family="monospace" font-weight="700">= +0.82R/trade</text>

    <!-- Result comparison -->
    <rect x="520" y="15" width="185" height="155" rx="8" fill="#0a1628" stroke="#f0a500" stroke-width="1.5"/>
    <text x="612" y="34" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">Resultado Mensal</text>
    <text x="530" y="68" font-size="10" fill="#e8394a" font-family="monospace">Sistema A:</text>
    <text x="530" y="85" font-size="11" fill="#e8394a" font-family="monospace" font-weight="700">50×(−0.04) = −2R</text>
    <text x="530" y="100" font-size="9" fill="#607d8b" font-family="sans-serif">Perde R mesmo com</text>
    <text x="530" y="112" font-size="9" fill="#607d8b" font-family="sans-serif">70% win rate!</text>
    <line x1="530" y1="122" x2="695" y2="122" stroke="#1e3a5f" stroke-width="1"/>
    <text x="530" y="136" font-size="10" fill="#00d68f" font-family="monospace">Sistema B:</text>
    <text x="530" y="153" font-size="11" fill="#00d68f" font-family="monospace" font-weight="700">8×0.82 = +6.6R</text>
    <text x="530" y="168" font-size="9" fill="#607d8b" font-family="sans-serif">6× menos trades</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> Os 3 Pilares do Pensamento Probabilístico</h2>

<div class="steps">
  <div class="step-card" style="border-left: 3px solid var(--gold)">
    <div class="step-num" style="background: linear-gradient(135deg,#7B5C00,#f0a500)">①</div>
    <div class="step-content">
      <h4>Pilar 1 — Expectativa Matemática (Edge)</h4>
      <p>A <strong>expectativa matemática</strong> responde: "Se eu executar este tipo de setup 100 vezes, qual é o resultado médio esperado?"</p>
      <p><strong>Fórmula:</strong> Expectativa = (Probabilidade de Ganho × Ganho Médio) − (Probabilidade de Perda × Perda Média)</p>
      <p><strong>Exemplo:</strong> Setup com 55% de win rate e R:R 1:2 → Expectativa = (0.55 × 2R) − (0.45 × 1R) = 1.1R − 0.45R = <strong>+0.65R por trade</strong>. Positivo = edge real.</p>
      <p><strong>Conclusão crítica:</strong> Você pode ter um win rate de apenas 40% e ainda ser muito lucrativo se o R:R for 1:3 ou melhor. Win rate sozinho não diz nada sobre lucratividade.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--bright)">
    <div class="step-num" style="background: linear-gradient(135deg,#0A3060,#3d8fef)">②</div>
    <div class="step-content">
      <h4>Pilar 2 — Lei dos Grandes Números</h4>
      <p>Um trade individual não prova nem disprova a qualidade do seu sistema. A lei dos grandes números diz que <strong>você precisa de pelo menos 30–50 trades similares</strong> antes de ter dados suficientes para julgar se seu edge é real.</p>
      <p><strong>Implicação prática:</strong> Nunca mude seu sistema após 5 trades perdedores. Nunca se sinta gênio após 5 trades ganhadores. Avalie o sistema apenas após amostras estatisticamente significativas.</p>
      <p><strong>Drawdown esperado:</strong> Mesmo um sistema com 60% de win rate pode ter sequências de 8–10 perdas consecutivas por pura variância. Isso é normal e esperado — não é falha do sistema.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--cyan)">
    <div class="step-num" style="background: linear-gradient(135deg,#004a5c,#00c4e8)">③</div>
    <div class="step-content">
      <h4>Pilar 3 — Gestão de Risco como Vantagem, Não Limitação</h4>
      <p>Traders amadores veem o stop loss como uma limitação — algo que os impede de "ter razão depois". Traders profissionais veem o stop loss como o que protege o capital necessário para executar os próximos 50 trades do sistema.</p>
      <p><strong>A aritmética da recuperação:</strong></p>
      <ul style="font-size:13px;line-height:2;margin-top:4px">
        <li>Perda de 10% do portfólio → precisa de +11% para recuperar</li>
        <li>Perda de 25% → precisa de +33% para recuperar</li>
        <li>Perda de 50% → precisa de +100% para recuperar</li>
        <li>Perda de 75% → precisa de +300% para recuperar</li>
      </ul>
      <p style="margin-top:8px"><strong>Conclusão:</strong> A única forma de sobreviver longo prazo no mercado é proteger o capital das perdas grandes. Um stop loss de 2% por trade, mesmo com 10 perdas consecutivas, deixa você com 82% do capital — ainda na luta.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">3</span> Como Estimar Probabilidades no TMP</h2>
<p>No método TMP, as probabilidades dos cenários não são inventadas — elas são derivadas de forma sistemática com base em 4 fatores objetivos:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Fator</th><th>Peso na Probabilidade</th><th>Como Avaliar</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Score STMP / Matriz MTF</td>
    <td class="td-gold">40%</td>
    <td>Score mais alto = probabilidade base maior. Score 16+/21 = ponto de partida ~70%. Score 7–10 = ponto de partida ~50%.</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Alinhamento de Timeframes</td>
    <td class="td-bright">25%</td>
    <td>Todos os TFs alinhados +15% na probabilidade. 2/3 alinhados = neutro. 1/3 ou 0/3 = −15%.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Qualidade da Zona de S/R</td>
    <td class="td-cyan">20%</td>
    <td>S/R S1 (máxima confluência) = +10%. S/R S2 = neutro. S/R fraco = −10%.</td>
  </tr>
  <tr>
    <td class="td-em td-green">Contexto Macro (Fase 1)</td>
    <td class="td-green">15%</td>
    <td>Macro favorável = +8%. Macro neutro = 0%. Macro adverso (tarifas, crise) = −10%.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Tabela de Expectativa — Construindo o Edge do TMP</h2>
<p>Com base em dados históricos de setups similares, o método TMP tem as seguintes estatísticas de expectativa por tipo de setup:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Tipo de Setup</th><th>Win Rate Histórico</th><th>R:R Médio</th><th>Expectativa por Trade</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Score +16–21 + Todos TFs alinhados + S/R S1</td>
    <td class="td-green">~68%</td>
    <td>1:3.2</td>
    <td class="td-green td-em">+1.66R</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Score +11–15 + 2 TFs alinhados + S/R S1</td>
    <td class="td-green">~60%</td>
    <td>1:2.5</td>
    <td class="td-green td-em">+1.00R</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Score +7–10 + Setup padrão</td>
    <td class="td-gold">~52%</td>
    <td>1:2.0</td>
    <td class="td-gold td-em">+0.52R</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Contra-tendência Daily (sizing −40%)</td>
    <td class="td-gold">~45%</td>
    <td>1:2.5</td>
    <td class="td-gold td-em">+0.43R (sizing reduzido)</td>
  </tr>
  <tr>
    <td class="td-em td-red">Score abaixo de +7</td>
    <td class="td-red">~38%</td>
    <td>1:1.5</td>
    <td class="td-red td-em">−0.05R (edge negativo!)</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ Por Que Não Operar Abaixo do Score Mínimo</div>
  <p>A última linha da tabela responde definitivamente: um setup com score abaixo de +7 tem expectativa <strong>negativa</strong> (−0.05R). Isso significa que, operando esses setups, você perde dinheiro em média — mesmo que ocasionalmente ganhe trades individuais.<br><br>
  A disciplina de só operar quando o score qualifica não é conservadorismo excessivo. É a única forma matematicamente racional de operar.</p>
</div>

<h2><span class="h2-num">5</span> Probabilidade Aplicada — XRP 23/02/2026</h2>

<div class="callout callout-info">
  <div class="callout-title">📊 Cálculo de Probabilidade do Setup Long</div>
  <p>
  <strong>Score STMP:</strong> 4/12 aprovados + 4/12 parciais → Score base: ~40%<br>
  <strong>Alinhamento MTF:</strong> Daily BEAR + 4H BEAR + 1H BULL = 1/3 alinhado → −15%<br>
  <strong>S/R:</strong> Zona S1 de máxima confluência → +10%<br>
  <strong>Macro:</strong> F&G=5 (favorável médio prazo) mas tarifas + BTC.D adversos → −5%<br><br>
  <strong>Probabilidade estimada de atingir TP1 ($1.48):</strong> 40 −15 +10 −5 = <strong>~30%</strong><br>
  <strong>Probabilidade de atingir TP2 ($1.65):</strong> ~18%<br>
  <strong>Probabilidade de stop ($1.2821):</strong> ~70%<br><br>
  <strong>Expectativa com esses números:</strong> (0.30 × 1.5R) + (0.18 × 2.5R) − (0.70 × 1R) = 0.45 + 0.45 − 0.70 = <strong>+0.20R</strong><br><br>
  Expectativa marginalmente positiva — mas com risco de 70% de hit no stop. Dado o alto risco de perda, sizing máximo deve ser 40% do normal (conforme regras de contra-tendência + macro adverso).
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 3 pilares: expectativa matemática, lei dos grandes números, gestão de risco</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei calcular a expectativa de um setup: (Win% × Ganho) − (Loss% × Perda)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizei a aritmética de recuperação: perda de 50% exige +100% para recuperar</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 4 fatores de estimativa de probabilidade e seus pesos relativos</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Calculei a probabilidade e expectativa do setup XRP 23/02/2026</div></div>
</div>`,

  "cenarios": `
<div class="blockquote">
  <div class="blockquote-text">Todo analista competente não prevê o que vai acontecer. Ele mapeia o que pode acontecer, com qual probabilidade, e o que fará em cada caso. A diferença entre previsão e cenário é a diferença entre apostador e profissional.</div>
  <div class="blockquote-author">— Nassim Nicholas Taleb · Antifragile</div>
</div>

<h2><span class="h2-num">1</span> O Que São Cenários e Por Que Substituem "Previsões"</h2>
<p>Nenhum analista — por mais experiente que seja — prevê com certeza o que o mercado vai fazer. Quem afirma isso está mentindo para você ou para si mesmo. O que analistas competentes fazem é algo completamente diferente: eles <strong>mapeiam os cenários possíveis</strong>, estimam a probabilidade de cada um e preparam um plano de ação para cada possibilidade.</p>
<p>Esta abordagem é superior à "previsão" por três razões: <strong>(1)</strong> você está preparado para qualquer resultado — não apenas para o cenário que você espera; <strong>(2)</strong> você remove o ego do processo — se o cenário previsto não se materializar, você simplesmente executa o plano do cenário que aconteceu; <strong>(3)</strong> você pode quantificar seu risco com precisão antes de entrar no trade.</p>

<div class="kpi-row kpi-row-3">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">Bullish</div><div class="kpi-label">Alta — compradores dominam</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">Bearish</div><div class="kpi-label">Baixa — vendedores dominam</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">Neutro</div><div class="kpi-label">Range — equilíbrio temporário</div></div>
</div>


<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Framework dos 3 Cenários — Probabilidades e Planos</div>
  <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">

    <!-- Current price point -->
    <circle cx="140" cy="100" r="8" fill="#f0a500"/>
    <text x="140" y="92" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">PREÇO</text>
    <text x="140" y="80" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Atual</text>
    <text x="140" y="118" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">$1.33</text>

    <!-- Fan lines -->
    <!-- C1 Bullish (top) -->
    <line x1="148" y1="95" x2="680" y2="30" stroke="#00d68f" stroke-width="2.5" stroke-dasharray="8,4"/>
    <!-- C2 Neutral (middle) -->
    <line x1="148" y1="100" x2="680" y2="100" stroke="#f0a500" stroke-width="2" stroke-dasharray="8,4"/>
    <!-- C3 Bearish (bottom) -->
    <line x1="148" y1="105" x2="680" y2="170" stroke="#e8394a" stroke-width="2.5" stroke-dasharray="8,4"/>

    <!-- Probability labels on lines -->
    <rect x="540" y="14" width="134" height="30" rx="5" fill="#0a1628" stroke="#00d68f" stroke-width="1.2"/>
    <text x="607" y="27" text-anchor="middle" font-size="11" fill="#00d68f" font-family="sans-serif" font-weight="700">C3 Bullish</text>
    <text x="607" y="40" text-anchor="middle" font-size="10" fill="#00d68f" font-family="monospace">35%  →  $1.65+</text>

    <rect x="540" y="85" width="134" height="30" rx="5" fill="#0a1628" stroke="#f0a500" stroke-width="1.2"/>
    <text x="607" y="98" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">C2 Neutro</text>
    <text x="607" y="111" text-anchor="middle" font-size="10" fill="#f0a500" font-family="monospace">15%  →  $1.28–$1.48</text>

    <rect x="540" y="154" width="134" height="30" rx="5" fill="#0a1628" stroke="#e8394a" stroke-width="1.2"/>
    <text x="607" y="167" text-anchor="middle" font-size="11" fill="#e8394a" font-family="sans-serif" font-weight="700">C1 Bearish</text>
    <text x="607" y="180" text-anchor="middle" font-size="10" fill="#e8394a" font-family="monospace">50%  →  $1.15–$1.00</text>

    <!-- Trigger zones (vertical markers) -->
    <line x1="340" y1="15" x2="340" y2="185" stroke="#607d8b" stroke-width="1" stroke-dasharray="4,4" opacity=".5"/>
    <text x="344" y="25" font-size="9" fill="#607d8b" font-family="sans-serif">Gatilhos</text>

    <!-- Trigger annotations -->
    <text x="345" y="58" font-size="8.5" fill="#00d68f" font-family="sans-serif">4H fecha &gt;$1.48</text>
    <text x="345" y="96" font-size="8.5" fill="#f0a500" font-family="sans-serif">range $1.28–$1.48</text>
    <text x="345" y="148" font-size="8.5" fill="#e8394a" font-family="sans-serif">Daily fecha &lt;$1.28</text>

    <!-- "Se X, então Y" label -->
    <rect x="158" y="155" width="155" height="36" rx="6" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="235" y="170" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Regra de Ouro:</text>
    <text x="235" y="184" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">"Se X → então Y"</text>
  </svg>
</div>

<h2><span class="h2-num">2</span> O Framework dos 3 Cenários</h2>
<p>Para cada ativo analisado, o método TMP constrói sempre 3 cenários mutuamente exclusivos e coletivamente exaustivos — eles cobrem todas as possibilidades relevantes e as probabilidades somam 100%:</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">C1</div>
  <div class="rule-content">
    <h4>Cenário Bullish — Alta Estrutural</h4>
    <p><strong>Definição:</strong> Os compradores retomam o controle, o preço rompe acima das resistências chave e estabelece nova tendência de alta no timeframe relevante.<br>
    <strong>Gatilhos de ativação:</strong> Os eventos técnicos e fundamentais que precisam ocorrer para este cenário se confirmar. Sem os gatilhos, o cenário permanece como possibilidade, não realidade.<br>
    <strong>Alvos:</strong> Sequência de resistências que o preço vai testar (TP1, TP2, TP3).<br>
    <strong>Plano de ação:</strong> O que você faz quando os gatilhos forem atingidos — entrada, sizing, stops, alvos.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">C2</div>
  <div class="rule-content">
    <h4>Cenário Neutro — Consolidação / Range</h4>
    <p><strong>Definição:</strong> O preço não rompe significativamente para nenhuma direção. Lateralização entre suporte e resistência. Mercado em equilíbrio temporário.<br>
    <strong>Gatilhos de ativação:</strong> Preço se mantendo dentro de uma faixa definida, sem rompimento confirmado de nenhum lado.<br>
    <strong>Alvos:</strong> A faixa de preço dentro da qual o ativo vai oscilar. Topo e base do range.<br>
    <strong>Plano de ação:</strong> Range trade (comprar na base, vender no topo) com alvos menores, ou aguardar rompimento confirmatório antes de agir.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">C3</div>
  <div class="rule-content">
    <h4>Cenário Bearish — Continuação da Queda</h4>
    <p><strong>Definição:</strong> Os vendedores mantêm o controle, o suporte atual é rompido e o preço continua o downtrend estabelecido.<br>
    <strong>Gatilhos de ativação:</strong> Rompimento confirmado do suporte atual com volume + fechamento de candle abaixo.<br>
    <strong>Alvos:</strong> Próximos suportes abaixo (zonas onde o preço pode encontrar compradores novamente).<br>
    <strong>Plano de ação:</strong> Sair de longs existentes imediatamente. Possível setup de short no reteste do suporte rompido (resistência).</p>
  </div>
</div>

<h2><span class="h2-num">3</span> Como Definir os Gatilhos de Cada Cenário</h2>
<p>Os gatilhos são os eventos específicos que confirmam ou invalidam cada cenário. Eles precisam ser <strong>objetivos e verificáveis</strong> — não "quando parecer que está subindo" mas "quando o preço fechar acima de $X no 4H com volume Y% acima da média":</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Gatilho Técnico — O Mais Importante</h4>
      <p>Um nível de preço específico que, quando cruzado com fechamento de candle, confirma o cenário. Exemplos: "Fechamento 4H acima de $1.48 com volume 1.5× a média de 10 dias" (bullish) ou "Fechamento Daily abaixo de $1.30 com volume acima da média" (bearish).</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Gatilho de Indicador — Confirmação Adicional</h4>
      <p>Um estado específico de um ou mais indicadores. Exemplos: "HTF Trend 4H virando BULL" (bullish) ou "ADX Daily voltando a subir acima de 35 com HTF BEAR" (bearish). O gatilho de indicador confirma que não é apenas um false break do preço.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Gatilho Fundamental (opcional) — Catalisador Macro</h4>
      <p>Um evento específico de notícia ou dado que pode acelerar um cenário. Exemplos: "BTC.D caindo abaixo de 54%" (acelera bullish para altcoins) ou "Novo anúncio de tarifas ou dado macroeconômico negativo" (acelera bearish). Esses gatilhos são monitorados via alertas configurados.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Como Atribuir Probabilidades — O Processo</h2>
<p>A atribuição de probabilidades não é arbitrária. Ela segue um processo lógico baseado em evidências:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">A</div>
    <div class="step-content">
      <h4>Ponto de Partida — A Base Técnica</h4>
      <p>Comece com a análise MTF. Qual é o peso das evidências técnicas? Se 5 de 7 dimensões da Matriz apontam para bearish, o ponto de partida da probabilidade bearish é maior. Score MTF −5 → base bearish ~60–65%.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">B</div>
    <div class="step-content">
      <h4>Ajuste Fundamental — Adicione o Contexto da Fase 1</h4>
      <p>F&G em extremos é contrarian (ajusta para o cenário oposto). Dados on-chain de capitulação ajustam ligeiramente para bullish de médio prazo. Macro adverso (tarifas, crise) ajusta para bearish imediato.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">C</div>
    <div class="step-content">
      <h4>Calibração — Garantir que Soma 100%</h4>
      <p>As probabilidades dos 3 cenários devem somar exatamente 100%. Distribua os pontos percentuais de forma que nenhum cenário seja atribuído 0% (sempre existe alguma chance) nem nenhum exceda ~75% (o mercado sempre surpreende). Faixa usual: Cenário dominante 45–65%, outros 15–35%.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> O Plano de Ação de Cada Cenário — "Se X, então Y"</h2>
<p>Para cada cenário, o plano de ação é definido na forma de regras condicionais claras antes do evento ocorrer:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Cenário</th><th>Se acontecer (gatilho)</th><th>Então faço (ação)</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-green">C1 Bullish</td>
    <td>Fechamento 4H acima de $1.48 com volume + HTF 4H virando BULL</td>
    <td>Entrada 40% da posição em $1.49–$1.50. Stop $1.3821. Configurar alertas TP1 $1.65, TP2 $1.93.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">C2 Neutro</td>
    <td>Preço se mantendo em $1.30–$1.48 por mais de 5 dias sem rompimento</td>
    <td>Range trade: comprar bounce em $1.30–$1.33, vender em $1.43–$1.48. Alvos pequenos. Stops apertados.</td>
  </tr>
  <tr>
    <td class="td-em td-red">C3 Bearish</td>
    <td>Fechamento Daily abaixo de $1.28 com volume + ADX Daily subindo</td>
    <td>Zerar qualquer long existente imediatamente. Preparar short no reteste de $1.28–$1.30 (antigo suporte, nova resistência).</td>
  </tr>
</tbody>
</table>
</div>

<div class="callout callout-gold">
  <div class="callout-title">⭐ A Regra de Ouro dos Cenários</div>
  <p>Você define os planos de ação <strong>antes</strong> do cenário ocorrer — quando está calmo, com tempo para pensar, sem pressão emocional. Quando o gatilho for atingido no mercado ao vivo, você não precisa tomar decisão — você apenas <strong>executa o plano que já foi definido</strong>.<br><br>
  Isso remove 90% da ansiedade do trading. Você não está "esperando para ver o que vai acontecer e então decidir". Você está apenas esperando o gatilho que vai dizer qual dos seus planos pré-definidos executar.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que cenários são superiores a previsões</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei construir os 3 cenários: Bullish (C1), Neutro (C2) e Bearish (C3) com gatilhos e alvos</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo como atribuir probabilidades: base técnica + ajuste fundamental + calibração 100%</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Consigo construir o plano "Se X, então Y" para cada cenário antes do evento ocorrer</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Construí os 3 cenários para XRP com gatilhos técnicos específicos e planos de ação</div></div>
</div>`,

  "calc-prob": `
<div class="blockquote">
  <div class="blockquote-text">Números não mentem. Emoções mentem o tempo todo. Quando você tem um processo de cálculo objetivo, a emoção não tem onde entrar — porque a decisão já foi tomada antes da emoção aparecer.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> Da Análise Qualitativa ao Número — O Método de Cálculo</h2>
<p>Nas aulas anteriores você aprendeu os conceitos de probabilidade e a estrutura dos 3 cenários. Agora vamos ao processo prático e mecânico de <strong>transformar sua análise qualitativa em números concretos</strong> — probabilidades específicas, expectativas calculadas e sizing preciso.</p>
<p>Este processo elimina o maior risco do trading moderno: a <strong>ilusão de precisão sem base quantitativa</strong>. Muitos traders dizem "estou 70% confiante nesse trade" sem nenhum método para chegar a esse número. No TMP, o número é derivado de um processo — não de um sentimento.</p>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Saldo de Pontos → Probabilidade Bullish — XRP 23/02/2026</div>
  <svg viewBox="0 0 720 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- Bullish points bar -->
    <text x="18" y="28" font-size="10" fill="#00d68f" font-family="sans-serif" font-weight="700">Pontos Bullish  +37</text>
    <rect x="18" y="35" width="370" height="22" rx="4" fill="#00d68f" opacity=".15" stroke="#00d68f" stroke-width="1"/>
    <!-- segments -->
    <rect x="18" y="35" width="80" height="22" rx="4" fill="#00d68f" opacity=".3"/>
    <text x="58" y="50" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">RSI div +8</text>
    <rect x="100" y="35" width="80" height="22" rx="0" fill="#00d68f" opacity=".25"/>
    <text x="140" y="50" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">S/R S1 +8</text>
    <rect x="182" y="35" width="60" height="22" rx="0" fill="#00d68f" opacity=".2"/>
    <text x="212" y="50" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">F&amp;G +6</text>
    <rect x="244" y="35" width="50" height="22" rx="0" fill="#00d68f" opacity=".18"/>
    <text x="269" y="50" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">On-ch +5</text>
    <rect x="296" y="35" width="40" height="22" rx="0" fill="#00d68f" opacity=".15"/>
    <text x="316" y="50" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">ADX +4</text>
    <rect x="338" y="35" width="50" height="22" rx="4" fill="#00d68f" opacity=".12"/>
    <text x="363" y="50" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">Fib+Vol +6</text>

    <!-- Bearish points bar -->
    <text x="18" y="80" font-size="10" fill="#e8394a" font-family="sans-serif" font-weight="700">Pontos Bearish  −47</text>
    <rect x="18" y="87" width="470" height="22" rx="4" fill="#e8394a" opacity=".15" stroke="#e8394a" stroke-width="1"/>
    <rect x="18" y="87" width="120" height="22" rx="4" fill="#e8394a" opacity=".3"/>
    <text x="78" y="102" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="monospace">HTF Daily +12</text>
    <rect x="140" y="87" width="80" height="22" rx="0" fill="#e8394a" opacity=".25"/>
    <text x="180" y="102" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="monospace">HTF 4H +8</text>
    <rect x="222" y="87" width="60" height="22" rx="0" fill="#e8394a" opacity=".2"/>
    <text x="252" y="102" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="monospace">ADX +6</text>
    <rect x="284" y="87" width="60" height="22" rx="0" fill="#e8394a" opacity=".18"/>
    <text x="314" y="102" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="monospace">Ichi +5</text>
    <rect x="346" y="87" width="60" height="22" rx="0" fill="#e8394a" opacity=".15"/>
    <text x="376" y="102" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="monospace">Macro +6</text>
    <rect x="408" y="87" width="80" height="22" rx="4" fill="#e8394a" opacity=".12"/>
    <text x="448" y="102" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="monospace">MACD+BTC.D +10</text>

    <!-- Balance line -->
    <line x1="18" y1="130" x2="700" y2="130" stroke="#1e3a5f" stroke-width="1.5"/>
    <text x="18" y="148" font-size="11" fill="#607d8b" font-family="sans-serif">Saldo: 37 − 47 =</text>
    <text x="180" y="148" font-size="14" fill="#e8394a" font-family="monospace" font-weight="900">−10</text>

    <!-- Probability scale bar -->
    <rect x="220" y="138" width="480" height="18" rx="5" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <rect x="220" y="138" width="96" height="18" rx="5" fill="#e8394a" opacity=".5"/>
    <text x="268" y="151" text-anchor="middle" font-size="8.5" fill="white" font-family="monospace">10–20%</text>
    <rect x="316" y="138" width="80" height="18" rx="0" fill="#e67e22" opacity=".4"/>
    <text x="356" y="151" text-anchor="middle" font-size="8.5" fill="white" font-family="monospace">20–35%</text>
    <!-- Current position indicator -->
    <rect x="396" y="136" width="3" height="22" rx="1" fill="white"/>
    <text x="399" y="170" font-size="9" fill="#f0a500" font-family="monospace">▲ −10 → 35%</text>
    <rect x="400" y="138" width="80" height="18" rx="0" fill="#f0a500" opacity=".3"/>
    <text x="440" y="151" text-anchor="middle" font-size="8.5" fill="white" font-family="monospace">35–50%</text>
    <rect x="480" y="138" width="80" height="18" rx="0" fill="#00c4e8" opacity=".3"/>
    <text x="520" y="151" text-anchor="middle" font-size="8.5" fill="white" font-family="monospace">50–65%</text>
    <rect x="560" y="138" width="80" height="18" rx="0" fill="#00d68f" opacity=".4"/>
    <text x="600" y="151" text-anchor="middle" font-size="8.5" fill="white" font-family="monospace">65–75%</text>
    <rect x="640" y="138" width="60" height="18" rx="5" fill="#00d68f" opacity=".6"/>
    <text x="670" y="151" text-anchor="middle" font-size="8.5" fill="white" font-family="monospace">75%+</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> O Sistema de Pontos — Convertendo Evidências em Probabilidade</h2>
<p>Cada evidência da sua análise contribui com pontos positivos ou negativos para o cenário bullish. A soma total é convertida em probabilidade usando uma escala calibrada:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Evidência</th><th>Pontos Bullish</th><th>Pontos Bearish</th></tr></thead>
<tbody>
  <tr><td class="td-em">HTF Trend Daily BULL</td><td class="td-green">+12</td><td>0</td></tr>
  <tr><td class="td-em">HTF Trend Daily BEAR</td><td>0</td><td class="td-red">+12</td></tr>
  <tr><td class="td-em">HTF Trend 4H BULL</td><td class="td-green">+8</td><td>0</td></tr>
  <tr><td class="td-em">HTF Trend 4H BEAR</td><td>0</td><td class="td-red">+8</td></tr>
  <tr><td class="td-em">ADX Daily &gt;30 na direção bearish</td><td>0</td><td class="td-red">+6</td></tr>
  <tr><td class="td-em">ADX 4H caindo (enfraquecendo)</td><td class="td-green">+4</td><td>0</td></tr>
  <tr><td class="td-em">RSI sobrevendido (&lt;35) + divergência bullish</td><td class="td-green">+8</td><td>0</td></tr>
  <tr><td class="td-em">RSI sobrecomprado (&gt;65) + divergência bearish</td><td>0</td><td class="td-red">+8</td></tr>
  <tr><td class="td-em">MACD cruzamento bullish confirmado</td><td class="td-green">+6</td><td>0</td></tr>
  <tr><td class="td-em">MACD bearish ativo</td><td>0</td><td class="td-red">+6</td></tr>
  <tr><td class="td-em">Preço em S/R S1 (máxima confluência) como suporte</td><td class="td-green">+8</td><td>0</td></tr>
  <tr><td class="td-em">Fibonacci 61.8% como suporte</td><td class="td-green">+5</td><td>0</td></tr>
  <tr><td class="td-em">Fibonacci 78.6% como suporte (tendência fraca)</td><td class="td-green">+3</td><td>0</td></tr>
  <tr><td class="td-em">Ichimoku: preço acima da nuvem</td><td class="td-green">+5</td><td>0</td></tr>
  <tr><td class="td-em">Ichimoku: preço abaixo da nuvem</td><td>0</td><td class="td-red">+5</td></tr>
  <tr><td class="td-em">F&G &lt;20 (Medo Extremo — contrarian bullish)</td><td class="td-green">+6</td><td>0</td></tr>
  <tr><td class="td-em">BTC.D &lt;50% (altcoin season favorável)</td><td class="td-green">+4</td><td>0</td></tr>
  <tr><td class="td-em">BTC.D &gt;55% (Bitcoin Season — adverso para alts)</td><td>0</td><td class="td-red">+4</td></tr>
  <tr><td class="td-em">On-chain: capitulação confirmada (SOPR &lt;1 + liquidações)</td><td class="td-green">+5</td><td>0</td></tr>
  <tr><td class="td-em">Macro adverso (tarifas, crise, evento de risco)</td><td>0</td><td class="td-red">+6</td></tr>
  <tr><td class="td-em">Padrão de vela de reversão confirmado</td><td class="td-green">+4</td><td>0</td></tr>
  <tr><td class="td-em">Volume baixo na correção (exaustão vendedora)</td><td class="td-green">+3</td><td>0</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> Convertendo Pontos em Probabilidade — A Escala</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Saldo de Pontos Bullish (Bullish − Bearish)</th><th>Probabilidade Cenário Bullish</th><th>Qualidade do Setup Long</th></tr></thead>
<tbody>
  <tr><td class="td-em td-red">−40 ou menos</td><td class="td-red">5–10%</td><td class="td-red">Não operar long. Setup short potencial.</td></tr>
  <tr><td class="td-em td-red">−25 a −39</td><td class="td-red">10–20%</td><td class="td-red">Não operar long.</td></tr>
  <tr><td class="td-em" style="color:#e67e22">−10 a −24</td><td style="color:#e67e22">20–35%</td><td style="color:#e67e22">Setup contra-tendência marginal. Sizing máximo 30%.</td></tr>
  <tr><td class="td-em td-gold">−9 a +9</td><td class="td-gold">35–50%</td><td class="td-gold">Setup neutro. Não operar — sem edge claro.</td></tr>
  <tr><td class="td-em td-cyan">+10 a +24</td><td class="td-cyan">50–65%</td><td class="td-cyan">Setup válido. Sizing 70–100%. Score STMP deve qualificar.</td></tr>
  <tr><td class="td-em td-green">+25 a +39</td><td class="td-green">65–75%</td><td class="td-green">Setup de alta qualidade. Sizing 100%. R:R mínimo 1:2.</td></tr>
  <tr><td class="td-em td-gold">+40 ou mais</td><td class="td-gold">75–85%</td><td class="td-gold td-em">Setup de convicção máxima. Raro. Sizing até 120%.</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Cálculo Completo — XRP Long 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Cálculo de Pontos — Evidências do Dia</div>
  <p>
  <strong>Pontos Bullish:</strong><br>
  + ADX 4H caindo (enfraquecendo) → +4<br>
  + RSI sobrevedido &lt;35 + divergência bullish → +8<br>
  + Preço em S/R S1 suporte máxima confluência → +8<br>
  + Fibonacci 78.6% como suporte → +3<br>
  + F&G = 5 (contrarian bullish) → +6<br>
  + On-chain: capitulação $1.93B + liquidações → +5<br>
  + Volume muito baixo na zona → +3<br>
  <strong>Total Bullish: +37</strong><br><br>

  <strong>Pontos Bearish:</strong><br>
  + HTF Trend Daily BEAR → +12<br>
  + HTF Trend 4H BEAR → +8<br>
  + ADX Daily &gt;40 bearish → +6<br>
  + MACD bearish ativo (Daily e 4H) → +6<br>
  + Ichimoku: preço abaixo da nuvem → +5<br>
  + BTC.D 56.6% (Bitcoin Season) → +4<br>
  + Macro adverso (tarifas Trump) → +6<br>
  <strong>Total Bearish: +47</strong><br><br>

  <strong>Saldo:</strong> 37 − 47 = <strong>−10</strong><br>
  <strong>Probabilidade Cenário Bullish:</strong> ~35% (faixa "setup contra-tendência marginal")<br>
  <strong>Probabilidade Cenário Bearish:</strong> ~50%<br>
  <strong>Probabilidade Cenário Neutro/Range:</strong> ~15%<br><br>
  <strong>Decisão pelo cálculo:</strong> Saldo −10 = sizing máximo 30% se entrar. Expectativa positiva mas marginal. Confirma a decisão de AGUARDAR até o saldo melhorar para pelo menos −5 (quando mais evidências bullish aparecerem).
  </p>
</div>

<h2><span class="h2-num">5</span> Atualizando os Cenários em Tempo Real</h2>
<p>Os cenários e probabilidades não são fixos — eles se atualizam à medida que novas informações aparecem:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">📈</div>
    <div class="step-content">
      <h4>Quando Recalcular</h4>
      <p>Recalcule os pontos sempre que uma dessas condições mudar: HTF Trend em qualquer TF muda de direção / ADX cruza threshold significativo / F&G muda mais de 10 pontos / Notícia de impacto alto ocorre / Preço atinge zona de S/R relevante.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">🔄</div>
    <div class="step-content">
      <h4>Como a Probabilidade Muda</h4>
      <p>Exemplo: Se o HTF Trend 4H virar BULL (−8 pontos bearish, +8 pontos bullish), o saldo muda de −10 para +6. Isso desloca a probabilidade bullish de ~35% para ~45% — ainda neutro, mas muito mais próximo do threshold de entrada.</p>
      <p>Com HTF 4H BULL + MACD 4H cruzamento bullish (+6), saldo vai para +12 → probabilidade ~55% → setup válido para entrada com sizing 70%.</p>
    </div>
  </div>
</div>

<div class="callout callout-success">
  <div class="callout-title">✅ Conclusão — O Número Define a Ação</div>
  <p>O processo de cálculo transforma a análise subjetiva em um número objetivo. Quando o saldo de pontos chegar a +10 ou mais para XRP long, você entra com 70% do sizing. Quando chegar a +25, você entra com 100%. Você não precisa mais "decidir" — o número decide por você.<br><br>
  Isso é o que separa o trading profissional do amadorismo: não a ausência de análise, mas a <strong>conversão da análise em um processo reproduzível e quantificado</strong>.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo o sistema de pontos: cada evidência contribui com valor específico bullish ou bearish</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei converter o saldo de pontos em probabilidade usando a escala de 7 faixas</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Realizei o cálculo completo para XRP 23/02/2026 e obtive saldo −10 / prob. bullish 35%</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo como a probabilidade muda quando evidências se atualizam em tempo real</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Calculei o que precisa mudar para XRP atingir o threshold de entrada (+10 pontos bullish)</div></div>
</div>`,

  "cenarios-xrp": `
<div class="blockquote">
  <div class="blockquote-text">O melhor momento para definir seu plano de ação não é quando o mercado está se movendo contra você. É nas horas calmas, antes de qualquer posição aberta, quando você pode pensar com clareza e construir o mapa completo.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> Os 3 Cenários Completos — XRP/USDT 23/02/2026</h2>
<p>Esta é a culminação de toda a análise das Fases 1, 2 e 3 — o documento de cenários completo para XRP baseado em todos os dados reais coletados e analisados ao longo do curso. Este é o documento que um analista profissional entregaria ao final de uma sessão completa de análise.</p>

<div class="callout callout-info">
  <div class="callout-title">📊 Dados Base da Análise — 23/02/2026 09h00</div>
  <p>
  Preço: <strong>$1.3301</strong> · F&G: <strong>5/100</strong> · BTC.D: <strong>56.6%</strong> · BTC: <strong>$64.7k (−3.2% 24h)</strong><br>
  Liquidações 24h: <strong>$417M / 136k traders</strong> · Score STMP: <strong>4/12</strong> · Saldo de Pontos: <strong>−10</strong><br>
  Estrutura Daily: <strong>LH+LL downtrend</strong> · ATH: $3.66 (jan/2026) · Queda: <strong>−63.7%</strong>
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">XRP Níveis Chave — 3 Cenários (23/02/2026)</div>
  <svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- Chart area -->
    <rect x="10" y="10" width="560" height="180" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/>

    <!-- Price levels as horizontal lines (mapped to chart height) -->
    <!-- $3.66 ATH = y~15, $2.50 = y~45, $1.93 = y~75, $1.65 = y~100, $1.48 = y~118, $1.33 current = y~135, $1.00 = y~162, $0.75 = y~178 -->

    <!-- Resistances (above current) -->
    <line x1="10" y1="75" x2="570" y2="75" stroke="#e8394a" stroke-width="1.2" stroke-dasharray="5,3" opacity=".6"/>
    <text x="572" y="79" font-size="9.5" fill="#e8394a" font-family="monospace">$1.93  R3</text>
    <line x1="10" y1="100" x2="570" y2="100" stroke="#e8394a" stroke-width="1.2" stroke-dasharray="5,3" opacity=".5"/>
    <text x="572" y="104" font-size="9.5" fill="#e8394a" font-family="monospace">$1.65  R2</text>
    <line x1="10" y1="118" x2="570" y2="118" stroke="#f0a500" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="572" y="122" font-size="9.5" fill="#f0a500" font-family="monospace">$1.48  R1/Gatilho</text>

    <!-- Current price band -->
    <rect x="10" y="130" width="560" height="12" fill="#f0a500" opacity=".08" rx="2"/>
    <line x1="10" y1="136" x2="570" y2="136" stroke="#f0a500" stroke-width="2.5"/>
    <text x="572" y="140" font-size="10" fill="#f0a500" font-family="monospace" font-weight="700">$1.33 ← Agora</text>

    <!-- Supports (below current) -->
    <line x1="10" y1="162" x2="570" y2="162" stroke="#3d8fef" stroke-width="1.2" stroke-dasharray="5,3" opacity=".6"/>
    <text x="572" y="166" font-size="9.5" fill="#3d8fef" font-family="monospace">$1.00  S-B2</text>
    <line x1="10" y1="178" x2="570" y2="178" stroke="#3d8fef" stroke-width="1" stroke-dasharray="5,3" opacity=".4"/>
    <text x="572" y="182" font-size="9.5" fill="#607d8b" font-family="monospace">$0.75  S-B3</text>

    <!-- C3 Bullish arrow -->
    <path d="M 260,136 C 280,136 300,118 320,100 C 340,82 360,75 400,45" fill="none" stroke="#00d68f" stroke-width="2" stroke-dasharray="6,3"/>
    <polygon points="397,38 403,48 393,48" fill="#00d68f"/>
    <text x="405" y="42" font-size="9" fill="#00d68f" font-family="sans-serif">C3 Bullish 35%</text>
    <text x="405" y="53" font-size="9" fill="#607d8b" font-family="sans-serif">gatilho: &gt;$1.48</text>

    <!-- C2 Neutral arrow (horizontal) -->
    <path d="M 260,136 C 310,132 350,140 400,136" fill="none" stroke="#f0a500" stroke-width="2" stroke-dasharray="6,3"/>
    <polygon points="397,130 403,136 397,142" fill="#f0a500"/>
    <text x="405" y="130" font-size="9" fill="#f0a500" font-family="sans-serif">C2 Neutro 15%</text>
    <text x="405" y="141" font-size="9" fill="#607d8b" font-family="sans-serif">range $1.28–$1.48</text>

    <!-- C1 Bearish arrow -->
    <path d="M 260,136 C 280,140 300,155 330,162 C 360,170 380,175 400,178" fill="none" stroke="#e8394a" stroke-width="2" stroke-dasharray="6,3"/>
    <polygon points="397,172 403,180 393,180" fill="#e8394a"/>
    <text x="405" y="170" font-size="9" fill="#e8394a" font-family="sans-serif">C1 Bearish 50%</text>
    <text x="405" y="181" font-size="9" fill="#607d8b" font-family="sans-serif">gatilho: &lt;$1.28</text>

    <!-- Current price dot -->
    <circle cx="260" cy="136" r="6" fill="#f0a500"/>
  </svg>
</div>
<h2><span class="h2-num">2</span> Cenário 1 — BEARISH (Continuação do Downtrend)</h2>

<div class="rule-card" style="border-left: 3px solid var(--red)">
  <div class="rule-num" style="color:var(--red)">C1</div>
  <div class="rule-content">
    <h4 style="color:var(--red)">Probabilidade: 50% — Cenário Dominante</h4>
    <p>
    <strong>Narrativa:</strong> O suporte em $1.30–$1.35 não segura. As tarifas Trump ampliam o risk-off global, o BTC perde $63k e arrasta altcoins. O downtrend estrutural continua, com XRP buscando o próximo suporte relevante.<br><br>
    <strong>Gatilhos de Ativação:</strong><br>
    🔴 Fechamento Daily abaixo de $1.28 com volume acima da média de 7 dias<br>
    🔴 BTC fechando abaixo de $62.5k (próximo suporte BTC)<br>
    🔴 F&G caindo abaixo de 3 (capitulação extrema)<br>
    🔴 ADX Daily voltando a subir acima de 45<br><br>
    <strong>Alvos Bearish (sequência):</strong><br>
    🎯 T1: <strong style="color:var(--red)">$1.20–$1.15</strong> (próxima zona de suporte histórico)<br>
    🎯 T2: <strong style="color:var(--red)">$1.00–$0.98</strong> (nível psicológico $1.00 — suporte de último recurso)<br>
    🎯 T3: <strong style="color:var(--red)">$0.75–$0.80</strong> (mínimas 2024 — somente se $1.00 romper)<br><br>
    <strong>Plano de Ação:</strong><br>
    ▶ Se em long: sair imediatamente no gatilho de fechamento abaixo de $1.28<br>
    ▶ Possível short: entrada no reteste de $1.28–$1.30 (suporte rompido = resistência), stop acima de $1.35, alvo T1 $1.15<br>
    ▶ NÃO comprar em nenhum nível até o cenário bearish se esgotar (novo suporte + divergência + gatilho bullish)
    </p>
  </div>
</div>

<h2><span class="h2-num">3</span> Cenário 2 — NEUTRO (Consolidação em Range)</h2>

<div class="rule-card" style="border-left: 3px solid var(--cyan)">
  <div class="rule-num" style="color:var(--cyan)">C2</div>
  <div class="rule-content">
    <h4 style="color:var(--cyan)">Probabilidade: 15% — Cenário Secundário</h4>
    <p>
    <strong>Narrativa:</strong> O suporte em $1.30 segura, mas os vendedores impedem qualquer rompimento significativo de $1.48. XRP entra em período de consolidação lateral aguardando catalisador direcional — clareza sobre tarifas, dados macro ou movimento decisivo do BTC.<br><br>
    <strong>Gatilhos de Ativação:</strong><br>
    🟡 Preço se mantendo dentro de $1.28–$1.50 por 7+ dias consecutivos sem rompimento<br>
    🟡 Volume decaindo progressivamente (mercado perdendo interesse)<br>
    🟡 ADX Daily caindo para abaixo de 25 (tendência se dissolvendo)<br>
    🟡 F&G oscilando entre 10–25 sem tendência clara<br><br>
    <strong>Alvos do Range:</strong><br>
    🎯 Topo do range: <strong style="color:var(--cyan)">$1.43–$1.48</strong> (resistência LH 4H)<br>
    🎯 Base do range: <strong style="color:var(--cyan)">$1.28–$1.32</strong> (suporte S1)<br>
    🎯 Amplitude: ~10–12% de oscilação<br><br>
    <strong>Plano de Ação:</strong><br>
    ▶ Range trade com alvos limitados: comprar bounces em $1.30–$1.33 com alvo $1.43–$1.48<br>
    ▶ Sizing reduzido 40% (range trades têm menor R:R)<br>
    ▶ Stop rigoroso abaixo de $1.27 (invalida o range se romper)<br>
    ▶ Monitorar rompimento de qualquer lado para migrar para C1 ou C3
    </p>
  </div>
</div>

<h2><span class="h2-num">4</span> Cenário 3 — BULLISH (Reversão Estrutural)</h2>

<div class="rule-card" style="border-left: 3px solid var(--green)">
  <div class="rule-num" style="color:var(--green)">C3</div>
  <div class="rule-content">
    <h4 style="color:var(--green)">Probabilidade: 35% — Cenário de Reversão</h4>
    <p>
    <strong>Narrativa:</strong> O suporte confluente em $1.30–$1.35 (S1 máxima força + Fib 78.6% + F&G extremo + capitulação on-chain) marca o fundo do ciclo de correção. BTC estabiliza, macro melhora, e XRP inicia recuperação estrutural com potencial de retorno aos níveis de jan/2026.<br><br>
    <strong>Gatilhos de Ativação:</strong><br>
    🟢 Fechamento 4H acima de $1.48 com volume 1.5× a média de 10 dias<br>
    🟢 HTF Trend 4H virando BULL (confirmação de mudança de estrutura)<br>
    🟢 BTC estabilizando acima de $65.7k e HTF BTC virando BULL<br>
    🟢 BTC.D caindo abaixo de 54% (rotação iniciando para altcoins)<br>
    🟢 F&G subindo acima de 20 (medo extremo dissipando)<br><br>
    <strong>Alvos Bullish (sequência de resistências a superar):</strong><br>
    🎯 R1: <strong style="color:var(--green)">$1.48</strong> — gatilho de entrada + 1ª resistência<br>
    🎯 R2: <strong style="color:var(--green)">$1.65–$1.70</strong> — suporte antigo 2024 + Fib 61.8% (TP2)<br>
    🎯 R3: <strong style="color:var(--green)">$1.93–$2.00</strong> — LH Daily + Fib 200% + VPVR (TP3)<br>
    🎯 R4: <strong style="color:var(--gold)">$2.50–$2.60</strong> — resistência maior (cenário de retomada total)<br>
    🎯 R5: <strong style="color:var(--gold)">$2.77</strong> — Fib 61.8% do downtrend total (Golden Zone de retorno)<br><br>
    <strong>Plano de Ação:</strong><br>
    ▶ E1 (40%): Entrada em $1.49–$1.51 no fechamento 4H acima de $1.48 · Stop $1.3821<br>
    ▶ E2 (40%): Adicionar quando HTF 4H confirmar BULL e MACD 4H cruzar bullish<br>
    ▶ E3 (20%): Pirâmide após TP1 atingido se estrutura confirmar continuação<br>
    ▶ TP1 30% em $1.65 · TP2 50% em $1.93 · TP3 20% trailing stop a partir de $2.00
    </p>
  </div>
</div>

<h2><span class="h2-num">5</span> Resumo Executivo e Monitoramento</h2>

<div class="callout callout-gold">
  <div class="callout-title">📋 Síntese Final — XRP 23/02/2026</div>
  <p>
  <strong>Decisão atual:</strong> AGUARDAR. Nenhum dos 3 cenários tem gatilho ativo no momento.<br><br>
  <strong>O que monitorar (ordem de prioridade):</strong><br>
  1. Fechamento Daily abaixo de $1.28 → Ativar C1 Bearish (plano de short)<br>
  2. BTC.D caindo abaixo de 54% + BTC acima de $65.7k → Preparar E1 Bullish<br>
  3. Fechamento 4H acima de $1.48 com volume → Ativar C3 Bullish (entrar E1)<br>
  4. F&G subindo acima de 20 → Ajustar probabilidades C3 para 45%<br><br>
  <strong>Alertas configurados:</strong><br>
  📱 XRP abaixo de $1.27 (stop de qualquer long residual)<br>
  📱 XRP acima de $1.49 (entrada E1 bullish)<br>
  📱 BTC.D abaixo de 54% (rotação para altcoins)<br>
  📱 BTC abaixo de $62.5k (aceleração bearish)<br><br>
  <strong>Próxima revisão de cenários:</strong> Quando qualquer alerta disparar ou em 72h (atualização periódica)
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 3 cenários completos com probabilidades: C1 50% / C2 15% / C3 35%</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os gatilhos de ativação específicos de cada cenário (preços e condições objetivas)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Tenho os planos de ação definidos para C1, C2 e C3 com entradas, stops e TPs</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Configurei os 4 alertas prioritários nos níveis críticos</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que a decisão atual é AGUARDAR — nenhum gatilho ativo ainda</div></div>
</div>`,

  "filtros": `
<div class="blockquote">
  <div class="blockquote-text">Um filtro não elimina oportunidades. Ele elimina armadilhas disfarçadas de oportunidades. Cada filtro que você adiciona ao seu processo reduz o número de trades, mas aumenta exponencialmente a qualidade de cada trade executado.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> Por Que Filtros São a Essência do Edge</h2>
<p>A maioria dos traders iniciantes acredita que o edge vem de encontrar o "indicador certo" ou a "estratégia secreta". A realidade é mais simples e mais rigorosa: o edge vem de <strong>operar apenas nos setups de maior probabilidade e recusar sistematicamente todos os outros</strong>.</p>
<p>Um sistema com 50 trades por mês e 45% de win rate pode ser menos lucrativo que um sistema com 8 trades por mês e 65% de win rate. Filtros rigorosos reduzem frequência e aumentam qualidade. A paciência para esperar apenas os melhores setups é a vantagem mais subestimada do trading.</p>

<div class="callout callout-info">
  <div class="callout-title">💡 A Aritmética da Seletividade</div>
  <p>
  <strong>Trader A:</strong> 50 trades/mês, 45% win rate, R:R 1:1.5 → Expectativa: (0.45 × 1.5) − (0.55 × 1) = +0.125R/trade → 50 × 0.125 = <strong>+6.25R/mês</strong><br><br>
  <strong>Trader B:</strong> 8 trades/mês (filtros rigorosos), 62% win rate, R:R 1:2.5 → Expectativa: (0.62 × 2.5) − (0.38 × 1) = +1.17R/trade → 8 × 1.17 = <strong>+9.36R/mês</strong><br><br>
  O Trader B opera 84% menos e ganha 50% mais. Filtros corretos fazem isso.
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Funil de Filtros — Apenas o Melhor 5% Passa</div>
  <svg viewBox="0 0 720 185" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- Funnel layers (left side) -->
    <polygon points="30,10 330,10 305,35 55,35" fill="#e8394a" opacity=".15" stroke="#e8394a" stroke-width="1.2"/>
    <text x="180" y="27" text-anchor="middle" font-size="10" fill="#e8394a" font-family="sans-serif" font-weight="700">F1 — Macro (BTC.D · F&amp;G · Macro)</text>

    <polygon points="55,38 305,38 282,61 78,61" fill="#e67e22" opacity=".12" stroke="#e67e22" stroke-width="1.2"/>
    <text x="180" y="55" text-anchor="middle" font-size="10" fill="#e67e22" font-family="sans-serif" font-weight="700">F2 — Zona de S/R S1 ou S2</text>

    <polygon points="78,64 282,64 260,87 100,87" fill="#f0a500" opacity=".12" stroke="#f0a500" stroke-width="1.2"/>
    <text x="180" y="81" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">F3 — Tendência HTF Daily</text>

    <polygon points="100,90 260,90 238,113 122,113" fill="#3d8fef" opacity=".12" stroke="#3d8fef" stroke-width="1.2"/>
    <text x="180" y="107" text-anchor="middle" font-size="10" fill="#3d8fef" font-family="sans-serif" font-weight="700">F4 — Momentum RSI/MACD</text>

    <polygon points="122,116 238,116 218,137 142,137" fill="#00c4e8" opacity=".12" stroke="#00c4e8" stroke-width="1.2"/>
    <text x="180" y="131" text-anchor="middle" font-size="10" fill="#00c4e8" font-family="sans-serif" font-weight="700">F5 — R:R mínimo 1:2</text>

    <polygon points="142,140 218,140 200,161 160,161" fill="#9c27b0" opacity=".12" stroke="#9c27b0" stroke-width="1.2"/>
    <text x="180" y="155" text-anchor="middle" font-size="9.5" fill="#9c27b0" font-family="sans-serif" font-weight="700">F6 — Vela confirmação</text>

    <polygon points="160,164 200,164 190,182 170,182" fill="#00d68f" opacity=".2" stroke="#00d68f" stroke-width="1.5"/>
    <text x="180" y="177" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif" font-weight="700">F7 — Capital</text>

    <!-- Right side: input/output -->
    <text x="355" y="25" font-size="10" fill="#607d8b" font-family="sans-serif">100 setups identificados</text>
    <text x="355" y="52" font-size="10" fill="#607d8b" font-family="sans-serif">~40 passam macro</text>
    <text x="355" y="78" font-size="10" fill="#607d8b" font-family="sans-serif">~25 em zona válida</text>
    <text x="355" y="104" font-size="10" fill="#607d8b" font-family="sans-serif">~18 com tendência ok</text>
    <text x="355" y="130" font-size="10" fill="#607d8b" font-family="sans-serif">~12 com momentum</text>
    <text x="355" y="152" font-size="10" fill="#607d8b" font-family="sans-serif">~8 com R:R adequado</text>
    <text x="355" y="175" font-size="10" fill="#00d68f" font-family="sans-serif" font-weight="700">~5 trades/mês de qualidade</text>

    <!-- Arrow -->
    <line x1="340" y1="10" x2="340" y2="185" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="4,4" opacity=".4"/>

    <!-- XRP status -->
    <rect x="530" y="15" width="178" height="155" rx="8" fill="#0a1628" stroke="#1e3a5f" stroke-width="1"/>
    <text x="619" y="34" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">XRP 23/02 Status</text>
    <text x="540" y="55" font-size="9.5" fill="#e8394a" font-family="monospace">F1 ✗ BTC.D adverso</text>
    <text x="540" y="72" font-size="9.5" fill="#00d68f" font-family="monospace">F2 ✓ S1 $1.33</text>
    <text x="540" y="89" font-size="9.5" fill="#f0a500" font-family="monospace">F3 ⚠️ Daily BEAR</text>
    <text x="540" y="106" font-size="9.5" fill="#f0a500" font-family="monospace">F4 ⚠️ RSI div ok</text>
    <text x="540" y="123" font-size="9.5" fill="#00d68f" font-family="monospace">F5 ✓ R:R 1:2.1</text>
    <text x="540" y="140" font-size="9.5" fill="#f0a500" font-family="monospace">F6 ⚠️ Sem engolfo</text>
    <text x="540" y="157" font-size="9.5" fill="#00d68f" font-family="monospace">F7 ✓ Capital ok</text>
    <rect x="530" y="162" width="178" height="6" rx="3" fill="#e8394a" opacity=".3"/>
    <text x="619" y="178" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif">F1 reprovado → AGUARDAR</text>
  </svg>
</div>
<h2><span class="h2-num">2</span> Os 7 Filtros de Qualidade do TMP</h2>
<p>Estes são os filtros que o método TMP aplica antes de qualquer trade. Um setup só avança para execução se passar em todos os filtros obrigatórios:</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">F1</div>
  <div class="rule-content">
    <h4>Filtro de Contexto Macro — OBRIGATÓRIO</h4>
    <p><strong>Critério:</strong> O contexto de Fase 1 não está ativamente contra o trade.<br>
    <strong>Reprovar quando:</strong> F&G &gt; 80 para longs / F&G &lt; 10 sem suporte técnico confluente / BTC.D &gt; 60% para altcoins / Evento macro de alto impacto nas próximas 24h (Fed, dados de inflação, crise geopolítica).<br>
    <strong>Exceção:</strong> F&G &lt; 10 com suporte confluente S1 = permitido com sizing −30%.<br>
    <strong>Falha mais comum:</strong> Entrar long quando macro está claramente adverso porque "o gráfico parece bom". O macro sobrepõe a técnica no curto prazo.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">F2</div>
  <div class="rule-content">
    <h4>Filtro de Zona — OBRIGATÓRIO</h4>
    <p><strong>Critério:</strong> O preço está em zona de S/R de pelo menos S2 (2 confluências).<br>
    <strong>Reprovar quando:</strong> Preço no meio de um range sem nível claro / Entrada em zona S3 ou abaixo sem justificativa técnica excepcional / Perseguir preço após impulso sem reteste de nível.<br>
    <strong>A regra:</strong> Você compra zonas, não preços. A zona precisa estar claramente mapeada antes do preço chegar, não depois.<br>
    <strong>Falha mais comum:</strong> Entrar no "medo de perder" (FOMO) quando o preço já subiu muito de um suporte sem reteste.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">F3</div>
  <div class="rule-content">
    <h4>Filtro de Tendência — OBRIGATÓRIO para Tamanho Completo</h4>
    <p><strong>Critério:</strong> O Daily HTF Trend não está ativamente contra o trade (ou sizing reduzido −40% se estiver).<br>
    <strong>A lógica:</strong> Operar contra a tendência do Daily é nadar contra uma corrente. Você pode até avançar, mas gasta muito mais energia e risco para o mesmo resultado. Reserve o tamanho completo para quando o Daily está a favor.<br>
    <strong>Exceção documentada:</strong> Trades contra-tendência permitidos em zonas de S/R S1 com todos os outros filtros ativos + score STMP ≥ 8/12 + sizing reduzido 40%.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">F4</div>
  <div class="rule-content">
    <h4>Filtro de Momentum — OBRIGATÓRIO</h4>
    <p><strong>Critério:</strong> RSI não está em zona adversa ao trade E MACD não tem cruzamento ativo contra o trade.<br>
    <strong>Reprovar quando:</strong> RSI &gt; 65 para long entry / RSI &lt; 35 para short entry / MACD acaba de cruzar bearish (para long) ou bullish (para short) no 4H.<br>
    <strong>Bônus de convicção:</strong> Divergência de RSI a favor do trade → +1 ponto no score / dobra convicção na zona.<br>
    <strong>Falha mais comum:</strong> Entrar long quando RSI está a 72 "porque o suporte é forte". RSI sobrecomprado + suporte = posição de risco elevado com R:R ruim.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">F5</div>
  <div class="rule-content">
    <h4>Filtro de R:R — OBRIGATÓRIO</h4>
    <p><strong>Critério:</strong> O R:R calculado é de no mínimo 1:2 (ganho potencial = 2× o risco).<br>
    <strong>Como calcular:</strong> R:R = (TP1 − Entrada) ÷ (Entrada − Stop Loss).<br>
    <strong>Reprovar quando:</strong> Stop muito próximo de S/R (pode ser stop-hunted) / TP muito próximo de resistência forte / R:R resultante abaixo de 1:2.<br>
    <strong>Regra prática:</strong> Se você não consegue encontrar um stop que faça sentido técnico E mantenha R:R ≥ 1:2, o trade não existe. Não force o R:R ajustando stop artificialmente.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--red)">F6</div>
  <div class="rule-content">
    <h4>Filtro de Confirmação — IMPORTANTE</h4>
    <p><strong>Critério:</strong> Existe uma vela de confirmação (candle fechado) que indica entrada de compradores na zona de suporte.<br>
    <strong>Velas válidas:</strong> Martelo / Engolfo de alta / Doji + candle verde de confirmação / Morning Star.<br>
    <strong>Reprovar quando:</strong> Entrar antes de qualquer vela de confirmação "antecipando" a reversão / Vela de confirmação muito pequena (corpo &lt; 30% do range do candle).<br>
    <strong>A lógica:</strong> A vela de confirmação prova que compradores já estão comprando no nível — você está entrando com eles, não apostando que eles vão aparecer.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--purple)">F7</div>
  <div class="rule-content">
    <h4>Filtro de Capital — SEMPRE VERIFICAR</h4>
    <p><strong>Critério:</strong> O risco calculado neste trade não vai fazer o risco total aberto superar 6% do portfólio (máximo de 3 posições de 2% simultâneas).<br>
    <strong>Reprovar quando:</strong> Você já tem 2 posições abertas com risco total de 4%+ / O novo trade elevaria o risco total acima de 6% / Você está em drawdown de mais de 10% (reduzir sizing 50% até recuperar).<br>
    <strong>A lógica:</strong> Correlação entre criptomoedas é alta. Em crises, tudo cai junto. Expor 10%+ do portfólio com múltiplos trades simultâneos é assumir risco de 10% em um único evento macro.</p>
  </div>
</div>

<h2><span class="h2-num">3</span> Aplicação dos Filtros — XRP 23/02/2026</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Filtro</th><th>Avaliação</th><th>Status</th></tr></thead>
<tbody>
  <tr><td class="td-em">F1 — Macro</td><td>BTC.D 56.6% adverso + Tarifas Trump + BTC fraco</td><td class="td-red">✗ REPROVADO</td></tr>
  <tr><td class="td-em">F2 — Zona</td><td>Preço em S/R S1 máxima confluência $1.30–$1.35</td><td class="td-green">✓ APROVADO</td></tr>
  <tr><td class="td-em">F3 — Tendência</td><td>Daily BEAR — trade seria contra-tendência (sizing −40%)</td><td class="td-gold">⚠️ PARCIAL</td></tr>
  <tr><td class="td-em">F4 — Momentum</td><td>RSI sobrevedido + divergência bullish 1H. MACD desacelerando.</td><td class="td-gold">⚠️ PARCIAL</td></tr>
  <tr><td class="td-em">F5 — R:R</td><td>Stop $1.2821 / TP1 $1.48 = R:R 1:2.1 — mínimo aprovado</td><td class="td-green">✓ APROVADO</td></tr>
  <tr><td class="td-em">F6 — Confirmação</td><td>Martelos formando mas sem engolfo de confirmação ainda</td><td class="td-gold">⚠️ AGUARDANDO</td></tr>
  <tr><td class="td-em">F7 — Capital</td><td>Sem posições abertas. Risco disponível: 2% do portfólio</td><td class="td-green">✓ APROVADO</td></tr>
</tbody>
</table>
</div>

<div class="callout callout-warn">
  <div class="callout-title">🔍 Resultado dos Filtros — 23/02/2026</div>
  <p><strong>F1 REPROVADO</strong> — filtro obrigatório — invalida a entrada imediata independente dos demais.<br><br>
  Mesmo que todos os outros filtros aprovassem, o filtro de macro adverso (F1) sozinho impede a entrada com tamanho relevante. Esta é a proteção mais valiosa do sistema: um filtro obrigatório reprovado = zero exposição (ou máximo 20% se suporte for excepcional).<br><br>
  <strong>Para qualificar:</strong> F1 precisa melhorar (BTC.D &lt; 54% E macro estabilizar) + F6 precisa confirmar (vela de engolfo ou martelo confirmado no 4H). Quando isso acontecer, 4 de 7 filtros aprovados + 2 parciais = entrada válida com sizing reduzido.</p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que filtros aumentam qualidade e reduzem frequência de trades</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 7 filtros do TMP e quais são obrigatórios vs importantes</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo os critérios de reprovação de cada filtro e as falhas mais comuns</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Calculei o R:R de XRP: stop $1.2821 / TP1 $1.48 = 1:2.1</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que F1 reprovado invalida o trade — e o que precisa mudar para F1 aprovar</div></div>
</div>`,

  "entradas": `
<div class="blockquote">
  <div class="blockquote-text">A entrada perfeita não existe. A entrada boa existe e é reproduzível. Ela está sempre em uma zona de valor, com confirmação presente, e risco calculado. Tudo mais é especulação não estruturada.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden">
  <div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">4 Tipos de Entrada — Contexto e R:R de Cada</div>
  <svg viewBox="0 0 720 175" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto">
    <!-- E1: Zona -->
    <rect x="10" y="10" width="165" height="155" rx="7" fill="#0a1628" stroke="#f0a500" stroke-width="1.8"/>
    <rect x="10" y="10" width="165" height="28" rx="7" fill="#f0a500" opacity=".12"/>
    <text x="92" y="29" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">E1 — Zona</text>
    <!-- Mini chart -->
    <rect x="20" y="42" width="145" height="60" rx="3" fill="#060f1e"/>
    <line x1="20" y1="82" x2="165" y2="82" stroke="#00d68f" stroke-width="1" stroke-dasharray="4,2" opacity=".6"/>
    <line x1="20" y1="94" x2="165" y2="94" stroke="#00d68f" stroke-width="1" stroke-dasharray="4,2" opacity=".4"/>
    <polyline points="30,95 50,90 65,87 75,83 82,78" fill="none" stroke="#3d8fef" stroke-width="1.5"/>
    <circle cx="82" cy="78" r="4" fill="#f0a500"/>
    <text x="88" y="76" font-size="8" fill="#f0a500" font-family="monospace">limite</text>
    <text x="22" y="55" font-size="8" fill="#607d8b" font-family="monospace">R ──────</text>
    <text x="22" y="68" font-size="8" fill="#607d8b" font-family="monospace">   ──────</text>
    <text x="22" y="96" font-size="8" fill="#607d8b" font-family="monospace">S ──────</text>
    <text x="92" y="117" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Todos TFs alinhados</text>
    <text x="92" y="129" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="monospace">Sizing 100%</text>
    <text x="92" y="143" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="monospace">R:R esperado alto</text>
    <text x="92" y="157" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="monospace">Order limit na zona</text>

    <!-- E2: Confirmação -->
    <rect x="187" y="10" width="165" height="155" rx="7" fill="#0a1628" stroke="#3d8fef" stroke-width="1.8"/>
    <rect x="187" y="10" width="165" height="28" rx="7" fill="#3d8fef" opacity=".12"/>
    <text x="269" y="29" text-anchor="middle" font-size="11" fill="#3d8fef" font-family="sans-serif" font-weight="700">E2 — Confirmação</text>
    <rect x="197" y="42" width="145" height="60" rx="3" fill="#060f1e"/>
    <polyline points="207,94 222,90 235,88 245,85 252,82 262,88" fill="none" stroke="#3d8fef" stroke-width="1.5"/>
    <!-- Hammer candle -->
    <line x1="280" y1="66" x2="280" y2="91" stroke="#00d68f" stroke-width="1.5"/>
    <rect x="275" y="66" width="10" height="14" fill="#00d68f" rx="1"/>
    <circle cx="280" cy="59" r="4" fill="none" stroke="#00d68f" stroke-width="1.2" stroke-dasharray="2,2"/>
    <text x="269" y="117" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Vela reversão fechada</text>
    <text x="269" y="129" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="monospace">Sizing 80–100%</text>
    <text x="269" y="143" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="monospace">Menor false break</text>
    <text x="269" y="157" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="monospace">+1–3% vs E1</text>

    <!-- E3: Rompimento -->
    <rect x="364" y="10" width="165" height="155" rx="7" fill="#0a1628" stroke="#00c4e8" stroke-width="1.8"/>
    <rect x="364" y="10" width="165" height="28" rx="7" fill="#00c4e8" opacity=".10"/>
    <text x="446" y="29" text-anchor="middle" font-size="11" fill="#00c4e8" font-family="sans-serif" font-weight="700">E3 — Rompimento</text>
    <rect x="374" y="42" width="145" height="60" rx="3" fill="#060f1e"/>
    <line x1="374" y1="72" x2="519" y2="72" stroke="#e8394a" stroke-width="1" stroke-dasharray="4,2" opacity=".6"/>
    <polyline points="384,94 400,90 415,86 430,80 440,72 455,62 470,55" fill="none" stroke="#00d68f" stroke-width="2"/>
    <!-- Breakout arrow -->
    <polygon points="465,50 475,55 465,60" fill="#00d68f"/>
    <text x="374" y="68" font-size="8" fill="#e8394a" font-family="monospace">resistência</text>
    <text x="446" y="117" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Rompimento com volume</text>
    <text x="446" y="129" text-anchor="middle" font-size="8.5" fill="#00c4e8" font-family="monospace">Sizing 60–70%</text>
    <text x="446" y="143" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="monospace">Stop buy acima nível</text>
    <text x="446" y="157" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="monospace">Aguardar reteste (E4)</text>

    <!-- E4: Reteste -->
    <rect x="541" y="10" width="169" height="155" rx="7" fill="#0a1628" stroke="#00d68f" stroke-width="1.8"/>
    <rect x="541" y="10" width="169" height="28" rx="7" fill="#00d68f" opacity=".10"/>
    <text x="625" y="29" text-anchor="middle" font-size="11" fill="#00d68f" font-family="sans-serif" font-weight="700">E4 — Reteste</text>
    <rect x="551" y="42" width="149" height="60" rx="3" fill="#060f1e"/>
    <!-- Breakout then retest -->
    <line x1="551" y1="72" x2="700" y2="72" stroke="#00d68f" stroke-width="1" stroke-dasharray="4,2" opacity=".5"/>
    <polyline points="561,94 575,88 585,80 595,68 605,55 615,52" fill="none" stroke="#00d68f" stroke-width="1.5" opacity=".6"/>
    <!-- Retest dip back to line -->
    <polyline points="615,52 625,60 635,70 642,72 650,68 660,58 670,48" fill="none" stroke="#00d68f" stroke-width="2"/>
    <circle cx="642" cy="72" r="4" fill="#f0a500"/>
    <text x="648" y="70" font-size="8" fill="#f0a500" font-family="monospace">entry</text>
    <text x="625" y="117" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Retorno ao nível rompido</text>
    <text x="625" y="129" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">Sizing 100%</text>
    <text x="625" y="143" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="monospace">Melhor R:R possível</text>
    <text x="625" y="157" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="monospace">R:R ≥ 1:4</text>
  </svg>
</div>
<h2><span class="h2-num">1</span> Os 4 Tipos de Entrada do TMP</h2>
<p>O método TMP usa 4 tipos de entrada, cada um adequado para um contexto diferente. Conhecê-los permite adaptar a execução ao momento do mercado sem improvisar:</p>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">E1</div>
  <div class="rule-content">
    <h4>Entrada de Zona — O Tipo Padrão</h4>
    <p><strong>Quando usar:</strong> Preço chegando em zona de suporte de alta confluência (S1 ou S2) com todos os filtros aprovados.<br>
    <strong>Como executar:</strong> Ordem limitada (limit order) colocada dentro da zona, não no limite superior. Exemplo: zona $1.30–$1.35 → ordem em $1.32–$1.33 (centro da zona).<br>
    <strong>Vantagem:</strong> Melhor preço de entrada dentro da zona. Menos slippage em movimentos rápidos.<br>
    <strong>Desvantagem:</strong> Pode não ser preenchida se o preço reverter antes de atingir o centro da zona.<br>
    <strong>Stop:</strong> Abaixo da borda inferior da zona − 0.5%.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">E2</div>
  <div class="rule-content">
    <h4>Entrada de Confirmação — Mais Segura</h4>
    <p><strong>Quando usar:</strong> Após vela de reversão confirmada em suporte (candle fechado, não projeção). Ideal para contra-tendência ou quando há dúvida sobre a força do suporte.<br>
    <strong>Como executar:</strong> Ordem a mercado ou limite na abertura do candle seguinte ao candle de confirmação. Você paga um preço ligeiramente pior mas com muito mais certeza de que o suporte está ativo.<br>
    <strong>Vantagem:</strong> Muito menor chance de false break. A vela de confirmação prova que compradores estão ativos.<br>
    <strong>Desvantagem:</strong> Preço de entrada 1–3% acima do ideal, reduzindo ligeiramente o R:R.<br>
    <strong>Stop:</strong> Abaixo da mínima da vela de confirmação − 0.3%.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">E3</div>
  <div class="rule-content">
    <h4>Entrada de Rompimento — Para Continuação</h4>
    <p><strong>Quando usar:</strong> Quando um nível de resistência significativo é rompido com volume, confirmando continuação da tendência ou ativação do cenário bullish (gatilho de C3).<br>
    <strong>Como executar:</strong> Stop buy acima do nível de rompimento. Exemplo: stop buy em $1.49 para entrar quando o preço superar $1.48 com fechamento de candle 4H confirmado.<br>
    <strong>Vantagem:</strong> Você entra apenas quando o rompimento já está ocorrendo — elimina o risco de false break.<br>
    <strong>Desvantagem:</strong> Frequentemente preço piora após o rompimento com reteste — se possível, aguardar o reteste do nível rompido como suporte para melhor entrada.<br>
    <strong>Stop:</strong> Abaixo do nível rompido (que agora é suporte) − 0.5%.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">E4</div>
  <div class="rule-content">
    <h4>Entrada de Reteste — A Melhor Relação R:R</h4>
    <p><strong>Quando usar:</strong> Após rompimento de resistência, aguardar o preço retornar e testar o nível rompido como suporte antes de continuar.<br>
    <strong>Como executar:</strong> Ordem limitada no nível rompido + 0.5% de cushion. Aguardar com paciência — o reteste pode demorar horas ou dias. Se o preço não retornar, o rompimento foi tão forte que você só perde a oportunidade — não perde dinheiro.<br>
    <strong>Vantagem:</strong> Melhor R:R de todos os tipos de entrada. Stop muito próximo + alvo muito distante.<br>
    <strong>Desvantagem:</strong> Requer muita paciência. Nem todo rompimento tem reteste — às vezes você "perde" o trade por disciplina.<br>
    <strong>Para XRP:</strong> Se $1.48 for rompido com força, aguardar reteste em $1.46–$1.48 para E4 com stop $1.38 e alvos $1.65+. R:R ≥ 1:4.</p>
  </div>
</div>

<h2><span class="h2-num">2</span> Quando Usar Cada Tipo de Entrada</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Contexto</th><th>Tipo de Entrada</th><th>Sizing</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Todos os TFs alinhados + S/R S1 + Score &gt;14</td>
    <td class="td-gold">E1 (Zona) — entrar direto na zona</td>
    <td class="td-green">100%</td>
  </tr>
  <tr>
    <td class="td-em td-bright">2/3 TFs alinhados + S/R S1–S2 + Score 10–14</td>
    <td class="td-bright">E2 (Confirmação) — aguardar vela</td>
    <td class="td-green">80–100%</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Cenário bullish ativado (gatilho de rompimento)</td>
    <td class="td-cyan">E3 (Rompimento) — stop buy no nível</td>
    <td class="td-gold">60–70%</td>
  </tr>
  <tr>
    <td class="td-em td-green">Pós-rompimento + reteste confirmado</td>
    <td class="td-green">E4 (Reteste) — melhor R:R possível</td>
    <td class="td-green">100%</td>
  </tr>
  <tr>
    <td class="td-em td-red">Contra-tendência Daily + Score 7–10</td>
    <td class="td-red">E2 obrigatório — nunca E1 em contra-tendência</td>
    <td class="td-red">40–50%</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">3</span> Erros Mais Comuns na Execução de Entradas</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Erro</th><th>Por Que Acontece</th><th>Como Evitar</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">Entrar "antecipando" sem confirmação</td>
    <td>FOMO de perder o início do movimento</td>
    <td>E2 obrigatório em ambientes incertos. Perder os primeiros 1–2% é melhor que entrar em false break.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Perseguir o preço após impulso</td>
    <td>Momentum aparenta força — parece "óbvio"</td>
    <td>Nunca entrar quando o preço já se afastou &gt; 5% do ponto de entrada ideal. Aguardar reteste ou próxima zona.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Entrar com 100% de uma vez em contra-tendência</td>
    <td>Confiança excessiva na análise do suporte</td>
    <td>E2 + sizing −40% sempre em contra-tendência. Adicionar E2 extra (40% → 70%) quando HTF virar.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Entrar sem stop definido de antemão</td>
    <td>"Vou ver como fica e decido o stop depois"</td>
    <td>Stop SEMPRE definido antes da entrada. Se não encontrar stop que faça sentido técnico, o trade não existe.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Aumentar posição após o preço já ir a favor</td>
    <td>Ganância — "está funcionando, coloca mais"</td>
    <td>Adicionar apenas conforme o plano escalonado pré-definido (E1/E2/E3). Nunca impulsivamente.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Plano de Entrada Completo — XRP Quando Ativar C3</h2>

<div class="callout callout-gold">
  <div class="callout-title">📋 Plano de Entrada E3+E4 — Para Quando C3 Bullish Ativar</div>
  <p>
  <strong>Condição de ativação:</strong> Fechamento 4H acima de $1.48 com volume ≥ 1.5× média + HTF 4H BULL<br><br>
  <strong>Entrada E3 (Rompimento) — 40% da posição:</strong><br>
  • Stop buy em $1.4901 (acionado quando preço superar $1.49)<br>
  • Stop loss em $1.3850 (abaixo do suporte S1 $1.33 com margem)<br>
  • R:R com TP1 $1.65 = ($1.65 − $1.49) ÷ ($1.49 − $1.385) = 1.52<br><br>
  <strong>Entrada E4 (Reteste) — 40% adicional:</strong><br>
  • Aguardar reteste em $1.46–$1.49 se ocorrer<br>
  • Ordem limit em $1.47<br>
  • Stop loss em $1.3850<br>
  • R:R com TP1 $1.65 = ($1.65 − $1.47) ÷ ($1.47 − $1.385) = 2.12 → aprovado<br><br>
  <strong>Adição E2 (Confirmação de Continuação) — 20% restante:</strong><br>
  • Adicionar após HTF 4H confirmar BULL por 2 fechamentos + MACD 4H cruzamento bullish<br>
  • Preço estimado: $1.52–$1.55<br>
  • Stop mover para $1.43 (break-even após E3 e E4)<br><br>
  <strong>Alvos consolidados (posição completa):</strong><br>
  TP1 30% em $1.65 · TP2 50% em $1.93 · TP3 20% trailing a partir de $1.93
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Conheço os 4 tipos de entrada: Zona (E1), Confirmação (E2), Rompimento (E3), Reteste (E4)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei quando usar cada tipo conforme o contexto e o sizing adequado para cada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo os 5 erros mais comuns de entrada e como evitá-los</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Construí o plano completo de entrada E3+E4 para XRP quando C3 ativar</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei que E2 é obrigatório em contra-tendência — nunca E1 contra o Daily</div></div>
</div>`,

  "stop": `
<div class="blockquote">
  <div class="blockquote-text">O stop loss não é o sinal de que você estava errado. É o preço que você pagou para descobrir que estava errado antes que custasse muito mais. É um seguro, não uma derrota.</div>
  <div class="blockquote-author">— Ed Seykota · Market Wizards</div>
</div>

<h2><span class="h2-num">1</span> Stop Loss — A Ferramenta Mais Importante do Trading</h2>
<p>Se você pudesse escolher apenas uma habilidade para desenvolver no trading, a gestão de stop loss seria a escolha certa. Não porque seja a mais glamorosa — é justamente o contrário. É a mais silenciosa e a mais poderosa. <strong>Traders que sobrevivem décadas no mercado têm uma coisa em comum: stops disciplinados.</strong></p>
<p>O stop loss faz duas coisas simultaneamente: <strong>limita o tamanho da perda</strong> quando você está errado, e <strong>libera capital mental e financeiro</strong> para os próximos trades. Um trader preso num trade sem stop está psicologicamente comprometido — incapaz de ver novas oportunidades com clareza.</p>

<div class="callout callout-warn">
  <div class="callout-title">⚠️ O Erro que Destrói Portfólios</div>
  <p>O erro número 1 que transforma pequenas perdas em grandes perdas é <strong>mover o stop na direção contrária ao preço</strong>. "Deixa eu dar mais espaço" — essa frase, repetida vezes suficientes, destrói portfólios. O stop foi calculado em um momento de clareza. Movê-lo no calor do momento é deixar a emoção substituir a análise.</p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Gestão Dinâmica de Stop — Do Inicial ao Trailing</div><svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><defs><marker id="aY2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f0a500"/></marker></defs><rect x="10" y="10" width="700" height="180" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><polyline points="40,162 90,148 130,132 170,115 210,98 255,78 300,62 345,48 390,36 435,28 480,22 525,19 570,22 610,28" fill="none" stroke="#3d8fef" stroke-width="2.5" stroke-linejoin="round"/><circle cx="40" cy="162" r="6" fill="#00d68f"/><text x="14" y="179" font-size="9" fill="#00d68f" font-family="monospace">Entrada $1.49</text><line x1="10" y1="184" x2="700" y2="184" stroke="#e8394a" stroke-width="1.5" stroke-dasharray="6,3" opacity=".6"/><text x="14" y="192" font-size="9" fill="#e8394a" font-family="monospace">Stop Inicial $1.3821</text><line x1="210" y1="12" x2="210" y2="188" stroke="#00d68f" stroke-width="1" stroke-dasharray="4,4" opacity=".5"/><circle cx="210" cy="98" r="5" fill="#00d68f"/><text x="214" y="96" font-size="9" fill="#00d68f" font-family="monospace">TP1 $1.65 −30%</text><line x1="210" y1="162" x2="700" y2="162" stroke="#f0a500" stroke-width="1.5" stroke-dasharray="5,3" opacity=".8"/><text x="214" y="159" font-size="8.5" fill="#f0a500" font-family="monospace">Stop Break-Even $1.49</text><line x1="120" y1="182" x2="120" y2="166" stroke="#f0a500" stroke-width="1.5" marker-end="url(#aY2)"/><text x="60" y="178" font-size="8" fill="#f0a500" font-family="sans-serif">sobe stop</text><line x1="345" y1="12" x2="345" y2="188" stroke="#f0a500" stroke-width="1" stroke-dasharray="4,4" opacity=".5"/><circle cx="345" cy="48" r="5" fill="#f0a500"/><text x="349" y="46" font-size="9" fill="#f0a500" font-family="monospace">TP2 $1.93 −50%</text><polyline points="345,98 390,84 435,72 480,58 525,48 570,40 610,36" fill="none" stroke="#9c27b0" stroke-width="2" stroke-dasharray="5,3"/><text x="375" y="112" font-size="8.5" fill="#9c27b0" font-family="monospace">Trailing (Kijun-Sen)</text><rect x="480" y="12" width="230" height="34" fill="#00d68f" opacity=".06" rx="3"/><text x="595" y="25" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="monospace">TP3 $2.50+ −20%</text><text x="595" y="39" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">Trailing captura tendência</text><text x="125" y="14" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">① protege capital</text><text x="278" y="14" text-anchor="middle" font-size="8" fill="#f0a500" font-family="sans-serif">② protege lucro</text><text x="465" y="14" text-anchor="middle" font-size="8" fill="#9c27b0" font-family="sans-serif">③ captura tendência</text></svg></div>
<h2><span class="h2-num">2</span> Os 4 Métodos de Posicionamento de Stop do TMP</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">S1</div>
  <div class="rule-content">
    <h4>Stop Estrutural — O Método Principal</h4>
    <p><strong>Lógica:</strong> Posicione o stop abaixo do suporte técnico mais relevante que invalida a tese do trade. Se o preço fechar abaixo desse nível, a análise estava errada — não faz sentido segurar a posição.<br>
    <strong>Como calcular:</strong> Identifique o suporte S1 ou S2 mais próximo abaixo da entrada. Coloque o stop 0.5–1% abaixo desse suporte (margem para false break / stop hunt).<br>
    <strong>Exemplo XRP long:</strong> Entrada $1.49 / Suporte S1 = $1.30–$1.33 / Stop = $1.2821 (−0.7% abaixo de $1.30)<br>
    <strong>Quando usar:</strong> Sempre como método primário. É o único stop que tem lógica técnica real.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">S2</div>
  <div class="rule-content">
    <h4>Stop de ATR — Para Mercados Voláteis</h4>
    <p><strong>Lógica:</strong> O ATR (Average True Range) mede a volatilidade média diária do ativo. Em mercados muito voláteis, um stop estrutural pode ser muito próximo e ser acionado por ruído normal antes que a análise seja provada errada.<br>
    <strong>Como calcular:</strong> Stop = Entrada − (2 × ATR 14 períodos). Para XRP com ATR diário de ~$0.08, stop mínimo = $0.16 de distância da entrada.<br>
    <strong>Quando usar:</strong> Quando o stop estrutural é menor que 1.5× o ATR — significa que o stop está dentro do "ruído normal" de mercado e será acionado aleatoriamente.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--cyan)">S3</div>
  <div class="rule-content">
    <h4>Stop da Kijun-Sen — Para Trades de Tendência</h4>
    <p><strong>Lógica:</strong> Em trades seguindo a tendência de médio prazo, a Kijun-Sen (Linha Base Ichimoku) é o suporte dinâmico mais respeitado. Se o preço fechar abaixo da Kijun, a tendência está comprometida.<br>
    <strong>Como usar:</strong> Após TP1 atingido, mover o stop para seguir a Kijun-Sen — stop dinâmico que se move com o preço e protege lucros crescentes.<br>
    <strong>Vantagem:</strong> Permite capturar grandes movimentos de tendência sem sair cedo. A Kijun "afunila" naturalmente para o stop correto à medida que a tendência avança.</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">S4</div>
  <div class="rule-content">
    <h4>Trailing Stop — Para Proteger Lucros</h4>
    <p><strong>Lógica:</strong> Após o trade ir a favor, o trailing stop acompanha o preço mantendo uma distância fixa — travando lucros crescentes enquanto permite que o trade continue se a tendência continua.<br>
    <strong>Como calcular no TMP:</strong> Trailing de 1× ATR do timeframe de gestão. Quando o preço avança, o stop avança junto. Quando o preço recua, o stop para.<br>
    <strong>Quando ativar:</strong> Após TP2 atingido — o objetivo principal foi alcançado. A posição residual (20%) pode ser mantida com trailing stop para capturar o TP3 se vier.<br>
    <strong>Exemplo:</strong> TP2 atingido em $1.93 com trailing de 1 ATR = $0.08 → stop inicial em $1.85. Se preço sobe para $2.10, stop move para $2.02.</p>
  </div>
</div>

<h2><span class="h2-num">3</span> Stop Loss vs Stop Mental — Por Que Usar Ordens Reais</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Aspecto</th><th>Stop Real (Ordem na Exchange)</th><th>Stop Mental ("Vou sair se chegar em X")</th></tr></thead>
<tbody>
  <tr><td class="td-em">Execução</td><td class="td-green">Automática — sem interferência emocional</td><td class="td-red">Depende de você estar online E de agir sob pressão emocional intensa</td></tr>
  <tr><td class="td-em">Disciplina</td><td class="td-green">O sistema executa a decisão tomada com clareza</td><td class="td-red">90% das vezes você move o stop mental "mais um pouquinho"</td></tr>
  <tr><td class="td-em">Sono e paz mental</td><td class="td-green">Você pode dormir — o risco está limitado independente do que aconteça</td><td class="td-red">Você acorda de madrugada verificando o preço</td></tr>
  <tr><td class="td-em">Eventos overnight</td><td class="td-green">Stop acionado automaticamente mesmo em crashes às 3h da manhã</td><td class="td-red">Crash noturno = acorda com posição destruída sem possibilidade de ação</td></tr>
  <tr><td class="td-em">Confiança no sistema</td><td class="td-green">Cada stop acionado confirma que o sistema funciona como planejado</td><td class="td-red">Cada perda é vivida como falha pessoal, nunca como resultado esperado do sistema</td></tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> Gestão Dinâmica — Movendo o Stop a Favor</h2>
<p>O stop não precisa ficar estático — ele deve ser movido a favor do preço seguindo este protocolo:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">→</div>
    <div class="step-content">
      <h4>Após TP1 Atingido — Move para Break-Even</h4>
      <p>Quando o preço atinge TP1: realizar 30% da posição + mover stop da posição restante para o preço exato de entrada (break-even). <strong>A partir daqui, o trade não pode mais gerar perda financeira</strong> — apenas menor lucro ou lucro maior. Isso elimina completamente o estresse psicológico da posição restante.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">→</div>
    <div class="step-content">
      <h4>Após Novo Suporte Estrutural Formado</h4>
      <p>À medida que o preço avança e novos suportes se formam (ex: preço consolida acima de $1.65 criando um novo HL), mova o stop para abaixo desse novo suporte − 0.5%. Você protege lucros progressivamente enquanto mantém exposição ao movimento maior.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">→</div>
    <div class="step-content">
      <h4>Após TP2 Atingido — Trailing Stop Ativo</h4>
      <p>Após TP2, a posição residual (20%) opera com trailing stop da Kijun-Sen ou 1× ATR. O objetivo é capturar o TP3 se o movimento continuar, com proteção de que, no mínimo, você sai com lucro substancial mesmo se o preço reverter.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> Stop Plan Completo — XRP Trade Hipotético</h2>

<div class="callout callout-gold">
  <div class="callout-title">📋 Stop Plan — XRP Long (Cenário C3 Ativado)</div>
  <p style="font-size:13px;line-height:2.2">
  <strong>Entrada:</strong> $1.49 (E3 rompimento) + $1.47 (E4 reteste)<br>
  <strong>Preço médio:</strong> ~$1.48<br><br>
  <strong>Stop Inicial (S1 Estrutural):</strong> $1.3821 (−7.0% da entrada média)<br>
  → Justificativa: abaixo do suporte S1 $1.30–$1.35 com margem suficiente para false break<br><br>
  <strong>Stop após TP1 ($1.65 atingido):</strong> Mover para $1.49 (break-even)<br>
  → Realizar 30% da posição em $1.65<br><br>
  <strong>Stop após consolidação em $1.65+:</strong> Mover para $1.58 (abaixo novo HL)<br>
  → Protege ~7% de lucro na posição restante<br><br>
  <strong>Stop após TP2 ($1.93 atingido):</strong> Trailing stop ativado em Kijun 4H<br>
  → Realizar 50% da posição em $1.93<br>
  → 20% restante com trailing — alvo $2.50+
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 4 métodos de stop: Estrutural (S1), ATR (S2), Kijun (S3), Trailing (S4)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei por que stops reais são obrigatórios — nunca "stop mental"</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo o protocolo de gestão dinâmica: break-even após TP1, trailing após TP2</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Calculei o stop plan completo para o trade hipotético XRP com todos os ajustes</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo: NUNCA mover o stop na direção contrária ao preço — nunca, em hipótese alguma</div></div>
</div>`,

  "tp": `
<div class="blockquote">
  <div class="blockquote-text">Saber quando sair é tão importante quanto saber quando entrar. A maioria dos traders aprende a encontrar entradas. Poucos aprendem a gerenciar saídas. É na saída que o lucro se torna real.</div>
  <div class="blockquote-author">— Linda Bradford Raschke · Street Smarts</div>
</div>

<h2><span class="h2-num">1</span> A Arte de Sair — Por Que a Saída Define o Resultado</h2>
<p>Você pode ter a melhor entrada do mundo — zona de S/R perfeita, todos os filtros aprovados, timing preciso — e ainda destruir o resultado com uma saída ruim. Sair cedo demais deixa dinheiro na mesa. Sair tarde demais devolve lucros conquistados com muito esforço.</p>
<p>O método TMP resolve esse problema com um sistema de <strong>saídas escalonadas e pré-definidas</strong>: você realiza lucros progressivamente em múltiplos alvos, garantindo que cada trade que vai a seu favor seja lucrativo — independente de onde o preço finalmente revirar.</p>

<div class="callout callout-info">
  <div class="callout-title">💡 Por Que Múltiplos TPs São Superiores a Um Único Alvo</div>
  <p>
  <strong>Trade com 1 TP único (ex: só TP3 $1.93):</strong> Se o preço vai a $1.80 e reverte, você realizou $0. Ficou horas/dias em trade produtivo e saiu no zero.<br><br>
  <strong>Trade com 3 TPs escalonados (TP1 $1.65 / TP2 $1.93 / TP3 $2.50):</strong> Mesmo que o preço chegue a $1.80 e reverta, você já realizou 30% em $1.65 e move o stop para break-even. Resultado: lucro garantido na parte realizada, sem perda no restante.<br><br>
  Os TPs escalonados convertem trades "quase funcionou" em trades lucrativos consistentes.
  </p>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Take Profits Escalonados — Realizando Lucros em Etapas</div><svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="10" y="10" width="700" height="180" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><polyline points="40,168 85,155 120,140 155,124 192,105 228,86 265,70 300,55 338,42 375,30 415,22 458,16 502,14 542,16 575,20" fill="none" stroke="#3d8fef" stroke-width="2.2" stroke-linejoin="round"/><circle cx="40" cy="168" r="6" fill="#00c4e8"/><text x="8" y="185" font-size="8.5" fill="#00c4e8" font-family="monospace">Entrada $1.49</text><line x1="228" y1="12" x2="228" y2="188" stroke="#00d68f" stroke-width="1.2" stroke-dasharray="4,3" opacity=".7"/><circle cx="228" cy="86" r="7" fill="#00d68f" opacity=".25" stroke="#00d68f" stroke-width="2"/><text x="228" y="90" text-anchor="middle" font-size="8" fill="#00d68f" font-family="monospace" font-weight="700">TP1</text><rect x="152" y="100" width="78" height="34" rx="4" fill="#00d68f" opacity=".12"/><text x="191" y="114" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace">R:R 1:1.74</text><text x="191" y="126" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="sans-serif">$1.65 · 30% 💰</text><line x1="375" y1="12" x2="375" y2="188" stroke="#f0a500" stroke-width="1.2" stroke-dasharray="4,3" opacity=".7"/><circle cx="375" cy="30" r="7" fill="#f0a500" opacity=".25" stroke="#f0a500" stroke-width="2"/><text x="375" y="34" text-anchor="middle" font-size="8" fill="#f0a500" font-family="monospace" font-weight="700">TP2</text><rect x="296" y="42" width="82" height="34" rx="4" fill="#f0a500" opacity=".12"/><text x="337" y="56" text-anchor="middle" font-size="9" fill="#f0a500" font-family="monospace">R:R 1:4.6</text><text x="337" y="68" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="sans-serif">$1.93 · 50% 💰💰</text><line x1="502" y1="12" x2="502" y2="188" stroke="#9c27b0" stroke-width="1" stroke-dasharray="4,3" opacity=".5"/><rect x="502" y="12" width="208" height="40" fill="#9c27b0" opacity=".07" rx="3"/><text x="606" y="27" text-anchor="middle" font-size="9.5" fill="#9c27b0" font-family="monospace">TP3 Trailing $2.50+</text><text x="606" y="41" text-anchor="middle" font-size="8.5" fill="#9c27b0" font-family="sans-serif">20% · R:R 1:10 💰💰💰</text><text x="360" y="198" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Cada TP garante lucro progressivo — resultado positivo mesmo sem TP final</text></svg></div>
<h2><span class="h2-num">2</span> Os 3 Tipos de Take Profit do TMP</h2>

<div class="rule-card">
  <div class="rule-num" style="color:var(--bright)">TP1</div>
  <div class="rule-content">
    <h4>Take Profit 1 — Realização de Segurança (30% da posição)</h4>
    <p><strong>Objetivo:</strong> Garantir que o trade seja lucrativo. Proteger o capital e o esforço de análise.<br>
    <strong>Como definir:</strong> Próxima resistência significativa — S/R de pelo menos S2 + Fibonacci extensão 127.2% do impulso de entrada. O que vier primeiro.<br>
    <strong>Timing:</strong> Ordem limit colocada no momento da entrada — automático, sem intervenção quando atingido.<br>
    <strong>Ação após TP1:</strong> Realizar 30% + mover stop para break-even imediatamente.<br>
    <strong>XRP exemplo:</strong> TP1 = $1.65 (resistência estrutural 2024 + Fib 161.8% do bounce = coincidência de alvos)</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--gold)">TP2</div>
  <div class="rule-content">
    <h4>Take Profit 2 — Realização Principal (50% da posição)</h4>
    <p><strong>Objetivo:</strong> Capturar o movimento central do setup — o alvo que justificou o risco da entrada.<br>
    <strong>Como definir:</strong> Resistência S1 (alta confluência) + Fibonacci extensão 161.8% do impulso + VPVR HVN mais próximo acima.<br>
    <strong>Timing:</strong> Ordem limit colocada no momento da entrada — automático.<br>
    <strong>Ação após TP2:</strong> Realizar 50% + ativar trailing stop na Kijun-Sen para a posição residual.<br>
    <strong>XRP exemplo:</strong> TP2 = $1.93 (LH Daily + Fib 200% + VPVR HVN — tripla confluência resistência)</p>
  </div>
</div>

<div class="rule-card">
  <div class="rule-num" style="color:var(--green)">TP3</div>
  <div class="rule-content">
    <h4>Take Profit 3 — Posição de Tendência (20% da posição)</h4>
    <p><strong>Objetivo:</strong> Capturar movimentos maiores quando o cenário bullish se confirma completamente. "Deixar correr" com proteção.<br>
    <strong>Como definir:</strong> Resistência macro (S/R Daily de alta importância) + Fibonacci extensão 261.8% ou 300%. Pode ser indefinido se a tendência for muito forte — gerado pelo trailing stop.<br>
    <strong>Timing:</strong> Não colocar ordem limit — gerir com trailing stop. Sair quando o trailing for acionado.<br>
    <strong>Ação:</strong> Saída automática quando trailing stop disparar. Documentar o resultado no diário.<br>
    <strong>XRP exemplo:</strong> TP3 = $2.50–$2.60 (resistência macro) ou trailing stop seguindo a Kijun.</p>
  </div>
</div>

<h2><span class="h2-num">3</span> Como Calcular os TPs — Passo a Passo</h2>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Mapeie as Resistências à Frente</h4>
      <p>Usando o mapa de S/R construído na aula de Suportes e Resistências, liste todas as resistências relevantes entre a entrada e o máximo histórico recente. Priorize zonas S1 e S2. Cada zona importante é um TP candidato.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Aplique Fibonacci de Extensão</h4>
      <p>Usando o impulso do trade (ponto de entrada até o stop — ou o último swing relevante), projete as extensões 127.2%, 161.8%, 200% e 261.8%. Onde essas projeções coincidem com resistências estruturais = zonas de TP de alta probabilidade.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Verifique o R:R de Cada TP</h4>
      <p>
      TP1: R:R mínimo 1:1.5 (obrigatório para justificar entrada)<br>
      TP2: R:R mínimo 1:2.5 (alvo principal com lucro substancial)<br>
      TP3: R:R mínimo 1:4 (somente se confluência S1 + Fibonacci presente)<br>
      Se TP1 não atingir R:R 1:1.5, o trade tem risco/retorno insuficiente — não entrar.
      </p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Ajuste pelos Modificadores de Contexto</h4>
      <p>Se o mercado tem resistência adicional entre a entrada e TP1 (ex: a nuvem Ichimoku), ajuste TP1 para antes dessa resistência ou reconheça que a probabilidade de TP1 reduz. O Ichimoku e os S/R do mapa completo definem os obstáculos reais no caminho do preço.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> Situações Especiais de Saída</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Situação</th><th>Ação</th><th>Lógica</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">Notícia de alto impacto adversa ativa enquanto em posição</td>
    <td class="td-red">Sair 50% imediatamente a mercado. Ajustar stop do restante.</td>
    <td>O contexto macro mudou. A análise foi feita sob condições diferentes. Risco aumentou inesperadamente.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Preço chegou próximo ao TP mas não atingiu (ex: $1.63 vs TP1 $1.65)</td>
    <td class="td-gold">NÃO mover o TP para baixo para "garantir". Aguardar ou aceitar que pode não atingir.</td>
    <td>Mover TP para baixo é aceitar um R:R inferior ao calculado. Se o setup justificava $1.65, mantenha $1.65.</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Preço atingiu TP1 mas reverteu fortemente antes de TP2</td>
    <td class="td-bright">Segurar a posição restante com stop em break-even. Aguardar reaceleração.</td>
    <td>Após TP1 + stop em break-even, o risco é zero. Não faz sentido sair a mercado no pânico se o stop ainda não foi atingido.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Análise original muda significativamente (HTF virou BEAR)</td>
    <td class="td-cyan">Saída parcial estratégica (30–50%) + stop mais apertado para o restante.</td>
    <td>A tese do trade foi comprometida. Reduzir exposição faz sentido mesmo que o stop formal ainda não tenha sido atingido.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">5</span> TP Plan Completo — XRP Trade Hipotético (Cenário C3)</h2>

<div class="callout callout-gold">
  <div class="callout-title">📋 TP Plan Completo com Cálculos de R:R</div>
  <p style="font-size:13px;line-height:2.2">
  <strong>Entrada média:</strong> $1.48 · <strong>Stop:</strong> $1.3821 · <strong>Risco:</strong> $0.0979/unidade<br><br>
  <strong>TP1 — 30% da posição em $1.65:</strong><br>
  Ganho: $1.65 − $1.48 = $0.17 · R:R: 0.17 ÷ 0.0979 = <strong>1:1.74 ✓</strong><br>
  Ação: Realizar 30% + mover stop para $1.48 (break-even)<br><br>
  <strong>TP2 — 50% da posição em $1.93:</strong><br>
  Ganho: $1.93 − $1.48 = $0.45 · R:R: 0.45 ÷ 0.0979 = <strong>1:4.60 ✓✓</strong><br>
  Ação: Realizar 50% + ativar trailing stop em Kijun 4H (~$1.80 se tendência ativa)<br><br>
  <strong>TP3 — 20% da posição — trailing stop:</strong><br>
  Alvo referência: $2.50 · Ganho potencial: $1.02 · R:R potencial: <strong>1:10.4</strong><br>
  Saída real: quando trailing stop da Kijun for acionado<br><br>
  <strong>Resultado esperado em cenário C3 completo (todos TPs atingidos):</strong><br>
  P&L médio ponderado: (0.30 × 1.74R) + (0.50 × 4.60R) + (0.20 × 10.4R) = 0.52 + 2.30 + 2.08 = <strong>+4.90R total</strong>
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 3 TPs: TP1 segurança 30% / TP2 principal 50% / TP3 tendência 20%</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei calcular os TPs combinando resistências S/R + extensões Fibonacci</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Verifico o R:R de cada TP: mínimos 1:1.5 / 1:2.5 / 1:4 para TP1/TP2/TP3</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei as 4 situações especiais de saída e a ação correta em cada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Calculei o TP plan completo de XRP com R:R de cada nível e resultado esperado +4.90R</div></div>
</div>`,

  "sizing": `
<div class="blockquote">
  <div class="blockquote-text">A maioria dos traders passa 90% do tempo escolhendo onde entrar e 0% decidindo quanto entrar. É exatamente ao contrário do que deveria ser. O tamanho da posição é a variável mais controlável e mais impactante no resultado de longo prazo.</div>
  <div class="blockquote-author">— Van K. Tharp · Trade Your Way to Financial Freedom</div>
</div>

<h2><span class="h2-num">1</span> Por Que o Sizing é Mais Importante que a Direção</h2>
<p>Pense nisto: um trader com 60% de acerto que arrisca 10% do portfólio nos trades perdedores e 2% nos ganhadores vai perder dinheiro consistentemente. Um trader com 50% de acerto que arrisca 1% nos perdedores e 3% nos ganhadores vai ganhar dinheiro consistentemente.</p>
<p>O sizing — o tamanho de cada posição — determina se um sistema com edge positivo gera lucro ou perda. <strong>Um sistema bom com sizing ruim é um sistema perdedor. Um sistema médio com sizing excelente pode ser lucrativo.</strong></p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">1–2%</div><div class="kpi-label">Risco máximo por trade do portfólio total</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">6%</div><div class="kpi-label">Risco total máximo em posições simultâneas</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">−10%</div><div class="kpi-label">Drawdown que ativa redução de 50% no sizing</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">3</div><div class="kpi-label">Máximo de posições simultâneas</div></div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Fórmula de Sizing — Do Risco ao Tamanho de Posição</div><svg viewBox="0 0 720 195" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="20" y="20" width="130" height="68" rx="8" fill="#0a1628" stroke="#3d8fef" stroke-width="1.8"/><text x="85" y="44" text-anchor="middle" font-size="11" fill="#3d8fef" font-family="sans-serif" font-weight="700">Portfólio</text><text x="85" y="62" text-anchor="middle" font-size="16" fill="#fff" font-family="monospace" font-weight="700">$10.000</text><text x="85" y="78" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">capital total</text><text x="160" y="62" text-anchor="middle" font-size="22" fill="#607d8b" font-family="monospace">×</text><rect x="174" y="20" width="110" height="68" rx="8" fill="#0a1628" stroke="#f0a500" stroke-width="1.8"/><text x="229" y="44" text-anchor="middle" font-size="11" fill="#f0a500" font-family="sans-serif" font-weight="700">% Risco</text><text x="229" y="62" text-anchor="middle" font-size="16" fill="#fff" font-family="monospace" font-weight="700">2%</text><text x="229" y="78" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">= $200</text><text x="295" y="62" text-anchor="middle" font-size="22" fill="#607d8b" font-family="monospace">÷</text><rect x="310" y="20" width="158" height="68" rx="8" fill="#0a1628" stroke="#e8394a" stroke-width="1.8"/><text x="389" y="40" text-anchor="middle" font-size="10.5" fill="#e8394a" font-family="sans-serif" font-weight="700">Entrada − Stop</text><text x="389" y="58" text-anchor="middle" font-size="13" fill="#fff" font-family="monospace">$1.49 − $1.38</text><text x="389" y="78" text-anchor="middle" font-size="11" fill="#e8394a" font-family="monospace">= $0.1079</text><text x="480" y="62" text-anchor="middle" font-size="22" fill="#607d8b" font-family="monospace">=</text><rect x="496" y="12" width="204" height="82" rx="8" fill="#00d68f" opacity=".1" stroke="#00d68f" stroke-width="2"/><text x="598" y="36" text-anchor="middle" font-size="11" fill="#00d68f" font-family="sans-serif" font-weight="700">TAMANHO</text><text x="598" y="58" text-anchor="middle" font-size="20" fill="#00d68f" font-family="monospace" font-weight="700">1.854 XRP</text><text x="598" y="76" text-anchor="middle" font-size="10" fill="#00d68f" font-family="monospace">risco = $200 = 2%</text><text x="360" y="118" text-anchor="middle" font-size="10.5" fill="#607d8b" font-family="sans-serif" font-weight="700">Modificadores de Contexto</text><rect x="20" y="128" width="158" height="52" rx="6" fill="#0a1628" stroke="#00d68f" stroke-width="1"/><text x="99" y="146" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">Score ≥16 + TFs alinhados</text><text x="99" y="162" text-anchor="middle" font-size="13" fill="#00d68f" font-family="monospace" font-weight="700">+20% → 120%</text><text x="99" y="174" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">setup excepcional</text><rect x="190" y="128" width="148" height="52" rx="6" fill="#0a1628" stroke="#f0a500" stroke-width="1"/><text x="264" y="146" text-anchor="middle" font-size="9" fill="#f0a500" font-family="sans-serif">Contra-tendência Daily</text><text x="264" y="162" text-anchor="middle" font-size="13" fill="#f0a500" font-family="monospace" font-weight="700">−40% → 60%</text><text x="264" y="174" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">contra a maré</text><rect x="350" y="128" width="148" height="52" rx="6" fill="#0a1628" stroke="#e8394a" stroke-width="1"/><text x="424" y="146" text-anchor="middle" font-size="9" fill="#e8394a" font-family="sans-serif">Drawdown &gt;10%</text><text x="424" y="162" text-anchor="middle" font-size="13" fill="#e8394a" font-family="monospace" font-weight="700">−50% → 50%</text><text x="424" y="174" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">modo defensivo</text><rect x="510" y="128" width="190" height="52" rx="6" fill="#0a1628" stroke="#607d8b" stroke-width="1"/><text x="605" y="146" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Múltiplos negativos</text><text x="605" y="162" text-anchor="middle" font-size="12" fill="#607d8b" font-family="monospace" font-weight="700">Aplica o maior</text><text x="605" y="174" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">não acumula · teto −50%</text></svg></div>
<h2><span class="h2-num">2</span> A Fórmula de Sizing do TMP</h2>
<p>O sizing correto é sempre derivado do risco — nunca de um percentual fixo do portfólio que "parece certo":</p>

<div class="callout callout-gold">
  <div class="callout-title">📐 Fórmula de Sizing do TMP</div>
  <p style="font-size:15px;text-align:center;padding:12px">
  <strong>Tamanho = (Portfólio Total × % de Risco) ÷ (Preço de Entrada − Stop Loss)</strong>
  </p>
  <p>
  <strong>Exemplo XRP:</strong> Portfólio $10.000 · Risco 2% = $200 · Entrada $1.49 · Stop $1.3821<br>
  Distância ao stop = $1.49 − $1.3821 = $0.1079<br>
  Tamanho = $200 ÷ $0.1079 = <strong>1.854 XRP</strong> (valor aprox. $2.762)<br>
  Verificação: se stop for atingido, perda = 1.854 × $0.1079 = $200 = 2% do portfólio ✓
  </p>
</div>

<h2><span class="h2-num">3</span> Os Modificadores de Sizing — Ajustando ao Contexto</h2>
<p>O sizing base (calculado pela fórmula) é ajustado pelos <strong>modificadores de contexto</strong> — fatores que aumentam ou reduzem o tamanho da posição baseado na qualidade do setup:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Condição</th><th>Modificador</th><th>Sizing Final</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Score STMP ≥ 16/21 + Todos TFs alinhados</td>
    <td class="td-gold">+20% (setup excepcional)</td>
    <td class="td-gold">120% do base</td>
  </tr>
  <tr>
    <td class="td-em td-green">Score STMP 11–15 + Setup padrão</td>
    <td class="td-green">Sem modificador</td>
    <td class="td-green">100% do base</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Score STMP 7–10 (mínimo aceitável)</td>
    <td class="td-bright">−30%</td>
    <td class="td-bright">70% do base</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Trade contra-tendência Daily</td>
    <td class="td-gold">−40%</td>
    <td class="td-gold">60% do base</td>
  </tr>
  <tr>
    <td class="td-em td-red">F&G extremo (&lt;10 ou &gt;85)</td>
    <td class="td-red">−30% (volatilidade elevada)</td>
    <td class="td-red">70% do base</td>
  </tr>
  <tr>
    <td class="td-em td-red">Drawdown de portfólio &gt;10%</td>
    <td class="td-red">−50% (modo defensivo)</td>
    <td class="td-red">50% do base</td>
  </tr>
  <tr>
    <td class="td-em td-red">Drawdown de portfólio &gt;20%</td>
    <td class="td-red">−75% (modo sobrevivência)</td>
    <td class="td-red">25% do base</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Múltiplos modificadores negativos simultâneos</td>
    <td class="td-cyan">Aplica o maior modificador negativo (não acumula)</td>
    <td class="td-cyan">Máximo −50% por vez</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">4</span> A Regra do Risco Total — Nunca Mais de 6%</h2>
<p>Com múltiplas posições simultâneas, o risco total combinado nunca deve exceder 6% do portfólio. Isso porque criptomoedas são altamente correlacionadas — em crashes, tudo cai junto:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Antes de Abrir Novo Trade — Verificação de Risco Total</h4>
      <p>Some o risco atual de todas as posições abertas. Se já estiver em 4%, o novo trade pode usar no máximo 2% (total = 6%). Se já estiver em 5%, o novo trade usa 1% apenas. Se já estiver em 6%+, não abra novo trade até fechar algum existente.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Máximo de 3 Posições Simultâneas</h4>
      <p>Com 3 posições de 2% cada = 6% total máximo. Esta regra existe para forçar seletividade — se você já tem 3 posições abertas, a próxima ideia precisa ser melhor que uma das 3 existentes para merecer capital. Isso eleva a barra de qualidade continuamente.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Correlação de Ativos — Cuidado Especial</h4>
      <p>Se você tem 3 posições e todas são altcoins (XRP + ETH + SOL), na prática é quase uma posição única porque a correlação é &gt;0.85 em eventos macro. Prefira diversificar: 1 BTC + 1 altcoin + 1 ativo descorrelacionado, ou reduza o risco total para 4% quando todos forem altcoins.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">5</span> Sizing Aplicado — XRP 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📊 Cálculo de Sizing para o Trade Hipotético</div>
  <p style="font-size:13px;line-height:2.2">
  <strong>Portfólio:</strong> $10.000 · <strong>% Risco Base:</strong> 2% = $200<br>
  <strong>Entrada:</strong> $1.49 · <strong>Stop:</strong> $1.3821 · <strong>Distância:</strong> $0.1079<br><br>
  <strong>Sizing base:</strong> $200 ÷ $0.1079 = 1.854 XRP<br><br>
  <strong>Modificadores aplicáveis:</strong><br>
  ✗ Trade contra-tendência Daily: −40%<br>
  ✗ F&G = 5 (&lt;10): −30%<br>
  → Aplicar o maior modificador negativo: −40%<br><br>
  <strong>Sizing final:</strong> 1.854 × 0.60 = <strong>1.112 XRP</strong> (~$1.657)<br>
  <strong>Risco efetivo:</strong> 1.112 × $0.1079 = <strong>$120 = 1.2% do portfólio</strong><br><br>
  <strong>Entrada E1 (40%):</strong> 445 XRP<br>
  <strong>Entrada E2 (40%):</strong> 445 XRP (adicionar quando HTF 4H confirmar)<br>
  <strong>Entrada E3 (20%):</strong> 222 XRP (pirâmide após TP1)<br><br>
  <strong>Verificação de risco total:</strong> Sem outras posições abertas → 1.2% &lt; 6% máximo ✓
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a fórmula de sizing: (Portfólio × %Risco) ÷ (Entrada − Stop)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo os modificadores: contra-tendência −40% / F&G extremo −30% / drawdown 10%+ −50%</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei a regra do risco total: máximo 6% simultâneo / máximo 3 posições</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Calculei o sizing completo para XRP: 1.112 XRP / $120 de risco / 1.2% do portfólio</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que sizing correto é mais importante que direção correta no longo prazo</div></div>
</div>`,

  "regras": `
<div class="blockquote">
  <div class="blockquote-text">Disciplina não é fazer o que é difícil. É ter um sistema que remove as decisões difíceis — porque as decisões já foram tomadas com antecedência, quando você estava calmo e pensando com clareza.</div>
  <div class="blockquote-author">— Ray Dalio · Principles</div>
</div>

<h2><span class="h2-num">1</span> Por Que Regras São a Base da Consistência</h2>
<p>Todo trader profissional opera com regras. Não porque sejam rígidos ou sem criatividade — mas porque entenderam que a consistência de longo prazo exige um sistema que funcione independente do estado emocional do momento. Regras não limitam o trader. Elas o libertam da tirania das decisões impulsivas.</p>

<div class="kpi-row kpi-row-3">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--red)">Absolutas</div><div class="kpi-label">Nunca violadas — quebrar uma é gastar seu capital de disciplina</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">Diretrizes</div><div class="kpi-label">Seguidas na maioria dos casos — flexibilidade documentada</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">Heurísticas</div><div class="kpi-label">Guias de boa prática — adaptáveis ao contexto</div></div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">As 10 Regras — Pirâmide de Criticidade</div><svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="10" y="10" width="700" height="200" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><!-- Pyramid tiers --><polygon points="360,22 280,75 440,75" fill="#e8394a" opacity=".85"/><text x="360" y="56" text-anchor="middle" font-size="10" fill="#fff" font-family="sans-serif" font-weight="700">R1–R2–R3</text><text x="360" y="68" text-anchor="middle" font-size="8.5" fill="#fff" font-family="sans-serif">Stop · Sizing · Never Average</text><polygon points="280,75 200,130 440,130 440,75" fill="#e8394a" opacity=".55"/><text x="360" y="100" text-anchor="middle" font-size="10" fill="#fff" font-family="sans-serif" font-weight="700">R4–R5</text><text x="360" y="114" text-anchor="middle" font-size="8.5" fill="#fff" font-family="sans-serif">Análise completa · Sem average down</text><polygon points="200,130 140,185 520,185 440,130" fill="#f0a500" opacity=".4"/><text x="360" y="152" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">R6–R7–R8</text><text x="360" y="166" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="sans-serif">Contra-tendência · R:R &gt;1:2 · Estado emocional</text><text x="360" y="181" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="sans-serif">R9–R10: Realizar TP1 · Documentar trade</text><!-- Side labels --><text x="540" y="58" font-size="9" fill="#e8394a" font-family="sans-serif" font-weight="700">CRÍTICAS</text><text x="540" y="70" font-size="8.5" fill="#e8394a" font-family="sans-serif">Nunca violadas</text><line x1="535" y1="60" x2="445" y2="58" stroke="#e8394a" stroke-width="1" stroke-dasharray="3,2" opacity=".6"/><text x="540" y="105" font-size="9" fill="#e8394a" font-family="sans-serif">ABSOLUTAS</text><line x1="535" y1="105" x2="445" y2="100" stroke="#e8394a" stroke-width="1" stroke-dasharray="3,2" opacity=".5"/><text x="540" y="158" font-size="9" fill="#f0a500" font-family="sans-serif">DIRETRIZES</text><text x="540" y="170" font-size="8.5" fill="#f0a500" font-family="sans-serif">Alta importância</text><line x1="535" y1="160" x2="525" y2="158" stroke="#f0a500" stroke-width="1" stroke-dasharray="3,2" opacity=".5"/><text x="360" y="205" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Quanto mais alto na pirâmide, mais crítica a regra — nunca negocie com as do topo</text></svg></div>
<h2><span class="h2-num">2</span> As 10 Regras Absolutas do Método TMP</h2>
<p>Estas regras nunca são violadas. Se você está tentado a violar qualquer uma, é sinal de que a emoção assumiu o controle. Pare, respire, releia a regra e a razão por trás dela:</p>

<div class="rule-card"><div class="rule-num" style="color:var(--red)">R1</div><div class="rule-content"><h4>Nunca opere sem stop loss real configurado na exchange</h4><p>Stops mentais não existem. O stop é uma ordem real, colocada antes da entrada, que executa automaticamente. Sem stop = sem trade. Sem exceções, sem "só esse uma vez".</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--red)">R2</div><div class="rule-content"><h4>Nunca mova o stop contra a sua posição</h4><p>"Dar mais espaço" ao stop é o começo de todas as grandes perdas. O stop foi calculado em momento de clareza. Quando o preço ameaça, a emoção quer mover o stop — não ceda. A análise prevalece sobre o medo do momento.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--red)">R3</div><div class="rule-content"><h4>Nunca arrisque mais de 2% do portfólio em um único trade</h4><p>Mesmo que o setup seja "certeza absoluta" (não existe). Mesmo que seja "a oportunidade da vida". O sizing correto é o que permite sobreviver para os próximos 100 trades. Uma posição grande demais mata a objetividade.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--red)">R4</div><div class="rule-content"><h4>Nunca opere sem completar a análise das 3 fases (Contexto + Técnica + Decisão)</h4><p>Não há "trade rápido sem análise". Se não há tempo para análise completa, não há trade. Um trade sem processo não é um trade — é uma aposta com dinheiro real.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--red)">R5</div><div class="rule-content"><h4>Nunca adicione a uma posição perdedora (averaging down)</h4><p>Se o preço foi contra você, sua análise estava errada ou o timing estava errado. Adicionar capital a uma análise errada é dobrar a aposta errada. Se quiser re-entrar, feche a posição, reanalize do zero, e re-entre com nova análise fresca.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--gold)">R6</div><div class="rule-content"><h4>Nunca opere contra o Daily sem redução de 40% no sizing</h4><p>Longs em downtrend Daily e shorts em uptrend Daily são operações contra a maré. Elas podem funcionar — mas exigem sizing menor para que, quando não funcionarem (frequente), o impacto no portfólio seja gerenciável.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--gold)">R7</div><div class="rule-content"><h4>Nunca entre em trade com R:R menor que 1:2</h4><p>Se o melhor TP calculado versus o stop necessário resultar em R:R de 1:1.5 ou menos, o trade não existe. Um sistema consistente exige que os ganhos quando certo superem significativamente as perdas quando errado.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--gold)">R8</div><div class="rule-content"><h4>Nunca opere em dias de humor alterado (raiva, euforia, ansiedade extrema)</h4><p>O trading em estado emocional alterado é o erro mais custoso e mais previsível. Se você acabou de perder 3 trades seguidos e está com raiva, a análise do próximo trade está comprometida. Feche o computador. Volte amanhã.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--gold)">R9</div><div class="rule-content"><h4>Realize o TP1 sempre — nunca "deixe correr" além do plano sem mover o stop</h4><p>Ganância após o preço ir a favor é tão destrutiva quanto medo antes de entrar. Quando TP1 é atingido: realize 30%, mova o stop para break-even. Isso garante que o trade seja lucrativo. Então deixe o resto correr com proteção.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--cyan)">R10</div><div class="rule-content"><h4>Documente cada trade no diário — sem exceções</h4><p>O diário é a ferramenta de evolução mais subestimada do trading. Sem documentação, você repete os mesmos erros indefinidamente sem perceber o padrão. Com documentação, cada erro ensina algo. Cada acerto pode ser reproduzido.</p></div></div>

<h2><span class="h2-num">3</span> As 5 Regras de Emergência</h2>
<p>Situações extremas exigem respostas automáticas — não deliberação. Memorize estas regras para que executem automaticamente quando necessário:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Situação de Emergência</th><th>Regra de Emergência</th></tr></thead>
<tbody>
  <tr><td class="td-em td-red">Stop atingido</td><td>Aceitar, fechar, documentar. Zero deliberação. Zero "só mais um pouco".</td></tr>
  <tr><td class="td-em td-red">Perda de 5% do portfólio em 1 dia</td><td>Fechar todas as posições. Parar de operar por 24h. Revisar análise do dia seguinte.</td></tr>
  <tr><td class="td-em td-red">Drawdown acumulado de 10%</td><td>Reduzir sizing para 50% do normal até recuperar. Revisar o sistema.</td></tr>
  <tr><td class="td-em td-gold">Notícia de alto impacto inesperada em posição aberta</td><td>Reduzir 50% da posição imediatamente. Ajustar stop do restante para próximo S/R.</td></tr>
  <tr><td class="td-em td-gold">Exchange com problemas técnicos enquanto em posição</td><td>Sair da posição imediatamente via outra exchange ou contato de suporte. Segurança antes de lucro.</td></tr>
</tbody>
</table>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Li e entendi todas as 10 regras absolutas do método TMP</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Identifiquei qual regra tenho mais dificuldade de seguir e escrevi por quê</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Memorizo as 5 regras de emergência e quando cada uma se aplica</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Imprimi ou salvei as regras em local visível durante as sessões de trading</div></div>
</div>`,

  "emocional": `
<div class="blockquote">
  <div class="blockquote-text">Você não está lutando contra o mercado. Você está lutando contra versões de si mesmo: o você que quer vingança após uma perda, o você que quer mais após um ganho, o você que quer certeza antes de entrar. O mercado apenas revela quem você já é.</div>
  <div class="blockquote-author">— Mark Douglas · Trading in the Zone</div>
</div>

<h2><span class="h2-num">1</span> O Mapa Emocional do Trading</h2>
<p>Cada fase de um trade ativa emoções específicas e previsíveis. Conhecer esse mapa antecipadamente permite identificar quando você está sendo governado pela emoção — e retomar o controle antes de tomar uma decisão ruim.</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Fase do Trade</th><th>Emoção Típica</th><th>Comportamento Destrutivo</th><th>Comportamento Correto</th></tr></thead>
<tbody>
  <tr><td class="td-em td-bright">Antes de entrar — setup formando</td><td>FOMO / Ansiedade de perder</td><td>Entrar antes da confirmação, sem análise completa</td><td>Seguir o processo. Se perdeu a entrada, aguardar o próximo setup.</td></tr>
  <tr><td class="td-em td-gold">Após entrar — preço lateral</td><td>Impaciência / Dúvida</td><td>Sair prematuramente "para parar o sofrimento"</td><td>Confiar no processo. A análise foi feita. Aguardar o gatilho (TP ou stop).</td></tr>
  <tr><td class="td-em td-red">Preço vai contra — próximo do stop</td><td>Medo / Negação</td><td>Mover o stop, adicionar à posição perdedora, não aceitar o stop</td><td>Aceitar. O stop foi calculado corretamente. Se for atingido, é informação valiosa.</td></tr>
  <tr><td class="td-em td-green">Preço vai a favor — TP1 quase atingido</td><td>Ganância / Euforia</td><td>Não realizar TP1, "deixar correr" sem mover stop, aumentar posição impulsivamente</td><td>Executar o plano. Realizar TP1. Mover stop para break-even. Sem improvisação.</td></tr>
  <tr><td class="td-em td-red">Stop atingido</td><td>Raiva / Desejo de vingança</td><td>Entrar imediatamente no próximo trade para "recuperar", operar em modo revanche</td><td>Fechar. Documentar. Parar por pelo menos 2 horas. Analisar o que aconteceu com calma.</td></tr>
  <tr><td class="td-em td-gold">Sequência de perdas (3+)</td><td>Desespero / Quebra de confiança</td><td>Dobrar sizing para "recuperar rápido" ou desistir completamente</td><td>Reduzir sizing para 50%. Revisar o sistema. Verificar se está seguindo o processo corretamente.</td></tr>
</tbody>
</table>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">O Ciclo Emocional do Trade — Da Entrada ao Resultado</div><svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="10" y="10" width="700" height="170" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><line x1="30" y1="132" x2="695" y2="132" stroke="#1e3a5f" stroke-width="1.5"/><polyline points="50,132 80,118 105,110" fill="none" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/><polyline points="105,110 135,115 155,118 175,112" fill="none" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/><polyline points="175,112 205,126 228,137 248,147" fill="none" stroke="#e8394a" stroke-width="2.5" stroke-linejoin="round"/><polyline points="248,147 278,132 308,112 338,90 360,70" fill="none" stroke="#00d68f" stroke-width="2.5" stroke-linejoin="round"/><polyline points="360,70 385,58 400,50" fill="none" stroke="#00d68f" stroke-width="2.5" stroke-linejoin="round"/><polyline points="400,50 430,38 458,28 485,22" fill="none" stroke="#f0a500" stroke-width="2.5" stroke-linejoin="round"/><polyline points="485,22 515,38 540,58 562,82 582,110 605,132 628,150" fill="none" stroke="#e8394a" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="80" cy="104" rx="30" ry="13" fill="#f0a500" opacity=".15" stroke="#f0a500" stroke-width="1"/><text x="80" y="102" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="sans-serif" font-weight="700">FOMO</text><text x="80" y="112" text-anchor="middle" font-size="7.5" fill="#f0a500" font-family="sans-serif">ansiedade</text><ellipse cx="240" cy="155" rx="30" ry="12" fill="#e8394a" opacity=".15" stroke="#e8394a" stroke-width="1"/><text x="240" y="153" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="sans-serif" font-weight="700">MEDO</text><text x="240" y="163" text-anchor="middle" font-size="7.5" fill="#e8394a" font-family="sans-serif">próx. stop</text><ellipse cx="330" cy="80" rx="30" ry="13" fill="#00d68f" opacity=".15" stroke="#00d68f" stroke-width="1"/><text x="330" y="78" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="sans-serif" font-weight="700">ALÍVIO</text><text x="330" y="88" text-anchor="middle" font-size="7.5" fill="#00d68f" font-family="sans-serif">TP1 próximo</text><line x1="360" y1="14" x2="360" y2="175" stroke="#00d68f" stroke-width="1" stroke-dasharray="4,3" opacity=".5"/><text x="363" y="175" font-size="8" fill="#00d68f" font-family="sans-serif">TP1 ✓</text><ellipse cx="475" cy="18" rx="32" ry="13" fill="#f0a500" opacity=".15" stroke="#f0a500" stroke-width="1"/><text x="475" y="16" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="sans-serif" font-weight="700">GANÂNCIA</text><text x="475" y="26" text-anchor="middle" font-size="7.5" fill="#f0a500" font-family="sans-serif">"vai mais!"</text><ellipse cx="618" cy="154" rx="32" ry="13" fill="#e8394a" opacity=".15" stroke="#e8394a" stroke-width="1"/><text x="618" y="152" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="sans-serif" font-weight="700">VINGANÇA</text><text x="618" y="162" text-anchor="middle" font-size="7.5" fill="#e8394a" font-family="sans-serif">pausa 2h!</text><rect x="363" y="48" width="92" height="24" rx="4" fill="#00d68f" opacity=".15"/><text x="409" y="59" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="sans-serif" font-weight="700">✓ Realizar 30%</text><text x="409" y="69" text-anchor="middle" font-size="7.5" fill="#00d68f" font-family="sans-serif">+ stop B/E</text><text x="360" y="186" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">O plano foi feito com clareza — execute-o, não improvise sob emoção</text></svg></div>
<h2><span class="h2-num">2</span> Os 5 Inimigos Emocionais do Trader</h2>

<div class="rule-card"><div class="rule-num" style="color:var(--red)">①</div><div class="rule-content"><h4>FOMO — Fear Of Missing Out</h4><p><strong>O que é:</strong> Medo de perder uma oportunidade, levando a entradas precipitadas sem análise completa ou perseguição de preço após impulso.<br><strong>Como reconhecer:</strong> "Está subindo rápido, preciso entrar agora antes que seja tarde demais."<br><strong>Como combater:</strong> Lembre-se que o mercado cria novas oportunidades todos os dias. Perder um trade por disciplina é infinitamente melhor que entrar mal e perder dinheiro. O próximo setup sempre vem.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--red)">②</div><div class="rule-content"><h4>Revenge Trading — Operação de Vingança</h4><p><strong>O que é:</strong> Entrar em trades logo após perdas com o objetivo inconsciente de "recuperar" o que foi perdido.<br><strong>Como reconhecer:</strong> "Preciso recuperar essa perda agora. Vou entrar nesse setup mesmo sem análise completa."<br><strong>Como combater:</strong> Regra de emergência: após stop atingido, pausa mínima de 2 horas. O mercado não te deve nada. Cada trade é independente.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--gold)">③</div><div class="rule-content"><h4>Overconfidence — Excesso de Confiança</h4><p><strong>O que é:</strong> Após uma série de trades ganhadores, sensação de que "entendeu o mercado" e começa a relaxar as regras.<br><strong>Como reconhecer:</strong> "Estou num bom momento, posso arriscar mais esse trade. Sei o que estou fazendo."<br><strong>Como combater:</strong> Lembre que a última série de ganhos foi resultado de processo + probabilidade favorável. O próximo trade tem a mesma probabilidade, independente dos anteriores. O sistema não muda.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--bright)">④</div><div class="rule-content"><h4>Analysis Paralysis — Paralisia por Análise</h4><p><strong>O que é:</strong> Incapacidade de tomar decisão porque sempre há mais uma variável para verificar, mais uma confirmação para esperar.<br><strong>Como reconhecer:</strong> Setup qualificado há horas mas você ainda está "checando mais uma coisa".<br><strong>Como combater:</strong> O processo tem 3 fases. Quando as 3 fases estão completas e o score qualifica, você entra. Ponto. Perfeição não existe — boa análise + execução é o suficiente.</p></div></div>

<div class="rule-card"><div class="rule-num" style="color:var(--cyan)">⑤</div><div class="rule-content"><h4>Loss Aversion — Aversão à Perda</h4><p><strong>O que é:</strong> A dor de perder é psicologicamente 2× mais intensa que o prazer de ganhar o mesmo valor. Isso faz traders segurarem perdedores por tempo demais e realizarem ganhadores cedo demais.<br><strong>Como reconhecer:</strong> Realizou TP1 cedo demais com ganho de 0.5R "antes que virasse". Está segurando posição perdedora sem stop porque "não quer confirmar a perda".<br><strong>Como combater:</strong> O stop e o TP foram calculados antes da entrada com lógica técnica. Execute-os. A dor da perda já foi incorporada no cálculo de risco — é esperada e gerenciável.</p></div></div>

<h2><span class="h2-num">3</span> O Protocolo de Estado Emocional</h2>
<p>Antes de cada sessão de análise, faça esta verificação rápida:</p>

<div class="callout callout-gold">
  <div class="callout-title">🧠 Checklist de Estado Emocional — Antes de Qualquer Análise</div>
  <p style="font-family: var(--font-mono); font-size: 13px; line-height: 2.2; color: var(--gray1)">
  □ Dormi bem (≥7h)? Se não → reduzir sizing 30%<br>
  □ Estou com raiva, ansiedade extrema ou euforia? Se sim → não operar hoje<br>
  □ Tive perda maior que 3% ontem? Se sim → sizing 50% por 24h<br>
  □ Tive sequência de 3+ perdas na semana? Se sim → revisar processo antes de continuar<br>
  □ Há problemas pessoais significativos hoje? Se sim → análise apenas, sem trades<br>
  □ Estado: □ Calmo e focado → OPERAR normalmente<br>
  □ Levemente ansioso → OPERAR com sizing −20%<br>
  □ Alterado → NÃO OPERAR hoje
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Reconheço os 6 momentos emocionais críticos de um trade e o comportamento correto em cada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Identifiquei meu inimigo emocional principal entre os 5 (FOMO, Revenge, Overconfidence, Paralysis, Aversion)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Incorporei o checklist de estado emocional na minha rotina pré-sessão</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo que o mercado não te deve nada — cada trade é probabilístico e independente</div></div>
</div>`,

  "planob": `
<div class="blockquote">
  <div class="blockquote-text">Plano B não é admitir fraqueza. É reconhecer que o mercado é um adversário que frequentemente surpreende, e que os profissionais se preparam para essa surpresa enquanto amadores a ignoram.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Plano B — Árvore de Decisão por Cenário</div><svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="10" y="10" width="700" height="180" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><!-- Current price node --><rect x="290" y="75" width="140" height="48" rx="8" fill="#0a1628" stroke="#3d8fef" stroke-width="2"/><text x="360" y="95" text-anchor="middle" font-size="10.5" fill="#3d8fef" font-family="sans-serif" font-weight="700">XRP $1.33</text><text x="360" y="110" text-anchor="middle" font-size="9" fill="#607d8b" font-family="sans-serif">Aguardando gatilho</text><!-- Arrow C1 bearish --><line x1="290" y1="99" x2="145" y2="145" stroke="#e8394a" stroke-width="1.8"/><rect x="50" y="140" width="148" height="48" rx="8" fill="#0a1628" stroke="#e8394a" stroke-width="1.5"/><text x="124" y="159" text-anchor="middle" font-size="10" fill="#e8394a" font-family="sans-serif" font-weight="700">C1 — Bearish 50%</text><text x="124" y="172" text-anchor="middle" font-size="8.5" fill="#e8394a" font-family="sans-serif">Fechar longs · Short reteste</text><text x="124" y="182" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">gatilho: &lt;$1.28</text><!-- Arrow C2 range --><line x1="360" y1="123" x2="360" y2="140" stroke="#00c4e8" stroke-width="1.8"/><rect x="287" y="140" width="146" height="48" rx="8" fill="#0a1628" stroke="#00c4e8" stroke-width="1.5"/><text x="360" y="159" text-anchor="middle" font-size="10" fill="#00c4e8" font-family="sans-serif" font-weight="700">C2 — Range 15%</text><text x="360" y="172" text-anchor="middle" font-size="8.5" fill="#00c4e8" font-family="sans-serif">Range trade $1.28–$1.48</text><text x="360" y="182" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">gatilho: lateral 7d+</text><!-- Arrow C3 bullish --><line x1="430" y1="99" x2="577" y2="145" stroke="#00d68f" stroke-width="1.8"/><rect x="524" y="140" width="148" height="48" rx="8" fill="#0a1628" stroke="#00d68f" stroke-width="1.5"/><text x="598" y="159" text-anchor="middle" font-size="10" fill="#00d68f" font-family="sans-serif" font-weight="700">C3 — Bullish 35%</text><text x="598" y="172" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="sans-serif">E3 entrada · TP1 $1.65</text><text x="598" y="182" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">gatilho: &gt;$1.48 vol</text><!-- If/then labels --><text x="190" y="130" font-size="8.5" fill="#e8394a" font-family="sans-serif">Se &lt;$1.28...</text><text x="365" y="136" font-size="8.5" fill="#00c4e8" font-family="sans-serif">Se range...</text><text x="468" y="130" font-size="8.5" fill="#00d68f" font-family="sans-serif">Se &gt;$1.48...</text><!-- Top label --><text x="360" y="55" text-anchor="middle" font-size="10" fill="#607d8b" font-family="sans-serif">Plano "Se X, então Y" — decisões pré-definidas, executadas quando o gatilho ativar</text><!-- Prob circles at top --><circle cx="125" cy="38" r="18" fill="#e8394a" opacity=".15" stroke="#e8394a" stroke-width="1"/><text x="125" y="35" text-anchor="middle" font-size="9" fill="#e8394a" font-family="monospace" font-weight="700">50%</text><text x="125" y="47" text-anchor="middle" font-size="8" fill="#e8394a" font-family="sans-serif">bearish</text><circle cx="360" cy="38" r="18" fill="#00c4e8" opacity=".15" stroke="#00c4e8" stroke-width="1"/><text x="360" y="35" text-anchor="middle" font-size="9" fill="#00c4e8" font-family="monospace" font-weight="700">15%</text><text x="360" y="47" text-anchor="middle" font-size="8" fill="#00c4e8" font-family="sans-serif">range</text><circle cx="595" cy="38" r="18" fill="#00d68f" opacity=".15" stroke="#00d68f" stroke-width="1"/><text x="595" y="35" text-anchor="middle" font-size="9" fill="#00d68f" font-family="monospace" font-weight="700">35%</text><text x="595" y="47" text-anchor="middle" font-size="8" fill="#00d68f" font-family="sans-serif">bullish</text></svg></div>
<h2><span class="h2-num">1</span> O Que é o Plano B e Por Que Você Precisa de Um</h2>
<p>O Plano B é o conjunto de ações pré-definidas para quando o cenário principal (Plano A) não se materializa. Todo trader experiente tem plano B para as situações mais comuns que fogem do script. Ter plano B não é pessimismo — é profissionalismo.</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Situação Plano B</th><th>O que significa</th><th>Ação pré-definida</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-red">Stop atingido antes de TP1</td>
    <td>A análise estava errada ou o timing estava errado</td>
    <td>Aceitar a perda calculada. Documentar o motivo. Esperar 2h. Reanalisar do zero se quiser re-entrar. Nunca entrar imediatamente no sentido oposto por impulso.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Preço atinge TP1 mas não TP2 e reverte</td>
    <td>O movimento foi menor que o esperado</td>
    <td>TP1 realizou. Stop em break-even. Se stop de break-even for atingido: trade fechado com lucro da parte realizada. Resultado positivo — não é falha.</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Cenário principal não ativa em 72h</td>
    <td>Mercado em indecisão / esperando catalisador</td>
    <td>Revisar se as condições ainda justificam monitoramento. Manter alertas ativos ou fechar análise e aguardar setup mais claro. Não entrar por impaciência.</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Gatilho do Cenário C3 (Bullish) ativa mas com volume fraco</td>
    <td>Rompimento suspeito — pode ser falso</td>
    <td>Usar E4 (reteste) em vez de E3 (rompimento). Aguardar reteste do nível rompido para confirmar antes de entrar. Sizing reduzido 30% até confirmação.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Notícia de alto impacto adversa enquanto posição em lucro</td>
    <td>Risco macro aumentou inesperadamente</td>
    <td>Realizar 50% da posição imediatamente. Ajustar stop para garantir no mínimo break-even. Reavaliação completa antes de qualquer ação adicional.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Drawdown de 10% no mês</td>
    <td>O sistema ou a execução está com problemas</td>
    <td>Parar de operar por 48h. Revisar os últimos 10 trades: os erros foram de processo ou de sorte? Se processo: corrigir antes de continuar. Sizing 50% por 2 semanas após retorno.</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">2</span> Plano B Específico — XRP 23/02/2026</h2>

<div class="callout callout-warn">
  <div class="callout-title">📋 Planos B Definidos para o Case XRP</div>
  <p>
  <strong>Se C3 Bullish ativar mas volume for fraco no rompimento de $1.48:</strong><br>
  → Não usar E3. Aguardar reteste em $1.46–$1.48. Se reteste confirmar (bounce com volume), usar E4. Sizing reduzido 30%.<br><br>
  <strong>Se C1 Bearish ativar (fechamento abaixo de $1.28):</strong><br>
  → Cancelar imediatamente qualquer ordem de long pendente. Reanalisar downside: próximo suporte em $1.15, depois $1.00. Avaliar setup de short no reteste de $1.28–$1.30 somente com volume e HTF BEAR confirmado.<br><br>
  <strong>Se preço ficar em range $1.28–$1.48 por mais de 7 dias (C2 Neutro):</strong><br>
  → Range trade: comprar em $1.30–$1.33 (limite da zona S1) com alvo $1.43–$1.48. Stop $1.2621. Sizing 50% (range trade). Máximo 2 entradas de range por semana.<br><br>
  <strong>Se BTC tiver crash inesperado (&gt;−10% em 4h):</strong><br>
  → Fechar qualquer long de XRP imediatamente. Criptos têm correlação quase 1:1 em crashes de BTC. Reanalisar após estabilização do BTC.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os 6 cenários de Plano B mais comuns e a ação correta em cada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Defini os Planos B específicos para o case XRP (C1, C2, rompimento fraco, crash BTC)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo que drawdown de 10% exige pausa de 48h e revisão do sistema antes de continuar</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Tenho uma resposta automática definida para cada situação de emergência</div></div>
</div>`,

  "stop-hit": `
<div class="blockquote">
  <div class="blockquote-text">O stop atingido não é o fim do trade — é o início de uma lição. O que você faz nos 60 minutos após o stop define se você vai crescer como trader ou repetir o mesmo erro na próxima semana.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Protocolo Pós-Stop — Os 5 Passos</div><svg viewBox="0 0 720 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><defs><marker id="aBlue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#3d8fef"/></marker></defs><rect x="10" y="10" width="700" height="110" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><!-- 5 step boxes --><rect x="22" y="28" width="120" height="68" rx="7" fill="#0a1628" stroke="#e8394a" stroke-width="1.5"/><text x="82" y="52" text-anchor="middle" font-size="11" fill="#e8394a" font-family="monospace" font-weight="700">①</text><text x="82" y="66" text-anchor="middle" font-size="9.5" fill="#e8394a" font-family="sans-serif" font-weight="700">ACEITAR</text><text x="82" y="79" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">0–5 min</text><text x="82" y="90" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">não reabrir</text><line x1="143" y1="62" x2="156" y2="62" stroke="#3d8fef" stroke-width="2" marker-end="url(#aBlue)"/><rect x="158" y="28" width="120" height="68" rx="7" fill="#0a1628" stroke="#f0a500" stroke-width="1.5"/><text x="218" y="52" text-anchor="middle" font-size="11" fill="#f0a500" font-family="monospace" font-weight="700">②</text><text x="218" y="66" text-anchor="middle" font-size="9.5" fill="#f0a500" font-family="sans-serif" font-weight="700">PAUSA 2h</text><text x="218" y="79" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">obrigatória</text><text x="218" y="90" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">fechar gráficos</text><line x1="279" y1="62" x2="292" y2="62" stroke="#3d8fef" stroke-width="2" marker-end="url(#aBlue)"/><rect x="294" y="28" width="120" height="68" rx="7" fill="#0a1628" stroke="#3d8fef" stroke-width="1.5"/><text x="354" y="52" text-anchor="middle" font-size="11" fill="#3d8fef" font-family="monospace" font-weight="700">③</text><text x="354" y="66" text-anchor="middle" font-size="9.5" fill="#3d8fef" font-family="sans-serif" font-weight="700">DOCUMENTAR</text><text x="354" y="79" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">fatos objetivos</text><text x="354" y="90" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">sem julgamento</text><line x1="415" y1="62" x2="428" y2="62" stroke="#3d8fef" stroke-width="2" marker-end="url(#aBlue)"/><rect x="430" y="28" width="120" height="68" rx="7" fill="#0a1628" stroke="#9c27b0" stroke-width="1.5"/><text x="490" y="52" text-anchor="middle" font-size="11" fill="#9c27b0" font-family="monospace" font-weight="700">④</text><text x="490" y="66" text-anchor="middle" font-size="9.5" fill="#9c27b0" font-family="sans-serif" font-weight="700">CAUSA RAIZ</text><text x="490" y="79" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">A/B/C/D tipo</text><text x="490" y="90" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">processo ou sorte?</text><line x1="551" y1="62" x2="564" y2="62" stroke="#3d8fef" stroke-width="2" marker-end="url(#aBlue)"/><rect x="566" y="28" width="138" height="68" rx="7" fill="#0a1628" stroke="#00d68f" stroke-width="1.5"/><text x="635" y="52" text-anchor="middle" font-size="11" fill="#00d68f" font-family="monospace" font-weight="700">⑤</text><text x="635" y="66" text-anchor="middle" font-size="9.5" fill="#00d68f" font-family="sans-serif" font-weight="700">ATUALIZAR</text><text x="635" y="79" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">cenários novos</text><text x="635" y="90" text-anchor="middle" font-size="8" fill="#607d8b" font-family="sans-serif">reanalisar clean</text></svg></div>
<h2><span class="h2-num">1</span> O Protocolo Pós-Stop — Os 5 Passos</h2>
<p>A maioria dos traders trata o stop atingido como um evento traumático a ser esquecido rapidamente. Profissionais tratam como dados valiosos a serem extraídos com método. Este protocolo transforma cada stop em aprendizado:</p>

<div class="steps">
  <div class="step-card">
    <div class="step-num">1</div>
    <div class="step-content">
      <h4>Aceite Imediatamente (0–5 min)</h4>
      <p>Quando o stop é atingido, o trade foi fechado automaticamente pela ordem. Não reabra, não "cheque mais uma vez", não mude nada. A ordem executou como planejado. Respire. O pior que pode acontecer já está limitado ao risco calculado.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">2</div>
    <div class="step-content">
      <h4>Pausa Obrigatória (5–120 min)</h4>
      <p>Feche os gráficos por pelo menos 2 horas. Esta pausa não é opcional. O estado emocional logo após um stop é o pior momento possível para qualquer decisão de trading. O risco de revenge trading é máximo nesse período.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">3</div>
    <div class="step-content">
      <h4>Documentação Objetiva (após a pausa)</h4>
      <p>Registre no diário: data/hora, preço de entrada, stop, por que o stop foi atingido (preço foi até o stop ou houve spike?), score STMP original, o que aconteceu que não estava no cenário previsto. Sem julgamento — apenas fatos.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">4</div>
    <div class="step-content">
      <h4>Análise de Causa Raiz</h4>
      <p>Classifique o stop em uma de 3 categorias: <strong>(A) Processo correto, resultado adverso</strong> — o cenário de menor probabilidade se materializou. Nada a corrigir. <strong>(B) Análise correta, timing errado</strong> — a direção estava certa mas o momento estava cedo. Verificar se o processo de timing pode ser melhorado. <strong>(C) Erro de processo</strong> — alguma regra foi violada ou etapa pulada. Identificar a falha específica e corrigi-la.</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">5</div>
    <div class="step-content">
      <h4>Atualização dos Cenários</h4>
      <p>O stop atingido geralmente significa que um dos cenários (frequentemente o bearish) foi ativado. Atualize os cenários: o preço agora está abaixo do suporte que invalidou o trade — isso muda as probabilidades. Reanalize os 3 cenários do zero com os novos dados.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">2</span> Distinguindo Perdas Normais de Perdas por Erro</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Tipo de Perda</th><th>Característica</th><th>O Que Fazer</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-cyan">Perda Normal (sistema)</td>
    <td>Processo correto, todos os filtros seguidos, stop no lugar certo, cenário de menor probabilidade se materializou</td>
    <td class="td-green">Nada — é o custo esperado de um sistema com edge positivo. Documentar e avançar.</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Perda por Timing</td>
    <td>Análise correta mas entrada muito cedo — preço foi ao stop antes de ir ao alvo, depois subiu conforme previsto</td>
    <td class="td-gold">Verificar se o processo de aguardar confirmação (E2) teria evitado. Calibrar a exigência de confirmação.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Perda por Erro de Processo</td>
    <td>Uma ou mais regras foram violadas: stop muito próximo, sizing excessivo, entrada sem confirmação, análise incompleta</td>
    <td class="td-red">Identificar a regra violada. Entender por que foi violada (qual emoção). Criar salvaguarda para evitar recorrência.</td>
  </tr>
  <tr>
    <td class="td-em td-red">Perda por Evento Inesperado (Black Swan)</td>
    <td>Crash súbito, notícia de altíssimo impacto, falha técnica de exchange</td>
    <td class="td-gold">Verificar se tamanho de posição estava correto (proteção para eventos extremos). Stop real estava configurado? Se sim: o sistema funcionou.</td>
  </tr>
</tbody>
</table>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 5 passos do protocolo pós-stop: aceitar, pausa, documentar, análise, atualizar</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei distinguir entre perda normal de sistema, timing, processo e evento inesperado</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Comprometo-me com a pausa de 2 horas obrigatória após cada stop atingido</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo que perda normal de sistema não exige mudança — é o custo do edge</div></div>
</div>`,

  "semanal": `
<div class="blockquote">
  <div class="blockquote-text">Você não pratica o que não repete. E você não melhora no que não revisa. A rotina semanal é onde o método se transforma de conhecimento em habilidade — de teoria em reflexo.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Rotina Semanal — 3 Momentos, 3 Produtos</div><svg viewBox="0 0 720 165" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="10" y="10" width="700" height="145" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><!-- Sunday block --><rect x="22" y="24" width="190" height="118" rx="8" fill="#0a1628" stroke="#f0a500" stroke-width="1.8"/><rect x="22" y="24" width="190" height="30" rx="8" fill="#f0a500" opacity=".15"/><text x="117" y="44" text-anchor="middle" font-size="12" fill="#f0a500" font-family="sans-serif" font-weight="700">DOMINGO</text><text x="117" y="57" text-anchor="middle" font-size="9" fill="#f0a500" font-family="sans-serif">Preparação · 60 min</text><text x="30" y="76" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Revisão semana passada</text><text x="30" y="90" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Calendário macro semana</text><text x="30" y="104" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Daily dos ativos alvo</text><text x="30" y="118" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Lista de vigilância</text><rect x="28" y="128" width="176" height="8" rx="3" fill="#f0a500" opacity=".12"/><text x="116" y="136" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="monospace">↳ Lista de vigilância</text><!-- Mon-Thu block --><rect x="230" y="24" width="260" height="118" rx="8" fill="#0a1628" stroke="#3d8fef" stroke-width="1.8"/><rect x="230" y="24" width="260" height="30" rx="8" fill="#3d8fef" opacity=".12"/><text x="360" y="44" text-anchor="middle" font-size="12" fill="#3d8fef" font-family="sans-serif" font-weight="700">SEG — QUI</text><text x="360" y="57" text-anchor="middle" font-size="9" fill="#3d8fef" font-family="sans-serif">Execução · 45 min/dia</text><text x="238" y="76" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Manhã: protocolo 3 fases</text><text x="238" y="90" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Alertas: análise + execução</text><text x="238" y="104" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Gestão de posições abertas</text><text x="238" y="118" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Noite: documentar trades</text><rect x="236" y="128" width="246" height="8" rx="3" fill="#3d8fef" opacity=".1"/><text x="359" y="136" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="monospace">↳ Documento de análise</text><!-- Friday block --><rect x="508" y="24" width="202" height="118" rx="8" fill="#0a1628" stroke="#00d68f" stroke-width="1.8"/><rect x="508" y="24" width="202" height="30" rx="8" fill="#00d68f" opacity=".1"/><text x="609" y="44" text-anchor="middle" font-size="12" fill="#00d68f" font-family="sans-serif" font-weight="700">SEXTA</text><text x="609" y="57" text-anchor="middle" font-size="9" fill="#00d68f" font-family="sans-serif">Revisão · 30 min</text><text x="516" y="76" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Resultado em R do período</text><text x="516" y="90" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Análise de processo</text><text x="516" y="104" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Regras seguidas? Erros?</text><text x="516" y="118" font-size="9" fill="#607d8b" font-family="sans-serif">✦ Aprendizado da semana</text><rect x="514" y="128" width="188" height="8" rx="3" fill="#00d68f" opacity=".1"/><text x="608" y="136" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="monospace">↳ R total + aprendizado</text></svg></div>
<h2><span class="h2-num">1</span> A Rotina Semanal Completa do Método TMP</h2>
<p>Uma semana de trading bem estruturada tem três momentos distintos: <strong>preparação</strong> (domingo/segunda), <strong>execução</strong> (terça a quinta) e <strong>revisão</strong> (sexta). Cada momento tem sua função e seu produto específico.</p>

<div class="steps">
  <div class="step-card" style="border-left: 3px solid var(--gold)">
    <div class="step-num" style="background: linear-gradient(135deg,#7B5C00,#f0a500)">Dom</div>
    <div class="step-content">
      <h4>Domingo — Preparação Macro (60 min)</h4>
      <p>
      <strong>1. Revisão da semana passada (15 min):</strong> Releia os diários da semana. Quais trades ocorreram? Resultados em R? Padrões de erro observados?<br>
      <strong>2. Calendário macro da semana (10 min):</strong> Quais eventos de alto impacto acontecem essa semana (Fed, dados de emprego, anúncios regulatórios)? Marcar no calendário com alertas.<br>
      <strong>3. Análise Daily dos ativos monitorados (25 min):</strong> Atualizar mapa de S/R, verificar se algum cenário ativou na semana passada, construir cenários iniciais para a nova semana.<br>
      <strong>4. Lista de vigilância (10 min):</strong> Quais setups estão em formação? Quais alertas configurar? Quais preços monitorar com prioridade?
      </p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--bright)">
    <div class="step-num" style="background: linear-gradient(135deg,#0A3060,#3d8fef)">Seg–Qui</div>
    <div class="step-content">
      <h4>Segunda a Quinta — Execução (45 min/dia)</h4>
      <p>
      <strong>Manhã (20 min):</strong> Protocolo diário completo (3 fases: contexto + técnica + decisão). Preencher documento de análise. Atualizar cenários se necessário.<br>
      <strong>Alertas disparados:</strong> Quando um alerta disparar, executar análise rápida do 4H e 1H. Verificar score STMP. Executar se qualificar.<br>
      <strong>Gerenciamento de posições abertas (10 min, se aplicável):</strong> Verificar TPs, stops, trailing. Ajustar conforme gestão dinâmica.<br>
      <strong>Noite (15 min):</strong> Documentar qualquer trade executado. Revisar alertas. Registrar observações do dia no diário.
      </p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--cyan)">
    <div class="step-num" style="background: linear-gradient(135deg,#004a5c,#00c4e8)">Sex</div>
    <div class="step-content">
      <h4>Sexta — Revisão Semanal (30 min)</h4>
      <p>
      <strong>Resultado em R (10 min):</strong> Somar todos os trades da semana em R. Positivo ou negativo? Dentro da variância esperada?<br>
      <strong>Análise de processo (15 min):</strong> Para cada trade: o processo foi seguido? Alguma regra foi violada? Qual emoção dominou nas decisões difíceis?<br>
      <strong>Aprendizado da semana (5 min):</strong> Escrever 1–3 frases sobre o principal aprendizado da semana. Isso vai para o diário permanente e cria uma base de conhecimento crescente.
      </p>
    </div>
  </div>
</div>

<h2><span class="h2-num">2</span> Calendário Típico de Trading — O Que Esperar de Cada Fase do Mês</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Período</th><th>Característica Típica</th><th>Ajuste de Estratégia</th></tr></thead>
<tbody>
  <tr><td class="td-em td-bright">1ª semana do mês</td><td>Dados macroeconômicos importantes (PMI, Non-Farm Payrolls, etc.). Volatilidade elevada.</td><td>Sizing reduzido 20% nos dias de dados. Evitar trades abertos durante anúncios.</td></tr>
  <tr><td class="td-em td-green">2ª–3ª semana</td><td>Período mais limpo para swing trade. Menos eventos macro. Tendências técnicas mais respeitadas.</td><td>Sizing normal. Foco em setups de tendência. Melhor janela para o método TMP.</td></tr>
  <tr><td class="td-em td-gold">4ª semana</td><td>Fechamento de posições antes do fim de mês (window dressing institucional). Possível volatilidade.</td><td>Cautela com novos trades na última semana. Gerenciar posições abertas.</td></tr>
  <tr><td class="td-em td-red">Vencimento de futuros/opções</td><td>Volatilidade intensa. Movimentos artificiais de preço (pinning, stop hunts ampliados).</td><td>Evitar abertura de novas posições em dias de vencimento. Stops mais largos se em posição.</td></tr>
</tbody>
</table>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Defini minha rotina semanal: domingo (prep), seg–qui (execução), sexta (revisão)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei os 4 produtos de cada momento: lista de vigilância / documento de análise / resultado em R / aprendizado</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo o calendário mensal e os ajustes para cada fase</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Reservei horários fixos na agenda para a rotina — trading como profissão exige estrutura</div></div>
</div>`,

  "metricas": `
<div class="blockquote">
  <div class="blockquote-text">O que não é medido não é gerenciado. E o que não é gerenciado não melhora. As métricas de trading não são burocracia — são o painel de controle do seu negócio.</div>
  <div class="blockquote-author">— Peter Drucker (adaptado para trading)</div>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Dashboard de Métricas — Referências Saudáveis</div><svg viewBox="0 0 720 170" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="10" y="10" width="700" height="150" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><!-- Row 1: 4 metric cards --><rect x="22" y="22" width="154" height="58" rx="7" fill="#0a1628" stroke="#00d68f" stroke-width="1.2"/><text x="99" y="40" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Win Rate</text><text x="99" y="58" text-anchor="middle" font-size="18" fill="#00d68f" font-family="monospace" font-weight="700">55%</text><text x="99" y="72" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">meta: 45–65%</text><rect x="186" y="22" width="154" height="58" rx="7" fill="#0a1628" stroke="#f0a500" stroke-width="1.2"/><text x="263" y="40" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">R:R Médio</text><text x="263" y="58" text-anchor="middle" font-size="18" fill="#f0a500" font-family="monospace" font-weight="700">2.4R</text><text x="263" y="72" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">meta: ≥2.0R</text><rect x="350" y="22" width="154" height="58" rx="7" fill="#0a1628" stroke="#3d8fef" stroke-width="1.2"/><text x="427" y="40" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Expectativa</text><text x="427" y="58" text-anchor="middle" font-size="18" fill="#3d8fef" font-family="monospace" font-weight="700">+0.82R</text><text x="427" y="72" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">meta: &gt;+0.5R</text><rect x="514" y="22" width="196" height="58" rx="7" fill="#0a1628" stroke="#9c27b0" stroke-width="1.2"/><text x="612" y="40" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Profit Factor</text><text x="612" y="58" text-anchor="middle" font-size="18" fill="#9c27b0" font-family="monospace" font-weight="700">1.85</text><text x="612" y="72" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">meta: &gt;1.5 · ótimo: &gt;2.0</text><!-- Row 2: 4 more --><rect x="22" y="92" width="154" height="58" rx="7" fill="#0a1628" stroke="#e8394a" stroke-width="1.2"/><text x="99" y="110" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Max Drawdown</text><text x="99" y="128" text-anchor="middle" font-size="18" fill="#e8394a" font-family="monospace" font-weight="700">−8%</text><text x="99" y="142" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">alerta: &gt;10%</text><rect x="186" y="92" width="154" height="58" rx="7" fill="#0a1628" stroke="#00d68f" stroke-width="1.2"/><text x="263" y="110" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Taxa Processo</text><text x="263" y="128" text-anchor="middle" font-size="18" fill="#00d68f" font-family="monospace" font-weight="700">92%</text><text x="263" y="142" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">meta: &gt;90%</text><rect x="350" y="92" width="154" height="58" rx="7" fill="#0a1628" stroke="#f0a500" stroke-width="1.2"/><text x="427" y="110" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Seq. Perdas</text><text x="427" y="128" text-anchor="middle" font-size="18" fill="#f0a500" font-family="monospace" font-weight="700">5</text><text x="427" y="142" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">normal: até 7–8</text><rect x="514" y="92" width="196" height="58" rx="7" fill="#0a1628" stroke="#00c4e8" stroke-width="1.2"/><text x="612" y="110" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">R Total / Mês</text><text x="612" y="128" text-anchor="middle" font-size="18" fill="#00c4e8" font-family="monospace" font-weight="700">+6.4R</text><text x="612" y="142" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">meta: &gt;+3R/mês</text></svg></div>
<h2><span class="h2-num">1</span> As 8 Métricas Essenciais do TMP</h2>
<p>Estas são as métricas que todo trader sério rastreia mensalmente. Elas revelam a saúde real do sistema — muito além do simples lucro ou prejuízo:</p>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Métrica</th><th>Como Calcular</th><th>Referência Saudável</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Win Rate</td>
    <td>Trades ganhadores ÷ Total de trades × 100</td>
    <td class="td-gold">45–65% dependendo do R:R médio</td>
  </tr>
  <tr>
    <td class="td-em td-bright">R:R Médio Realizado</td>
    <td>Média de (ganho em R) dos trades ganhadores</td>
    <td class="td-green">≥ 2.0R (meta: 2.5R+)</td>
  </tr>
  <tr>
    <td class="td-em td-green">Expectativa por Trade</td>
    <td>(Win Rate × R:R médio ganho) − (Loss Rate × 1R)</td>
    <td class="td-green">&gt; +0.5R por trade (sinal de edge real)</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Profit Factor</td>
    <td>Soma dos ganhos ÷ Soma das perdas (valor absoluto)</td>
    <td class="td-cyan">&gt; 1.5 (excelente: &gt; 2.0)</td>
  </tr>
  <tr>
    <td class="td-em td-gold">Máximo Drawdown</td>
    <td>Maior queda pico a vale do portfólio no período</td>
    <td class="td-gold">&lt; 15% por mês (atenção: &gt; 10%)</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Taxa de Acerto de Processo</td>
    <td>Trades onde todas as regras foram seguidas ÷ Total</td>
    <td class="td-green">&gt; 90% (meta: 100%)</td>
  </tr>
  <tr>
    <td class="td-em td-red">Sequência Máxima de Perdas</td>
    <td>Maior número consecutivo de trades perdedores</td>
    <td class="td-gold">Normal: 4–7 seguidos mesmo com edge positivo</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">R Total do Mês</td>
    <td>Soma de todos os resultados em R do mês</td>
    <td class="td-green">&gt; +3R/mês = sistema funcionando</td>
  </tr>
</tbody>
</table>
</div>

<h2><span class="h2-num">2</span> Como Interpretar as Métricas — Diagnóstico do Sistema</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Sintoma nas Métricas</th><th>Diagnóstico Provável</th><th>Ação</th></tr></thead>
<tbody>
  <tr><td class="td-em">Win Rate alto (&gt;65%) mas R Total baixo</td><td>R:R médio muito baixo — saindo cedo demais nos ganhadores</td><td>Revisar gestão de TPs. Usar trailing stop mais eficiente.</td></tr>
  <tr><td class="td-em">Win Rate baixo (&lt;40%) e R Total negativo</td><td>Setups ruins (abaixo do score mínimo) ou stops muito apertados</td><td>Aumentar exigência de score antes de entrar. Rever posicionamento de stop.</td></tr>
  <tr><td class="td-em">Profit Factor &lt; 1.0</td><td>Sistema sem edge — perdendo mais do que ganhando sistematicamente</td><td>Parar de operar. Revisar todo o processo. Não continuar até identificar e corrigir a causa.</td></tr>
  <tr><td class="td-em">Taxa de acerto de processo &lt; 80%</td><td>Problema de disciplina — regras não estão sendo seguidas</td><td>Identificar qual regra está sendo violada com mais frequência. Criar salvaguarda específica.</td></tr>
  <tr><td class="td-em">Sequência de perdas &gt; 8</td><td>Pode ser variância normal ou degradação do sistema</td><td>Reduzir sizing 50%. Revisar se mercado mudou de regime (ex: de tendência para range).</td></tr>
</tbody>
</table>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei calcular as 8 métricas essenciais do TMP</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo os valores de referência saudável para cada métrica</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei diagnosticar problemas a partir das métricas e a ação corretiva para cada</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Criei minha planilha de rastreamento de métricas para uso mensal</div></div>
</div>`,

  "jornada": `
<div class="blockquote">
  <div class="blockquote-text">Você não chegou ao fim de um curso. Você chegou ao início de uma jornada. O que você tem agora é o mapa. O território você vai descobrir trade por trade, semana por semana, com o método como guia.</div>
  <div class="blockquote-author">— Método Trade Master Pro</div>
</div>

<h2><span class="h2-num">1</span> O Que Você Domina Agora</h2>
<p>Ao concluir o Método Trade Master Pro completo, você possui um arsenal analítico e operacional que a maioria dos participantes do mercado nunca vai ter. Não porque seja secreto — mas porque exige disciplina e comprometimento para aprender e aplicar de forma consistente.</p>

<div class="kpi-row kpi-row-4">
  <div class="kpi-card"><div class="kpi-value" style="color:var(--gold)">36</div><div class="kpi-label">Aulas concluídas</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--green)">4</div><div class="kpi-label">Fases do método dominadas</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--bright)">1</div><div class="kpi-label">Análise real completa (XRP 23/02/2026)</div></div>
  <div class="kpi-card"><div class="kpi-value" style="color:var(--cyan)">∞</div><div class="kpi-label">Potencial de aplicação diária</div></div>
</div>

<h2><span class="h2-num">2</span> O Mapa Completo do Método</h2>

<div class="data-table-wrap">
<table class="data-table">
<thead><tr><th>Fase</th><th>O Que Você Domina</th><th>Aplicação Diária</th></tr></thead>
<tbody>
  <tr>
    <td class="td-em td-gold">Fase 1 — Inteligência de Mercado</td>
    <td>Mindset profissional, diário de trading, classificação de notícias, fontes confiáveis, Fear & Greed Index, dominância BTC, dados on-chain</td>
    <td>20 min de contexto macro antes de abrir qualquer gráfico</td>
  </tr>
  <tr>
    <td class="td-em td-bright">Fase 2 — Análise Técnica</td>
    <td>Estrutura de preço, S/R, Fibonacci, padrões gráficos, sistema STMP (8 componentes, 5 filtros), ADX, RSI, MACD, Ichimoku, processo de decisão, análise MTF</td>
    <td>25 min de análise técnica multi-timeframe estruturada</td>
  </tr>
  <tr>
    <td class="td-em td-cyan">Fase 3 — Cenários e Probabilidades</td>
    <td>Pensamento probabilístico, 3 cenários com gatilhos, cálculo de probabilidade, filtros de qualidade, 4 tipos de entrada, stop loss (4 métodos), take profit escalonado, sizing preciso</td>
    <td>10 min de scorecard e decisão quantificada</td>
  </tr>
  <tr>
    <td class="td-em td-green">Fase 4 — Psicologia e Rotina</td>
    <td>10 regras absolutas, mapa emocional, 5 inimigos do trader, plano B, protocolo pós-stop, rotina semanal, 8 métricas essenciais</td>
    <td>Revisão semanal + documentação diária + estado emocional verificado</td>
  </tr>
</tbody>
</table>
</div>

<div style="margin:24px 0 28px;background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:20px 16px 16px;overflow:hidden"><div style="text-align:center;font-size:11px;color:#607d8b;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px">Os 90 Dias — Da Teoria à Execução Consistente</div><svg viewBox="0 0 720 155" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:720px;display:block;margin:0 auto"><rect x="10" y="10" width="700" height="135" rx="6" fill="#060f1e" stroke="#1e3a5f" stroke-width="1"/><!-- Timeline bar --><rect x="40" y="68" width="640" height="8" rx="4" fill="#1e3a5f"/><rect x="40" y="68" width="640" height="8" rx="4" fill="url(#grad90)" opacity=".7"/><!-- Gradient def --><defs><linearGradient id="grad90" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3d8fef"/><stop offset="33%" stop-color="#f0a500"/><stop offset="100%" stop-color="#00d68f"/></linearGradient></defs><!-- Month markers --><circle cx="40" cy="72" r="8" fill="#3d8fef"/><text x="40" y="76" text-anchor="middle" font-size="9" fill="#fff" font-family="monospace" font-weight="700">0</text><circle cx="253" cy="72" r="8" fill="#3d8fef"/><text x="253" y="76" text-anchor="middle" font-size="8.5" fill="#fff" font-family="monospace" font-weight="700">30d</text><circle cx="467" cy="72" r="8" fill="#f0a500"/><text x="467" y="76" text-anchor="middle" font-size="8.5" fill="#fff" font-family="monospace" font-weight="700">60d</text><circle cx="680" cy="72" r="8" fill="#00d68f"/><text x="680" y="76" text-anchor="middle" font-size="8.5" fill="#fff" font-family="monospace" font-weight="700">90d</text><!-- Month 1 block above --><!-- Phase 1 label --><rect x="40" y="22" width="205" height="38" rx="6" fill="#3d8fef" opacity=".12" stroke="#3d8fef" stroke-width="1"/><text x="142" y="36" text-anchor="middle" font-size="10" fill="#3d8fef" font-family="sans-serif" font-weight="700">Mês 1 — Paper Trade</text><text x="142" y="51" text-anchor="middle" font-size="8.5" fill="#3d8fef" font-family="sans-serif">Processo sem dinheiro real · 20+ análises</text><line x1="142" y1="60" x2="142" y2="68" stroke="#3d8fef" stroke-width="1.5" stroke-dasharray="3,2" opacity=".6"/><!-- Phase 2 label --><rect x="253" y="22" width="215" height="38" rx="6" fill="#f0a500" opacity=".12" stroke="#f0a500" stroke-width="1"/><text x="360" y="36" text-anchor="middle" font-size="10" fill="#f0a500" font-family="sans-serif" font-weight="700">Mês 2 — Capital 25%</text><text x="360" y="51" text-anchor="middle" font-size="8.5" fill="#f0a500" font-family="sans-serif">Testar sob emoção real · taxa processo &gt;85%</text><line x1="360" y1="60" x2="360" y2="68" stroke="#f0a500" stroke-width="1.5" stroke-dasharray="3,2" opacity=".6"/><!-- Phase 3 label --><rect x="467" y="22" width="213" height="38" rx="6" fill="#00d68f" opacity=".1" stroke="#00d68f" stroke-width="1"/><text x="573" y="36" text-anchor="middle" font-size="10" fill="#00d68f" font-family="sans-serif" font-weight="700">Mês 3 — Capital Completo</text><text x="573" y="51" text-anchor="middle" font-size="8.5" fill="#00d68f" font-family="sans-serif">Sistema validado · Escalar com confiança</text><line x1="573" y1="60" x2="573" y2="68" stroke="#00d68f" stroke-width="1.5" stroke-dasharray="3,2" opacity=".6"/><!-- Bottom labels --><text x="142" y="98" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">automatizar o processo</text><text x="360" y="98" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">calibrar sob pressão</text><text x="573" y="98" text-anchor="middle" font-size="8.5" fill="#607d8b" font-family="sans-serif">consistência real</text><!-- Bottom tagline --><text x="360" y="135" text-anchor="middle" font-size="9.5" fill="#607d8b" font-family="sans-serif">Resultados consistentes emergem de processo consistente — não o contrário</text></svg></div>
<h2><span class="h2-num">3</span> Os Próximos 90 Dias — Seu Plano de Implementação</h2>

<div class="steps">
  <div class="step-card" style="border-left: 3px solid var(--bright)">
    <div class="step-num" style="background: linear-gradient(135deg,#0A3060,#3d8fef)">Mês 1</div>
    <div class="step-content">
      <h4>Consolidação — Paper Trade e Processo</h4>
      <p>Primeiro mês: <strong>não opere com dinheiro real</strong> (ou opere com valor mínimo simbólico). Foco total em executar o protocolo completo todos os dias como se fosse dinheiro real. Preencha o documento de análise. Calcule scores STMP. Defina cenários. Apenas <em>não execute</em> as ordens reais — ou execute com $50 máximo.<br><br>
      Objetivo: Ter o processo tão automatizado que ele seja natural, não forçado. Colecione 20+ análises documentadas completas.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--gold)">
    <div class="step-num" style="background: linear-gradient(135deg,#7B5C00,#f0a500)">Mês 2</div>
    <div class="step-content">
      <h4>Capital Real Reduzido — Testando o Sistema</h4>
      <p>Segundo mês: opere com 25–30% do capital pretendido. O objetivo não é lucro — é validar que você consegue seguir o processo sob a pressão do dinheiro real. As emoções são completamente diferentes quando há capital em risco real.<br><br>
      Objetivo: Identificar onde o processo quebra sob pressão emocional. Cada falha é dados valiosos. Meta: taxa de acerto de processo &gt; 85%.</p>
    </div>
  </div>
  <div class="step-card" style="border-left: 3px solid var(--green)">
    <div class="step-num" style="background: linear-gradient(135deg,#005C3A,#00d68f)">Mês 3</div>
    <div class="step-content">
      <h4>Capital Completo — Sistema em Operação</h4>
      <p>Terceiro mês: após validar que o processo funciona e as métricas do mês 2 são saudáveis (expectativa positiva, taxa de processo &gt; 85%), escalar para o capital pretendido.<br><br>
      Objetivo: Operar com consistência de processo, não de resultado. Resultados consistentes emergem naturalmente de processo consistente — não o contrário.</p>
    </div>
  </div>
</div>

<h2><span class="h2-num">4</span> A Única Garantia Real do Método</h2>

<div class="callout callout-gold">
  <div class="callout-title">🏆 O Que o Método TMP Garante — e o Que Não Garante</div>
  <p>
  <strong>O que o método garante:</strong><br>
  ✓ Um processo analítico rigoroso e completo para qualquer ativo<br>
  ✓ Um sistema de gestão de risco que protege seu capital das perdas devastadoras<br>
  ✓ Um framework para tomar decisões objetivas, quantificadas e reproduzíveis<br>
  ✓ Uma estrutura para evoluir continuamente através de métricas e documentação<br><br>
  <strong>O que o método não garante:</strong><br>
  ✗ Lucro garantido em todo trade<br>
  ✗ Nunca ter perdas (perdas são parte do sistema)<br>
  ✗ Resultados sem disciplina de execução<br><br>
  <strong>A verdade fundamental:</strong> Nenhum método garante lucro em todo trade. O que um método sólido garante é que, executado consistentemente, os ganhos superarão as perdas no longo prazo — e que nenhuma perda individual destruirá o portfólio.<br><br>
  <strong>Você chegou até aqui.</strong> Isso já te coloca no top 5% dos participantes do mercado em termos de preparação. O próximo passo é a execução — trade por trade, diário por diário, semana por semana.
  </p>
</div>

<div class="checklist">
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Revisei o mapa completo do método e entendo o papel de cada fase</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Defini meu plano de 90 dias: mês 1 (paper), mês 2 (capital reduzido), mês 3 (completo)</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo o que o método garante — e o que não garante</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Tenho meu diário configurado, minhas planilhas prontas e minha rotina definida</div></div>
  <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">✅ MÉTODO TRADE MASTER PRO COMPLETO — estou pronto para a jornada</div></div>
</div>`,

};

export function getConteudoAula(aulaSlug: string): string | null {
  return LESSON_CONTENT[aulaSlug] ?? null;
}