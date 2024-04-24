const link = 'https://boards-api.greenhouse.io/v1/boards';
const jobBackends = [
  {
    title: 'RVO Health',
    name: 'rvohealth',
    url: `${link}/rvohealth/jobs`,
  },
  {
    title: 'Red Ventures',
    name: 'redventures',
    url: `${link}/redventures/jobs`,
  },
  {
    title: 'Airbnb',
    name: 'airbnb',
    url: `${link}/airbnb/jobs`,
  },
  {
    title: 'Dropbox',
    name: 'dropbox',
    url: `${link}/dropbox/jobs`,
  },
  {
    title: 'Instacart',
    name: 'instacart',
    url: `${link}/instacart/jobs`,
  },
  {
    title: 'Stripe',
    name: 'stripe',
    url: `${link}/stripe/jobs`,
  },
  {
    title: 'Greenhouse',
    name: 'greenhouse',
    url: `${link}/greenhouse/jobs`,
  },
  {
    title: 'Reddit',
    name: 'reddit',
    url: `${link}/reddit/jobs`,
  },
  {
    title: 'Robinhood',
    name: 'robinhood',
    url: `${link}/robinhood/jobs`,
  },
  {
    title: 'Twitch',
    name: 'twitch',
    url: `${link}/twitch/jobs`,
  },
  {
    title: 'GoDaddy',
    name: 'godaddy',
    url: `${link}/godaddy/jobs`,
  },
  {
    title: 'NerdWallet',
    name: 'nerdwallet',
    url: `${link}/nerdwallet/jobs`,
  },
  {
    title: 'Pinterest',
    name: 'pinterest',
    url: `${link}/pinterest/jobs`,
  },
  {
    title: 'Wayfair',
    name: 'wayfair',
    url: `${link}/wayfair/jobs`,
  },
  {
    title: 'Learfield',
    name: 'learfield',
    url: `${link}/learfield/jobs`,
  },
  {
    title: 'Monumental Sports',
    name: 'monumentalsports',
    url: `${link}/monumentalsports/jobs`,
  },
  {
    title: 'Red Canary',
    name: 'redcanary',
    url: `${link}/redcanary/jobs`,
  },
  {
    title: 'Three Flow',
    name: 'threeflow',
    url: `${link}/threeflow/jobs`,
  },
  {
    title: 'GitLab',
    name: 'gitlab',
    url: `${link}/gitlab/jobs`,
  },
  {
    title: 'Figma',
    name: 'figma',
    url: `${link}/figma/jobs`,
  },
  {
    title: 'Voltron Data',
    name: 'voltrondata',
    url: `${link}/voltrondata/jobs`,
  },
  {
    title: 'Doximity',
    name: 'doximity',
    url: `${link}/doximity/jobs`,
  },
  {
    title: 'Agent Sync',
    name: 'agentsync',
    url: `${link}/agentsync/jobs`,
  },
  {
    title: 'Protagonist',
    name: 'protagonist',
    url: `${link}/protagonist/jobs`,
  },
  {
    title: 'Fearless',
    name: 'fearless',
    url: `${link}/fearless/jobs`,
  },
  {
    title: 'Parachute Health',
    name: 'parachutehealth',
    url: `${link}/parachutehealth/jobs`,
  },
  {
    title: 'Lyft',
    name: 'lyft',
    url: `${link}/lyft/jobs`,
  },
  {
    title: 'Okta',
    name: 'okta',
    url: `${link}/okta/jobs`,
  },
  {
    title: 'Warby Parker',
    name: 'warbyparker',
    url: `${link}/warbyparker/jobs`,
  },
  {
    title: 'Calm',
    name: 'calm',
    url: `${link}/calm/jobs`,
  },
  {
    title: 'Cruise',
    name: 'cruise',
    url: `${link}/cruise/jobs`,
  },
  {
    title: 'DoorDash',
    name: 'doordash',
    url: `${link}/doordash/jobs`,
  },
  {
    title: 'Gusto',
    name: 'gusto',
    url: `${link}/gusto/jobs`,
  },
  {
    title: 'Lattice',
    name: 'lattice',
    url: `${link}/lattice/jobs`,
  },
  {
    title: 'Fabric',
    name: 'fabric',
    url: `${link}/fabric83/jobs`,
  },
  {
    title: 'Cerebral',
    name: 'cerebral',
    url: `${link}/cerebral/jobs`,
  },
];

/**
 * Workday job URLs
 * @type {Array<{title: string, name: string, url: string}>}
 * title: The title of the company.
 * name: The name of the company, used for parameterizing the URL.
 * url: The URL to fetch job listings from (FRONTEND BASE PATH).
 */
export const workdayJobs = [
  {
    title: 'Booz Allen Hamilton',
    name: 'bah',
    url: 'https://bah.wd1.myworkdayjobs.com/BAH_Jobs',
  },
  {
    title: 'CACI International',
    name: 'caci',
    url: 'https://caci.wd1.myworkdayjobs.com/External',
  },
  {
    title: 'Accenture',
    name: 'accenture',
    url: 'https://accenture.wd3.myworkdayjobs.com/Accenture_Careers',
  },
];

export default jobBackends;
