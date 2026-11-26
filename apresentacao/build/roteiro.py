"""Gera roteiro/roteiro.html (falas por integrante). O PDF sai do Chrome headless."""
import html
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "roteiro" / "roteiro.html"
WPM = 140  # ritmo de fala para estimar o tempo

PESSOAS = {
    "andre": ("André Luís Aguiar", "#D62C1F"),
    "guilherme": ("Guilherme Passinho", "#9A5B12"),
    "hugo": ("Hugo Oliveira", "#1F6F54"),
    "rai": ("Raí Abreu", "#2F4F8F"),
}

# (slide, título, quem, fala [parágrafos], dica opcional)
FALAS = [
    (1, "Capa", "andre", [
        "Boa tarde. Nós somos André, Guilherme, Hugo e Raí, e vamos apresentar o projeto de Circuitos Digitais orientado pelo professor Luiz Henrique: o Placar Eletrônico Digital.",
        "A ideia é um placar de pontos para dois jogadores feito só com circuitos integrados de lógica digital. Não tem microcontrolador nem uma linha de código. Tudo o que vocês vão ver é contagem, decodificação e lógica combinacional.",
    ], "Apontar para o placar 7 : 3 da capa: “é isso que o circuito faz”."),
    (2, "Onde estamos", "andre", [
        "Começando pelo resumo. Hoje, 20 de novembro, já se passaram 94 dos 105 dias do projeto, cerca de 90% do prazo.",
        "Das 17 atividades do cronograma, 14 estão concluídas. Uma está em andamento, o relatório final, e duas estão pendentes: o TEP e a apresentação final.",
        "Os oito casos de teste foram aprovados: sete na simulação e o oitavo, que repete todos eles, na montagem física. O custo total dos materiais ficou em 82 reais e 25 centavos, uns 20 reais por integrante.",
        "Ou seja, a fase de execução terminou e estamos no encerramento.",
    ], None),
    (3, "O projeto", "andre", [
        "O princípio é o mesmo de um placar de quadra, como o da foto, só que em escala de bancada. São três requisitos.",
        "Primeiro: cada jogador tem um botão, e cada toque soma um ponto, de 0 a 9. Segundo: cada placar aparece no seu próprio display de sete segmentos. Terceiro: um único botão de reset zera os dois placares ao mesmo tempo.",
        "A base teórica foi o livro do Tocci, Sistemas Digitais, e os datasheets dos componentes. Agora o Guilherme explica como o circuito foi organizado.",
    ], "Passar a palavra para o Guilherme."),
    (4, "Arquitetura", "guilherme", [
        "Dividimos o circuito em três blocos ligados em cadeia, e essa cadeia se repete para cada jogador.",
        "O primeiro bloco é a entrada: o botão de ponto, com um filtro RC de 10 quilo-ohms e 10 microfarads, e o botão de reset, com um resistor de pull-down.",
        "O segundo é a contagem: um contador 74HC93, limitado de 0 a 9 por duas portas OR do 74HC32.",
        "O terceiro é a visualização: o decodificador CD4511, que converte o código binário para os sete segmentos, e um display de catodo comum com resistores de 330 ohms.",
        "Como são dois jogadores, cada um tem seu contador, decodificador e display. O 74HC32 tem quatro portas OR, então um único chip atende os dois placares, e o botão de reset também é compartilhado.",
    ], None),
    (5, "O contador", "guilherme", [
        "O 74HC93 é um contador binário assíncrono de 4 bits. Ligando a saída Q0 na entrada CP1, ele conta de 0 a 15, avançando na borda de descida do clock.",
        "Ele zera quando as duas entradas de reset, MR1 e MR2, estão em nível alto. Como queremos parar no 9, ligamos uma porta OR em cada uma: MR1 = Q1 + RST e MR2 = Q3 + RST. Pela propriedade distributiva, o reset interno fica R0 = Q1·Q3 + RST.",
        "O número 10, em binário 1010, é o primeiro estado em que Q1 e Q3 valem 1 juntos. Nesse instante o contador zera, em alguns nanossegundos. Por isso o 10 nunca chega a aparecer no display: depois do 9 vem direto o 0.",
    ], "Apontar para a sequência de dígitos: o 10 aparece apagado antes do 0."),
    (6, "O decodificador", "guilherme", [
        "O CD4511 recebe os quatro bits do contador e acende os segmentos de a até g. As saídas são ativas em nível alto, o que combina com display de catodo comum.",
        "Deixamos o teste de lâmpadas e o apagamento desligados e o latch transparente. Assim o display segue o contador direto.",
        "Para documentar a lógica interna, simplificamos cada segmento por mapa de Karnaugh, usando as combinações de 10 a 15 como don't care, já que o contador nunca fica nelas. O exemplo destacado é o segmento c: ele só apaga no dígito 2, e a expressão mínima fica c = Q2 + Q1' + Q0.",
    ], None),
    (7, "O filtro RC", "guilherme", [
        "O último bloco resolve um problema físico. Ao apertar ou soltar, o contato do botão oscila por cerca de um milissegundo. É o bounce. Como o contador reage a bordas, cada oscilação poderia virar um ponto.",
        "O capacitor resolve isso: quando o botão fecha, ele carrega na hora; nas aberturas rápidas do bounce, descarrega devagar pelo resistor. A constante de tempo é de 100 milissegundos, então a tensão não chega a cair abaixo do nível lógico.",
        "No osciloscópio, em cima está o contato com as oscilações e embaixo o sinal filtrado, limpo. Um detalhe: o ponto é contado quando o botão é solto, cerca de 120 milissegundos depois, na borda de descida.",
        "Com os três blocos explicados, o Hugo mostra a simulação e os testes.",
    ], "Passar a palavra para o Hugo."),
    (8, "Simulação no Tinkercad", "hugo", [
        "Antes de comprar qualquer peça, montamos o placar completo no Tinkercad Circuits.",
        "São duas protoboards, uma por jogador, e cada uma tem o caminho 74HC93, CD4511 e display. O fio amarelo leva o reset compartilhado entre as duas placas.",
        "Essa montagem virtual serviu de mapa para a montagem física: os CIs e os fios ficam na mesma posição, o que reduziu bastante os erros na bancada.",
    ], None),
    (9, "Esquemático e analisador lógico", "hugo", [
        "Também documentamos o circuito no padrão do Multisim. À esquerda está o esquemático do módulo de um jogador, com referências, pinos e o display.",
        "À direita está o analisador lógico. Damos doze toques no botão de ponto e depois um no reset. Nos nove primeiros toques, as saídas sobem em binário e o display vai de 0 a 9.",
        "No décimo toque aparece o estado 1010 por um instante; o sinal R0 vai a 1 e o contador volta para 0000. Depois, o reset manual zera o placar a partir do 2.",
    ], "Apontar o pulso estreito de R0 no 10º toque."),
    (10, "Testes", "hugo", [
        "Fizemos oito casos de teste. Os sete primeiros, na simulação: um toque a partir do zero, nove toques seguidos sem pular número, o retorno do 9 para o 0, o reset em qualquer valor, o reset pressionado bloqueando a contagem, toques rápidos sem contagem dupla e a independência entre os placares: o ponto do jogador A não mexe no B.",
        "O teste T8 repetiu todos eles na montagem física, com o mesmo resultado da simulação. Por isso o placar está oito de oito.",
    ], None),
    (11, "Montagem física", "hugo", [
        "Com tudo validado na simulação, compramos os materiais e montamos o circuito na protoboard, seguindo a mesma disposição do Tinkercad.",
        "Nas fotos está a bancada do laboratório, com a protoboard alimentada pela fonte de 5 volts, e a vista de cima, com os CIs, o botão e os LEDs de teste.",
        "Agora o Raí apresenta os custos e o cronograma.",
    ], "Passar a palavra para o Raí. Conferir antes se as fotos são as mais recentes da montagem."),
    (12, "Custos", "rai", [
        "O custo de referência do placar completo, para os dois jogadores, foi de 82 reais e 25 centavos, sem frete. Dá 20 reais e 56 centavos por integrante.",
        "A maior parte, 48 reais, ou 58%, é de protoboards, jumpers e o módulo de alimentação MB102, itens que reaproveitamos em outras disciplinas. Os circuitos integrados custaram 22 reais e 50 centavos, cerca de 27%. Displays, botões, resistores e capacitores somaram 11 reais e 75 centavos.",
        "Os preços foram consultados em lojas virtuais em 8 de novembro, à vista.",
    ], None),
    (13, "Cronograma (Gantt)", "rai", [
        "Este é o gráfico de Gantt, com o previsto e o realizado. A faixa cinza embaixo de cada barra é o que foi planejado no Termo de Abertura, os losangos são os marcos e a linha tracejada vermelha marca hoje, 20 de novembro.",
        "A pedido do professor, todos os testes ficaram na fase de Monitoramento e Testes: a verificação dos módulos, os testes em simulação, o teste físico e a validação final. Na Execução ficou só a construção do circuito.",
        "Tivemos um atraso: a entrega dos componentes estava prevista para 3 de novembro e só chegou no dia 7, quatro dias depois. Com isso, a montagem, o teste físico e a validação foram empurrados, e a validação terminou em 13 de novembro, e não no dia 10.",
        "Como o relatório final começou no prazo, em paralelo, a folga absorveu esse atraso. Nenhum marco do encerramento mudou e o projeto continua terminando em 1º de dezembro.",
    ], "Apontar o trecho hachurado em vermelho da aquisição dos materiais."),
    (14, "Problemas e melhorias", "rai", [
        "Registramos três pontos. O de impacto médio é a borda lenta no clock: o 74HC93 não tem entrada Schmitt trigger, e a descida do filtro RC leva uns 120 milissegundos. Como melhoria para uma próxima versão, dá para colocar um 74HC14 entre o filtro e o contador, por menos de 5 reais.",
        "O segundo é que o ponto conta ao soltar o botão, não ao apertar. Aceitamos e documentamos esse comportamento.",
        "O terceiro é que o placar vai só até 9. Isso atende o escopo, mas dá para cascatear um segundo contador e chegar a 99. E um problema que já resolvemos: o placar começou com um jogador e foi estendido para dois.",
    ], None),
    (15, "Próximos passos", "rai", [
        "Faltam três entregas. Hoje, o relatório final, com os resultados da placa e a prestação de contas dos materiais. De 21 a 24 de novembro, o Termo de Encerramento do Projeto. E de 25 de novembro a 1º de dezembro, a apresentação final, com o placar funcionando ao vivo.",
        "Antes da demonstração, vamos ensaiar o roteiro, conferir a alimentação e levar CIs e jumpers reserva.",
    ], "Passar a palavra de volta para o André."),
    (16, "Encerramento", "andre", [
        "Para fechar: o placar já funciona na simulação e na protoboard, dentro do prazo e com um custo baixo. A demonstração ao vivo fica para a apresentação final.",
        "Obrigado. O placar está zerado, agora é a vez de vocês: ficamos à disposição para perguntas.",
    ], "Nas perguntas, cada um responde pela sua parte (quadro abaixo)."),
]

PERGUNTAS = [
    ("Por que o 10 não aparece no display?", "guilherme",
     "Porque o 1010 dispara o reset na hora: R0 = Q1·Q3 vai a 1 e o contador zera em nanossegundos, rápido demais para o display mostrar."),
    ("Por que o ponto conta ao soltar o botão?", "guilherme",
     "O 74HC93 avança na borda de descida. Com o filtro RC, essa borda só acontece depois que o botão é solto, cerca de 120 ms depois."),
    ("Por que um filtro RC e não um Schmitt trigger?", "guilherme",
     "O RC resolveu o bounce com dois componentes baratos. O 74HC14 (Schmitt trigger) fica como melhoria, porque a borda lenta pode gerar contagem dupla em alguns casos."),
    ("Como vocês sabem que funciona?", "hugo",
     "Pelos casos T1 a T7 na simulação, pelo analisador lógico e pelo T8, que repetiu todos na montagem física com o mesmo resultado."),
    ("Dá para contar até 99?", "rai",
     "Sim: basta cascatear um segundo contador para as dezenas, com outro decodificador e display. Ficou fora porque o escopo do TAP é de 0 a 9."),
    ("Quanto custou e o que dá para reaproveitar?", "rai",
     "R$ 82,25 no total. Protoboards, jumpers e o MB102 (R$ 48,00, 58%) servem para outras disciplinas."),
]


def badge(k):
    nome, cor = PESSOAS[k]
    return f'<span class="badge" style="background:{cor}">{html.escape(nome)}</span>'


def minutos(seg):
    m, s = divmod(int(round(seg / 5.0) * 5), 60)
    return f"{m}:{s:02d}"


tempo = {k: 0.0 for k in PESSOAS}
slides_de = {k: [] for k in PESSOAS}
blocos = []
for n, tit, quem, pars, dica in FALAS:
    palavras = sum(len(p.split()) for p in pars)
    seg = palavras / WPM * 60
    tempo[quem] += seg
    slides_de[quem].append(n)
    corpo = "".join(f"<p>{html.escape(p)}</p>" for p in pars)
    dica_html = f'<div class="dica"><b>Dica:</b> {html.escape(dica)}</div>' if dica else ""
    blocos.append(f"""
<section class="fala" style="--c:{PESSOAS[quem][1]}">
  <div class="thumb"><img src="thumbs/s-{n:02d}.jpg" alt="Slide {n}"><div class="sn">Slide {n:02d}</div></div>
  <div class="txt">
    <div class="head"><h3>{html.escape(tit)}</h3>{badge(quem)}<span class="tempo">≈ {minutos(seg)}</span></div>
    {corpo}{dica_html}
  </div>
</section>""")

total = sum(tempo.values())


def faixa(ns):
    ns = sorted(ns)
    grupos, ini, ant = [], ns[0], ns[0]
    for x in ns[1:]:
        if x == ant + 1:
            ant = x
            continue
        grupos.append((ini, ant))
        ini = ant = x
    grupos.append((ini, ant))
    return ", ".join(f"{a}" if a == b else f"{a}–{b}" for a, b in grupos)


linhas = "".join(
    f"<tr><td>{badge(k)}</td><td>{faixa(slides_de[k])}</td><td>{len(slides_de[k])}</td><td>≈ {minutos(tempo[k])}</td></tr>"
    for k in PESSOAS
)
perg = "".join(
    f"<div class='q'><div class='qh'><b>{html.escape(q)}</b>{badge(k)}</div><p>{html.escape(a)}</p></div>"
    for q, k, a in PERGUNTAS
)

doc = f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Roteiro de Falas</title>
<style>
@page {{ size: A4; margin: 16mm 15mm 16mm 15mm; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: "Space Grotesk", "DejaVu Sans", Arial, sans-serif; color: #0C211B; font-size: 10.5pt; line-height: 1.45; background: #fff; }}
.mono {{ font-family: "JetBrains Mono", "DejaVu Sans Mono", "Courier New", monospace; }}
.kicker {{ font-family: "DejaVu Sans Mono", "Courier New", monospace; font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; color: #9A5B12; font-weight: 700; }}
h1 {{ font-size: 24pt; line-height: 1.1; margin: 6px 0 4px; }}
h2 {{ font-size: 14pt; margin: 18px 0 8px; }}
h3 {{ font-size: 12pt; }}
.sub {{ color: #4B6A5E; font-size: 10.5pt; }}
.badge {{ display: inline-block; color: #fff; font-size: 8.5pt; font-weight: 700; padding: 2px 9px; border-radius: 10px; white-space: nowrap; }}
table {{ width: 100%; border-collapse: collapse; margin-top: 8px; }}
th, td {{ text-align: left; padding: 7px 8px; border-bottom: 1px solid #E3EAE6; font-size: 10pt; }}
th {{ font-size: 8pt; text-transform: uppercase; letter-spacing: .08em; color: #4B6A5E; }}
.nota {{ background: #F3F6F4; border-radius: 6px; padding: 10px 12px; margin-top: 12px; font-size: 9.5pt; color: #2C4A3F; }}
.fala {{ display: grid; grid-template-columns: 62mm 1fr; gap: 6mm; padding: 5mm 0; border-top: 1px solid #E3EAE6; break-inside: avoid; }}
.thumb img {{ width: 62mm; border-radius: 4px; border: 1px solid #D5DED9; display: block; }}
.sn {{ font-family: "DejaVu Sans Mono", "Courier New", monospace; font-size: 8pt; color: #4B6A5E; margin-top: 3px; }}
.head {{ display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }}
.head h3 {{ margin-right: 4px; }}
.tempo {{ font-family: "DejaVu Sans Mono", "Courier New", monospace; font-size: 8.5pt; color: #4B6A5E; margin-left: auto; }}
.txt p {{ margin-bottom: 5px; }}
.txt {{ border-left: 3px solid var(--c); padding-left: 4mm; }}
.dica {{ margin-top: 6px; font-size: 9pt; color: #4B6A5E; background: #F3F6F4; padding: 5px 8px; border-radius: 4px; }}
.q {{ padding: 8px 0; border-top: 1px solid #E3EAE6; break-inside: avoid; }}
.qh {{ display: flex; justify-content: space-between; gap: 10px; align-items: center; margin-bottom: 3px; }}
.capa {{ break-after: page; }}
.pb {{ break-before: page; }}
</style></head>
<body>
<div class="capa">
  <div class="kicker">Circuitos Digitais · UFMA · Apresentação de status · 20/11/2026</div>
  <h1>Placar Eletrônico Digital<br>Roteiro de falas</h1>
  <p class="sub">Quem fala em cada slide, o que dizer e quanto tempo leva. Orientador: Prof. Luiz Henrique Neves Rodrigues.</p>

  <h2>Divisão</h2>
  <table>
    <tr><th>Integrante</th><th>Slides</th><th>Qtd.</th><th>Tempo</th></tr>
    {linhas}
    <tr><td><b>Total</b></td><td>1–16</td><td>16</td><td><b>≈ {minutos(total)}</b></td></tr>
  </table>
  <div class="nota">
    <b>Lógica da divisão:</b> André abre e fecha (contexto e status); Guilherme explica os três blocos do circuito;
    Hugo cobre simulação, testes e montagem; Raí fecha com custos, cronograma, problemas e próximos passos.
    Os tempos foram estimados a {WPM} palavras por minuto, sem contar as perguntas. As falas são uma base:
    adaptem para o jeito de cada um falar.
  </div>

  <h2>Passagens de palavra</h2>
  <table>
    <tr><th>Depois do slide</th><th>De</th><th>Para</th><th>Frase de ligação</th></tr>
    <tr><td>3</td><td>{badge("andre")}</td><td>{badge("guilherme")}</td><td>“Agora o Guilherme explica como o circuito foi organizado.”</td></tr>
    <tr><td>7</td><td>{badge("guilherme")}</td><td>{badge("hugo")}</td><td>“Com os três blocos explicados, o Hugo mostra a simulação e os testes.”</td></tr>
    <tr><td>11</td><td>{badge("hugo")}</td><td>{badge("rai")}</td><td>“Agora o Raí apresenta os custos e o cronograma.”</td></tr>
    <tr><td>15</td><td>{badge("rai")}</td><td>{badge("andre")}</td><td>(o André retoma para o encerramento)</td></tr>
  </table>
</div>

{"".join(blocos)}

<div class="pb">
  <div class="kicker">Para as perguntas</div>
  <h2 style="margin-top:6px">Perguntas prováveis e quem responde</h2>
  {perg}
</div>
</body></html>
"""
OUT.write_text(doc, encoding="utf-8")
print("ok", OUT, "total", minutos(total), {k: minutos(v) for k, v in tempo.items()})
