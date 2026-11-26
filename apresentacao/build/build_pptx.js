// Gera apresentacao/export/Placar_Eletronico_Status_26-11-2026.pptx
// Mesmo design do html/index.html (grade de 1280×720 px → 13,333×7,5 in).
const path = require("path");
const pptxgen = require("pptxgenjs");

const ROOT = path.resolve(__dirname, "..");
const IMG = (f) => path.join(ROOT, "assets/img", f);
const WEB = (f) => path.join(ROOT, "assets/web", f);
const OUT = path.join(ROOT, "export/Placar_Eletronico_Status_26-11-2026.pptx");

const P = (px) => +(px / 96).toFixed(4); // px → polegadas
const C = {
  pcb: "0C211B", pcb2: "133328", trace: "1E4034", mint: "9DB5AA", ink: "EDEFEA",
  copper: "E0A458", led: "FF4136", ghost: "1B3A30", black: "06120E", panel: "050D0A",
  done: "13875A", now: "2F6FD0", todoL: "8AA39A",
  paper: "F3F6F4", paper2: "E3EAE6", white: "FFFFFF", pmuted: "4B6A5E", pled: "D62C1F", pcopper: "9A5B12",
  ghostL: "D5DED9",
};
const HEAD = "Arial", BODY = "Calibri", MONO = "Courier New";

const THEME = {
  name: "Placar PCB",
  headFontFace: HEAD, bodyFontFace: BODY,
  colors: {
    dk1: C.pcb, lt1: C.white, dk2: C.pcb2, lt2: C.paper,
    accent1: C.led, accent2: C.copper, accent3: C.mint, accent4: C.trace, accent5: C.pled, accent6: C.pcopper,
    hlink: C.copper, folHlink: C.mint,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Placar Eletrônico Digital — Status do Projeto";
pres.author = "Equipe do Placar Eletrônico Digital";
pres.subject = "Circuitos Digitais · UFMA · status em 26/11/2026";
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

pres.defineSlideMaster({ title: "ESCURO", background: { color: C.pcb } });
pres.defineSlideMaster({ title: "CLARO", background: { color: C.paper } });

// ---------------- helpers ----------------
function T(slide, text, x, y, w, h, o = {}) {
  // espaçamento de linha sempre em pontos (spcPts): alguns visualizadores erram o espaçamento proporcional
  const fs = o.fontSize || 15;
  slide.addText(text, {
    x: P(x), y: P(y), w: P(w), h: P(h), isTextBox: true, margin: 0, valign: "top",
    fontFace: BODY, fontSize: 15, color: C.ink, lineSpacing: Math.round(fs * 1.18 * 10) / 10, ...o,
  });
}
function kicker(slide, text, light) {
  T(slide, text.toUpperCase(), 64, 50, 900, 22, {
    fontFace: MONO, fontSize: 10.5, bold: true, charSpacing: 2, color: light ? C.pcopper : C.copper,
  });
}
function title(slide, text, light, w = 1020) {
  T(slide, text, 64, 78, w, 120, { fontFace: HEAD, bold: true, fontSize: 32, color: light ? C.pcb : C.ink, valign: "top" });
}
function rect(slide, x, y, w, h, fill, o = {}) {
  slide.addShape(pres.shapes.RECTANGLE, { x: P(x), y: P(y), w: P(w), h: P(h), fill: { color: fill }, line: { type: "none" }, ...o });
}
function card(slide, x, y, w, h, light, o = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: P(x), y: P(y), w: P(w), h: P(h), rectRadius: 0.1,
    fill: { color: o.fill || (light ? C.white : C.pcb2) }, line: { type: "none" },
    shadow: light ? { type: "outer", color: "0C211B", opacity: 0.1, blur: 8, offset: 2, angle: 90 } : undefined,
  });
}
function img(slide, file, x, y, w, h, iw, ih, o = {}) {
  // recorta no modo "cover" mantendo proporção
  slide.addImage({ path: file, x: P(x), y: P(y), w: P(w), h: P(h), sizing: { type: "cover", w: P(w), h: P(h) }, altText: o.alt || "", ...o.extra });
}

// display de 7 segmentos com formas nativas (hexágonos inclinados)
const MAP = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcfgd" };
function seg(slide, v, x, y, wpx, { ghost = false, light = false, labels = false } = {}) {
  // grade 60×104 unidades, como no SVG
  const k = wpx / 60, t = 10, g = 2.2, L = 5, R = 55, Tp = 5, M = 52, B = 99, sk = 0.105; // inclinação ~6°
  const on = ghost ? "" : MAP[v] || "";
  const lit = C.led, off = light ? C.ghostL : C.ghost;
  const sx = (ux, uy) => ux + (104 - uy) * sk; // skew
  const Hs = (x1, x2, yy) => [[x1, yy], [x1 + t / 2, yy - t / 2], [x2 - t / 2, yy - t / 2], [x2, yy], [x2 - t / 2, yy + t / 2], [x1 + t / 2, yy + t / 2]];
  const Vs = (xx, y1, y2) => [[xx, y1], [xx + t / 2, y1 + t / 2], [xx + t / 2, y2 - t / 2], [xx, y2], [xx - t / 2, y2 - t / 2], [xx - t / 2, y1 + t / 2]];
  const S = { a: Hs(L + g, R - g, Tp), g: Hs(L + g, R - g, M), d: Hs(L + g, R - g, B), f: Vs(L, Tp + g, M - g), b: Vs(R, Tp + g, M - g), e: Vs(L, M + g, B - g), c: Vs(R, M + g, B - g) };
  for (const key of Object.keys(S)) {
    const pts = S[key].map(([ux, uy]) => [sx(ux, uy) * k, uy * k]);
    const minX = Math.min(...pts.map((p) => p[0])), minY = Math.min(...pts.map((p) => p[1]));
    const maxX = Math.max(...pts.map((p) => p[0])), maxY = Math.max(...pts.map((p) => p[1]));
    const points = pts.map(([px, py], i) => ({ x: P(px - minX), y: P(py - minY) }));
    points.push({ close: true });
    const isOn = on.includes(key);
    slide.addShape(pres.shapes.CUSTOM_GEOMETRY, {
      x: P(x + minX), y: P(y + minY), w: P(maxX - minX), h: P(maxY - minY), points,
      fill: { color: isOn ? lit : off }, line: { type: "none" },
      objectName: `seg-${v}-${key}`,
    });
  }
  if (labels) {
    const LP = { a: [30, -9], b: [66, 28], c: [62, 78], d: [26, 114], e: [-12, 78], f: [-8, 28], g: [30, 30] };
    for (const key of Object.keys(LP)) {
      const [ux, uy] = LP[key];
      T(slide, key, x + sx(ux, uy) * k - 10, y + uy * k - 10, 20, 20, { fontFace: MONO, fontSize: 11, bold: true, color: C.mint, align: "center", valign: "middle" });
    }
  }
  return (wpx * 104) / 60; // altura
}
function segRow(slide, str, x, y, wpx, o) {
  [...String(str)].forEach((c, i) => seg(slide, +c, x + i * wpx * 1.18, y, wpx, o));
}
function num(slide, n, light) {
  segRow(slide, String(n).padStart(2, "0"), 1180, 48, 18, { light });
}
// trilhas de cobre decorativas
function traces(slide, kind) {
  const L = [];
  if (kind === "cover") {
    L.push([[1280, 560], [980, 560], [930, 610], [700, 610]], [[1280, 600], [1000, 600], [950, 650], [760, 650]], [[1280, 640], [1020, 640], [990, 670], [820, 670]], [[0, 120], [360, 120], [400, 80], [640, 80]], [[0, 160], [340, 160], [380, 120], [520, 120]]);
  } else if (kind === "a") {
    L.push([[1280, 640], [1060, 640], [1010, 690], [860, 690]], [[1280, 680], [1090, 680], [1070, 700], [940, 700]]);
  } else {
    L.push([[1280, 540], [1140, 540], [1110, 565], [960, 565]]);
  }
  for (const pl of L) {
    for (let i = 0; i < pl.length - 1; i++) {
      const [x1, y1] = pl[i], [x2, y2] = pl[i + 1];
      slide.addShape(pres.shapes.LINE, {
        x: P(Math.min(x1, x2)), y: P(Math.min(y1, y2)), w: P(Math.abs(x2 - x1)) || 0.001, h: P(Math.abs(y2 - y1)) || 0.001,
        flipH: (x2 < x1) !== (y2 < y1) && y1 !== y2, line: { color: C.trace, width: 2.25 },
      });
    }
    const [ex, ey] = pl[pl.length - 1];
    slide.addShape(pres.shapes.OVAL, { x: P(ex - 7), y: P(ey - 7), w: P(14), h: P(14), fill: { type: "none" }, line: { color: C.copper, width: 2.25, transparency: 45 } });
  }
}
function scoreboard(slide, x, y, w, h, a, b, dw) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: P(x), y: P(y), w: P(w), h: P(h), rectRadius: 0.14, fill: { color: C.panel }, line: { color: C.trace, width: 1.5 } });
  T(slide, "JOGADOR A", x + 34, y + 26, 160, 20, { fontFace: MONO, fontSize: 10.5, color: C.mint });
  T(slide, "JOGADOR B", x + w - 194, y + 26, 160, 20, { fontFace: MONO, fontSize: 10.5, color: C.mint, align: "right" });
  const dh = (dw * 104) / 60, top = y + 60 + (h - 60 - dh) / 2 - 6;
  seg(slide, a, x + 40, top, dw);
  seg(slide, b, x + w - 40 - dw * 1.12, top, dw);
  const cx = x + w / 2 - 8;
  slide.addShape(pres.shapes.OVAL, { x: P(cx), y: P(top + dh * 0.32), w: P(16), h: P(16), fill: { color: C.led }, line: { type: "none" } });
  slide.addShape(pres.shapes.OVAL, { x: P(cx), y: P(top + dh * 0.62), w: P(16), h: P(16), fill: { color: C.led }, line: { type: "none" } });
}
function credit(slide, text, x, y, w, color, align = "left") {
  T(slide, text, x, y, w, 16, { fontFace: MONO, fontSize: 8, color, align });
}
function eq(slide, lines, x, y, w, h, fs = 16) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: P(x), y: P(y), w: P(w), h: P(h), rectRadius: 0.08, fill: { color: C.black }, line: { type: "none" } });
  slide.addText(lines.map((l, i) => ({ text: l.t, options: { color: l.hi ? C.led : C.copper, bold: !!l.hi, breakLine: i < lines.length - 1 } })),
    { x: P(x + 20), y: P(y + 12), w: P(w - 40), h: P(h - 24), isTextBox: true, margin: 0, fontFace: MONO, fontSize: fs, valign: "middle", lineSpacing: Math.round(fs * 1.35) });
}

// ================= SLIDES =================
// 01 CAPA
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  traces(s, "cover");
  kicker(s, "Circuitos Digitais · UFMA · Status em 26/11/2026");
  T(s, "Placar\nEletrônico\nDigital", 64, 200, 620, 240, { fontFace: HEAD, bold: true, fontSize: 52, lineSpacing: 54 });
  T(s, "Um contador de pontos para dois jogadores, feito só com lógica digital: sem microcontrolador, sem código.", 64, 456, 560, 70, { fontSize: 17, color: C.mint });
  scoreboard(s, 746, 150, 470, 330, 7, 3, 150);
  T(s, "André Luís Aguiar · Guilherme Passinho · Hugo Oliveira · Raí Abreu", 64, 640, 760, 24, { fontFace: MONO, fontSize: 11.5 });
  T(s, [{ text: "Orientador", options: { color: C.mint, breakLine: true } }, { text: "Prof. Luiz Henrique Neves Rodrigues", options: { color: C.ink } }], 816, 628, 400, 40, { fontFace: MONO, fontSize: 10, align: "right" });
  s.addNotes("Abertura. O projeto é um placar de dois jogadores feito apenas com CIs de lógica digital (74HC93, CD4511 e 74HC32). Esta apresentação mostra o status em 26/11/2026: o que foi feito, simulação, montagem, custos e cronograma.");
}

// 02 ONDE ESTAMOS
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  kicker(s, "Onde estamos");
  title(s, "O placar funciona na simulação; a montagem na protoboard é o próximo passo");
  const cw = 266, gap = 24, y0 = 250, ch = 220;
  const cards = [
    { big: "95", unit: "", lab: "% do prazo", sub: "100 de 105 dias decorridos" },
    { big: "14", unit: "/17", lab: "atividades", sub: "Relatório e TEP atrasados" },
    { big: "7", unit: "/8", lab: "testes ok", sub: "T1–T7 na simulação; T8 na placa pendente" },
  ];
  cards.forEach((c, i) => {
    const x = 64 + i * (cw + gap);
    card(s, x, y0, cw, ch, false);
    segRow(s, c.big, x + 24, y0 + 22, 46);
    if (c.unit) T(s, c.unit, x + 24 + c.big.length * 46 * 1.18 + 4, y0 + 66, 90, 34, { fontFace: MONO, fontSize: 22, color: C.mint });
    T(s, c.lab, x + 24, y0 + 112, cw - 48, 26, { fontFace: MONO, fontSize: 15, color: C.led });
    T(s, c.sub, x + 24, y0 + 146, cw - 48, 50, { fontSize: 14, color: C.mint });
  });
  const x = 64 + 3 * (cw + gap);
  card(s, x, y0, cw, ch, false);
  T(s, "R$", x + 24, y0 + 22, 80, 24, { fontFace: MONO, fontSize: 15, color: C.copper });
  T(s, "123,00", x + 24, y0 + 44, cw - 48, 60, { fontFace: MONO, fontSize: 38, bold: true });
  T(s, "em materiais", x + 24, y0 + 112, cw - 48, 26, { fontFace: MONO, fontSize: 15, color: C.led });
  T(s, "R$ 30,75 por integrante", x + 24, y0 + 146, cw - 48, 50, { fontSize: 14, color: C.mint });
  T(s, [{ text: "Fase atual: ", options: { color: C.mint } }, { text: "Encerramento", options: { color: C.ink, bold: true } }, { text: ". Relatório e aprovação do TEP atrasados; apresentação até 01/12.", options: { color: C.mint } }], 64, 620, 1150, 30, { fontSize: 16 });
  num(s, 2);
  s.addNotes("Resumo do status: 100 dos 105 dias decorridos (95%), 14 de 17 atividades concluídas, 7 dos 8 casos de teste aprovados (T1–T7, na simulação; o T8, na placa, ainda não foi feito) e custo total de R$ 123,00. O relatório final, previsto para 20/11, ainda não foi entregue, e a aprovação do TEP, prevista para 24/11, também está atrasada.");
}

// 03 O QUE É
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  img(s, WEB("scoreboard.jpg"), 0, 0, 440, 720, 1920, 2880, { alt: "Placar digital de um clube de críquete" });
  credit(s, "Foto: Acabashi · CC BY-SA 4.0 · Wikimedia Commons", 16, 696, 420, C.white);
  T(s, "O PROJETO", 504, 50, 600, 22, { fontFace: MONO, fontSize: 10.5, bold: true, charSpacing: 2, color: C.copper });
  T(s, "O mesmo princípio de um placar de quadra, em escala de bancada", 504, 78, 660, 110, { fontFace: HEAD, bold: true, fontSize: 30 });
  const items = [
    [1, "Apertou, contou", "Cada jogador tem um botão que soma 1 ponto, de 0 a 9."],
    [2, "Aparece no display", "Cada placar tem seu display de 7 segmentos."],
    [0, "Um botão zera tudo", "O reset volta os dois placares para 0 ao mesmo tempo."],
  ];
  items.forEach(([d, h, b], i) => {
    const y = 230 + i * 100;
    seg(s, d, 504, y, 40);
    T(s, h, 570, y + 2, 600, 30, { fontFace: HEAD, bold: true, fontSize: 18 });
    T(s, b, 570, y + 34, 620, 30, { fontSize: 15, color: C.mint });
  });
  T(s, "Início 19/08 · Entrega 01/12 · Base: Tocci, Sistemas Digitais (11ª ed.) e datasheets", 504, 560, 700, 22, { fontFace: MONO, fontSize: 10.5, color: C.mint });
  num(s, 3);
  s.addNotes("O objetivo: um placar como o de uma quadra, mas em protoboard. Três requisitos: cada botão soma um ponto (0 a 9), cada jogador tem seu display, e um botão de reset zera os dois.");
}

// 04 ARQUITETURA
{
  const s = pres.addSlide({ masterName: "CLARO" });
  kicker(s, "Arquitetura", true);
  title(s, "Três blocos em cadeia, repetidos para cada jogador", true);
  credit(s, "Fotos: Soumyapatra13, JailsonBR, Haragayato · CC BY-SA 3.0 · Wikimedia Commons", 640, 22, 576, C.pmuted, "right");
  const blocks = [
    [WEB("componentes.jpg"), 1920, 1314, "1 · ENTRADA", "Botões", "Botão de ponto com filtro RC anti-repique; reset com pull-down", "R = 10 kΩ · C = 10 µF"],
    [WEB("chips7400.jpg"), 1920, 1440, "2 · CONTAGEM", "Contador", "Contador de 4 bits limitado a 0–9 por duas portas OR no reset", "74HC93 + 74HC32"],
    [WEB("7seg2.jpg"), 1078, 789, "3 · VISUALIZAÇÃO", "Display", "Decodificador BCD → 7 segmentos e display de catodo comum", "CD4511 + 7 × 330 Ω"],
  ];
  const bw = 357, gap = 40, y0 = 206, bh = 380;
  blocks.forEach(([f, iw, ih, k, h, b, m], i) => {
    const x = 64 + i * (bw + gap);
    card(s, x, y0, bw, bh, true);
    img(s, f, x, y0, bw, 170, iw, ih);
    T(s, k, x + 22, y0 + 188, bw - 44, 18, { fontFace: MONO, fontSize: 10, bold: true, color: C.pcopper });
    T(s, h, x + 22, y0 + 210, bw - 44, 30, { fontFace: HEAD, bold: true, fontSize: 19, color: C.pcb });
    T(s, b, x + 22, y0 + 246, bw - 44, 56, { fontSize: 14, color: C.pmuted });
    T(s, m, x + 22, y0 + 320, bw - 44, 22, { fontFace: MONO, fontSize: 11.5, color: C.pcb });
    if (i < 2) s.addShape(pres.shapes.RIGHT_ARROW, { x: P(x + bw + 9), y: P(y0 + bh / 2 - 11), w: P(22), h: P(22), fill: { color: C.pcopper }, line: { type: "none" } });
  });
  T(s, [{ text: "×2 jogadores: ", options: { bold: true, color: C.pcb } }, { text: "cada um tem contador, decodificador e display próprios. Um único 74HC32 (4 portas OR) e um só botão de reset atendem os dois.", options: { color: C.pmuted } }], 64, 616, 1150, 50, { fontSize: 15 });
  num(s, 4, true);
  s.addNotes("Arquitetura em três blocos por jogador: entrada (botão com filtro RC), contagem (74HC93 com portas OR do 74HC32 no reset) e visualização (CD4511 + display de catodo comum). O 74HC32 e o botão de reset são compartilhados.");
}

// 05 CONTADOR
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  traces(s, "a");
  kicker(s, "Bloco 2 · Contagem");
  title(s, "O 74HC93 conta de 0 a 9 e se zera sozinho ao chegar no 10");
  const dw = 58, gap = 14, y = 240;
  for (let d = 0; d <= 9; d++) seg(s, d, 64 + d * (dw + gap), y, dw);
  const gx = 64 + 10 * (dw + gap) + 10;
  segRow(s, "10", gx, y + 28, 40, { ghost: true });
  T(s, "1010", gx, y + 100, 100, 16, { fontFace: MONO, fontSize: 9, color: C.mint });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: P(gx + 110), y: P(y + 38), w: P(46), h: P(22), fill: { color: C.copper }, line: { type: "none" } });
  seg(s, 0, gx + 176, y, dw);
  eq(s, [{ t: "MR1 = Q1 + RST" }, { t: "MR2 = Q3 + RST" }, { t: "R0 = MR1·MR2 = Q1·Q3 + RST", hi: true }], 64, 420, 556, 130, 16);
  T(s, [
    { text: "O 10 (", options: {} }, { text: "1010", options: { fontFace: MONO, color: C.copper } },
    { text: ") é o primeiro estado com Q1 e Q3 em 1 ao mesmo tempo. Ele dispara o reset assíncrono e dura só alguns nanossegundos: ", options: {} },
    { text: "o 10 nunca aparece no display.", options: { bold: true } },
  ], 660, 420, 556, 100, { fontSize: 16 });
  T(s, "O mesmo par de portas OR recebe o botão de reset (RST).", 660, 545, 556, 30, { fontSize: 14, color: C.mint });
  num(s, 5);
  s.addNotes("O 74HC93 é um contador binário de 4 bits. Ele zera quando MR1 e MR2 estão em 1. Ligamos MR1 = Q1 + RST e MR2 = Q3 + RST, então R0 = Q1·Q3 + RST. No estado 10 (1010) Q1 e Q3 valem 1 juntos e o contador volta a 0 em nanossegundos.");
}

// 06 DECODIFICADOR
{
  const s = pres.addSlide({ masterName: "CLARO" });
  kicker(s, "Bloco 3 · Visualização", true);
  title(s, "O CD4511 transforma 4 bits em 7 segmentos acesos", true);
  slide6Panel(s);
  const lines = [
    ["a = Q3 + Q2·Q0 + Q2'·Q1 + Q2'·Q0'"], ["b = Q2' + Q1·Q0 + Q1'·Q0'"], ["c = Q2 + Q1' + Q0", true],
    ["d = Q1·Q0' + Q2'·Q1 + Q2'·Q0' + Q2·Q1'·Q0"], ["e = Q1·Q0' + Q2'·Q0'"], ["f = Q3 + Q2·Q0' + Q2·Q1' + Q1'·Q0'"], ["g = Q3 + Q1·Q0' + Q2'·Q1 + Q2·Q1'"],
  ];
  rect(s, 412, 196 + 2 * 33 + 2, 520, 30, C.white);
  s.addText(lines.map(([t, hi], i) => ({ text: t, options: { color: hi ? C.pled : C.pcb, bold: !!hi, breakLine: i < lines.length - 1 } })),
    { x: P(420), y: P(196), w: P(800), h: P(236), isTextBox: true, margin: 0, fontFace: MONO, fontSize: 14.5, valign: "top", lineSpacing: 24.75 });
  T(s, [{ text: "Cada equação saiu de um mapa de Karnaugh, com 10 a 15 como " }, { text: "don't care", options: { italic: true } }, { text: ". O segmento c só apaga no 2, então sobram três grupos de oito células." }], 420, 450, 790, 56, { fontSize: 15, color: C.pmuted });
  T(s, "LT' = 1 · BI' = 1 · LE = 0 → o display segue o contador direto", 420, 520, 790, 24, { fontFace: MONO, fontSize: 11.5, color: C.pcb });
  num(s, 6, true);
  s.addNotes("O CD4511 recebe o código BCD e acende os segmentos a–g em nível alto, ideal para catodo comum. Para documentar a lógica interna, cada segmento foi simplificado por mapa de Karnaugh, com 10 a 15 como don't care. Exemplo: c = Q2 + Q1' + Q0, porque c só apaga no dígito 2.");
}
function slide6Panel(s) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: P(64), y: P(196), w: P(300), h: P(410), rectRadius: 0.14, fill: { color: C.black }, line: { type: "none" } });
  seg(s, 8, 122, 236, 170, { labels: true });
  T(s, "saídas a–g ativas em nível alto", 84, 576, 260, 20, { fontFace: MONO, fontSize: 9.5, color: C.mint, align: "center" });
}

// 07 DEBOUNCE
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  kicker(s, "Bloco 1 · Entrada");
  title(s, "Filtro RC: um toque no botão vale exatamente um ponto");
  s.addImage({ path: IMG("osciloscopio.png"), x: P(64), y: P(206), w: P(790), h: P(790 * 706 / 1495), altText: "Osciloscópio: contato do botão com bounce e sinal filtrado pelo RC" });
  T(s, "O PROBLEMA", 890, 206, 330, 18, { fontFace: MONO, fontSize: 10, bold: true, color: C.copper });
  T(s, "O contato oscila por ~1 ms ao fechar e abrir. Cada oscilação seria um ponto.", 890, 226, 326, 70, { fontSize: 15 });
  T(s, "A SOLUÇÃO", 890, 306, 330, 18, { fontFace: MONO, fontSize: 10, bold: true, color: C.copper });
  T(s, "C1 carrega na hora e descarrega devagar por R1: o nível lógico não cai.", 890, 326, 326, 70, { fontSize: 15 });
  eq(s, [{ t: "τ = 10 kΩ × 10 µF" }, { t: "= 100 ms", hi: true }], 890, 410, 326, 86, 15);
  T(s, [{ text: "O ponto entra ao " }, { text: "soltar", options: { bold: true, color: C.ink } }, { text: " o botão, ≈ 120 ms depois, na borda de descida." }], 890, 512, 326, 60, { fontSize: 14, color: C.mint });
  num(s, 7);
  s.addNotes("O contato mecânico do botão oscila por cerca de 1 ms. O filtro RC (10 kΩ e 10 µF, τ = 100 ms) segura a tensão. No osciloscópio, em cima o contato com bounce, embaixo o nó RC limpo. O contador avança na borda de descida, cerca de 120 ms depois de soltar o botão.");
}

// 08 TINKERCAD
{
  const s = pres.addSlide({ masterName: "CLARO" });
  kicker(s, "Simulação · Tinkercad Circuits", true);
  title(s, "Nova simulação: dois jogadores, cada um contando de 0 a 9", true);
  const h = 490, w = h * 540 / 521;
  card(s, 64, 196, w, h, true);
  s.addImage({ path: IMG("simulacao_nova.png"), x: P(64), y: P(196), w: P(w), h: P(h), altText: "Nova simulação no Tinkercad: duas protoboards, uma por jogador, com 74HC93, CD4511, display e 74HC32" });
  const pts = [
    ["01", [{ text: "Uma protoboard por jogador, cada uma com " }, { text: "74HC93 → CD4511 → display", options: { bold: true } }, { text: "." }]],
    ["02", [{ text: "Cada placar conta de " }, { text: "0 a 9", options: { bold: true } }, { text: " e volta a 0 sozinho no 10º toque." }]],
    ["03", [{ text: "Um fio leva o " }, { text: "reset compartilhado", options: { bold: true } }, { text: " entre as placas: um botão zera os dois." }]],
  ];
  pts.forEach(([n, t], i) => {
    const y = 226 + i * 110;
    T(s, n, 760, y, 50, 34, { fontFace: MONO, fontSize: 21, bold: true, color: C.pcopper });
    T(s, t, 816, y + 2, 400, 80, { fontSize: 16, color: C.pcb });
  });
  num(s, 8, true);
  s.addNotes("Esta é a nova simulação no Tinkercad, com os dois jogadores: uma protoboard por jogador, cada uma com contador, decodificador e display. Cada placar conta de 0 a 9 e volta a 0 no décimo toque. Um fio leva o reset compartilhado, então um único botão zera os dois placares.");
}

// 09 ESQUEMÁTICO + ANALISADOR
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  kicker(s, "Simulação · Esquemático e analisador lógico");
  title(s, "No analisador, a contagem passa de 9 para 0 sem mostrar o 10");
  rect(s, 64, 196, 560, 560 * 927 / 1770, C.white);
  s.addImage({ path: IMG("esquematico_novo.png"), x: P(64), y: P(196), w: P(560), h: P(560 * 927 / 1770), altText: "Esquemático da nova simulação no Tinkercad, folha 1 de 2: módulo de um jogador com 74HC93, 74HC32, CD4511 e display" });
  s.addImage({ path: IMG("analisador.png"), x: P(656), y: P(196), w: P(560), h: P(560 * 706 / 1495), altText: "Analisador lógico: contagem de 0 a 9, reinício e reset" });
  T(s, "Nova simulação no Tinkercad: folha de um jogador (1 de 2).", 64, 500, 560, 22, { fontSize: 13, color: C.mint });
  T(s, "Analisador lógico (XLA1): 12 toques em S1, depois 1 toque em S2.", 656, 474, 560, 22, { fontSize: 13, color: C.mint });
  const cs = [
    ["TOQUES 1 A 9", [{ text: "Q0–Q3 sobem em binário e o display mostra 0 → 9." }]],
    ["10º TOQUE", [{ text: "Surge o " }, { text: "1010", options: { fontFace: MONO, color: C.led } }, { text: ", R0 vai a 1 e o contador volta a 0000." }]],
    ["TOQUE EM S2", [{ text: "O reset manual zera o placar a partir do 2." }]],
  ];
  const cw = (1152 - 48) / 3;
  cs.forEach(([k, t], i) => {
    const x = 64 + i * (cw + 24);
    card(s, x, 548, cw, 112, false);
    T(s, k, x + 22, 566, cw - 44, 18, { fontFace: MONO, fontSize: 10, bold: true, color: C.copper });
    T(s, t, x + 22, 590, cw - 44, 56, { fontSize: 15 });
  });
  num(s, 9);
  s.addNotes("À esquerda, o esquemático gerado pelo Tinkercad a partir da nova simulação; esta é a folha de um jogador, a outra folha repete o módulo para o segundo jogador. À direita, o analisador lógico com 12 toques em S1 e um em S2: a contagem vai de 0 a 9, no décimo toque aparece o 1010 por um instante e R0 zera tudo; depois o reset manual zera a partir do 2.");
}

// 10 TESTES
{
  const s = pres.addSlide({ masterName: "CLARO" });
  kicker(s, "Testes", true);
  title(s, "7 de 8 casos aprovados na simulação; falta o teste na placa", true);
  const TT = [["T1", "Um toque a partir de 0", "Display vai para 1"], ["T2", "Nove toques seguidos", "0 → 9 sem saltos"], ["T3", "Toque com display em 9", "Volta para 0"], ["T4", "Reset em qualquer valor", "Os dois displays vão a 0"],
    ["T5", "Reset pressionado + toque", "Contagem presa em 0"], ["T6", "Toques rápidos seguidos", "Um ponto por toque"], ["T7", "Ponto do jogador A", "Placar B não muda"], ["T8", "T1–T7 na montagem física", "Ainda não executado"]];
  const cw = (1152 - 3 * 18) / 4, ch = 178;
  TT.forEach(([id, e, r], i) => {
    const x = 64 + (i % 4) * (cw + 18), y = 196 + Math.floor(i / 4) * (ch + 18);
    const dark = id === "T8";
    card(s, x, y, cw, ch, !dark, dark ? { fill: C.pcb } : {});
    T(s, id, x + 22, y + 20, 80, 34, { fontFace: MONO, fontSize: 22, bold: true, color: dark ? C.led : C.pled });
    T(s, dark ? "○ PLACA · PENDENTE" : "✓ SIMULAÇÃO", x + cw - 182, y + 28, 160, 16, { fontFace: MONO, fontSize: 9, color: dark ? C.copper : C.pmuted, align: "right" });
    T(s, e, x + 22, y + 66, cw - 44, 50, { fontSize: 15, bold: true, color: dark ? C.ink : C.pcb });
    T(s, "→ " + r, x + 22, y + 122, cw - 44, 44, { fontSize: 14, color: dark ? C.mint : C.pmuted });
  });
  T(s, "T1–T7 executados em simulação (21/10–03/11). T8 repete todos na montagem física e ainda não foi executado.", 64, 630, 1150, 24, { fontSize: 14, color: C.pmuted });
  num(s, 10, true);
  s.addNotes("Bateria de testes: entradas normais (T1, T2), limite 9 → 0 (T3), reset (T4), casos extremos (T5, T6) e independência entre jogadores (T7), todos aprovados em simulação. O T8, que repete tudo na montagem física, ainda não foi executado: é o próximo passo depois da montagem na protoboard.");
}

// 11 MONTAGEM
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  kicker(s, "Montagem física");
  title(s, "Da protoboard virtual para a bancada do laboratório");
  img(s, IMG("montagem2.jpg"), 64, 200, 736, 420, 1600, 1200, { alt: "Protoboard montada ao lado das fontes de bancada" });
  img(s, IMG("montagem1.jpg"), 828, 200, 388, 420, 1200, 1600, { alt: "Vista superior da protoboard com os CIs, botão e LEDs" });
  T(s, "Bancada do laboratório: protoboard alimentada pela fonte de 5 V", 64, 636, 736, 20, { fontFace: MONO, fontSize: 10.5, color: C.mint });
  T(s, "Vista de cima: CIs, botão e LEDs de teste", 828, 636, 388, 20, { fontFace: MONO, fontSize: 10.5, color: C.mint });
  num(s, 11);
  s.addNotes("Montagem física no laboratório, alimentada pela fonte de bancada em 5 V. Seguimos a mesma disposição da simulação no Tinkercad.");
}

// 12 CUSTOS
{
  const s = pres.addSlide({ masterName: "CLARO" });
  kicker(s, "Custos", true);
  title(s, "R$ 123,00 no total: as peças chegaram, só falta o módulo de fonte", true);
  T(s, "TOTAL · SEM FRETE", 64, 206, 300, 18, { fontFace: MONO, fontSize: 10.5, bold: true, color: C.pcopper });
  T(s, "R$ 123,00", 64, 228, 320, 64, { fontFace: MONO, fontSize: 38, bold: true, color: C.pcb });
  T(s, "R$ 30,75 por integrante", 64, 296, 300, 24, { fontSize: 15, color: C.pmuted });
  img(s, WEB("dip.jpg"), 64, 340, 300, 228, 500, 381, { alt: "Circuitos integrados em encapsulamento DIP" });
  credit(s, "Foto: Kimmo Palosaari · domínio público", 64, 576, 300, C.pmuted);
  const rows = [["Circuitos integrados", "2× 74HC93, 2× CD4511, 74HC32", true], ["Displays, botões e passivos", "2 displays, 3 botões, resistores, capacitores", true], ["Protoboards e jumpers", "base da montagem dos dois placares", true], ["Módulo de fonte MB102", "alimentação de 5 V na protoboard", false]];
  const x0 = 420, bw = 796;
  rows.forEach(([n, d, ok], i) => {
    const y = 206 + i * 84;
    T(s, n, x0, y + 8, 560, 26, { fontSize: 17, bold: true, color: C.pcb });
    T(s, d, x0, y + 38, 560, 20, { fontSize: 12.5, color: C.pmuted });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: P(x0 + bw - 112), y: P(y + 18), w: P(112), h: P(28), rectRadius: 0.14, fill: { color: ok ? C.pcb : "FBE3E0" }, line: { type: "none" } });
    T(s, ok ? "✓ RECEBIDO" : "AGUARDANDO", x0 + bw - 112, y + 24, 112, 16, { fontFace: MONO, fontSize: 9.5, bold: true, color: ok ? C.ink : C.pled, align: "center" });
    rect(s, x0, y + 74, bw, 1, C.paper2);
  });
  T(s, "Enquanto o MB102 não chega, usamos a fonte de bancada do laboratório (5 V).", x0, 556, bw, 24, { fontSize: 13.5, color: C.pmuted });
  num(s, 12, true);
  s.addNotes("O custo total ficou em R$ 123,00 sem frete, R$ 30,75 por integrante. Todas as peças já chegaram, menos o módulo de fonte MB102. Enquanto ele não chega, usamos a fonte de bancada do laboratório em 5 V.");
}

// 13 GANTT
{
  const s = pres.addSlide({ masterName: "CLARO" });
  kicker(s, "Cronograma · Gantt · 14 de 17 atividades concluídas", true);
  title(s, "Peças com +4 dias; relatório e TEP atrasados", true);
  card(s, 64, 180, 1020, 1020 * 1428 / 2800, true);
  s.addImage({ path: IMG("gantt.png"), x: P(64), y: P(180), w: P(1020), h: P(1020 * 1428 / 2800), altText: "Gráfico de Gantt previsto e realizado de 19/08 a 01/12/2026, com marcos, atraso de 4 dias na entrega dos componentes e linha de hoje em 26/11" });
  const LX = 1100;
  const leg = [["Concluída", C.done], ["Em andamento", C.now], ["Pendente", null, C.todoL], ["Atraso", null, C.pled], ["Previsto", "base"], ["Marco", "dia"]];
  leg.forEach(([t, fill, outline], i) => {
    const y = 204 + i * 30;
    if (fill === "base") rect(s, LX, y + 4, 20, 4, "C9D5CF");
    else if (fill === "dia") s.addShape(pres.shapes.DIAMOND, { x: P(LX + 3), y: P(y - 1), w: P(14), h: P(14), fill: { color: C.done }, line: { type: "none" } });
    else if (fill) rect(s, LX, y, 20, 12, fill);
    else s.addShape(pres.shapes.RECTANGLE, { x: P(LX), y: P(y), w: P(20), h: P(12), fill: { color: outline, transparency: 70 }, line: { color: outline, width: 1.25 } });
    T(s, t, LX + 28, y - 3, 130, 18, { fontSize: 11.5, color: C.pmuted });
  });
  T(s, [{ text: "+4 d", options: { fontSize: 16, bold: true, color: C.pled, breakLine: true } }, { text: "na entrega das peças", options: { fontSize: 9.5, color: C.pmuted } }], LX, 400, 160, 46, { fontFace: MONO });
  T(s, [{ text: "01/12", options: { fontSize: 16, bold: true, color: C.pcb, breakLine: true } }, { text: "fim mantido", options: { fontSize: 9.5, color: C.pmuted } }], LX, 462, 160, 46, { fontFace: MONO });
  num(s, 13, true);
  s.addNotes("Gantt previsto × realizado, com marcos. A pedido do professor, todos os testes ficaram na fase Monitoramento e Testes. A entrega dos componentes atrasou 4 dias (prevista 03/11, chegou 07/11); a montagem física, o teste físico T8 e a validação final foram reprogramados, e a validação terminou em 13/11 em vez de 10/11. No encerramento, o relatório final começou no prazo, mas a entrega, prevista para 20/11, está atrasada (+6 dias até hoje, 26/11) e ainda não aconteceu. A aprovação do TEP, prevista para 24/11, também está atrasada (+2 dias). A apresentação está em andamento.");
}

// 14 PROBLEMAS
{
  const s = pres.addSlide({ masterName: "CLARO" });
  kicker(s, "Problemas e melhorias", true);
  title(s, "O que observamos e o que fica para uma próxima versão", true);
  const P3 = [
    ["IMPACTO MÉDIO", C.pcopper, "Borda lenta no clock", "O 74HC93 não tem Schmitt trigger e a descida do RC leva ≈ 120 ms.", "Melhoria:", " um 74HC14 entre o RC e CP0, por menos de R$ 5."],
    ["IMPACTO BAIXO", C.pmuted, "Conta ao soltar", "O ponto entra na borda de descida, quando o botão é solto.", "Decisão:", " comportamento aceito e documentado."],
    ["IMPACTO BAIXO", C.pmuted, "Só vai até 9", "Atende o escopo do TAP, mas limita partidas longas.", "Melhoria:", " cascatear um segundo contador para 00–99."],
  ];
  const cw = (1152 - 48) / 3;
  P3.forEach(([k, kc, h, d, b1, b2], i) => {
    const x = 64 + i * (cw + 24);
    card(s, x, 206, cw, 300, true);
    T(s, k, x + 28, 232, cw - 56, 18, { fontFace: MONO, fontSize: 10, bold: true, color: kc });
    T(s, h, x + 28, 258, cw - 56, 32, { fontFace: HEAD, bold: true, fontSize: 19, color: C.pcb });
    T(s, d, x + 28, 302, cw - 56, 70, { fontSize: 15, color: C.pmuted });
    T(s, [{ text: b1, options: { bold: true } }, { text: b2 }], x + 28, 390, cw - 56, 70, { fontSize: 15, color: C.pcb });
  });
  T(s, "Resolvido: o placar começou com um jogador e foi replicado para dois, compartilhando o 74HC32.", 64, 630, 1150, 24, { fontSize: 14, color: C.pmuted });
  num(s, 14, true);
  s.addNotes("Problemas identificados: a borda lenta do filtro RC no clock (o 74HC93 não tem Schmitt trigger; melhoria com 74HC14), o incremento ao soltar o botão (aceito) e a faixa limitada a 0–9 (pode ser estendida para 00–99).");
}

// 15 PRÓXIMOS PASSOS
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  traces(s, "b");
  kicker(s, "Próximos passos");
  title(s, "Relatório e TEP atrasados, apresentação em andamento");
  const y = 290;
  rect(s, 64, y, 1152, 3, C.trace);
  rect(s, 64, y, 1152 * 0.76, 3, C.led);
  const steps = [
    ["ATRASADO · previsto 20/11", C.led, "Relatório final", "Resultados da placa e prestação de contas; entrega pendente", "late"],
    ["ATRASADO · previsto 24/11", C.led, "TEP", "Termo de Encerramento elaborado; aprovação ainda pendente", "late"],
    ["HOJE · 26/11 · até 01/12", C.led, "Apresentação", "O placar funcionando ao vivo na protoboard", "now"],
  ];
  const cw = (1152 - 56) / 3;
  steps.forEach(([d, dc, h, b, now], i) => {
    const x = 64 + i * (cw + 28);
    s.addShape(pres.shapes.OVAL, { x: P(x), y: P(y - 10), w: P(22), h: P(22), fill: now === "late" ? { color: C.led, transparency: 100 } : { color: now === "now" ? C.led : C.copper }, line: now === "late" ? { color: C.led, width: 2.25 } : { type: "none" } });
    T(s, d, x, y + 34, cw, 22, { fontFace: MONO, fontSize: 11.5, bold: true, color: dc });
    T(s, h, x, y + 62, cw, 34, { fontFace: HEAD, bold: true, fontSize: 20 });
    T(s, b, x, y + 102, cw - 20, 56, { fontSize: 15, color: C.mint });
  });
  card(s, 64, 588, 1152, 70, false);
  T(s, "ANTES DA DEMO", 88, 614, 160, 18, { fontFace: MONO, fontSize: 10, bold: true, color: C.copper });
  T(s, "Ensaiar o roteiro · receber o MB102 (ou usar a fonte de bancada) · separar CIs reserva", 260, 610, 930, 26, { fontSize: 16 });
  num(s, 15);
  s.addNotes("O relatório final, previsto para 20/11, ainda não foi entregue. O TEP foi elaborado, mas a aprovação, prevista para 24/11, também está atrasada. Falta a apresentação final, que vai até 01/12. Antes da demonstração: ensaiar o roteiro, receber o módulo de fonte MB102 (ou usar a fonte de bancada do laboratório) e separar componentes reserva.");
}

// 16 ENCERRAMENTO
{
  const s = pres.addSlide({ masterName: "ESCURO" });
  traces(s, "cover");
  kicker(s, "Encerramento");
  T(s, [{ text: "Placar zerado.", options: { color: C.ink, breakLine: true } }, { text: "Sua vez de perguntar.", options: { color: C.led } }], 64, 200, 640, 200, { fontFace: HEAD, bold: true, fontSize: 46, lineSpacing: 50 });
  T(s, "Obrigado. A demonstração ao vivo fica para a apresentação final.", 64, 420, 600, 60, { fontSize: 17, color: C.mint });
  scoreboard(s, 796, 180, 420, 300, 0, 0, 136);
  T(s, "Circuitos Digitais · Engenharia da Computação · UFMA · 2026", 64, 650, 700, 20, { fontFace: MONO, fontSize: 10.5, color: C.mint });
  s.addNotes("Encerramento e perguntas.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require("/home/andre/.claude/skills/synced/e271325b-cc20-468a-aaa3-74cfe014abf4_a902bb35-85f5-4712-b553-6f8b360568d2/pptx/scripts/apply_theme.js");
  await applyTheme(OUT, THEME);
  console.log("ok", OUT);
})();
