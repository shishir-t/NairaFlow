"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Agent } from "@/lib/types";
import { agentCashAction } from "@/lib/actions/agents";
import { FormError, FormSuccess, useNfForm } from "@/components/ui/AuthForm";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatNgn } from "@/lib/format";

const TYPE_LABEL: Record<Agent["type"], string> = {
  cash_in_out: "Cash in/out",
  wifi_hotspot: "Wi-Fi hotspot",
  both: "Cash in/out + Wi-Fi",
};

export function AgentList({ agents, balanceNgn }: { agents: Agent[]; balanceNgn: number }) {
  const [city, setCity] = useState<"All" | "Lagos" | "Abuja">("All");
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id ?? "");
  const [state, formAction] = useNfForm(agentCashAction);

  const filtered = useMemo(
    () => (city === "All" ? agents : agents.filter((a) => a.city === city)),
    [agents, city]
  );

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="mb-4 flex gap-2">
          {(["All", "Lagos", "Abuja"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={clsx(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                city === c ? "border-nf-green bg-nf-green/10 text-nf-green" : "border-nf-border text-neutral-400 hover:border-neutral-600"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedAgentId(a.id)}
              className={clsx(
                "rounded-xl border p-4 text-left transition",
                selectedAgentId === a.id ? "border-nf-green bg-nf-green/10" : "border-nf-border bg-nf-surface/40 hover:border-neutral-600"
              )}
            >
              <p className="font-medium text-white">{a.name}</p>
              <p className="mt-0.5 text-xs text-neutral-500">{a.area}, {a.city}</p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-neutral-400">{TYPE_LABEL[a.type]}</span>
                <span className="text-nf-gold">★ {a.rating}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form action={formAction} className="h-fit rounded-xl border border-nf-border bg-nf-surface/50 p-5">
        <h3 className="text-sm font-semibold text-white">Cash in / cash out</h3>
        <p className="mt-1 text-xs text-neutral-500">
          Balance: <span className="text-neutral-300">{formatNgn(balanceNgn)}</span>
        </p>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-neutral-300">Agent</span>
          <select
            name="agentId"
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.area}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 rounded-md border border-nf-border px-3 py-2 text-sm text-neutral-300 has-[:checked]:border-nf-green has-[:checked]:text-nf-green">
            <input type="radio" name="direction" value="cash_in" defaultChecked className="accent-nf-green" />
            Cash in
          </label>
          <label className="flex items-center gap-2 rounded-md border border-nf-border px-3 py-2 text-sm text-neutral-300 has-[:checked]:border-nf-green has-[:checked]:text-nf-green">
            <input type="radio" name="direction" value="cash_out" className="accent-nf-green" />
            Cash out
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-neutral-300">Amount (₦)</span>
          <input
            name="amount"
            type="number"
            min={500}
            step={500}
            placeholder="20000"
            required
            className="mt-1.5 w-full rounded-md border border-nf-border bg-neutral-950 px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-nf-green focus:outline-none focus:ring-1 focus:ring-nf-green"
          />
        </label>

        <p className="mt-3 text-[11px] text-neutral-500">
          0.5% agent commission applies. {selectedAgent ? `Selected: ${selectedAgent.name}` : ""}
        </p>

        <div className="mt-4 space-y-2">
          <FormError state={state} />
          <FormSuccess state={state} />
        </div>

        <SubmitButton className="mt-4 w-full" pendingText="Submitting...">
          Confirm
        </SubmitButton>
      </form>
    </div>
  );
}
