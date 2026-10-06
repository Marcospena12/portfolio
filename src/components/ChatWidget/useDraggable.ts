"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { clamp, type Viewport, type WindowPosition } from "./types";

type UseDraggableOptions = {
  /** Posição atual (controlada pelo orquestrador). */
  position: WindowPosition;
  /** Atualiza a posição durante o arraste. */
  onPositionChange: (position: WindowPosition) => void;
  /** Dispara no pointerup — usado para persistir no localStorage. */
  onCommit?: (position: WindowPosition) => void;
  /** Dimensões da janela para calcular os limites da viewport. */
  bounds: { width: number; height: number };
  viewport: Viewport;
  /** Desabilita o drag (mobile = tela cheia). */
  disabled?: boolean;
};

export type UseDraggableReturn = {
  isDragging: boolean;
  /** Anexe ao elemento que funciona como alça de arraste (header). */
  handleRef: RefObject<HTMLElement | null>;
};

/**
 * Drag nativo com Pointer Events (sem dependências).
 * - Arrastável apenas pela alça (handle), não pelo corpo.
 * - Limita a janela à viewport.
 * - Persiste a posição via onCommit (localStorage fica no orquestrador).
 *
 * Os listeners são anexados uma única vez; `disabled` e demais valores são
 * lidos via refs dentro dos handlers — assim mudanças (ex.: virar mobile)
 * são tratadas nos próprios eventos, sem setState dentro de efeitos.
 */
export function useDraggable({
  position,
  onPositionChange,
  onCommit,
  bounds,
  viewport,
  disabled = false,
}: UseDraggableOptions): UseDraggableReturn {
  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef<HTMLElement | null>(null);

  // Valores "frescos" para os handlers anexados uma única vez.
  // Atualizados pós-render: eventos do usuário sempre leem o valor mais novo.
  const latest = useRef({ position, onPositionChange, onCommit, bounds, viewport, disabled });
  useEffect(() => {
    latest.current = { position, onPositionChange, onCommit, bounds, viewport, disabled };
  });

  const dragState = useRef<{ offsetX: number; offsetY: number } | null>(null);
  // Última posição calculada no pointermove (o setState pode não ter
  // renderizado ainda quando o pointerup chegar).
  const lastPositionRef = useRef<WindowPosition | null>(null);

  const clampToViewport = useCallback(
    (x: number, y: number, vp: Viewport, b: { width: number; height: number }) => ({
      x: clamp(x, 0, Math.max(0, vp.width - b.width)),
      y: clamp(y, 0, Math.max(0, vp.height - b.height)),
    }),
    [],
  );

  // Encerra um arraste em andamento (usado em pointerup e ao desabilitar).
  const endDrag = useCallback(() => {
    dragState.current = null;
    lastPositionRef.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    function onPointerDown(event: PointerEvent) {
      const { disabled: isDisabled, position: pos } = latest.current;
      // Apenas botão principal, drag habilitado; ignora botões do header
      // (fechar/minimizar) — o clique deles deve funcionar normalmente.
      if (event.button !== 0 || isDisabled) return;
      if ((event.target as HTMLElement).closest("button")) return;

      dragState.current = {
        offsetX: event.clientX - pos.x,
        offsetY: event.clientY - pos.y,
      };
      lastPositionRef.current = pos;

      handle!.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }

    function onPointerMove(event: PointerEvent) {
      const drag = dragState.current;
      if (!drag) return;

      // Virou mobile no meio do arraste: solta tudo aqui (em evento, não em efeito).
      if (latest.current.disabled) {
        endDrag();
        return;
      }

      const { onPositionChange: setPosition, bounds: b, viewport: vp } = latest.current;
      // Posição segue o ponteiro 1:1 (translate aplicado no render, sem lag).
      const next = clampToViewport(
        event.clientX - drag.offsetX,
        event.clientY - drag.offsetY,
        vp,
        b,
      );
      lastPositionRef.current = next;
      setPosition(next);
    }

    function onPointerUp(event: PointerEvent) {
      const drag = dragState.current;
      if (!drag) return;

      if (handle!.hasPointerCapture(event.pointerId)) {
        handle!.releasePointerCapture(event.pointerId);
      }
      // Persiste só no fim do arraste (não a cada frame).
      const finalPos = lastPositionRef.current;
      setIsDragging(false);
      dragState.current = null;
      lastPositionRef.current = null;
      if (finalPos) latest.current.onCommit?.(finalPos);
    }

    handle.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("pointermove", onPointerMove);
    handle.addEventListener("pointerup", onPointerUp);
    handle.addEventListener("pointercancel", onPointerUp);

    return () => {
      handle.removeEventListener("pointerdown", onPointerDown);
      handle.removeEventListener("pointermove", onPointerMove);
      handle.removeEventListener("pointerup", onPointerUp);
      handle.removeEventListener("pointercancel", onPointerUp);
      dragState.current = null;
      lastPositionRef.current = null;
    };
  }, [clampToViewport, endDrag]);

  return { isDragging, handleRef };
}
