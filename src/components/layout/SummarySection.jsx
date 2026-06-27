import CurrentBudgetSummary from "../history/CurrentBudgetSummary";
import QuotesHistory from "../history/QuotesHistory";

/**
 * SummarySection component.
 * Orchestrates the current budget summary and the quotes history list.
 *
 * @param {object} project - Current project state.
 * @param {object} results - Calculations derived from useCalculator.
 * @param {array} history - Array of saved calculations.
 * @param {function} saveToHistory - Callback to save current project state.
 * @param {function} updateHistoryItem - Callback to update a saved item.
 * @param {function} deleteFromHistory - Callback to delete a saved item.
 * @param {function} resetProject - Callback to reset inputs.
 * @param {function} handleExport - Callback to trigger PDF print mode.
 * @param {object} settings - Global application settings.
 */
export default function SummarySection({
  project,
  results,
  history,
  saveToHistory,
  updateHistoryItem,
  deleteFromHistory,
  resetProject,
  handleExport,
  settings,
}) {
  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <CurrentBudgetSummary
        results={results}
        saveToHistory={saveToHistory}
        handleExport={handleExport}
        resetProject={resetProject}
      />

      <QuotesHistory
        history={history}
        settings={settings}
        updateHistoryItem={updateHistoryItem}
        deleteFromHistory={deleteFromHistory}
      />
    </div>
  );
}
