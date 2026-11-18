(function () {
  "use strict";

  const runtime = window.SYMMETRY_SPAN_RUNTIME;
  if (!runtime || !Array.isArray(runtime.timeline)) {
    throw new Error("Symmetry Span timeline is unavailable for presentation updates.");
  }

  const timeline = runtime.timeline;

  // Add correctness feedback after each judgment in symmetry-only practice.
  for (let index = timeline.length - 1; index >= 0; index--) {
    const trial = timeline[index];
    const data = trial.data || {};
    if (data.phase !== "symmetry-practice" || data.trialType !== "symmetry") continue;

    timeline.splice(index + 1, 0, {
      type: jsPsychHtmlButtonResponse,
      stimulus: function () {
        const result = jsPsych.data.get().last(1).values()[0];
        return `<section class="feedback-panel"><h2>${result.accuracy ? "Correct" : "Incorrect"}</h2><p>The grid was ${result.correctAnswerLabel.toLowerCase()}.</p></section>`;
      },
      choices: ["Continue"],
      data: { phase: "symmetry-practice", practice: true, trialType: "practice-feedback" }
    });
  }

  // Do not disclose the upcoming set size or the total number of sequences.
  timeline.forEach(trial => {
    const data = trial.data || {};
    if (data.phase === "main" && data.trialType === "instruction" &&
        data.screen === "Main Symmetry Span task") {
      trial.stimulus = `<section class="instruction-panel instruction-page"><div class="instruction-content"><h1>Main Symmetry Span task</h1><p>Make each Symmetry Judgment accurately and do your best to remember the square locations. You will not receive correctness feedback during the main task.</p></div></section>`;
    }
    if (data.phase === "main" && data.trialType === "instruction" &&
        typeof data.screen === "string" && data.screen.startsWith("Sequence ")) {
      trial.stimulus = `<section class="instruction-panel instruction-page"><div class="instruction-content"><h1>Next sequence</h1><p>Remember each location as it appears.</p></div></section>`;
    }
  });
})();
