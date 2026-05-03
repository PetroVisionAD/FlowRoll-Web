// FlowRoll — Jiu-Jitsu Training Library
// Content is pedagogically realistic but generic enough for educational demo.

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const POSITIONS = [
  {
    id: "closed-guard",
    name: "Closed Guard",
    category: "Guard",
    focus: "Control & attack from bottom",
    difficulty: "Fundamental",
    tagline: "The fortress of the bottom game",
    description:
      "Legs locked around your opponent's waist. Your job is to break posture, control, and threaten sweeps or submissions.",
  },
  {
    id: "open-guard",
    name: "Open Guard",
    category: "Guard",
    focus: "Distance & grip management",
    difficulty: "Intermediate",
    tagline: "Where movement wins",
    description:
      "Feet, knees and grips manage distance. High mobility, high risk — your frames and hooks are everything.",
  },
  {
    id: "half-guard",
    name: "Half Guard",
    category: "Guard",
    focus: "Underhook, knee-shield & sweeps",
    difficulty: "Intermediate",
    tagline: "The underhook battle",
    description:
      "One leg trapped, one free. Win the underhook, win the position. Classic sweeps and back takes live here.",
  },
  {
    id: "mount",
    name: "Mount",
    category: "Top",
    focus: "Pressure & finishes from top",
    difficulty: "Fundamental",
    tagline: "The king's seat",
    description:
      "Chest on chest, knees climbing. Control the head, trap an arm, finish clean.",
  },
  {
    id: "side-control",
    name: "Side Control",
    category: "Top",
    focus: "Pinning mechanics & transitions",
    difficulty: "Fundamental",
    tagline: "Shoulder pressure or nothing",
    description:
      "Crossface, underhook, weight distribution. Hold, attack, or transition to mount.",
  },
  {
    id: "back-control",
    name: "Back Control",
    category: "Top",
    focus: "Seatbelt, hooks & chokes",
    difficulty: "Fundamental",
    tagline: "The highest value position",
    description:
      "Two hooks, seatbelt grip. Finish with rear naked choke or stay heavy and wait for the mistake.",
  },
];

export const getPosition = (id) => POSITIONS.find((p) => p.id === id);

export const SCENARIOS = {
  "closed-guard": [
    {
      id: "opponent-standing",
      title: "Opponent standing in your guard",
      subtitle: "Break the posture or break the grips",
      tags: ["Posture", "Grip fight"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "When your opponent stands, gravity works against you. You must disrupt their base before they pass.",
        keySteps: [
          "Hook behind both knees with your heels to prevent them from stepping back.",
          "Sit up and grip the belt or pants at the hip to anchor them.",
          "Shrimp out and switch to an open guard with shin-to-shin if they drive forward.",
          "If they stall standing, threaten a sweep with the belt grip and a leg drag entry.",
        ],
        whenToUse:
          "Any time the opponent lifts posture to stand. Early disruption beats late reaction.",
        commonMistakes: [
          "Crossing ankles behind their back — invites footlocks and no control.",
          "Letting their hips drift past your knees before reacting.",
          "Reaching for sleeves instead of controlling the hips.",
        ],
        drills: {
          static:
            "3 rounds × 10 reps: partner stands, you secure hip grip and knee hooks.",
          progressive:
            "Partner attempts a slow stand-up pass at 50% resistance, you disrupt and recover guard.",
          live: "Start from closed guard, score for every successful posture break or sweep within 90s.",
        },
      },
    },
    {
      id: "posture-broken",
      title: "Posture broken, opponent stuck low",
      subtitle: "Your moment to attack",
      tags: ["Attack", "Submission"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "Once their head is near your chest, you own the attack. Chain threats to finish or sweep.",
        keySteps: [
          "Over-hook one arm, cross-face with the other to pin the head.",
          "Shift hips off-center (angle) to load your hip bump sweep.",
          "Thread for the triangle when the far arm posts inside.",
          "Transition to arm-bar if they stack with both arms posted.",
        ],
        whenToUse:
          "Any time their head drops below your sternum and their hands post on your chest.",
        commonMistakes: [
          "Squeezing the triangle before the arm is across — burns grip fast.",
          "Flattening your hips — attacks only work off-angle.",
          "Releasing the overhook too early.",
        ],
        drills: {
          static:
            "10 reps per side: overhook → angle → hip bump sweep entry (no finish).",
          progressive:
            "Partner resists hip bump at 40%, you flow to triangle if blocked.",
          live: "3-minute rounds starting with posture broken, partner tries to rebuild posture.",
        },
      },
    },
    {
      id: "opening-guard",
      title: "Opponent opening your guard",
      subtitle: "Transition before the pass",
      tags: ["Retention", "Transition"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "The second they force your ankles apart, decide: sweep, submit, or transition to open guard with purpose.",
        keySteps: [
          "Frame on the bicep they are using to pry your knee open.",
          "Shoot hips away to create angle before they square up.",
          "Insert a shin-across-belly or butterfly hook as guard opens.",
          "Re-engage with a sit-up sweep or scissor-sweep threat before they settle.",
        ],
        whenToUse:
          "When ankles are being forced open — a closing window of 1–2 seconds.",
        commonMistakes: [
          "Squeezing harder to keep closed guard — wastes energy and flattens you.",
          "Giving up the outside hook position during transition.",
          "Forgetting the frame on the opening arm.",
        ],
        drills: {
          static: "Partner opens slowly, you enter butterfly guard cleanly — 20 reps.",
          progressive:
            "Partner opens at 60%, you sit-up or scoop to open guard without losing hips.",
          live: "Start closed guard, partner passes. You may not stay closed — must transition.",
        },
      },
    },
  ],
  "open-guard": [
    {
      id: "standing-pass-pressure",
      title: "Opponent standing, driving pressure",
      subtitle: "Distance is life",
      tags: ["Distance", "Frames"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "Against standing pressure, your feet and hips create distance. Never let chest meet chest.",
        keySteps: [
          "Place both feet on hips with active knees (not locked).",
          "Match grips — cross collar + sleeve, or double sleeve.",
          "Shrimp out the moment they try to circle.",
          "Switch to de la Riva or shin-shin as their lead leg commits.",
        ],
        whenToUse:
          "When opponent stands and begins pressuring forward without stepping around.",
        commonMistakes: [
          "Extending legs straight — easy to pin the feet and pass.",
          "Letting grips break without replacing them.",
          "Flat hips during shrimp.",
        ],
        drills: {
          static: "Feet-on-hips → de la Riva hook insertion. 15 reps per side.",
          progressive: "Partner walks toward you; you must keep distance for 30s.",
          live: "Open guard survival drill — no sweeps, only retention for 2 min.",
        },
      },
    },
    {
      id: "toreando-pass-attempt",
      title: "Opponent attempting a torreando (bullfighter) pass",
      subtitle: "Win the inside space",
      tags: ["Retention", "Counter"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "The torreando wins with fast grip + hip-cut angle. Your counter is inside frames and a quick hip re-angle.",
        keySteps: [
          "The instant they grab both pants cuffs, pummel one knee inside.",
          "Frame on the near hip with your forearm.",
          "Hip-switch to face their passing side.",
          "Recover to knee shield or re-insert hook.",
        ],
        whenToUse:
          "Opponent steps out wide, grips both pants, attempts to run the pipe.",
        commonMistakes: [
          "Trying to flex legs against their grip — losing leverage.",
          "Staying flat on the back as they switch sides.",
          "Failing to hip-escape after the first side attempt.",
        ],
        drills: {
          static: "Torreando grip → inside knee pummel. 20 reps.",
          progressive: "Partner torreando at 50%; you must frame + re-angle.",
          live: "2-min rounds, partner only passes via torreando.",
        },
      },
    },
  ],
  "half-guard": [
    {
      id: "flattened-underhook-lost",
      title: "Flattened, lost the underhook",
      subtitle: "Don't panic — rebuild",
      tags: ["Escape", "Recovery"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "Losing the underhook in half guard is a 2-step recovery: frame, then knee-shield or hip escape.",
        keySteps: [
          "Forearm frame on the crossface shoulder.",
          "Bridge slightly and shrimp to create underhook space.",
          "Re-pummel the underhook or insert the knee shield.",
          "Switch to deep half or regain full guard from there.",
        ],
        whenToUse:
          "Any time your shoulder is pinned and opponent is chest-to-chest.",
        commonMistakes: [
          "Trying to sweep without the underhook or knee shield.",
          "Leaving the top leg loose — opponent flattens faster.",
          "Pushing the head instead of framing the shoulder.",
        ],
        drills: {
          static: "Frame → shrimp → re-pummel. 15 reps per side.",
          progressive: "Partner crossfaces at 50%; you recover underhook.",
          live: "Start flattened in half guard, score for any sweep or full guard recovery.",
        },
      },
    },
    {
      id: "underhook-secured",
      title: "Underhook secured, time to sweep",
      subtitle: "Your offensive window",
      tags: ["Sweep", "Back take"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "With the underhook, you choose: old-school sweep, knee-tap, or back take.",
        keySteps: [
          "Lift the underhook elbow high to load their shoulder.",
          "Turn onto your side, base on the far elbow.",
          "Step the top leg over or drive the knee tap.",
          "If they sprawl, thread for the back with both hooks.",
        ],
        whenToUse:
          "Whenever the underhook + head position are yours for more than 2s.",
        commonMistakes: [
          "Staying flat with the underhook — no leverage.",
          "Rushing before the shoulder is compromised.",
          "Forgetting the top leg — it must exit.",
        ],
        drills: {
          static: "Underhook → old-school entry. 10 reps per side.",
          progressive: "Partner resists at 40%; flow between sweep and back take.",
          live: "Round starts with your underhook; must sweep or take back in 60s.",
        },
      },
    },
  ],
  mount: [
    {
      id: "high-mount-arm-trap",
      title: "High mount with arm trapped",
      subtitle: "Finish the fight",
      tags: ["Submission", "Control"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "High mount with one arm isolated is 90% of the way to a submission. Stay heavy and connect the finish.",
        keySteps: [
          "Walk hips up until knees are under armpits.",
          "Grapevine the trapped arm with your leg.",
          "Attack the cross-collar choke or americana.",
          "If they bridge, switch to S-mount and arm-bar.",
        ],
        whenToUse:
          "Any time you climb to high mount and an arm crosses your centerline.",
        commonMistakes: [
          "Sitting too low — opponent regains elbow frames.",
          "Letting the trapped arm escape during the set-up.",
          "Lifting weight to finish — drop it instead.",
        ],
        drills: {
          static: "Climb to high mount → grapevine → collar grip. 10 reps.",
          progressive: "Partner frames at 40%; you maintain and threaten finish.",
          live: "Start high mount, score only for finishes or back takes.",
        },
      },
    },
    {
      id: "opponent-bridging-hard",
      title: "Opponent bridging hard to escape",
      subtitle: "Base, don't resist",
      tags: ["Retention", "Base"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "A bridge is just a ride. Post, absorb, and re-settle on the open side.",
        keySteps: [
          "Post the head-side arm wide.",
          "Ride the bridge — don't push back.",
          "As they roll, switch hips and replace knees.",
          "Immediately re-establish grapevines or high mount.",
        ],
        whenToUse:
          "At the top of any hard bridge, especially with their arms framing your hips.",
        commonMistakes: [
          "Trying to crush down — amplifies their bridge.",
          "Narrow base — gets rolled.",
          "Not re-establishing control after the ride.",
        ],
        drills: {
          static: "Partner bridges slowly; you ride and re-settle. 15 reps.",
          progressive: "Partner bridges at 60%; you must not lose mount.",
          live: "3-min rounds, start in mount, partner escape-focused.",
        },
      },
    },
  ],
  "side-control": [
    {
      id: "classic-side-control",
      title: "Classic side control, opponent framing",
      subtitle: "Kill the frames, then attack",
      tags: ["Pin", "Transition"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "A strong side control kills the inside frame first. Once frames die, the rest is a menu.",
        keySteps: [
          "Crossface with shoulder — head off the mat.",
          "Underhook the far arm or grip the hip.",
          "Flatten their near knee with your knee or hand.",
          "Transition to knee-on-belly, mount, or north-south.",
        ],
        whenToUse:
          "Immediately after a pass or from any side control reset.",
        commonMistakes: [
          "Floating too high — easy to shrimp out.",
          "Letting the far elbow stay tight to their ribs.",
          "Rushing the transition before control is secured.",
        ],
        drills: {
          static: "Crossface + underhook → knee-on-belly switch. 10 reps.",
          progressive: "Partner frames at 50%; you must kill frames and transition.",
          live: "Start side control, score only for transitions or submissions.",
        },
      },
    },
    {
      id: "opponent-turning-in",
      title: "Opponent turning in to recover guard",
      subtitle: "Catch the turn",
      tags: ["Counter", "Back take"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "When they turn toward you, they give their back. Read the hip cue and take it.",
        keySteps: [
          "Feel the near hip lift — that's the turn.",
          "Drop your weight on the far shoulder to stall.",
          "Thread the far-side hook as their chest faces the mat.",
          "Take the back with seatbelt established.",
        ],
        whenToUse:
          "The instant you feel their near hip lift while you're in side control.",
        commonMistakes: [
          "Chasing with mount — often too late.",
          "Not threading the hook before seatbelt.",
          "Leaving the head free — they can re-turn out.",
        ],
        drills: {
          static: "Partner turns in slowly; you thread hook + seatbelt. 10 reps.",
          progressive: "Partner tries to recover guard at 50%; you must take back.",
          live: "Start side control, partner must escape; you score back takes only.",
        },
      },
    },
  ],
  "back-control": [
    {
      id: "seatbelt-tight-hooks-in",
      title: "Seatbelt tight, hooks in",
      subtitle: "Hunt the RNC",
      tags: ["Submission", "Control"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "Seatbelt + hooks is the ideal. Patience wins — bait the defense, then finish.",
        keySteps: [
          "Chest glued to their upper back.",
          "Bait a hand to the choking arm to open the other side.",
          "Slide the choking arm under the chin as they defend.",
          "Lock figure-four and extend, don't squeeze.",
        ],
        whenToUse:
          "Any time seatbelt and both hooks are secured with chest contact.",
        commonMistakes: [
          "Squeezing before the arm is under the chin.",
          "Letting the hooks over-extend — easy to strip.",
          "Releasing the seatbelt to reach for the choke.",
        ],
        drills: {
          static: "Seatbelt → chin line → figure-four. 15 reps.",
          progressive: "Partner defends at 50%; you hunt the finish.",
          live: "Start with back control, score only for chokes.",
        },
      },
    },
    {
      id: "opponent-escaping-back",
      title: "Opponent escaping, sliding down",
      subtitle: "Switch sides or finish fast",
      tags: ["Retention", "Switch"],
      lesson: {
        video: SAMPLE_VIDEO,
        summary:
          "When the seatbelt side gets exposed, switch hooks or take the arm-bar from the back.",
        keySteps: [
          "Feel shoulder drop toward the mat on the choking-arm side.",
          "Swing the top leg over the head for arm-bar.",
          "Or — release the lower hook and switch to the other side.",
          "Re-establish seatbelt on the new side.",
        ],
        whenToUse:
          "The moment their shoulder dips below yours on the seatbelt side.",
        commonMistakes: [
          "Holding the bad side too long — loses the position.",
          "Crossing ankles with hooks in — guaranteed escape.",
          "Slow side switch — they complete the escape.",
        ],
        drills: {
          static: "Partner escapes slowly; you switch sides cleanly. 10 reps.",
          progressive: "Partner escapes at 60%; you must switch or arm-bar.",
          live: "Start with back, partner escape-only; you score for retention or finish.",
        },
      },
    },
  ],
};

export const getScenarios = (positionId) => SCENARIOS[positionId] || [];
export const getScenario = (positionId, scenarioId) =>
  getScenarios(positionId).find((s) => s.id === scenarioId);

// For the Logger dropdowns
export const BELTS = ["White", "Blue", "Purple", "Brown", "Black"];
export const STARTING_POSITIONS = POSITIONS.map((p) => ({
  id: p.id,
  name: p.name,
}));
export const RESULTS = ["Win", "Loss", "Draw"];
export const SUBMISSIONS = [
  "None",
  "Rear Naked Choke",
  "Triangle",
  "Arm-bar",
  "Kimura",
  "Americana",
  "Guillotine",
  "Cross Collar Choke",
  "Bow & Arrow",
  "Omoplata",
  "Heel Hook",
  "Straight Ankle Lock",
];
