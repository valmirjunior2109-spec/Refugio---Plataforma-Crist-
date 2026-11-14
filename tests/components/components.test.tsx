import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScriptureText } from "@/components/bible/scripture-text";
import { NeedChips } from "@/components/devotionals/need-chips";
import { Prose } from "@/components/ui/prose";
import { EmptyState } from "@/components/ui/feedback-states";
import { BottomNav } from "@/components/navigation/bottom-nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/biblia/salmos/23" }));

describe("ScriptureText", () => {
  it("mostra palavras acrescentadas em itálico, sem colchetes", () => {
    const { container } = render(<ScriptureText text="Deus [é] nosso refúgio" />);
    expect(container.textContent).toBe("Deus é nosso refúgio");
    expect(container.querySelector("em")?.textContent).toBe("é");
  });
});

describe("Prose", () => {
  it("separa parágrafos e nunca interpreta HTML", () => {
    const { container } = render(<Prose text={"Primeiro.\n\n<img src=x onerror=alert(1)>"} />);
    expect(container.querySelectorAll("p")).toHaveLength(2);
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("<img src=x onerror=alert(1)>");
  });
});

describe("NeedChips", () => {
  it("cria um link para cada sentimento", () => {
    render(
      <NeedChips
        needs={[
          { topic: "triste", label: "Estou triste" },
          { topic: "paz", label: "Preciso de paz" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Estou triste" })).toHaveAttribute("href", "/preciso-de-uma-palavra/triste");
    expect(screen.getByRole("link", { name: "Preciso de paz" })).toHaveAttribute("href", "/preciso-de-uma-palavra/paz");
  });
});

describe("BottomNav", () => {
  it("tem os 5 destinos e marca a seção atual", () => {
    render(<BottomNav />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["Início", "Bíblia", "Orações", "Refúgio", "Meu espaço"]);
    expect(screen.getByRole("link", { name: "Bíblia" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Início" })).not.toHaveAttribute("aria-current");
  });
});

describe("EmptyState", () => {
  it("exibe título, descrição e ação", () => {
    render(<EmptyState title="Nada aqui" description="Descrição" action={<button>Agir</button>} />);
    expect(screen.getByRole("heading", { name: "Nada aqui" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agir" })).toBeInTheDocument();
  });
});
