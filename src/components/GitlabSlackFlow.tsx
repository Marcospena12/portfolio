"use client";

import { FaSlack, FaUser } from "react-icons/fa";
import { SiGitlab, SiN8N } from "react-icons/si";
import type { IconType } from "react-icons";

const GITLAB_COLOR = "#FC6D26";
const N8N_COLOR = "#EA4B71";
const SLACK_COLOR = "#4A154B";

type Props = {
  devs?: number;
};

function Node({
  icon: Icon,
  label,
  color,
}: {
  icon: IconType;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background"
        style={{ borderColor: `${color}66`, boxShadow: `0 0 20px -6px ${color}` }}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

function Connector({ color, delay }: { color: string; delay: string }) {
  return (
    <div className="relative h-1 min-w-10 flex-1">
      <div className="absolute inset-x-0 top-0 border-t border-dashed border-foreground/20" />
      <div
        className="flow-dot"
        style={{ background: color, boxShadow: `0 0 8px ${color}`, animationDelay: delay }}
      />
    </div>
  );
}

export function GitlabSlackFlow({ devs = 3 }: Props) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl border border-foreground/10 bg-background/40 p-8 backdrop-blur-sm">
      <div className="flex w-full items-center gap-3">
        <Node icon={SiGitlab} label="GitLab" color={GITLAB_COLOR} />
        <Connector color={GITLAB_COLOR} delay="0s" />
        <Node icon={SiN8N} label="n8n" color={N8N_COLOR} />
        <Connector color={N8N_COLOR} delay="0.9s" />

        <div className="flex items-center gap-3">
          <Node icon={FaSlack} label="Slack" color={SLACK_COLOR} />

          <div className="relative flex items-center">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-[0.2em] text-foreground/40 uppercase">
              Devs
            </span>

            <div className="flex items-stretch gap-3">
              <div className="w-px border-l border-dashed border-foreground/20" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: devs }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-px w-10 border-t border-dashed border-foreground/20" />
                    <div className="flow-buzz" style={{ animationDelay: `${0.2 + i * 0.25}s` }}>
                      <FaUser className="text-xl text-foreground/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-foreground/40"></p>
    </div>
  );
}