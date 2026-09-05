// 2026–27 preparation catalog. Archived EVENTS in data.js stays unchanged.
// Sources: team Drive draft references and official Science Olympiad trial-event resources.
const CURRENT_EVENTS = [
  {
    "id": "2027-anatomy-and-physiology",
    "name": "Anatomy & Physiology",
    "type": "study",
    "icon": "🫀",
    "category": "Life science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Respiratory, digestive, and immune systems, structure to disorder.",
    "overview": "Connect organ structure to function, disorders, and physiological processes.",
    "rules": [
      "Respiratory, digestive, and immune system structure and function.",
      "Apply physiology to disorders and data-based questions.",
      "Practice diagram, model, and station-based identification."
    ],
    "tips": "Practice system diagrams and application questions. The source warns that printed draft rules contain errors; verify final content and reference-sheet limits.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Anatomy_and_Physiology"
  },
  {
    "id": "2027-astronomy",
    "name": "Astronomy",
    "type": "study",
    "icon": "🔭",
    "category": "Earth & space",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Read the universe through stellar evolution and galaxies.",
    "overview": "Interpret spectra, light curves, H–R diagrams, and observations of normal and starburst galaxies.",
    "rules": [
      "Stellar evolution, normal galaxies, and starburst galaxies.",
      "Interpret spectra, light curves, and H–R diagrams.",
      "Use orbital mechanics and distance relationships to analyze astronomical data."
    ],
    "tips": "Build an organized object guide and practice distance calculations using real data.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Astronomy"
  },
  {
    "id": "2027-boomilever",
    "name": "Boomilever",
    "type": "build",
    "icon": "🏗️",
    "category": "Engineering",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Build light. Carry more. Test a cantilever to its limit.",
    "overview": "Design and load-test a wooden cantilever, using material selection and structural efficiency.",
    "rules": [
      "Wood selection, joints, statics, compression, and tension.",
      "Relate supported load to structure mass and failure mode.",
      "Use repeated builds to test one design variable at a time."
    ],
    "tips": "Log structure mass, supported load, and failure mode. Draft bonus and tiebreaker changes remain unconfirmed.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Boomilever"
  },
  {
    "id": "2027-botany",
    "name": "Botany",
    "type": "study",
    "icon": "🌿",
    "category": "Life science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "How plants grow, function, and shape the ecosystems around them.",
    "overview": "Study plant anatomy, physiology, genetics, evolution, and ecological roles, including Division C biochemistry.",
    "rules": [
      "Plant anatomy, physiology, reproduction, and genetics.",
      "Plant ecology, evolution, and economic importance.",
      "Division C topics include plant biochemistry and applications in medicine and environmental management."
    ],
    "tips": "Organize notes by plant structures and processes. The reference set is introductory; confirm the final topic list.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Botany"
  },
  {
    "id": "2027-chemistry-lab",
    "name": "Chemistry Lab",
    "type": "lab",
    "icon": "⚗️",
    "category": "Physical science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Investigate reaction kinetics and the behavior of gases.",
    "overview": "Combine written chemistry questions with laboratory measurements and data analysis.",
    "rules": [
      "Reaction kinetics, rate factors, and graphical analysis.",
      "Gas laws and relationships between pressure, volume, and temperature.",
      "Combine hands-on measurements with written explanations and safe lab practice."
    ],
    "tips": "Practice gas laws, reaction rates, graph interpretation, and safe laboratory technique.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Chemistry_Lab"
  },
  {
    "id": "2027-circuit-lab",
    "name": "Circuit Lab",
    "type": "lab",
    "icon": "🔌",
    "category": "Physical science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Turn circuit theory into measurable results.",
    "overview": "Solve electricity and magnetism problems, measure circuits, and build circuits to specifications.",
    "rules": [
      "Electricity, magnetism, and circuit analysis.",
      "Measure and analyze a supplied circuit.",
      "Build circuits to given specifications and compare predictions with measurements."
    ],
    "tips": "Practice using a multimeter and predicting circuit behavior before measuring it.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Circuit_Lab"
  },
  {
    "id": "2027-codebusters",
    "name": "Codebusters",
    "type": "study",
    "icon": "🔐",
    "category": "Inquiry",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Find the pattern. Break the cipher.",
    "overview": "Apply cryptanalysis, frequency analysis, and teamwork to timed encrypted messages.",
    "rules": [
      "Cryptanalysis of historical and advanced ciphers.",
      "Frequency analysis, statistics, and pattern recognition.",
      "Practice timed decoding and dividing questions among teammates."
    ],
    "tips": "Practice dividing a test among partners. Calculator policy and Hill cipher coverage conflict in the draft references; confirm both.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Codebusters"
  },
  {
    "id": "2027-designer-genes",
    "name": "Designer Genes",
    "type": "study",
    "icon": "🧬",
    "category": "Life science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Decode inheritance, molecular genetics, and evolution.",
    "overview": "Classical, molecular, population, and evolutionary genetics, plus gene-modification techniques.",
    "rules": [
      "Classical and molecular genetics.",
      "Population and evolutionary genetics.",
      "Gene modification technology and techniques."
    ],
    "tips": "Practice genetics problems and data interpretation. The source is missing text from its detailed topic slides.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Designer_Genes"
  },
  {
    "id": "2027-disease-detectives",
    "name": "Disease Detectives",
    "type": "study",
    "icon": "🔬",
    "category": "Life science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Follow the evidence behind an outbreak.",
    "overview": "Use epidemiology and population-level data to investigate patterns of disease and public health.",
    "rules": [
      "Investigate disease patterns in populations.",
      "Use evidence and epidemiological data to evaluate an outbreak.",
      "Connect investigation findings to public-health decisions."
    ],
    "tips": "Practice outbreak investigations, study designs, and explaining conclusions from evidence.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Disease_Detectives"
  },
  {
    "id": "2027-dynamic-planet",
    "name": "Dynamic Planet",
    "type": "study",
    "icon": "🌊",
    "category": "Earth & space",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Trace freshwater through landscapes and underground.",
    "overview": "Study the hydrologic cycle, watersheds, groundwater, and the geology of freshwater systems.",
    "rules": [
      "Freshwater hydrology and the water cycle.",
      "Watersheds, groundwater, and water movement across landscapes.",
      "Interpret maps, graphs, and geologic evidence."
    ],
    "tips": "Interpret maps and hydrology data. Keep the focus on water movement and geology.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Dynamic_Planet"
  },
  {
    "id": "2027-electric-vehicle",
    "name": "Electric Vehicle",
    "type": "build",
    "icon": "🏎️",
    "category": "Engineering",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "A battery-powered run that has to stop on a revealed distance.",
    "overview": "Build and calibrate an electric vehicle for target distance and time, with a bottle-pushing task in the draft format.",
    "rules": [
      "Electric propulsion, kinematics, and calibration.",
      "Tune travel time and stopping position.",
      "Draft format includes pushing a weighted bottle toward a target line."
    ],
    "tips": "Record repeated runs and analyze stopping error. Verify final dimensions and task requirements before building.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Electric_Vehicle"
  },
  {
    "id": "2027-engineering-cad",
    "name": "Engineering CAD",
    "type": "lab",
    "icon": "📐",
    "category": "Inquiry",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Transform engineering drawings into a 3D assembly.",
    "overview": "Work with a partner in Onshape to model parts and assemble them from supplied drawings.",
    "rules": [
      "Interpret engineering drawings and dimensions.",
      "Create constrained sketches and parts in Onshape.",
      "Coordinate with a partner to assemble the modeled parts."
    ],
    "tips": "Practice sketch constraints and assemblies. Draft part-count requirements conflict, so confirm the final numbers.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Engineering_CAD"
  },
  {
    "id": "2027-experimental-design",
    "name": "Experimental Design",
    "type": "lab",
    "icon": "🧪",
    "category": "Inquiry",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Ask a question. Test it. Defend the evidence.",
    "overview": "Design, conduct, analyze, and report an on-site experiment using supplied materials.",
    "rules": [
      "Design an on-site investigation using supplied materials.",
      "Collect real data through multiple trials.",
      "Analyze results and produce a rubric-based written report."
    ],
    "tips": "Practice dividing responsibilities, collecting multiple trials, and writing a clear, rubric-based report.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Experimental_Design"
  },
  {
    "id": "2027-forensics",
    "name": "Forensics",
    "type": "lab",
    "icon": "🔎",
    "category": "Physical science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Let the evidence tell the story.",
    "overview": "Analyze a crime scenario through qualitative tests and evidence interpretation.",
    "rules": [
      "Use qualitative tests to analyze crime-scene evidence.",
      "Interpret chromatography and other laboratory results.",
      "Connect the evidence to a supported conclusion about suspects."
    ],
    "tips": "Practice chromatography and evidence analysis. Keep each mock case’s data together rather than mixing source values.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Forensics"
  },
  {
    "id": "2027-hovercraft",
    "name": "Hovercraft",
    "type": "build",
    "icon": "🛸",
    "category": "Physical science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Float on air. Calibrate for control.",
    "overview": "Build an air-levitated, self-propelled vehicle and tune its travel against target-time and distance objectives.",
    "rules": [
      "Air levitation, thrust, ballast, and motion.",
      "Design a self-propelled hovercraft for a track.",
      "Calibrate travel to target-time and distance objectives."
    ],
    "tips": "Compare lift, thrust, and ballast through repeatable tests and a calibration log.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Hovercraft"
  },
  {
    "id": "2027-mission-possible",
    "name": "Mission Possible",
    "type": "build",
    "icon": "⚙️",
    "category": "Engineering",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Make one action spark the next.",
    "overview": "Design an autonomous chain-reaction device using linked physical and chemical actions.",
    "rules": [
      "Build an autonomous chain of linked actions.",
      "Apply physical and chemical processes to trigger successive tasks.",
      "Document and test the reliability of the complete sequence."
    ],
    "tips": "Test each action independently, then track reliability across complete runs. Confirm final allowed actions.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Mission_Possible"
  },
  {
    "id": "2027-ping-pong-parachute",
    "name": "Ping-Pong Parachute",
    "type": "build",
    "icon": "🪂",
    "category": "Inquiry",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Launch a tiny payload. Make the descent count.",
    "overview": "Use an air-pressure bottle rocket to send a ping-pong ball and parachute aloft.",
    "rules": [
      "Design an air-pressure bottle rocket and parachute.",
      "Analyze aerodynamics, stability, and descent time.",
      "Use launch logs to compare pressure and parachute configurations."
    ],
    "tips": "Log launches and compare parachute designs, stability, and time aloft. Verify final construction and eye-protection rules.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Ping_Pong_Parachute"
  },
  {
    "id": "2027-protein-modeling",
    "name": "Protein Modeling",
    "type": "lab",
    "icon": "🧩",
    "category": "Physical science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Make molecular structure something you can hold.",
    "overview": "Build a physical protein model and use molecular visualization to explain structure and function.",
    "rules": [
      "Protein synthesis, amino acids, and structure-function relationships.",
      "Use molecular visualization to research a designated protein.",
      "Construct and explain a physical protein model."
    ],
    "tips": "The draft assignment is hemagglutinin, PDB 3UBE. Zinc-finger examples teach technique; they are not the assigned protein. Confirm the final structure.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Protein_Modeling"
  },
  {
    "id": "2027-remote-sensing",
    "name": "Remote Sensing",
    "type": "study",
    "icon": "🛰️",
    "category": "Earth & space",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "See Earth differently through satellite data.",
    "overview": "Analyze imagery, sensing instruments, climate processes, and Earth’s energy balance.",
    "rules": [
      "Remote-sensing instruments, physics, and sensor resolution.",
      "Interpret satellite imagery and spatial data.",
      "Connect climate processes with Earth’s energy balance."
    ],
    "tips": "Practice interpreting bands and maps. Confirm allowed calculator and measurement-tool quantities.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Remote_Sensing"
  },
  {
    "id": "2027-rocks-and-minerals",
    "name": "Rocks and Minerals",
    "type": "study",
    "icon": "💎",
    "category": "Earth & space",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Read Earth’s history in every specimen.",
    "overview": "Identify and classify rocks and minerals, linking properties to geological processes and uses.",
    "rules": [
      "Identify and classify rocks and minerals using diagnostic properties.",
      "Connect specimens to geologic processes and Earth history.",
      "Understand resource uses and economic significance."
    ],
    "tips": "Practice identification with multiple properties, not color alone. Verify the current specimen list and calculator allowance.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Rocks_and_Minerals"
  },
  {
    "id": "2027-thermodynamics",
    "name": "Thermodynamics",
    "type": "lab",
    "icon": "🌡️",
    "category": "Physical science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "The physics of heat, on paper and in an insulated box.",
    "overview": "Pair thermodynamics questions with a device task. Detailed draft notes describe a heat collector.",
    "rules": [
      "Conduction, convection, and radiation.",
      "Thermodynamic laws, cycles, efficiency, phases, and gas behavior.",
      "Pair theory with device testing; confirm the heat-collector task against final rules."
    ],
    "tips": "Study conduction, convection, radiation, and thermodynamic laws. Draft sources conflict about the device task; verify before construction.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Thermodynamics"
  },
  {
    "id": "2027-water-quality",
    "name": "Water Quality",
    "type": "lab",
    "icon": "💧",
    "category": "Life science",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Investigate marine ecosystems and estuaries.",
    "overview": "Study aquatic ecology, identify reef organisms, interpret monitoring data, and build a salinometer.",
    "rules": [
      "Marine and estuary ecology and coral-reef organisms.",
      "Interpret water-monitoring measurements and environmental data.",
      "Build and calibrate a salinometer or hydrometer."
    ],
    "tips": "Practice reading water-quality data and calibrating a salinometer. Confirm the final equipment requirements.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Water_Quality"
  },
  {
    "id": "2027-wright-stuff",
    "name": "Wright Stuff",
    "type": "build",
    "icon": "✈️",
    "category": "Engineering",
    "season": "2026–27",
    "status": "Draft reference",
    "shortDesc": "Chase a longer flight with a lighter touch.",
    "overview": "Build, trim, and test a rubber-powered indoor airplane for maximum time aloft.",
    "rules": [
      "Rubber-powered indoor airplane design.",
      "Aerodynamic balance, stability, trimming, and motor performance.",
      "Use flight logs to improve time aloft."
    ],
    "tips": "Log flight performance and adjust one variable at a time. Confirm final measurement-box dimensions.",
    "soincSlug": "events/div-c",
    "wikiSlug": "Wright_Stuff"
  },
  {
    "id": "2027-code-craze",
    "name": "Code Craze",
    "type": "lab",
    "icon": "💻",
    "category": "Featured trial",
    "season": "2026–27",
    "status": "Featured trial",
    "shortDesc": "Timed coding challenges across core computer science.",
    "overview": "Code Craze combines quizzes and coding activities covering topics such as programming, AI, cryptography, and Python. It is listed as a featured trial event on the official 2027 Division C slate.",
    "rules": [
      "Featured trial event: confirm whether your tournament offers Code Craze.",
      "The supplied Drive folder does not contain a Code Craze reference document.",
      "2026–27 team guidance and detailed requirements are coming soon; consult the official resources."
    ],
    "tips": "Use the practice resources linked from Science Olympiad’s trial-events page. Confirm the competition’s current modules and format before preparing.",
    "referenceUrl": "https://www.soinc.org/learn/trial-events",
    "soincSlug": "learn/trial-events",
    "wikiSlug": "Code_Craze"
  }
];
