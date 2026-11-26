"""Gera o gráfico de Gantt do projeto (PNG) a partir do cronograma/relatório de 20/11/2026."""
import sys
from datetime import date, timedelta
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Patch

OUT = sys.argv[1] if len(sys.argv) > 1 else "gantt.png"
HOJE = date(2026, 11, 20)

BG, INK, MUTED, GRID = "#0C211B", "#EDEFEA", "#9DB5AA", "#1E4034"
DONE, NOW, TODO = "#E0A458", "#FF4136", "#6E8F82"

rows = [  # (fase, atividade, inicio, fim, status)
    ("Início", "TAP: elaboração e aprovação", (8, 19), (8, 25), "c"),
    ("Planejamento", "Levantamento bibliográfico", (8, 26), (9, 1), "c"),
    ("Planejamento", "Metodologia e arquitetura", (9, 2), (9, 8), "c"),
    ("Execução", "Contador digital (74HC93)", (9, 9), (9, 22), "c"),
    ("Execução", "Decodificação BCD + displays", (9, 23), (10, 6), "c"),
    ("Execução", "Debounce dos botões", (10, 7), (10, 13), "c"),
    ("Execução", "Integração dos módulos", (10, 14), (10, 20), "c"),
    ("Execução", "Testes T1–T7", (10, 21), (11, 3), "c"),
    ("Execução", "Correção e validação final", (11, 4), (11, 10), "c"),
    ("Monit. e Controle", "Acompanhamento e qualidade", (9, 9), (11, 10), "c"),
    ("Encerramento", "Relatório final", (11, 11), (11, 20), "a"),
    ("Encerramento", "TEP", (11, 21), (11, 24), "p"),
    ("Encerramento", "Apresentação final", (11, 25), (12, 1), "p"),
]

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 13})
fig, ax = plt.subplots(figsize=(16, 7.2), dpi=150)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

n = len(rows)
for i, (fase, nome, s, e, st) in enumerate(rows):
    y = n - 1 - i
    d0 = date(2026, *s)
    d1 = date(2026, *e) + timedelta(days=1)
    w = (d1 - d0).days
    if st == "c":
        ax.barh(y, w, left=d0, height=0.56, color=DONE, edgecolor=BG, linewidth=2)
    elif st == "a":
        ax.barh(y, w, left=d0, height=0.56, color=NOW, edgecolor=BG, linewidth=2)
    else:
        ax.barh(y, w, left=d0, height=0.56, color=BG, edgecolor=TODO,
                linewidth=1.6, hatch="////")
    lab = f"{d0:%d/%m}–{date(2026, *e):%d/%m}"
    ax.text(d1 + timedelta(days=1), y, lab, va="center", ha="left",
            color=MUTED, fontsize=10.5, zorder=5,
            bbox=dict(facecolor=BG, edgecolor="none", pad=1.5))

ax.set_yticks(range(n))
ax.set_yticklabels([r[1] for r in rows][::-1], color=INK, fontsize=12.5)

# separadores de fase
prev = None
for i, r in enumerate(rows):
    if prev is not None and r[0] != prev:
        ax.axhline(n - 1 - i + 0.5, color=GRID, lw=1)
    prev = r[0]

ax.set_xlim(date(2026, 8, 17), date(2026, 12, 9))
ax.set_ylim(-0.7, n - 0.3)
ax.xaxis.set_major_locator(mdates.MonthLocator())
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b"))
ax.xaxis.set_minor_locator(mdates.WeekdayLocator(byweekday=mdates.MO))
month_pt = {8: "AGO", 9: "SET", 10: "OUT", 11: "NOV", 12: "DEZ"}
ax.set_xticks([date(2026, m, 1) for m in (9, 10, 11, 12)])
ax.set_xticklabels([month_pt[m] for m in (9, 10, 11, 12)], color=MUTED)
ax.tick_params(axis="x", which="both", colors=MUTED, length=0, labelsize=12)
ax.tick_params(axis="y", length=0, pad=10)
ax.grid(axis="x", which="major", color=GRID, lw=1)
ax.grid(axis="x", which="minor", color=GRID, lw=0.5, alpha=0.5)
ax.set_axisbelow(True)
for sp in ax.spines.values():
    sp.set_visible(False)
ax.xaxis.tick_top()

# linha de hoje
ax.axvline(HOJE, color=NOW, lw=2, ls=(0, (4, 3)), zorder=1)
ax.text(HOJE, -1.05, "hoje · 20/11", color=NOW, fontsize=12, fontweight="bold",
        va="top", ha="center", clip_on=False)

leg = ax.legend(
    handles=[Patch(facecolor=DONE, label="Concluída (10)"),
             Patch(facecolor=NOW, label="Em andamento (1)"),
             Patch(facecolor=BG, edgecolor=TODO, hatch="////", label="Pendente (2)")],
    loc="lower left", bbox_to_anchor=(0.0, -0.13), ncol=3, frameon=False,
    labelcolor=INK, fontsize=12, handlelength=1.6)

plt.tight_layout()
fig.savefig(OUT, facecolor=BG)
print("ok", OUT)
