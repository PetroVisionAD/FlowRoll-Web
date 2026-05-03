import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Flame, RotateCcw, PlayCircle, Info, X } from "lucide-react";
import { resetDemoData, saveTourState } from "@/lib/demoMode";
import { toast } from "sonner";

export default function DemoBadge() {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetDemoData();
    toast.success("Demo data reset — reloading…");
    setTimeout(() => window.location.reload(), 600);
  };

  const handleRestartTour = () => {
    saveTourState({ active: true, step: 0, seen: false });
    setOpen(false);
    // Broadcast so the tour component re-reads state immediately.
    window.dispatchEvent(new Event("flowroll:tour-restart"));
    toast("Guided tour restarted");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          data-testid="demo-badge"
          className="fixed left-4 bottom-4 z-40 flex items-center gap-2 px-3 h-9 rounded-sm bg-[#FF3B30] hover:bg-[#D63026] text-white shadow-[0_0_20px_rgba(255,59,48,0.35)] hover:shadow-[0_0_28px_rgba(255,59,48,0.6)] transition-all fr-pressable border border-white/20"
        >
          <Flame className="w-3.5 h-3.5" fill="currentColor" />
          <span className="label-eyebrow text-[10px]">Demo Mode</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="bg-[#141414] border-white/15 rounded-sm text-white w-80 p-0"
        data-testid="demo-badge-popover"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="label-eyebrow text-[#FF3B30]">Preview Build</div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/40 hover:text-white"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="font-display text-2xl tracking-tight uppercase text-white leading-none mb-2">
            FlowRoll Demo
          </h3>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            You're viewing a client preview populated with realistic sample
            data. Nothing here is saved to a real account.
          </p>

          <div className="border border-white/10 rounded-sm p-3 mb-4">
            <div className="label-eyebrow text-white/40 mb-2">Sample User</div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#FF3B30] text-white font-display text-sm flex items-center justify-center">
                AR
              </div>
              <div>
                <div className="font-ui text-sm text-white font-semibold leading-none">
                  Alex Reyes
                </div>
                <div className="label-eyebrow text-white/40 text-[9px] mt-1">
                  Blue Belt · 2 stripes
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleRestartTour}
              data-testid="demo-restart-tour"
              className="w-full h-10 rounded-sm bg-white text-black hover:bg-white/90 font-ui font-semibold fr-pressable"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Restart Guided Tour
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              data-testid="demo-reset-data"
              className="w-full h-10 rounded-sm bg-transparent border-white/15 text-white hover:bg-white/5 font-ui fr-pressable"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Demo Data
            </Button>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
            <Info className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/40 leading-relaxed">
              Supabase auth, cloud sync, real video content and community
              backend are planned for the full release.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
