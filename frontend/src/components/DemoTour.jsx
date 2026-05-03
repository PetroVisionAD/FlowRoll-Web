import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Sparkles, Check } from "lucide-react";
import { TOUR_STEPS, loadTourState, saveTourState } from "@/lib/demoMode";

export default function DemoTour() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({ active: false, step: 0, seen: false });

  // Initialise once — if user has never seen the tour, start it on first load.
  useEffect(() => {
    const initial = loadTourState();
    if (!initial.seen && !initial.active) {
      const next = { active: true, step: 0, seen: false };
      saveTourState(next);
      setState(next);
    } else {
      setState(initial);
    }
  }, []);

  // React to "restart tour" from the demo badge popover.
  useEffect(() => {
    const onRestart = () => {
      const next = { active: true, step: 0, seen: false };
      saveTourState(next);
      setState(next);
      navigate(TOUR_STEPS[0].route);
    };
    window.addEventListener("flowroll:tour-restart", onRestart);
    return () => window.removeEventListener("flowroll:tour-restart", onRestart);
  }, [navigate]);

  if (!state.active) return null;

  const current = TOUR_STEPS[state.step];
  const isLast = state.step === TOUR_STEPS.length - 1;
  const isFirst = state.step === 0;
  const onRoute = location.pathname === current.route;

  const goto = (stepIndex) => {
    const next = { ...state, step: stepIndex };
    saveTourState(next);
    setState(next);
    navigate(TOUR_STEPS[stepIndex].route);
  };

  const handleNext = () => {
    if (isLast) return handleFinish();
    goto(state.step + 1);
  };

  const handlePrev = () => {
    if (isFirst) return;
    goto(state.step - 1);
  };

  const handleSkip = () => {
    const next = { active: false, step: state.step, seen: true };
    saveTourState(next);
    setState(next);
  };

  const handleFinish = () => {
    const next = { active: false, step: 0, seen: true };
    saveTourState(next);
    setState(next);
  };

  const handleGoHere = () => {
    navigate(current.route);
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl pointer-events-auto"
      data-testid="demo-tour"
    >
      <div className="bg-[#141414]/95 backdrop-blur-xl border border-white/15 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden fr-fade-up">
        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-[#FF3B30] transition-all duration-300"
            style={{
              width: `${((state.step + 1) / TOUR_STEPS.length) * 100}%`,
            }}
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-[#FF3B30] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="label-eyebrow text-[#FF3B30] text-[9px]">
                  Guided Tour
                </div>
                <div className="label-eyebrow text-white/40 text-[9px] mt-0.5">
                  Step {state.step + 1} of {TOUR_STEPS.length}
                </div>
              </div>
            </div>
            <button
              onClick={handleSkip}
              data-testid="tour-skip"
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Skip tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3
            className="font-display text-2xl sm:text-3xl tracking-tight leading-none text-white mb-2"
            data-testid="tour-title"
          >
            {current.title}
          </h3>
          <p
            className="text-sm text-white/70 leading-relaxed mb-5"
            data-testid="tour-body"
          >
            {current.body}
          </p>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Button
              onClick={handlePrev}
              disabled={isFirst}
              variant="outline"
              data-testid="tour-prev"
              className="rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui disabled:opacity-30 h-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2 order-3 sm:order-2 w-full sm:w-auto">
              {!onRoute && (
                <Button
                  onClick={handleGoHere}
                  variant="outline"
                  data-testid="tour-goto"
                  className="rounded-sm bg-transparent border-white/15 text-white/80 hover:bg-white/5 font-ui text-xs h-10 flex-1 sm:flex-initial"
                >
                  Take me there
                </Button>
              )}
            </div>

            <Button
              onClick={handleNext}
              data-testid="tour-next"
              className="rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white font-ui font-semibold h-10 fr-pressable order-2 sm:order-3"
            >
              {isLast ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
