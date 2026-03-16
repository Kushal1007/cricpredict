export interface IPLTeam {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  homeGround: string;
  city: string;
  coach: string;
  captain: string;
  titles: number;
  titleYears: number[];
  players: IPLPlayer[];
  achievements: string[];
}

export interface IPLPlayer {
  name: string;
  role: string;
  nationality: string;
  battingStyle?: string;
  bowlingStyle?: string;
  isStar?: boolean;
}

export interface IPLMatch {
  id: string;
  matchNumber: number;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  status: 'upcoming' | 'live' | 'completed';
  score1?: string;
  score2?: string;
  result?: string;
}

// IPL 2026 squads — updated post-auction (Dec 2025) + trades
export const IPL_TEAMS: IPLTeam[] = [
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    emoji: '💙',
    primaryColor: 'neon-blue',
    secondaryColor: 'neon-orange',
    homeGround: 'Wankhede Stadium',
    city: 'Mumbai',
    coach: 'Mahela Jayawardene',
    captain: 'Hardik Pandya',
    titles: 5,
    titleYears: [2013, 2015, 2017, 2019, 2020],
    achievements: [
      '5× IPL Champions — most titles in history',
      'Jasprit Bumrah — India\'s premier fast bowler',
      'Suryakumar Yadav — ICC Men\'s T20 No.1 batter',
      'Sherfane Rutherford & Shardul Thakur traded in for 2026',
      'Quinton de Kock adds power at the top',
    ],
    players: [
      { name: 'Hardik Pandya', role: 'All-rounder', nationality: 'India', isStar: true },
      { name: 'Jasprit Bumrah', role: 'Bowler', nationality: 'India', isStar: true },
      { name: 'Suryakumar Yadav', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Rohit Sharma', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Tilak Varma', role: 'Batsman', nationality: 'India' },
      { name: 'Trent Boult', role: 'Bowler', nationality: 'New Zealand' },
      { name: 'Ryan Rickelton', role: 'Wicketkeeper-Batsman', nationality: 'South Africa' },
      { name: 'Will Jacks', role: 'All-rounder', nationality: 'England' },
      { name: 'Mitchell Santner', role: 'All-rounder', nationality: 'New Zealand' },
      { name: 'Deepak Chahar', role: 'Bowler', nationality: 'India' },
      { name: 'Naman Dhir', role: 'All-rounder', nationality: 'India' },
      { name: 'Robin Minz', role: 'Wicketkeeper-Batsman', nationality: 'India' },
      { name: 'Sherfane Rutherford', role: 'Batsman', nationality: 'West Indies' },
      { name: 'Shardul Thakur', role: 'All-rounder', nationality: 'India' },
      { name: 'Quinton de Kock', role: 'Wicketkeeper-Batsman', nationality: 'South Africa' },
      { name: 'Corbin Bosch', role: 'All-rounder', nationality: 'South Africa' },
    ],
  },
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    emoji: '🦁',
    primaryColor: 'neon-orange',
    secondaryColor: 'neon-green',
    homeGround: 'MA Chidambaram Stadium',
    city: 'Chennai',
    coach: 'Stephen Fleming',
    captain: 'Ruturaj Gaikwad',
    titles: 5,
    titleYears: [2010, 2011, 2018, 2021, 2023],
    achievements: [
      '5× IPL Champions',
      'Ruturaj Gaikwad leads CSK in 2026',
      'MS Dhoni remains in squad as wicketkeeper-batsman',
      'Sanju Samson traded in from Rajasthan Royals',
      'Kartik Sharma & Prashant Veer — joint-costliest uncapped buys (₹14.20 Cr each)',
    ],
    players: [
      { name: 'Ruturaj Gaikwad', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'MS Dhoni', role: 'Wicketkeeper-Batsman', nationality: 'India', isStar: true },
      { name: 'Sanju Samson', role: 'Wicketkeeper-Batsman', nationality: 'India', isStar: true },
      { name: 'Shivam Dube', role: 'All-rounder', nationality: 'India', isStar: true },
      { name: 'Ayush Mhatre', role: 'Batsman', nationality: 'India' },
      { name: 'Dewald Brevis', role: 'Batsman', nationality: 'South Africa' },
      { name: 'Noor Ahmad', role: 'Bowler', nationality: 'Afghanistan' },
      { name: 'Khaleel Ahmed', role: 'Bowler', nationality: 'India' },
      { name: 'Anshul Kamboj', role: 'Bowler', nationality: 'India' },
      { name: 'Nathan Ellis', role: 'Bowler', nationality: 'Australia' },
      { name: 'Jamie Overton', role: 'All-rounder', nationality: 'England' },
      { name: 'Kartik Sharma', role: 'All-rounder', nationality: 'India' },
      { name: 'Prashant Veer', role: 'Batsman', nationality: 'India' },
      { name: 'Rahul Chahar', role: 'Bowler', nationality: 'India' },
      { name: 'Matt Henry', role: 'Bowler', nationality: 'New Zealand' },
    ],
  },
  {
    id: 'rcb',
    name: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    emoji: '🔴',
    primaryColor: 'destructive',
    secondaryColor: 'neon-orange',
    homeGround: 'M. Chinnaswamy Stadium',
    city: 'Bengaluru',
    coach: 'Andy Flower',
    captain: 'Rajat Patidar',
    titles: 2,
    titleYears: [2024, 2025],
    achievements: [
      '2025 IPL Champions — back-to-back titles!',
      'Rajat Patidar leads RCB as defending champions',
      'Virat Kohli — first player to score 1000 runs in a single IPL season',
      'Venkatesh Iyer added for extra batting depth',
      'Jacob Bethell — exciting England all-rounder in squad',
    ],
    players: [
      { name: 'Virat Kohli', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Rajat Patidar', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Phil Salt', role: 'Wicketkeeper-Batsman', nationality: 'England', isStar: true },
      { name: 'Josh Hazlewood', role: 'Bowler', nationality: 'Australia', isStar: true },
      { name: 'Tim David', role: 'Batsman', nationality: 'Singapore' },
      { name: 'Jitesh Sharma', role: 'Wicketkeeper-Batsman', nationality: 'India' },
      { name: 'Krunal Pandya', role: 'All-rounder', nationality: 'India' },
      { name: 'Yash Dayal', role: 'Bowler', nationality: 'India' },
      { name: 'Bhuvneshwar Kumar', role: 'Bowler', nationality: 'India' },
      { name: 'Romario Shepherd', role: 'All-rounder', nationality: 'West Indies' },
      { name: 'Nuwan Thushara', role: 'Bowler', nationality: 'Sri Lanka' },
      { name: 'Devdutt Padikkal', role: 'Batsman', nationality: 'India' },
      { name: 'Jacob Bethell', role: 'All-rounder', nationality: 'England' },
      { name: 'Venkatesh Iyer', role: 'All-rounder', nationality: 'India' },
      { name: 'Suyash Sharma', role: 'Bowler', nationality: 'India' },
    ],
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    emoji: '💜',
    primaryColor: 'secondary',
    secondaryColor: 'neon-orange',
    homeGround: 'Eden Gardens',
    city: 'Kolkata',
    coach: 'Chandrakant Pandit',
    captain: 'Ajinkya Rahane',
    titles: 3,
    titleYears: [2012, 2014, 2024],
    achievements: [
      '3× IPL Champions — latest title in 2024',
      'Cameron Green — most expensive overseas buy (₹25.20 Cr)',
      'Matheesha Pathirana joins as premier death bowler (₹18 Cr)',
      'Rachin Ravindra adds flair at the top',
      'Sunil Narine & Varun Chakravarthy — spin twins',
    ],
    players: [
      { name: 'Ajinkya Rahane', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Sunil Narine', role: 'All-rounder', nationality: 'West Indies', isStar: true },
      { name: 'Cameron Green', role: 'All-rounder', nationality: 'Australia', isStar: true },
      { name: 'Matheesha Pathirana', role: 'Bowler', nationality: 'Sri Lanka', isStar: true },
      { name: 'Rinku Singh', role: 'Batsman', nationality: 'India' },
      { name: 'Varun Chakravarthy', role: 'Bowler', nationality: 'India' },
      { name: 'Rachin Ravindra', role: 'Batsman', nationality: 'New Zealand' },
      { name: 'Angkrish Raghuvanshi', role: 'Batsman', nationality: 'India' },
      { name: 'Harshit Rana', role: 'Bowler', nationality: 'India' },
      { name: 'Rovman Powell', role: 'Batsman', nationality: 'West Indies' },
      { name: 'Ramandeep Singh', role: 'All-rounder', nationality: 'India' },
      { name: 'Mustafizur Rahman', role: 'Bowler', nationality: 'Bangladesh' },
      { name: 'Finn Allen', role: 'Batsman', nationality: 'New Zealand' },
      { name: 'Manish Pandey', role: 'Batsman', nationality: 'India' },
      { name: 'Umran Malik', role: 'Bowler', nationality: 'India' },
    ],
  },
  {
    id: 'dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    emoji: '🔵',
    primaryColor: 'neon-blue',
    secondaryColor: 'destructive',
    homeGround: 'Arun Jaitley Stadium',
    city: 'Delhi',
    coach: 'Hemang Badani',
    captain: 'Axar Patel',
    titles: 0,
    titleYears: [],
    achievements: [
      'Runners-up 2020',
      'Axar Patel leads DC as captain in 2026',
      'Auqib Nabi Dar — ₹8.40 Cr uncapped talent buy',
      'Ben Duckett & Pathum Nissanka bolster batting lineup',
      'David Miller adds explosive finishing power',
    ],
    players: [
      { name: 'Axar Patel', role: 'All-rounder', nationality: 'India', isStar: true },
      { name: 'KL Rahul', role: 'Wicketkeeper-Batsman', nationality: 'India', isStar: true },
      { name: 'Mitchell Starc', role: 'Bowler', nationality: 'Australia', isStar: true },
      { name: 'Kuldeep Yadav', role: 'Bowler', nationality: 'India', isStar: true },
      { name: 'Tristan Stubbs', role: 'Batsman', nationality: 'South Africa' },
      { name: 'Ben Duckett', role: 'Batsman', nationality: 'England' },
      { name: 'Pathum Nissanka', role: 'Batsman', nationality: 'Sri Lanka' },
      { name: 'David Miller', role: 'Batsman', nationality: 'South Africa' },
      { name: 'Karun Nair', role: 'Batsman', nationality: 'India' },
      { name: 'Abishek Porel', role: 'Wicketkeeper-Batsman', nationality: 'India' },
      { name: 'Sameer Rizvi', role: 'Batsman', nationality: 'India' },
      { name: 'Ashutosh Sharma', role: 'All-rounder', nationality: 'India' },
      { name: 'Mukesh Kumar', role: 'Bowler', nationality: 'India' },
      { name: 'Dushmanta Chameera', role: 'Bowler', nationality: 'Sri Lanka' },
      { name: 'T. Natarajan', role: 'Bowler', nationality: 'India' },
    ],
  },
  {
    id: 'srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    emoji: '🔶',
    primaryColor: 'neon-orange',
    secondaryColor: 'destructive',
    homeGround: 'Rajiv Gandhi International Stadium',
    city: 'Hyderabad',
    coach: 'Daniel Vettori',
    captain: 'Pat Cummins',
    titles: 1,
    titleYears: [2016],
    achievements: [
      '2016 IPL Champions',
      'IPL 2024 Runners-up under Pat Cummins',
      'Liam Livingstone joins for ₹13 Cr — big-hitting all-rounder',
      'Heinrich Klaasen & Travis Head remain the batting core',
      'Mohammed Shami traded to LSG for 2026',
    ],
    players: [
      { name: 'Pat Cummins', role: 'Bowler', nationality: 'Australia', isStar: true },
      { name: 'Travis Head', role: 'Batsman', nationality: 'Australia', isStar: true },
      { name: 'Heinrich Klaasen', role: 'Wicketkeeper-Batsman', nationality: 'South Africa', isStar: true },
      { name: 'Liam Livingstone', role: 'All-rounder', nationality: 'England', isStar: true },
      { name: 'Abhishek Sharma', role: 'All-rounder', nationality: 'India' },
      { name: 'Nitish Kumar Reddy', role: 'All-rounder', nationality: 'India' },
      { name: 'Ishan Kishan', role: 'Wicketkeeper-Batsman', nationality: 'India' },
      { name: 'Harshal Patel', role: 'Bowler', nationality: 'India' },
      { name: 'Kamindu Mendis', role: 'All-rounder', nationality: 'Sri Lanka' },
      { name: 'Brydon Carse', role: 'All-rounder', nationality: 'England' },
      { name: 'Zeeshan Ansari', role: 'Bowler', nationality: 'India' },
      { name: 'Jaydev Unadkat', role: 'Bowler', nationality: 'India' },
      { name: 'Harsh Dubey', role: 'Bowler', nationality: 'India' },
      { name: 'Aniket Verma', role: 'Batsman', nationality: 'India' },
      { name: 'Jack Edwards', role: 'Bowler', nationality: 'Australia' },
    ],
  },
  {
    id: 'rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    emoji: '💗',
    primaryColor: 'destructive',
    secondaryColor: 'neon-blue',
    homeGround: 'Sawai Mansingh Stadium',
    city: 'Jaipur',
    coach: 'Rahul Dravid',
    captain: 'Riyan Parag',
    titles: 1,
    titleYears: [2008],
    achievements: [
      'Inaugural IPL Champions 2008',
      'Riyan Parag leads RR as captain in 2026',
      'Ravindra Jadeja & Sam Curran traded in from CSK',
      'Vaibhav Suryavanshi — youngest talent (15 yrs) in IPL 2026',
      'Ravi Bishnoi joins for ₹7.20 Cr to strengthen spin attack',
    ],
    players: [
      { name: 'Riyan Parag', role: 'All-rounder', nationality: 'India', isStar: true },
      { name: 'Yashasvi Jaiswal', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Jofra Archer', role: 'Bowler', nationality: 'England', isStar: true },
      { name: 'Ravindra Jadeja', role: 'All-rounder', nationality: 'India', isStar: true },
      { name: 'Sam Curran', role: 'All-rounder', nationality: 'England' },
      { name: 'Dhruv Jurel', role: 'Wicketkeeper-Batsman', nationality: 'India' },
      { name: 'Shimron Hetmyer', role: 'Batsman', nationality: 'West Indies' },
      { name: 'Vaibhav Suryavanshi', role: 'Batsman', nationality: 'India' },
      { name: 'Ravi Bishnoi', role: 'Bowler', nationality: 'India' },
      { name: 'Tushar Deshpande', role: 'Bowler', nationality: 'India' },
      { name: 'Kwena Maphaka', role: 'Bowler', nationality: 'South Africa' },
      { name: 'Shubham Dubey', role: 'Batsman', nationality: 'India' },
      { name: 'Nandre Burger', role: 'Bowler', nationality: 'South Africa' },
      { name: 'Yudhvir Singh Charak', role: 'Bowler', nationality: 'India' },
      { name: 'Adam Milne', role: 'Bowler', nationality: 'New Zealand' },
    ],
  },
  {
    id: 'pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    emoji: '🔴',
    primaryColor: 'destructive',
    secondaryColor: 'neon-orange',
    homeGround: 'PCA Stadium, New Chandigarh',
    city: 'Mullanpur',
    coach: 'Ricky Ponting',
    captain: 'Shreyas Iyer',
    titles: 0,
    titleYears: [],
    achievements: [
      'Runners-up 2014',
      'Shreyas Iyer & Ricky Ponting reunion in 2026',
      'Arshdeep Singh — India\'s premier T20 death bowler',
      'Home fixtures split between Mullanpur & Dharamsala',
      'Mitchell Owen — explosive new overseas addition',
    ],
    players: [
      { name: 'Shreyas Iyer', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Arshdeep Singh', role: 'Bowler', nationality: 'India', isStar: true },
      { name: 'Marcus Stoinis', role: 'All-rounder', nationality: 'Australia', isStar: true },
      { name: 'Yuzvendra Chahal', role: 'Bowler', nationality: 'India', isStar: true },
      { name: 'Prabhsimran Singh', role: 'Wicketkeeper-Batsman', nationality: 'India' },
      { name: 'Shashank Singh', role: 'All-rounder', nationality: 'India' },
      { name: 'Marco Jansen', role: 'All-rounder', nationality: 'South Africa' },
      { name: 'Harpreet Brar', role: 'All-rounder', nationality: 'India' },
      { name: 'Azmatullah Omarzai', role: 'All-rounder', nationality: 'Afghanistan' },
      { name: 'Priyansh Arya', role: 'Batsman', nationality: 'India' },
      { name: 'Musheer Khan', role: 'Batsman', nationality: 'India' },
      { name: 'Lockie Ferguson', role: 'Bowler', nationality: 'New Zealand' },
      { name: 'Mitchell Owen', role: 'Batsman', nationality: 'Australia' },
      { name: 'Cooper Connolly', role: 'All-rounder', nationality: 'Australia' },
      { name: 'Xavier Bartlett', role: 'Bowler', nationality: 'Australia' },
    ],
  },
  {
    id: 'lsg',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    emoji: '🩵',
    primaryColor: 'neon-blue',
    secondaryColor: 'neon-green',
    homeGround: 'BRSABV Ekana Cricket Stadium',
    city: 'Lucknow',
    coach: 'Justin Langer',
    captain: 'Rishabh Pant',
    titles: 0,
    titleYears: [],
    achievements: [
      'Rishabh Pant — most expensive IPL player ever (₹27 Cr)',
      'Mohammed Shami traded in from SRH for 2026',
      'Wanindu Hasaranga strengthens the spin attack',
      'Josh Inglis — dynamic wicketkeeper-batsman (₹8.60 Cr)',
      'Anrich Nortje adds pace to the bowling lineup',
    ],
    players: [
      { name: 'Rishabh Pant', role: 'Wicketkeeper-Batsman', nationality: 'India', isStar: true },
      { name: 'Nicholas Pooran', role: 'Wicketkeeper-Batsman', nationality: 'West Indies', isStar: true },
      { name: 'Mohammed Shami', role: 'Bowler', nationality: 'India', isStar: true },
      { name: 'Mayank Yadav', role: 'Bowler', nationality: 'India', isStar: true },
      { name: 'Aiden Markram', role: 'All-rounder', nationality: 'South Africa' },
      { name: 'Mitchell Marsh', role: 'All-rounder', nationality: 'Australia' },
      { name: 'Josh Inglis', role: 'Wicketkeeper-Batsman', nationality: 'Australia' },
      { name: 'Wanindu Hasaranga', role: 'All-rounder', nationality: 'Sri Lanka' },
      { name: 'Anrich Nortje', role: 'Bowler', nationality: 'South Africa' },
      { name: 'Avesh Khan', role: 'Bowler', nationality: 'India' },
      { name: 'Ayush Badoni', role: 'Batsman', nationality: 'India' },
      { name: 'Abdul Samad', role: 'All-rounder', nationality: 'India' },
      { name: 'Shahbaz Ahmed', role: 'All-rounder', nationality: 'India' },
      { name: 'Arjun Tendulkar', role: 'All-rounder', nationality: 'India' },
      { name: 'Arshin Kulkarni', role: 'All-rounder', nationality: 'India' },
    ],
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    emoji: '🩵',
    primaryColor: 'neon-blue',
    secondaryColor: 'neon-green',
    homeGround: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    coach: 'Ashish Nehra',
    captain: 'Shubman Gill',
    titles: 1,
    titleYears: [2022],
    achievements: [
      'Champions in debut season 2022; runners-up 2023',
      'Shubman Gill — India vice-captain & retained at ₹16.5 Cr',
      'Rashid Khan — world\'s best leg-spinner retained',
      'Jason Holder adds all-round depth (₹7 Cr)',
      'Glenn Phillips joins as explosive overseas batsman',
    ],
    players: [
      { name: 'Shubman Gill', role: 'Batsman', nationality: 'India', isStar: true },
      { name: 'Rashid Khan', role: 'All-rounder', nationality: 'Afghanistan', isStar: true },
      { name: 'Jos Buttler', role: 'Wicketkeeper-Batsman', nationality: 'England', isStar: true },
      { name: 'Mohammed Siraj', role: 'Bowler', nationality: 'India', isStar: true },
      { name: 'Sai Sudharsan', role: 'Batsman', nationality: 'India' },
      { name: 'Kagiso Rabada', role: 'Bowler', nationality: 'South Africa' },
      { name: 'Prasidh Krishna', role: 'Bowler', nationality: 'India' },
      { name: 'Washington Sundar', role: 'All-rounder', nationality: 'India' },
      { name: 'Rahul Tewatia', role: 'All-rounder', nationality: 'India' },
      { name: 'Shahrukh Khan', role: 'Batsman', nationality: 'India' },
      { name: 'Glenn Phillips', role: 'Batsman', nationality: 'New Zealand' },
      { name: 'Jason Holder', role: 'All-rounder', nationality: 'West Indies' },
      { name: 'Anuj Rawat', role: 'Wicketkeeper-Batsman', nationality: 'India' },
      { name: 'Nishant Sindhu', role: 'All-rounder', nationality: 'India' },
      { name: 'Ishant Sharma', role: 'Bowler', nationality: 'India' },
    ],
  },
];

// IPL 2026 Schedule
// Phase 1 (Mar 28 – Apr 12) officially announced by BCCI on March 11, 2026.
// Remaining fixtures marked as TBA — will be updated when BCCI announces them.
export interface IPLMatchTBA {
  id: string;
  matchNumber: number;
  tba: true; // fixture not yet announced
}

export type IPLScheduleEntry = IPLMatch | IPLMatchTBA;

export const IPL_SCHEDULE: IPLScheduleEntry[] = [
  // ── Phase 1: Mar 28 – Apr 12 (Officially Announced) ──────────────────────
  { id: 'm1',  matchNumber: 1,  team1Id: 'rcb',  team2Id: 'srh',  date: '2026-03-28', time: '07:30 PM', venue: 'M. Chinnaswamy Stadium',      city: 'Bengaluru',      status: 'upcoming' },
  { id: 'm2',  matchNumber: 2,  team1Id: 'mi',   team2Id: 'kkr',  date: '2026-03-29', time: '07:30 PM', venue: 'Wankhede Stadium',             city: 'Mumbai',         status: 'upcoming' },
  { id: 'm3',  matchNumber: 3,  team1Id: 'rr',   team2Id: 'csk',  date: '2026-03-30', time: '07:30 PM', venue: 'Barsapara Cricket Stadium',    city: 'Guwahati',       status: 'upcoming' },
  { id: 'm4',  matchNumber: 4,  team1Id: 'pbks', team2Id: 'gt',   date: '2026-03-31', time: '07:30 PM', venue: 'PCA Stadium',                  city: 'New Chandigarh', status: 'upcoming' },
  { id: 'm5',  matchNumber: 5,  team1Id: 'dc',   team2Id: 'lsg',  date: '2026-04-01', time: '07:30 PM', venue: 'Ekana Cricket Stadium',        city: 'Lucknow',        status: 'upcoming' },
  { id: 'm6',  matchNumber: 6,  team1Id: 'kkr',  team2Id: 'srh',  date: '2026-04-02', time: '07:30 PM', venue: 'Eden Gardens',                 city: 'Kolkata',        status: 'upcoming' },
  { id: 'm7',  matchNumber: 7,  team1Id: 'csk',  team2Id: 'pbks', date: '2026-04-03', time: '07:30 PM', venue: 'MA Chidambaram Stadium',       city: 'Chennai',        status: 'upcoming' },
  { id: 'm8',  matchNumber: 8,  team1Id: 'dc',   team2Id: 'mi',   date: '2026-04-04', time: '03:30 PM', venue: 'Arun Jaitley Stadium',         city: 'Delhi',          status: 'upcoming' },
  { id: 'm9',  matchNumber: 9,  team1Id: 'gt',   team2Id: 'rr',   date: '2026-04-04', time: '07:30 PM', venue: 'Narendra Modi Stadium',        city: 'Ahmedabad',      status: 'upcoming' },
  { id: 'm10', matchNumber: 10, team1Id: 'lsg',  team2Id: 'srh',  date: '2026-04-05', time: '03:30 PM', venue: 'Rajiv Gandhi Intl. Stadium',   city: 'Hyderabad',      status: 'upcoming' },
  { id: 'm11', matchNumber: 11, team1Id: 'rcb',  team2Id: 'csk',  date: '2026-04-05', time: '07:30 PM', venue: 'M. Chinnaswamy Stadium',      city: 'Bengaluru',      status: 'upcoming' },
  { id: 'm12', matchNumber: 12, team1Id: 'kkr',  team2Id: 'pbks', date: '2026-04-06', time: '07:30 PM', venue: 'Eden Gardens',                 city: 'Kolkata',        status: 'upcoming' },
  { id: 'm13', matchNumber: 13, team1Id: 'rr',   team2Id: 'mi',   date: '2026-04-07', time: '07:30 PM', venue: 'Barsapara Cricket Stadium',    city: 'Guwahati',       status: 'upcoming' },
  { id: 'm14', matchNumber: 14, team1Id: 'dc',   team2Id: 'gt',   date: '2026-04-08', time: '07:30 PM', venue: 'Arun Jaitley Stadium',         city: 'Delhi',          status: 'upcoming' },
  { id: 'm15', matchNumber: 15, team1Id: 'kkr',  team2Id: 'lsg',  date: '2026-04-09', time: '07:30 PM', venue: 'Eden Gardens',                 city: 'Kolkata',        status: 'upcoming' },
  { id: 'm16', matchNumber: 16, team1Id: 'rr',   team2Id: 'rcb',  date: '2026-04-10', time: '07:30 PM', venue: 'Barsapara Cricket Stadium',    city: 'Guwahati',       status: 'upcoming' },
  { id: 'm17', matchNumber: 17, team1Id: 'csk',  team2Id: 'dc',   date: '2026-04-11', time: '07:30 PM', venue: 'MA Chidambaram Stadium',       city: 'Chennai',        status: 'upcoming' },
  { id: 'm18', matchNumber: 18, team1Id: 'pbks', team2Id: 'srh',  date: '2026-04-11', time: '03:30 PM', venue: 'PCA Stadium',                  city: 'New Chandigarh', status: 'upcoming' },
  { id: 'm19', matchNumber: 19, team1Id: 'mi',   team2Id: 'rcb',  date: '2026-04-12', time: '07:30 PM', venue: 'Wankhede Stadium',             city: 'Mumbai',         status: 'upcoming' },
  { id: 'm20', matchNumber: 20, team1Id: 'lsg',  team2Id: 'gt',   date: '2026-04-12', time: '03:30 PM', venue: 'Ekana Cricket Stadium',        city: 'Lucknow',        status: 'upcoming' },
  // ── Phase 2 onwards: Yet to be Announced ────────────────────────────────
  { id: 'tba21', matchNumber: 21, tba: true },
  { id: 'tba22', matchNumber: 22, tba: true },
  { id: 'tba23', matchNumber: 23, tba: true },
  { id: 'tba24', matchNumber: 24, tba: true },
  { id: 'tba25', matchNumber: 25, tba: true },
  { id: 'tba26', matchNumber: 26, tba: true },
  { id: 'tba27', matchNumber: 27, tba: true },
  { id: 'tba28', matchNumber: 28, tba: true },
  { id: 'tba29', matchNumber: 29, tba: true },
  { id: 'tba30', matchNumber: 30, tba: true },
  { id: 'tba31', matchNumber: 31, tba: true },
  { id: 'tba32', matchNumber: 32, tba: true },
  { id: 'tba33', matchNumber: 33, tba: true },
  { id: 'tba34', matchNumber: 34, tba: true },
  { id: 'tba35', matchNumber: 35, tba: true },
  { id: 'tba36', matchNumber: 36, tba: true },
  { id: 'tba37', matchNumber: 37, tba: true },
  { id: 'tba38', matchNumber: 38, tba: true },
  { id: 'tba39', matchNumber: 39, tba: true },
  { id: 'tba40', matchNumber: 40, tba: true },
  { id: 'tba41', matchNumber: 41, tba: true },
  { id: 'tba42', matchNumber: 42, tba: true },
  { id: 'tba43', matchNumber: 43, tba: true },
  { id: 'tba44', matchNumber: 44, tba: true },
  { id: 'tba45', matchNumber: 45, tba: true },
  { id: 'tba46', matchNumber: 46, tba: true },
  { id: 'tba47', matchNumber: 47, tba: true },
  { id: 'tba48', matchNumber: 48, tba: true },
  { id: 'tba49', matchNumber: 49, tba: true },
  { id: 'tba50', matchNumber: 50, tba: true },
  { id: 'tba51', matchNumber: 51, tba: true },
  { id: 'tba52', matchNumber: 52, tba: true },
  { id: 'tba53', matchNumber: 53, tba: true },
  { id: 'tba54', matchNumber: 54, tba: true },
  { id: 'tba55', matchNumber: 55, tba: true },
  { id: 'tba56', matchNumber: 56, tba: true },
  { id: 'tba57', matchNumber: 57, tba: true },
  { id: 'tba58', matchNumber: 58, tba: true },
  { id: 'tba59', matchNumber: 59, tba: true },
  { id: 'tba60', matchNumber: 60, tba: true },
  { id: 'tba61', matchNumber: 61, tba: true },
  { id: 'tba62', matchNumber: 62, tba: true },
  { id: 'tba63', matchNumber: 63, tba: true },
  { id: 'tba64', matchNumber: 64, tba: true },
  { id: 'tba65', matchNumber: 65, tba: true },
  { id: 'tba66', matchNumber: 66, tba: true },
  { id: 'tba67', matchNumber: 67, tba: true },
  { id: 'tba68', matchNumber: 68, tba: true },
  { id: 'tba69', matchNumber: 69, tba: true },
  { id: 'tba70', matchNumber: 70, tba: true },
  // Playoffs — TBA
  { id: 'tba71', matchNumber: 71, tba: true },
  { id: 'tba72', matchNumber: 72, tba: true },
  { id: 'tba73', matchNumber: 73, tba: true },
  { id: 'tba74', matchNumber: 74, tba: true },
];

export const IPL_INFO = {
  season: 19,
  year: 2026,
  totalTeams: 10,
  totalMatches: 84,
  startDate: '28 March 2026',
  endDate: '3 June 2026',
  prizePool: '₹20 Crore',
  tagline: 'Bigger, Bolder, Better',
  highlights: [
    'Season 19 — 84 matches, the biggest IPL ever (10 more than 2025)',
    'RCB are defending back-to-back champions (2024 & 2025)',
    'Cameron Green sold for ₹25.20 Cr — costliest overseas buy ever',
    'Vaibhav Suryavanshi returns aged 15 — youngest IPL player',
    'Phase 1 (Mar 28–Apr 12) officially announced; full schedule TBA',
  ],
};

export interface PointsTableEntry {
  teamId: string;
  played: number;
  won: number;
  lost: number;
  nr: number;   // no result
  pts: number;
  nrr: number;  // net run rate
  form: ('W' | 'L' | 'NR')[]; // last 5
}

// Season not yet started — all teams begin at 0
export const IPL_POINTS_TABLE: PointsTableEntry[] = [
  { teamId: 'rcb',  played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'mi',   played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'kkr',  played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'csk',  played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'srh',  played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'gt',   played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'rr',   played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'dc',   played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'pbks', played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
  { teamId: 'lsg',  played: 0, won: 0, lost: 0, nr: 0, pts: 0, nrr: 0.000, form: [] },
];

// ─── Player Season Stats ──────────────────────────────────────────────────────
// Update these as the season progresses.
// Orange Cap = most runs | Purple Cap = most wickets

export interface PlayerSeasonStat {
  name: string;
  teamId: string;
  role: 'bat' | 'bowl' | 'all';
  // batting
  matches: number;
  runs: number;
  innings: number;
  highScore: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  fours: number;
  sixes: number;
  // bowling
  wickets: number;
  bowlingInnings: number;
  economy: number;
  bestFigures: string; // e.g. "4/18"
  fiveWickets: number;
}

// Season has NOT started — all stats are 0. Update after each match.
export const IPL_PLAYER_STATS: PlayerSeasonStat[] = [
  // ── Batsmen / All-rounders ───────────────────────────────────────────
  { name: 'Virat Kohli',       teamId: 'rcb',  role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Rohit Sharma',      teamId: 'mi',   role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Shubman Gill',      teamId: 'gt',   role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Yashasvi Jaiswal',  teamId: 'rr',   role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Rishabh Pant',      teamId: 'lsg',  role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Suryakumar Yadav',  teamId: 'mi',   role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Travis Head',       teamId: 'srh',  role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Ruturaj Gaikwad',   teamId: 'csk',  role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'KL Rahul',          teamId: 'dc',   role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Cameron Green',     teamId: 'kkr',  role: 'all', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Hardik Pandya',     teamId: 'mi',   role: 'all', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Sunil Narine',      teamId: 'kkr',  role: 'all', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Heinrich Klaasen',  teamId: 'srh',  role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Riyan Parag',       teamId: 'rr',   role: 'all', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Nicholas Pooran',   teamId: 'lsg',  role: 'bat', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  // ── Bowlers ───────────────────────────────────────────────────────────
  { name: 'Jasprit Bumrah',    teamId: 'mi',   role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Rashid Khan',       teamId: 'gt',   role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Mohammed Shami',    teamId: 'lsg',  role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Arshdeep Singh',    teamId: 'pbks', role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Pat Cummins',       teamId: 'srh',  role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Matheesha Pathirana',teamId: 'kkr', role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Kuldeep Yadav',     teamId: 'dc',   role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Josh Hazlewood',    teamId: 'rcb',  role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Jofra Archer',      teamId: 'rr',   role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
  { name: 'Yuzvendra Chahal',  teamId: 'pbks', role: 'bowl', matches: 0, runs: 0, innings: 0, highScore: 0, average: 0, strikeRate: 0, fifties: 0, hundreds: 0, fours: 0, sixes: 0, wickets: 0, bowlingInnings: 0, economy: 0, bestFigures: '-', fiveWickets: 0 },
];
