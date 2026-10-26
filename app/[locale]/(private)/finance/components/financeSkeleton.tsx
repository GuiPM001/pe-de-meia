import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Grade de Meses Skeleton */}
      <section className="my-6">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1.5 py-3 h-[62px] rounded-lg bg-card/60 border border-border/50"
            >
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
          ))}
        </div>

        {/* Legenda Skeleton */}
        <div className="flex flex-row items-center justify-between mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-3 h-3 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-3 h-3 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-3 h-3 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
      </section>

      {/* Resumo do Mês Skeleton */}
      <div className="space-y-6">
        {/* Saldo do mês */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20 rounded" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </section>

        {/* Custo de vida */}
        <section className="space-y-3 border-t pt-4">
          <Skeleton className="h-5 w-28 rounded-lg" />
          <div className="bg-card border rounded-2xl p-4 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
        </section>

        {/* Planejamento diário */}
        <section className="space-y-3 border-t pt-4">
          <Skeleton className="h-5 w-36 rounded-lg" />
          <div className="bg-card border rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-8 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
            <Skeleton className="h-3 w-52 rounded" />
          </div>
        </section>

        {/* Investimentos */}
        <section className="space-y-3 border-t pt-4">
          <Skeleton className="h-5 w-32 rounded-lg" />
          <div className="bg-card border rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-44 rounded" />
              </div>
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        </section>

        {/* Totais das transações */}
        <section className="space-y-2 border-t pt-4">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <div className="bg-card border rounded-2xl divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
