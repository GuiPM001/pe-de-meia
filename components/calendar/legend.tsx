import React from "react";

export default function Legend() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-default border border-green-text" />
          <span className="text-xs text-gray-500">Acima da meta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-default border border-yellow-text" />
          <span className="text-xs text-gray-500">Abaixo da meta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-default border border-red-text" />
          <span className="text-xs text-gray-500">Saldo negativo</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-text" />
          <span className="text-xs text-gray-500">Entrada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-text" />
          <span className="text-xs text-gray-500">Saída</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-text" />
          <span className="text-xs text-gray-500">Gasto diário</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-text" />
          <span className="text-xs text-gray-500">Investimento</span>
        </div>
      </div>
    </div>
  );
}
