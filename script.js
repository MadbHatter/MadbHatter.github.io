const ship_names = [
    "Random Effect",
    "Reality Graft",
    "Untidy Intentions",
    "Division by Zero",
    "Mojo Filter",
    "Schroedinger’s Hammer",
    "Shot Noise",
    "Circumstantial Evidence",
    "Guilt by Association",
    "Innocent Until Proven",
    "Juju Eyeball",
    "Full Width Half Maximum",
    "Undocumented Feature",
    "This Is the Picture",
    "Excellent Bird",
    "Just Like a Metaphor",
    "The Most Fabulous Object",
    "Intellectual Interference",
    "Sevenfold",
    "Obscure Reference",
    "Horse of Another Color",
    "Opaque Logic",
    "Spurious Signal",
    "Maniacal Laughter",
    "Gravity’s Angel",
    "Monkeyfinger",
    "Bizarre Lag Phenomena",
    "Catlike Tread",
    "No Sound At All",
    "Secret Ingredient",
    "Formal Complaint",
    "So Minimal As to Be Actually Negative",
    "Artistic License",
    "It's Character Forming",
    "Standard Deviant",
    "Don't Make Me Come Over There",
    "Asymptotic Momentum",
    "The Problem with Inertia",
    "Back By Popular Demand",
    "Continuing Engagement",
    "Causal Loop",
    "Infinite Recursion",
    "Divisible Prime",
    "Even Odds",
    "Irresistible Object",
    "Immovable Force",
    "To The Left",
    "Where There’s Smoke",
    "To Be Continued",
    "Fearful Angel Treading",
    "Agorophile",
    "Four Sigma Event",
    "One Word Dictionary",
    "Unspoken Language",
    "Winging It",
    "Suppressed Evidence",
    "Monotonic Increase",
    "Paradigm Shift (GCU)",
    "Out of Context Problem (GCU)",
    "Momentary Diversion (VFP)",
    "As Advertised (ROU)",
    "Chance Encounter (GCU)",
    "Spinal Clacker (ROU)",
    "Walrus Gumboot (LSV)",
    "Grooving Up Slowly (GCU)",
    "Stranger in the Night (VFP)",
    "No Viable Alternative (ROU)",
    "Five Minutes for Fighting (ROU)",
    "Contrarian in Denial (ROU)",
    "Laugh While You Can (ROU)",
    "Cut Large and Kicked Into Place (GSV)",
    "Truth From Error (GSV)",
    "Necessary, Therefore Possible (LSV)",
    "Simplicity Itself",
    "SL Phlogiston Pump",
    "VFP Distant Early Warning",
    "LSV Orbital Transfer",
    "SL Easy Does It",
    "GSV One Koan Clapping",
    "GCU Keep that Frequency Clear",
    "ROU Repeat Until Done",
    "ROU Pressure Of Grace",
    "LSV Vacuum Sonar",
    "GSV Ad Infinitum",
    "ROU Cordiality Assured",
    "ROU Into the Breach",
    "GSV This End Up",
    "LSV Carry the 4",
    "VFP Velvet Anvil",
    "GCU Point of Entry",
    "GSV Octopus's Garden",
    "ROU You Did NOT Just Say that",
    "GCU Through The Looking Glass",
    "ROU Contrarian",
    "ROU Not a Contrarian",
    "GSV A Lot Of Night Music",
    "GSV Work In Progress",
    "ROU A Kind Word And A Two-by-Four",
    "LSV Thick As A Brick",
    "ROU Final Word",
    "GCU Look Who Just Turned Up",
    "ROU They Couldn't Hit An Elephant At This Dist-",
    "GCU The Woman Named Tomorrow",
    "Superlifter When In Doubt, Use More",
    "VFP Once is Enough",
    "GSV Pace of Nature",
    "GCU Playing Dice With The Universe",
    "LSV Action In Rehearsal",
    "GSV Fractally Weird",
    "GSV Do it My Way",
    "Superlifter Universal Infrastructure",
    "ROU Dirty Only if Done Right",
    "GSV Who’s Your Daddy?",
    "Move to strike",
    "Malice Aforethought",
    "Hostile Witness",
    "Premeditating",
    "I have Half a mind and Where's the other half?",
    "Checks in the Mail",
    "Xeno's Arrow",
    "Alternate Route",
    "Add All",
    "Post-Grindstone Nose",
    "ROU Anger Management",
    "ROU Complaint Department",
    "ROU Custodial Services",
    "ROU Irreconcilable Difference",
    "ROU Objection Overruled",
    "GSV Face to the Sun",
    "VFP Maybe Its Time",
    "ROU Screaming in Space",
    "VFP Identity Crisis",
    "ROU End-Of-Lifer",
    "Just Checking",
    "Metastable",
    "Cartoon Physics",
    "Everything I say Is A Lie",
    "Still Life With Dyson Sphere",
    "Do Not Know, So Cannot Say",
    "Reciprocity",
    "Degree of Freedom",
    "Agent of Entropy",
    "A Fly's Footfall",
    "Distinctly Heard",
    "Signal To Noise",
    "The Only Thing We Have to Fear",
    "Ask Not",
    "Waiting for the Rhyme",
    "Tangency",
    "Final Argument",
    "Final Argument of Kings",
    "Ultima Ratio Regum",
    "Oderint dum Metuant",
    "Let them hate so long as they fear",
    "If You’re Feeling Sinister",
    "And you thought THAT was bad.",
    "Its not me you should be worried about.",
    "You will be sorted",
    "Pareto was wrong",
    "Drake Equation",
    "A sufficiently advanced technology.",
    "I'm just getting started",
    "Statistics Maker",
    "Shit Happens",
    "Candygram...",
    "Bigger Frog",
    "Error of your Ways",
    "How many was That?",
    "Attempting the Impossible",
    "Reconnaissance Without End",
    "A variation of Sadness",
    "After the water, the Clouds",
    "The Art of Conversation",
    "The Cultivation of Ideas",
    "Figure Brooding on Madness",
    "The Garment of Adventure",
    "The Good Example",
    "The Muscles of the Sky",
    "The Ordeal of Sleep",
    "This is not an Apple",
    "The Treachery of images",
    "GCU - Factoring the Prime Directive.",
    "ROU Nothing Up My Sleeve",
    "LSV 'My Other Vehicle's A GSV'",
    "VFP 'It Was Like That When I Got Here'",
    "ROU Nasty Brutish and Short",
    "ROU You Look like a Nail",
    "GSV Sufficiently Long Lever",
    "ROU General Protection Fault",
    "VFP Collateral Damage",
    "ROU Don't Say You Weren't Warned",
    "GSV pU yaW sihT",
    "ROU Candygram for Mongo",
    "GCU Tab A",
    "GSV Slot B",
    "GCU Are We There Yet?",
    "GSV Another Way to Travel",
    "ROU 'Don't Touch That Button ...'",
    "LOU 'If I Could Do It Again, I Would Do It All Over You'",
    "GSV 'Pedal To The Metal'",
    "ROU Another One Bites The Dust",
    "ROU The Means Justify The End",
    "GCU Public Nuisance",
    "GSV Not Wanted On Voyage",
    "ROU The Continuation Of Diplomacy",
    "GCU Invisible Idiot",
    "ROU You Go First",
    "ROU Deadlier Than The Mail",
    "ROU All Right, This Time You Hold That End",
    "ROU - I've Added You to my Kill-File.",
    "GSV - Forty Two; and Counting.",
    "GCU Oops.",
    "GSV I'm Sure I had It Around Here Somewhere",
    "GCU Not In My Back Yard",
    "GSV Pocket Change",
    "GSV Shopping List",
    "GSV Full House",
    "ROU Flash in the Pan",
    "ROU Extreme Prejudice",
    "ROU Rainbow Warrior",
    "ROU War Office, Wanna Fight?",
    "ROU Make My Day",
    "ROU He Went Mad, So I Shot Him",
    "ROU One for Sorrow",
    "ROU CAM Bombs Are Us",
    "ROU Let Us Prey",
    "ROU The Weather",
    "VFP 'Look, I'm a Plowshare!'",
    "ROU They looked hostile to me...",
    "GCU Happy Birthday!",
    "GSV Would you like fries with that?",
    "GSV Don't Let The Name Fool You",
    "ROU No Rest for the Wicked",
    "ROU Peace Sells, But It's Really Too Damn Expensive",
    "ROU Sorry, My Trigger Finger Slipped",
    "GSV Damn, I Am Bloated",
    "GSV Parasitical Haven",
    "GCU Funny Meeting You Here",
    "GCU Come on, Everybody's Doing It",
    "Consider Phlebas",
    "GCU Nervous Energy",
    "GCU Prosthetic Conscience",
    "GSV The Ends Of Invention (ex-Culture)",
    "GSV Eschatologist (temporary name)",
    "GSV Irregular Apocalyse",
    "GSV No More Mr Nice Guy",
    "GSV Determinist",
    "GSV Bora Horza Gobuchul",
    "LSV Profit Margin",
    "ROU Trade Surplus",
    "ROU Revisionist",
    "The Player of Games",
    "Clipper Screw Loose",
    "GCU Flexible Demeanour",
    "GCU Just Read The Instructions",
    "GCU Of Course I Still Love You",
    "GOU Limiting Factor",
    "GSV Cargo Cult",
    "GSV Little Rascal",
    "GSV So Much For Subtlety",
    "GSV Unfortunate Conflict Of Evidence",
    "GSV Youthful Indiscretion",
    "LOU Gunboat Diplomat",
    "dROU Zealot",
    "Superlifter Kiss My Ass",
    "Superlifter Prime Mover",
    "Use of Weapons",
    "GCU? Just Testing",
    "dROU Xenophobe",
    "GCU Very Little Gravitas Indeed",
    "GSV What Are The Civilian Applications?",
    "GSV Congenital Optimist",
    "GSV Size Isn't Everything",
    "GCU Sweet and Full of Grace",
    "GCU Different Tan",
    "GCU Fate Amenable To Change",
    "GCU Gray Area",
    "GCU It's Character Forming",
    "GCU Jaundiced Outlook",
    "GCU Problem Child",
    "GCU Reasonable Excuse",
    "GCU Recent Convert",
    "GCU Tactical Grace",
    "GCU Unacceptable Behaviour",
    "GCV Steely Glint",
    "Highpoint",
    "Shoot Them Later",
    "LOU Attitude Adjuster",
    "ROU Killing Time",
    "dROU Frank Exchange Of Views",
    "GSV Anticipation Of A New Lover's Arrival, The",
    "GSV Death and Gravity",
    "GSV Ethics Gradient",
    "GSV Honest Mistake",
    "GSV Limivourous",
    "GSV No Fixed Abode",
    "GSV Quietly Confident",
    "GSV Sleeper Service",
    "GSV Uninvited Guest",
    "GSV Use Psychology",
    "GSV What Is The Answer and Why?",
    "GSV Wisdom Like Silence",
    "GSV Yawning Angel",
    "GSV Zero Gravitas",
    "LSV Misophist",
    "LSV Serious Callers Only",
    "MSV Not Invented Here",
    "Appeal To Reason",
    "Break Even",
    "Long View",
    "Peace Makes Plenty",
    "Sober Counsel",
    "Within Reason",
    "Kiss the Blade",
    "Frightspear",
    "Furious Purpose",
    "Riptalon",
    "Wingclipper",
    "SacSlicer II",
    "Xenoclast",
    "Full Refund",
    "Superlifter Charitable View",
    "Cruise Ship Just Passing Through",
    "Added Value",
    "I Blame Your Mother",
    "I Blame My Mother",
    "Heavy Messing",
    "GSV Bad for Business",
    "GCU Arbitrary",
    "GCU Cantankerous",
    "GCU Only Slightly Bent",
    "GCU I Thought He Was With You",
    "GCU Space Monster",
    "GCU A Series Of Unlikely Explanations",
    "GCU Big Sexy Beast",
    "GCU Never Talk To Strangers",
    "GCU Funny, It Worked Last Time...",
    "GCU Boo!",
    "GCU Ultimate Ship The Second",
    "GCU It'll Be Over By Christmas",
    "A Ship With A View",
    "Ablation",
    "Arrested Development",
    "Credibility Problem",
    "Dramatic Exit",
    "Excuses And Accusations",
    "God Told Me To Do It",
    "Halation Effect",
    "Happy Idiot Talk",
    "Helpless In The Face Of Your Beauty",
    "Heresiarch",
    "Just Another Victim Of The Ambient Morality",
    "Minority Report",
    "Not Wanted On Voyage",
    "Perfidy",
    "Sacrificial Victim",
    "Stranger Here Myself",
    "Synchronize Your Dogmas",
    "Thank you And Goodnight",
    "The Precise Nature Of The Catastrophe",
    "Unwitting Accomplice",
    "Undesirable Alien",
    "Well I Was In The Neighbourhood",
    "You Would If You Really Loved Me",
    "You'll Thank Me Later",
    "From Look to Windward",
    "Winter Storm",
    "Piety",
    "Nuisance Value ROU",
    "Vulgarian Superlifter",
    "Sanctioned Parts List GSV",
    "Resistance Is Character-Forming VFP",
    "All Through With This Niceness And Negotiation",
    "Stuff OU",
    "Someone Else's Problem",
    "Lacking That Small Match Temperament",
    "Poke It With A Stick GCU",
    "I Said, I've Got A Big Stick OU",
    "Hand Me The Gun And Ask Me Again",
    "But Who's Counting?",
    "Germane Riposte",
    "We Haven't Met But You're A Great Fan Of Mine",
    "All The Same, I Saw It First",
    "Ravished By The Sheer Implausibility Of That Last Statement",
    "Zero Credibility",
    "Charming But Irrational",
    "Demented But Determined",
    "You May Not Be The Coolest Person Here",
    "Lucid Nonsense",
    "Awkward Customer",
    "Thorough But ... Unreliable",
    "Advanced Case Of Chronic Patheticism",
    "Another Fine Product From The Nonsense Factory",
    "Conventional Wisdom",
    "In One Ear",
    "Fine Till You Came Along",
    "I Blame The Parents",
    "Inappropriate Response",
    "A Momentary Lapse Of Sanity",
    "Lapsed Pacifist",
    "Reformed Nice Guy",
    "Pride Comes Before A Fall",
    "Injury Time",
    "Now Look What You've Made Me Do",
    "Kiss This Then",
    "Grey Area",
    "Meatfucker",
    "Soulhaven",
    "Lasting Damage GSV",
    "Lasting Damage I GSV",
    "Lasting Damage II GSV",
    "Experiencing A Significant Gravitas Shortfall GSV"
];

const colorData = [
    {
        stellarisCode: ['W'],
        color: 'White',
        vanillaUse: 'Diplomatic Attitudes',
        code: '{W}',
        rgb: 'rgb(255, 255, 255)'
    },
    {
        stellarisCode: ['T'],
        color: 'Light Grey',
        vanillaUse: 'Standard color of all text',
        code: '{LGrey}',
        rgb: 'rgb(238, 238, 238)'
    },
    {
        stellarisCode: ['g'],
        color: 'Dark Grey',
        vanillaUse: 'Disabled / inactive',
        code: '{DGrey}',
        rgb: 'rgb(128, 128, 128)'
    },
    {
        stellarisCode: ['L'],
        color: 'Brown / Kaki',
        vanillaUse: 'Lore, back story, role playing elements',
        code: '{B}',
        rgb: 'rgb(195, 176, 145)'
    },
    {
        stellarisCode: ['P'],
        color: 'Light Dirty Pink',
        vanillaUse: 'Highlighting of Aggressive text in descriptions and event text',
        code: '{LDP}',
        rgb: 'rgb(225, 110, 110)'
    },
    {
        stellarisCode: ['R'],
        color: 'Red',
        vanillaUse: 'Negative modifiers',
        code: '{R}',
        rgb: 'rgb(252, 86, 70)'
    },
    {
        stellarisCode: ['S'],
        color: 'Dark Orange',
        vanillaUse: 'Subtle highlighted text',
        code: '{DO}',
        rgb: 'rgb(228, 156, 42)'
    },
    {
        stellarisCode: ['H', 'K'],
        color: 'Mango / Orange',
        vanillaUse: 'Highlighted text',
        code: '{O}',
        rgb: 'rgb(251, 170, 41)'
    },
    {
        stellarisCode: ['Y', 'I'],
        color: 'Yellow',
        vanillaUse: 'Sub-optimal or Neutral modifiers',
        code: '{Y}',
        rgb: 'rgb(247, 252, 52)'
    },
    {
        stellarisCode: ['G'],
        color: 'Green',
        vanillaUse: 'Positive modifiers',
        code: '{G}',
        rgb: 'rgb(41, 225, 38)'
    },
    {
        stellarisCode: ['V'],
        color: 'Dark Green',
        vanillaUse: 'Event text',
        code: '{DG}',
        rgb: 'rgb(76, 138, 113)'
    },
    {
        stellarisCode: ['E'],
        color: 'Teal',
        vanillaUse: 'Large chunks of text',
        code: '{T}',
        rgb: 'rgb(135, 255, 207)'
    },
    {
        stellarisCode: ['C'],
        color: 'Cyan',
        vanillaUse: 'Concept text that generates another tooltip',
        code: '{C}',
        rgb: 'rgb(33, 232, 208)'
    },
    {
        stellarisCode: ['B'],
        color: 'Cyan-Blue',
        vanillaUse: 'Event effects that affect pops',
        code: '{CB}',
        rgb: 'rgb(51, 167, 255)'
    },
    {
        stellarisCode: ['M'],
        color: 'Purple',
        vanillaUse: 'Rare technologies',
        code: '{P}',
        rgb: 'rgb(163, 53, 238)'
    },
    {
        stellarisCode: ['_'],
        color: 'Magenta',
        vanillaUse: 'Placeholders',
        code: '{M}',
        rgb: 'rgb(255, 0, 255)'
    },
    {
        stellarisCode: ['c'],
        color: 'Blue-Green',
        vanillaUse: 'Leader trait',
        code: '{BG}',
        rgb: 'rgb(60, 208, 146)'
    },
    {
        stellarisCode: ['v'],
        color: 'Faded Green',
        vanillaUse: 'Veteran leader trait',
        code: '{FG}',
        rgb: 'rgb(139, 174, 162)'
    },
    {
        stellarisCode: ['d'],
        color: 'Tan',
        vanillaUse: 'Destiny trait',
        code: '{T}',
        rgb: 'rgb(255, 221, 122)'
    },
    {
        stellarisCode: ['r'],
        color: 'Light Purple',
        vanillaUse: 'Renowned',
        code: '{LP}',
        rgb: 'rgb(163, 130, 255)'
    },
    {
        stellarisCode: ['l'],
        color: 'Light Green',
        vanillaUse: 'Legendary',
        code: '{LG}',
        rgb: 'rgb(178, 236, 104)'
    },
    {
        stellarisCode: ['!'],
        color: 'Default',
        vanillaUse: 'Return to color before last color change',
        code: '{RESET}',
        rgb: ''
    }
];


const MAX_LENGTH_NAME = 32;
const DC1_CHAR = '';
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const previewEl = document.getElementById("preview");
const tableContainer = document.getElementById("table-content");
const colorButtonsContainer = document.getElementById("color-buttons");
const lengthWarningEl = document.getElementById("length-warning");
const addResetCheckbox = document.getElementById("add-reset");

const generateNameButton = document.getElementById("generate-name");
const copyToClipboardButton = document.getElementById("copy-to-clipboard");
const toastTrigger = document.getElementById("liveToastBtn")
const toastLiveExample = document.getElementById("liveToast")
const toast = new bootstrap.Toast(toastLiveExample)

// Utilize modern JavaScript features for cleaner code
function createElement(type, attributes, ...children) {
    const el = document.createElement(type);
    for (let attr in attributes) {
        el[attr] = attributes[attr];
    }
    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else el.appendChild(child);
    });
    return el;
}

function addTable() {
    const headers = ['Stellaris Code (do not use)', 'Color', 'Vanilla Use', 'Code', 'Color Code'];
    const table = createElement('table', { className: 'table table-sm' },
        createElement('thead', {},
            createElement('tr', {}, ...headers.map(header => createElement('th', {}, header)))
        ),
        createElement('tbody', {}, ...colorData.map(data =>
            createElement('tr', {}, ...['stellarisCode', 'color', 'vanillaUse', 'code', 'rgb'].map(property =>
                createElement('td', {}, property === 'color' ?
                    createElement('span', { textContent: data[property], style: `color: ${data.rgb}` }) :
                    property === 'stellarisCode' ?
                        data[property].join(' / ') :
                        data[property])
            ))
        ))
    );
    tableContainer.appendChild(table);
}

function addButton(color) {
    const button = createElement('button', {
        type: 'button',
        className: 'btn btn-outline-primary',
        textContent: color.color,
        style: `color: ${color.rgb}`,
        onclick: () => insertCodeAtCursor(color.code)
    });
    colorButtonsContainer.appendChild(button);
}

function insertCodeAtCursor(code) {
    const { selectionStart } = inputEl;
    inputEl.value = inputEl.value.slice(0, selectionStart) + code + inputEl.value.slice(selectionStart);
    handleInputEvent();
}

function replaceWithControlChar(input) {
    return colorData.reduce((outputText, data) => {
        let modifiedText = outputText;
        data.stellarisCode.forEach(code => {
            modifiedText = modifiedText.replaceAll(data.code, DC1_CHAR + code);
        });
        return modifiedText;
    }, input);
}

function updatePreview(input) {
    previewEl.innerHTML = colorData.reduce((acc, data) => {
        let modifiedAcc = acc;
        data.stellarisCode.forEach(code => {
            modifiedAcc = modifiedAcc.replaceAll(DC1_CHAR + code, `<span style='color: ${data.rgb}'>`);
        });
        return modifiedAcc;
    }, input) + '</span>';
}

function validateLength() {
    lengthWarningEl.textContent = outputEl.value.length > MAX_LENGTH_NAME ?
        `Name has ${outputEl.value.length} Characters. Max length is ${MAX_LENGTH_NAME} characters. Output is getting cut off.` : '';
}

function handleInputEvent() {
    let currentValue = inputEl.value + (addResetCheckbox.checked ? colorData[colorData.length - 1].code : "");
    outputEl.value = replaceWithControlChar(currentValue);
    updatePreview(outputEl.value.slice(0, 32));
    validateLength();
}

inputEl.addEventListener("input", handleInputEvent);
addResetCheckbox.addEventListener("click", handleInputEvent);
generateNameButton.addEventListener("click", generateName);
copyToClipboardButton.addEventListener("click", copyToClipboard);

function copyToClipboard() {
    navigator.clipboard.writeText(outputEl.value).then(() => {
        document.getElementById("toast-text").textContent = "Copied to clipboard!";
        toast.show();
    }, () => {
        document.getElementById("toast-text").textContent = "Could not copy to clipboard :(";
        toast.show();
    });
}

let shortNamesList = ship_names.filter(name => !(name.length > MAX_LENGTH_NAME));
let newList = shortNamesList.concat([]);

function generateName() {
    const randomIndex = Math.floor(Math.random() * newList.length);
    const name = newList[randomIndex];
    newList = newList.filter(item => item !== name);
    if (newList.length === 0) newList = ship_names.concat([]);
    generateNameButton.textContent = `Generate Name (${newList.length}/${shortNamesList.length})`
    inputEl.value = name;
    handleInputEvent();
}

function init() {
    addTable();
    colorData.forEach(addButton);
    handleInputEvent(); // To set initial state   
}

init();
