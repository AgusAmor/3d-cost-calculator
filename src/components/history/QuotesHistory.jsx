import { FiClock, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatCurrency, formatDuration } from "../../utils/formatters";
import { useConfirm } from "../../context/ConfirmContext";
import QuoteModal from "./QuoteModal";
import { useState } from "react";

export default function QuotesHistory({
  history,
  settings,
  updateHistoryItem,
  deleteFromHistory,
}) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [activeQuote, setActiveQuote] = useState(null);
  const [quoteModalMode, setQuoteModalMode] = useState("view");
  const { confirm } = useConfirm();

  const openQuoteModal = (item, mode) => {
    setActiveQuote(item);
    setSelectedQuote(item);
    setQuoteModalMode(mode);
  };

  return (
    <>
      {/* History table */}
      <div className="pt-6 border-t border-slate-800">
        <h3 className="text-lg font-medium text-slate-200 mb-3 flex items-center gap-2">
          <FiClock className="text-slate-400" /> Historial de Cotizaciones
        </h3>

        {history.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
            No tienes cotizaciones guardadas. Haz clic en "Guardar Cotización"
            para archivar.
          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-950/30 overflow-hidden divide-y divide-slate-800">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-200 text-sm sm:text-base">
                    {item.projectName}
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(item.results.finalPrice)}
                    </span>
                    <span className="text-slate-500 hidden sm:inline">
                      • {formatDuration(item.results.totalMinutes)}
                    </span>
                    <span className="text-slate-500 hidden sm:inline">
                      • {item.details.plates ? item.details.plates.length : 1}{" "}
                      {item.details.plates && item.details.plates.length === 1
                        ? "placa"
                        : "placas"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => openQuoteModal(item, "view")}
                    className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors cursor-pointer"
                    title="Ver detalles"
                  >
                    <FiEye className="text-lg" />
                  </button>
                  <button
                    onClick={() => openQuoteModal(item, "edit")}
                    className="p-2 text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors cursor-pointer"
                    title="Editar cotización"
                  >
                    <FiEdit2 className="text-lg" />
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        await confirm({
                          title: "Eliminar Cotización",
                          message:
                            "¿Estás seguro de que deseas eliminar esta cotización del historial?",
                        })
                      ) {
                        deleteFromHistory(item.id);
                      }
                    }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeQuote && (
        <QuoteModal
          key={activeQuote.id}
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          item={activeQuote}
          settings={settings}
          updateHistoryItem={updateHistoryItem}
          deleteFromHistory={deleteFromHistory}
          initialMode={quoteModalMode}
        />
      )}
    </>
  );
}
