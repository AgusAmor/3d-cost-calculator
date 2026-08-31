import React from "react";
import { formatCurrency, formatDuration } from "../../utils/formatters";

/**
 * PrintableBudget component.
 * Renders a clean, print-friendly quotation invoice sheet.
 * Styled specifically for standard A4 paper size, visible only during printing.
 * Shows detailed breakdowns for all individual trays (plates) in the project.
 *
 * @param {object} project - The project input fields.
 * @param {object} results - Calculations derived from useCalculator.
 * @param {object} settings - Global settings parameters.
 */
export default function PrintableBudget({ project, results, settings }) {
  const currentDate = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalGrams = results.platesBreakdown.reduce(
    (sum, p) => sum + Number(p.filamentGrams || 0),
    0,
  );

  return (
    <div className="hidden print:block bg-white text-slate-900 p-12 pt-16 pb-24 font-sans w-full max-w-200 mx-auto relative">
      {/* Budget Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            PRESUPUESTO
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Servicio de Impresión 3D profesional
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-950">
            Fecha: {currentDate}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            ID Cotización: #{Date.now().toString().slice(-6)}
          </p>
        </div>
      </div>

      {/* Project info card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Detalles del Proyecto
        </h2>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div>
            <span className="text-slate-500">Nombre del Trabajo:</span>{" "}
            <span className="font-semibold text-slate-900">
              {project.projectName}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Total Placas de Impresión:</span>{" "}
            <span className="font-semibold text-slate-900">
              {results.platesBreakdown.length}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Peso Acumulado:</span>{" "}
            <span className="font-mono font-semibold text-slate-900">
              {totalGrams.toFixed(1)}g
            </span>
          </div>
          <div>
            <span className="text-slate-500">Tiempo Acumulado:</span>{" "}
            <span className="font-mono font-semibold text-slate-900">
              {formatDuration(results.totalMinutes)}
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Cost Breakdown Table */}
      <h2 className="text-lg font-bold text-slate-900 mb-3">
        Desglose de Costos por Placa de Impresión
      </h2>
      <table className="w-full text-left text-sm border-collapse mb-4">
        <thead>
          <tr className="border-b border-slate-900 text-slate-500 font-medium">
            <th className="py-2">Concepto</th>
            <th className="py-2 text-right">Tiempo</th>
            <th className="py-2 text-right">Material</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-250">
          {results.platesBreakdown.map((plate) => {
            const plateSubtotal =
              (plate.filamentCost + plate.timeCost) * project.profitMultiplier;
            return (
              <tr key={plate.id}>
                <td className="py-3 pr-4">
                  <div className="font-medium text-slate-900">{plate.name}</div>
                </td>
                <td className="py-3 text-right font-mono text-slate-600">
                  {plate.minutes > 0
                    ? `${plate.decimalHours.toFixed(2)} hs`
                    : "-"}
                </td>
                <td className="py-3 text-right font-mono text-slate-600">
                  {plate.filamentGrams > 0 ? `${plate.filamentGrams} g` : "-"}
                </td>
                <td className="py-3 text-right font-semibold font-mono">
                  {formatCurrency(plateSubtotal)}
                </td>
              </tr>
            );
          })}

          {/* Labor Cost Row */}
          {project.laborRatePerHour > 0 && results.totalDecimalHours > 0 && (
            <tr>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-900">
                  Mano de Obra y Monitoreo
                </div>
              </td>
              <td className="py-3 text-right font-mono text-slate-600">
                {results.totalDecimalHours.toFixed(2)} hs
              </td>
              <td className="py-3 text-right text-slate-500">-</td>
              <td className="py-3 text-right font-semibold font-mono">
                {formatCurrency(results.laborCost * project.profitMultiplier)}
              </td>
            </tr>
          )}

          {/* Other / Extra costs row */}
          {project.otherCosts > 0 && (
            <tr>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-900">
                  Adicionales / Insumos Extras
                </div>
              </td>
              <td className="py-3 text-right text-slate-500">-</td>
              <td className="py-3 text-right text-slate-500">-</td>
              <td className="py-3 text-right font-semibold font-mono">
                {formatCurrency(project.otherCosts * project.profitMultiplier)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pricing and totals */}
      <div className="flex justify-end pt-4 border-t-2 border-slate-900 break-inside-avoid">
        <div className="w-75 space-y-2">
          <div className="flex justify-between text-xl font-bold text-slate-950">
            <span>Total:</span>
            <span className="font-mono">
              {formatCurrency(results.finalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer and Terms (Repeats on every printed page) */}
      <div className="fixed bottom-0 left-0 w-full text-center text-xs text-slate-400 bg-white py-6 border-t border-slate-100">
        <p>
          Este presupuesto tiene validez por 15 días corridos desde su emisión.
        </p>
      </div>
    </div>
  );
}
