# Apresentação: Placar Eletrônico Digital (status em 20/11/2026)

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `html/index.html` | Deck em HTML (16 slides). Abra no navegador. **P** entra no modo apresentação, **← →** navegam e **Esc** sai. |
| `export/Placar_Eletronico_Status_20-11-2026.pptx` | O mesmo deck em PowerPoint, com formas e textos editáveis e notas do apresentador em cada slide. |
| `export/Placar_Eletronico_Status_20-11-2026.pdf` | Versão em PDF do .pptx. |
| `export/Placar_Eletronico_Roteiro_de_Falas.pdf` | Roteiro com a fala de cada integrante por slide, tempos estimados e perguntas prováveis. Fonte em `build/roteiro.py`; para gerar de novo: `python3 build/roteiro.py` e imprimir `roteiro/roteiro.html` em PDF pelo Chrome. |
| `assets/img/` | Imagens do projeto: Gantt, Tinkercad, esquemático, analisador, osciloscópio e fotos da montagem. |
| `assets/web/` | Fotos de licença livre baixadas do Wikimedia Commons (créditos abaixo). |
| `build/` | Scripts que geram o Gantt (`gantt.py`) e o .pptx (`build_pptx.js`). |

## Como regenerar

```bash
# Gantt do slide 13: gerado a partir de ../cronograma/index.html (fonte única do cronograma)
google-chrome --headless=new --hide-scrollbars --force-device-scale-factor=2 --window-size=1400,714 \
  --screenshot=assets/img/gantt.png "file://$PWD/../cronograma/index.html?export=1&w=1400&row=20&hoje=2026-11-20"

# PPTX (precisa de node; o pptxgenjs já está em build/node_modules)
cd build && npm install && NODE_PATH=$PWD/node_modules node build_pptx.js
```

As datas do cronograma ficam no bloco `DADOS DO CRONOGRAMA` de `../cronograma/index.html`. Se mudarem, edite ali e gere a imagem de novo. (`build/gantt.py` é a versão antiga, em matplotlib, e não é mais usada.)

## Créditos das imagens (Wikimedia Commons)

| Arquivo | Autor | Licença |
|---|---|---|
| `scoreboard.jpg`: Stansted Hall & Elsenham CC digital scoreboard | Acabashi | CC BY-SA 4.0 |
| `componentes.jpg`: Electronic components in Printed Circuit Board | Soumyapatra13 | CC BY-SA 3.0 |
| `chips7400.jpg`: 7400 Series Chips 1 | JailsonBR | CC BY-SA 3.0 |
| `7seg2.jpg`: 7 Segment Display2 | Haragayato | CC BY-SA 3.0 |
| `dip.jpg`: IC DIP chips | Kimmo Palosaari | Domínio público |
| `7seg.jpg`, `pcb.jpg`, `breadboard.jpg` | RetroEditor (CC BY-SA 4.0), Peter Shanks (CC BY 2.0), LukeSurl (CC BY-SA 3.0) | Baixadas, mas não usadas no deck |
