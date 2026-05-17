export const INIT_GOALS = [
  // Alice — approved + Q1 & Q2 logged
  { id:'g1',  eId:'emp1', thrust:'Revenue Growth',        title:'Monthly Sales Target',        desc:'Meet or exceed monthly sales targets across all product lines',                  uom:'min',      target:5000000,     unit:'₹',         wt:35, status:'approved', ach:{Q1:4200000,Q2:5100000,Q3:null,Q4:null}, st:{Q1:'On Track',Q2:'Completed',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g2',  eId:'emp1', thrust:'Customer Excellence',   title:'Customer CSAT Score',         desc:'Maintain CSAT above 4.5 through proactive customer engagement and follow-ups',  uom:'min',      target:4.5,         unit:'score',     wt:25, status:'approved', ach:{Q1:4.6,     Q2:4.8,     Q3:null,Q4:null}, st:{Q1:'On Track',Q2:'Completed',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g3',  eId:'emp1', thrust:'Operational Efficiency',title:'Lead Response Time',          desc:'Reduce average lead response time to under 2 hours from point of enquiry',       uom:'max',      target:2,           unit:'hrs',       wt:20, status:'approved', ach:{Q1:2.5,     Q2:1.8,     Q3:null,Q4:null}, st:{Q1:'On Track',Q2:'Completed',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g4',  eId:'emp1', thrust:'People & Culture',      title:'Training Completion',         desc:'Complete all assigned L&D modules, certifications and mandatory trainings',       uom:'timeline', target:'2024-09-30',unit:'date',      wt:10, status:'approved', ach:{Q1:null,    Q2:'2024-08-15',Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Completed',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g5',  eId:'emp1', thrust:'Risk & Compliance',     title:'Zero Compliance Violations',  desc:'Maintain zero regulatory or compliance violations throughout the financial year',  uom:'zero',     target:0,           unit:'incidents', wt:10, status:'approved', ach:{Q1:0,       Q2:0,       Q3:null,Q4:null}, st:{Q1:'Completed',Q2:'Completed',Q3:'Not Started',Q4:'Not Started'}, shared:true, sharedFrom:'admin1' },

  // Bob — submitted (pending approval)
  { id:'g6',  eId:'emp2', thrust:'Revenue Growth',        title:'New Client Acquisition',      desc:'Acquire minimum 60 new enterprise clients annually across all segments',           uom:'min',      target:60,          unit:'clients',   wt:40, status:'submitted', ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g7',  eId:'emp2', thrust:'Customer Excellence',   title:'Client Retention Rate',       desc:'Maintain 95%+ annual client retention across all active accounts',                uom:'min',      target:95,          unit:'%',         wt:30, status:'submitted', ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g8',  eId:'emp2', thrust:'Operational Efficiency',title:'Pipeline Hygiene Score',      desc:'Maintain CRM pipeline hygiene score above 90% with accurate stage data',           uom:'min',      target:90,          unit:'%',         wt:20, status:'submitted', ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g9',  eId:'emp2', thrust:'Risk & Compliance',     title:'Zero Compliance Violations',  desc:'Maintain zero regulatory or compliance violations throughout the financial year',  uom:'zero',     target:0,           unit:'incidents', wt:10, status:'submitted', ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:true, sharedFrom:'admin1' },

  // Carol — draft
  { id:'g10', eId:'emp3', thrust:'Innovation & Digital',  title:'Feature Delivery Velocity',   desc:'Deliver 95% of planned sprint features on time with agreed acceptance criteria',   uom:'min',      target:95,          unit:'%',         wt:40, status:'draft',     ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g11', eId:'emp3', thrust:'Operational Efficiency',title:'System Uptime SLA',           desc:'Maintain 99.9% uptime across all production systems and services',                 uom:'min',      target:99.9,        unit:'%',         wt:30, status:'draft',     ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g12', eId:'emp3', thrust:'Quality & Safety',      title:'Zero Critical Bugs in Prod',  desc:'No P0 or P1 severity bugs reaching the production environment',                   uom:'zero',     target:0,           unit:'bugs',      wt:20, status:'draft',     ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g13', eId:'emp3', thrust:'People & Culture',      title:'Internal Tech Talks',         desc:'Conduct at least 4 internal knowledge-sharing sessions for the engineering team',  uom:'min',      target:4,           unit:'sessions',  wt:10, status:'draft',     ach:{Q1:null,Q2:null,Q3:null,Q4:null}, st:{Q1:'Not Started',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },

  // David — approved + Q1 & Q2 logged
  { id:'g14', eId:'emp4', thrust:'Innovation & Digital',  title:'Code Review Turnaround',      desc:'Complete all pull request reviews within 24 hours of submission',                  uom:'max',      target:24,          unit:'hrs',       wt:30, status:'approved', ach:{Q1:20,      Q2:18,      Q3:null,Q4:null}, st:{Q1:'On Track',Q2:'Completed',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g15', eId:'emp4', thrust:'Operational Efficiency',title:'Test Coverage',               desc:'Maintain minimum 85% automated test coverage across all application modules',      uom:'min',      target:85,          unit:'%',         wt:35, status:'approved', ach:{Q1:82,      Q2:88,      Q3:null,Q4:null}, st:{Q1:'On Track',Q2:'On Track',  Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g16', eId:'emp4', thrust:'Quality & Safety',      title:'Zero Critical Bugs',          desc:'Zero P0 severity bugs shipped to production environment in any release',            uom:'zero',     target:0,           unit:'bugs',      wt:25, status:'approved', ach:{Q1:0,       Q2:1,       Q3:null,Q4:null}, st:{Q1:'Completed',Q2:'Not Started',Q3:'Not Started',Q4:'Not Started'}, shared:false },
  { id:'g17', eId:'emp4', thrust:'People & Culture',      title:'Junior Engineer Mentoring',   desc:'Conduct weekly one-on-one mentoring sessions for assigned junior engineers',        uom:'min',      target:20,          unit:'sessions',  wt:10, status:'approved', ach:{Q1:18,      Q2:22,      Q3:null,Q4:null}, st:{Q1:'On Track',Q2:'Completed',Q3:'Not Started',Q4:'Not Started'}, shared:false },
]

export const INIT_CHECKINS = [
  { id:'ci1', eId:'emp1', q:'Q1', mgr:'mgr1', comment:'Alice is tracking well. Revenue picked up in March. Focus on enterprise accounts in Q2 to sustain the momentum.',            ts:'2024-07-14T10:30:00Z' },
  { id:'ci2', eId:'emp1', q:'Q2', mgr:'mgr1', comment:'Exceptional Q2 — revenue exceeded target by 2% and CSAT hit 4.8. Replicate this strategy in Q3 with a focus on renewals.',  ts:'2024-10-10T14:00:00Z' },
  { id:'ci3', eId:'emp4', q:'Q1', mgr:'mgr2', comment:'David is showing solid progress on code review velocity. Test coverage slightly below target — needs a focused Q2 push.',    ts:'2024-07-15T11:00:00Z' },
  { id:'ci4', eId:'emp4', q:'Q2', mgr:'mgr2', comment:'Great improvement in test coverage. P0 bug in Q2 is a concern — implement a stricter pre-release checklist for Q3.',         ts:'2024-10-12T09:30:00Z' },
]

export const INIT_AUDIT = [
  { id:'a1', ts:'2024-05-01T09:00:00Z', uid:'emp1',   action:'Goal Created',    entity:'Monthly Sales Target',       detail:'Created with ₹50L target, 35% weightage' },
  { id:'a2', ts:'2024-05-03T11:00:00Z', uid:'emp1',   action:'Goal Submitted',  entity:'Goal Sheet',                  detail:'Submitted 5 goals for manager approval' },
  { id:'a3', ts:'2024-05-05T14:00:00Z', uid:'mgr1',   action:'Goals Approved',  entity:'Alice Johnson',               detail:'All 5 goals approved and locked' },
  { id:'a4', ts:'2024-05-06T10:00:00Z', uid:'emp2',   action:'Goal Created',    entity:'New Client Acquisition',      detail:'Created with 60 clients target, 40% weightage' },
  { id:'a5', ts:'2024-05-08T15:00:00Z', uid:'emp2',   action:'Goal Submitted',  entity:'Goal Sheet',                  detail:'Submitted 4 goals for manager approval' },
  { id:'a6', ts:'2024-05-02T09:00:00Z', uid:'emp4',   action:'Goal Created',    entity:'Code Review Turnaround',      detail:'Created with 24hr target, 30% weightage' },
  { id:'a7', ts:'2024-05-04T10:00:00Z', uid:'emp4',   action:'Goal Submitted',  entity:'Goal Sheet',                  detail:'Submitted 4 goals for manager approval' },
  { id:'a8', ts:'2024-05-06T11:00:00Z', uid:'mgr2',   action:'Goals Approved',  entity:'David Patel',                 detail:'All 4 goals approved and locked' },
  { id:'a9', ts:'2024-05-01T09:00:00Z', uid:'admin1', action:'Shared Goal Push','entity':'Zero Compliance Violations','detail':'Pushed to all employees — Risk & Compliance thrust' },
  { id:'a10',ts:'2024-07-14T10:30:00Z', uid:'mgr1',   action:'Q1 Check-in',     entity:'Alice Johnson',               detail:'Q1 check-in completed with structured feedback' },
  { id:'a11',ts:'2024-10-10T14:00:00Z', uid:'mgr1',   action:'Q2 Check-in',     entity:'Alice Johnson',               detail:'Q2 check-in — exceptional performance noted' },
]

export const INIT_NOTIFS = [
  { id:'n1', ts:'2024-10-10T09:00:00Z', msg:"Bob Kumar submitted 4 goals for your approval",             type:'approval', read:false },
  { id:'n2', ts:'2024-10-09T14:00:00Z', msg:'Q3 check-in window is now open — please log achievements',  type:'info',     read:false },
  { id:'n3', ts:'2024-10-05T11:00:00Z', msg:'Alice Johnson logged Q2 achievements',                       type:'checkin',  read:true  },
  { id:'n4', ts:'2024-09-28T08:00:00Z', msg:'Carol Singh has not yet submitted her goal sheet',            type:'alert',    read:true  },
]
