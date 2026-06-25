import React from "react";
import { formatCurrency, formatDuration } from "../../../utils/formatters";

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
    day: "numeric"
  });

  const totalGrams = results.platesBreakdown.reduce((sum, p) => sum + (p.filamentGrams || 0), 0);

  return (
    <div className="hidden print:block bg-white text-slate-900 p-8 min-h-screen font-sans w-full max-w-200 mx-auto">
      {/* Budget Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">PRESUPUESTO</h1>
          <p className="text-sm text-slate-600 mt-1">Servicio de Impresión 3D profesional</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-950">Fecha: {currentDate}</p>
          <p className="text-xs text-slate-500 mt-1">ID Cotización: #{Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      {/* Project info card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Detalles del Proyecto</h2>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div>
            <span className="text-slate-500">Nombre del Trabajo:</span>{" "}
            <span className="font-semibold text-slate-900">{project.projectName}</span>
          </div>
          <div>
            <span className="text-slate-500">Total Bandejas:</span>{" "}
            <span className="font-semibold text-slate-900">{results.platesBreakdown.length}</span>
          </div>
          <div>
            <span className="text-slate-500">Peso Acumulado:</span>{" "}
            <span className="font-mono font-semibold text-slate-900">{totalGrams.toFixed(1)}g</span>
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
      <h2 className="text-lg font-bold text-slate-900 mb-3">Desglose de Costos por Bandeja</h2>
      <table className="w-full text-left text-sm border-collapse mb-8">
        <thead>
          <tr className="border-b border-slate-900 text-slate-500 font-medium">
            <th className="py-2">Concepto / Descripción</th>
            <th className="py-2 text-right">Cantidad / Unidad</th>
            <th className="py-2 text-right">Costo Unitario</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-250">
          {results.platesBreakdown.map((plate) => (
            <React.Fragment key={plate.id}>
              {/* Filament row */}
              {plate.filamentGrams > 0 && (
                <tr>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-slate-900">{plate.name} (Material)</div>
                    <div className="text-xs text-slate-500">Filamento: {plate.selectedFilamentName} (+10% scrap)</div>
                  </td>
                  <td className="py-3 text-right font-mono">{plate.filamentGrams} g</td>
                  <td className="py-3 text-right font-mono">
                    {formatCurrency(plate.filamentCost / (plate.filamentGrams || 1))}/g
                  </td>
                  <td className="py-3 text-right font-semibold font-mono">{formatCurrency(plate.filamentCost)}</td>
                </tr>
              )}
              {/* Time row */}
              {plate.minutes > 0 && (
                <tr>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-slate-900">{plate.name} (Tiempo de Impresión)</div>
                    <div className="text-xs text-slate-500">Depreciación de impresora y consumo eléctrico (+10% scrap)</div>
                  </td>
                  <td className="py-3 text-right font-mono">{plate.decimalHours.toFixed(2)} hs</td>
                  <td className="py-3 text-right font-mono">
                    {formatCurrency(plate.timeCost / (plate.decimalHours || 1))}/h
                  </td>
                  <td className="py-3 text-right font-semibold font-mono">{formatCurrency(plate.timeCost)}</td>
                </tr>
              )}
            </React.Fragment>
          ))}

          {/* Labor Cost Row */}
          {project.laborRatePerHour > 0 && results.totalDecimalHours > 0 && (
            <tr>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-900">Mano de Obra y Monitoreo</div>
                <div className="text-xs text-slate-500">Costo total de operación y supervisión</div>
              </td>
              <td className="py-3 text-right font-mono">{results.totalDecimalHours.toFixed(2)} hs</td>
              <td className="py-3 text-right font-mono">{formatCurrency(project.laborRatePerHour)}/h</td>
              <td className="py-3 text-right font-semibold font-mono">{formatCurrency(results.laborCost)}</td>
            </tr>
          )}

          {/* Other / Extra costs row */}
          {project.otherCosts > 0 && (
            <tr>
              <td className="py-3 pr-4">
                <div className="font-medium text-slate-900">Adicionales / Insumos Extras</div>
                <div className="text-xs text-slate-500">Costo fijo añadido al presupuesto</div>
              </td>
              <td className="py-3 text-right">-</td>
              <td className="py-3 text-right font-mono">{formatCurrency(project.otherCosts)}</td>
              <td className="py-3 text-right font-semibold font-mono">{formatCurrency(project.otherCosts)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pricing and totals */}
      <div className="flex justify-end pt-4 border-t-2 border-slate-900">
        <div className="w-75 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Costo de Producción:</span>
            <span className="font-mono text-slate-900">{formatCurrency(results.productionCost)}</span>
          </div>
          {results.laborCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Mano de Obra:</span>
              <span className="font-mono text-slate-900">{formatCurrency(results.laborCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm border-b border-slate-200 pb-2">
            <span className="text-slate-500">Gastos Generales:</span>
            <span className="font-mono text-slate-900">
              {formatCurrency(results.productionCost + results.laborCost)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-950">
            <span>Total Presupuestado (x{project.profitMultiplier}):</span>
            <span className="font-mono">{formatCurrency(results.finalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Footer and Terms */}
      <div className="mt-16 text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
        <p>Este presupuesto tiene validez por 15 días corridos desde su emisión.</p>
        <p className="mt-1">© {new Date().getFullYear()} AgusAmor. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}
