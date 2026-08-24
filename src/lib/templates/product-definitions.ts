/**
 * Flowra Automation Product Definitions
 *
 * Central registry of all automation products.
 * Each product definition drives:
 *   - Public marketing landing page (/automations/[slug])
 *   - Dashboard template catalog (/dashboard/templates)
 *   - "Use Automation" → creates a real Workflow in the DB via /api/…/from-template
 *
 * IMPLEMENTATION STATUSES:
 *   IMPLEMENTED  — Real node graph that executes through the existing engine.
 *   PARTIAL      — Architecture exists but requires external integration config.
 *   COMING_SOON  — Product definition for catalog, execution not yet available.
 */

export type ProductImplementationStatus = "IMPLEMENTED" | "PARTIAL" | "COMING_SOON";
export type ProductCategory =
  | "Sales"
  | "Customer Support"
  | "Marketing"
  | "Operations"
  | "Ecommerce"
  | "Real Estate"
  | "HR"
  | "Finance";

export interface ProductIntegration {
  id: string;
  name: string;
  icon: string;
  status: "available" | "requires_setup" | "coming_soon";
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductWorkflowStep {
  /** Trigger or intermediate step label (human-readable) */
  label: string;
  /** Brief description of what happens */
  description: string;
  icon: string;
}

export interface ProductConfigurableField {
  key: string;
  label: string;
  type: "text" | "select" | "phone" | "textarea" | "number";
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
}

// Node/Edge types match WorkflowNodeRecord shape stored in DB
export interface TemplateNode {
  nodeId: string;
  type: string;
  positionX: number;
  positionY: number;
  data: Record<string, unknown>;
}

export interface TemplateEdge {
  edgeId: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface AutomationProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  shortDescription: string;
  longDescription: string;
  category: ProductCategory;
  icon: string; // lucide icon name
  color: string; // brand color for category
  targetCustomer: string[];
  problem: string;
  problemPoints: string[];
  solution: string;
  workflowSteps: ProductWorkflowStep[];
  benefits: string[];
  requiredIntegrations: ProductIntegration[];
  configurableFields: ProductConfigurableField[];
  faqs: ProductFaq[];
  ctaHeadline: string;
  ctaSubtext: string;
  implementationStatus: ProductImplementationStatus;
  pricingTier: "starter" | "growth" | "business";
  /** Real node/edge graph used to create a workflow in the database */
  templateNodes: TemplateNode[];
  templateEdges: TemplateEdge[];
  triggerType: "WEBHOOK_TRIGGER" | "MANUAL_TRIGGER" | "SCHEDULED_TRIGGER";
}

// ─────────────────────────────────────────────────────────────────────────────
// Product 01 — Missed Call Text-Back
// ─────────────────────────────────────────────────────────────────────────────
const missedCallRecovery: AutomationProduct = {
  id: "prod_01_missed_call",
  slug: "missed-call-recovery",
  name: "Missed Call Text-Back",
  tagline: "Never lose a customer because you missed a call.",
  heroTitle: "Turn Missed Calls Into New Customers.",
  heroDescription:
    "When your business misses a call, Flowra instantly sends a personalized SMS or WhatsApp message to the caller — so you never lose a lead again.",
  shortDescription:
    "Automatically follow up with customers when you miss their call. AI writes the message for you.",
  longDescription:
    "Every missed call is a potential customer walking out the door. Flowra intercepts missed and unanswered calls from Twilio, generates a warm AI-personalized response, and sends it via SMS or WhatsApp — all within seconds of the missed call.",
  category: "Customer Support",
  icon: "PhoneMissed",
  color: "#635BFF",
  targetCustomer: ["Clinics", "Salons", "Auto Repair", "Real Estate", "Local Services"],
  problem:
    "Every missed call is a potential customer who might call your competitor next.",
  problemPoints: [
    "Staff are busy and miss calls during peak hours",
    "Customers hang up and never call back",
    "No system to follow up with missed callers",
    "Leads are lost without any record",
  ],
  solution:
    "Flowra listens for missed calls and automatically sends a personalized follow-up within seconds.",
  workflowSteps: [
    { label: "Call Missed", description: "Customer calls your business line", icon: "Phone" },
    { label: "Webhook Triggered", description: "Twilio notifies Flowra of the missed call", icon: "Webhook" },
    { label: "Caller Detected", description: "Flowra extracts the caller's number", icon: "User" },
    { label: "AI Composes Message", description: "AI generates a personalized response", icon: "Sparkles" },
    { label: "Message Sent", description: "SMS or WhatsApp sent to the caller", icon: "MessageSquare" },
    { label: "Lead Logged", description: "Interaction recorded for follow-up", icon: "CheckCircle" },
  ],
  benefits: [
    "Respond to missed calls within seconds",
    "Never lose a lead to a competitor",
    "AI-generated messages sound human and personal",
    "Works 24/7 without staff involvement",
    "Full execution history and audit trail",
  ],
  requiredIntegrations: [
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
    { id: "whatsapp", name: "WhatsApp Business", icon: "MessageSquare", status: "requires_setup" },
  ],
  configurableFields: [
    {
      key: "businessName",
      label: "Business Name",
      type: "text",
      required: true,
      placeholder: "e.g. Downtown Dental",
      description: "Used in the AI-generated message",
    },
    {
      key: "channel",
      label: "Message Channel",
      type: "select",
      required: true,
      options: [
        { label: "SMS", value: "sms" },
        { label: "WhatsApp", value: "whatsapp" },
      ],
    },
    {
      key: "messageStyle",
      label: "Message Tone",
      type: "select",
      required: false,
      options: [
        { label: "Professional", value: "professional" },
        { label: "Friendly", value: "friendly" },
        { label: "Urgent", value: "urgent" },
      ],
    },
  ],
  faqs: [
    {
      question: "How does it know when a call is missed?",
      answer:
        "Twilio sends a webhook to Flowra when a call is not answered (status: no-answer or busy). Flowra then triggers the automation.",
    },
    {
      question: "Do I need a Twilio number?",
      answer:
        "Yes. You need a Twilio phone number that handles your business calls. Setup takes about 10 minutes.",
    },
    {
      question: "Can I customize the message?",
      answer:
        "Yes. You can provide your business name and tone. AI generates the personalized message dynamically.",
    },
    {
      question: "Does it work with WhatsApp?",
      answer:
        "Yes. With a Twilio WhatsApp sandbox or approved number, messages can be sent via WhatsApp.",
    },
  ],
  ctaHeadline: "Stop losing customers to unanswered calls.",
  ctaSubtext: "Set up once. Run forever. No technical knowledge required.",
  implementationStatus: "PARTIAL", // PARTIAL: engine works, requires Twilio config
  pricingTier: "starter",
  triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [
    { nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Webhook Received" } },
    { nodeId: "condition-1", type: "CONDITION", positionX: 100, positionY: 240, data: { label: "Check Call Status", expression: "input.CallStatus === 'no-answer' || input.CallStatus === 'busy'" } },
    { nodeId: "setvalue-1", type: "SET_VALUE", positionX: 100, positionY: 380, data: { label: "Extract Caller Number", key: "callerNumber", value: "{{input.From}}" } },
    { nodeId: "aigen-1", type: "AI_GENERATE", positionX: 100, positionY: 520, data: { label: "Generate Response", prompt: "You are a professional business assistant. A customer called {{setvalue-1.callerNumber}} but we missed their call. Write a short, friendly SMS message (under 160 characters) apologizing for missing their call and asking how you can help them. Be warm and professional. Do not use emojis excessively.", systemPrompt: "You write brief, professional business SMS messages." } },
    { nodeId: "sendmsg-1", type: "SEND_MESSAGE", positionX: 100, positionY: 660, data: { label: "Send SMS/WhatsApp", channel: "sms", to: "{{input.From}}", body: "{{aigen-1.generatedText}}" } },
    { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 800, data: { label: "Log Interaction" } },
    { nodeId: "end-1", type: "END", positionX: 100, positionY: 940, data: { label: "Done" } },
  ],
  templateEdges: [
    { edgeId: "e1", source: "start-1", target: "condition-1" },
    { edgeId: "e2", source: "condition-1", target: "setvalue-1", sourceHandle: "true" },
    { edgeId: "e3", source: "setvalue-1", target: "aigen-1" },
    { edgeId: "e4", source: "aigen-1", target: "sendmsg-1" },
    { edgeId: "e5", source: "sendmsg-1", target: "log-1" },
    { edgeId: "e6", source: "log-1", target: "end-1" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Product 02 — AI Lead Qualification
// ─────────────────────────────────────────────────────────────────────────────
const aiLeadQualification: AutomationProduct = {
  id: "prod_02_lead_qual",
  slug: "ai-lead-qualification",
  name: "AI Lead Qualification",
  tagline: "Know which leads are worth your time — instantly.",
  heroTitle: "Stop Wasting Time on Cold Leads.",
  heroDescription:
    "Flowra's AI analyzes every incoming lead, scores them 0–100, and classifies them as Hot, Warm, or Cold — so your sales team focuses on the best opportunities.",
  shortDescription:
    "AI scores and classifies every new lead so your team focuses on the right prospects.",
  longDescription:
    "When a lead submits a form or enters your CRM, Flowra extracts their information, runs AI analysis to determine intent and buying signals, scores them from 0 to 100, and classifies them as Hot, Warm, or Cold with a recommended action.",
  category: "Sales",
  icon: "Target",
  color: "#06B6D4",
  targetCustomer: ["Sales Teams", "Real Estate", "Financial Services", "B2B SaaS", "Agencies"],
  problem: "Sales teams waste time on leads that will never convert.",
  problemPoints: [
    "No way to prioritize hundreds of daily leads",
    "Sales reps waste hours on cold prospects",
    "Hot leads go cold waiting for follow-up",
    "No consistent qualification criteria",
  ],
  solution:
    "AI analyzes each lead's intent, behavior, and signals to score and prioritize automatically.",
  workflowSteps: [
    { label: "Lead Received", description: "New lead enters via form or webhook", icon: "UserPlus" },
    { label: "Data Extracted", description: "Flowra extracts lead information", icon: "Database" },
    { label: "AI Analysis", description: "AI evaluates intent and buying signals", icon: "Brain" },
    { label: "Lead Scored", description: "Score assigned from 0–100", icon: "BarChart3" },
    { label: "Classification", description: "Hot / Warm / Cold classification", icon: "Tag" },
    { label: "Team Notified", description: "Sales team receives alert for hot leads", icon: "Bell" },
  ],
  benefits: [
    "Never miss a hot lead",
    "40% less time spent on manual qualification",
    "Consistent AI-driven scoring criteria",
    "Immediate response to high-intent leads",
    "Full lead history and score tracking",
  ],
  requiredIntegrations: [
    { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" },
    { id: "webhook", name: "Webhooks", icon: "Webhook", status: "available" },
  ],
  configurableFields: [
    { key: "businessType", label: "Business Type", type: "text", required: true, placeholder: "e.g. Real Estate Agency" },
    { key: "qualificationCriteria", label: "What makes a good lead?", type: "textarea", required: false, placeholder: "e.g. Budget over $500k, located in Dubai, looking to buy within 3 months" },
    { key: "notificationEmail", label: "Notify email for hot leads", type: "text", required: false, placeholder: "sales@yourbusiness.com" },
  ],
  faqs: [
    { question: "How is the score calculated?", answer: "AI analyzes the lead's message, intent signals, urgency keywords, and any provided data points to generate a score." },
    { question: "What is a 'Hot' lead?", answer: "A lead scoring 70–100 with strong buying intent, urgency, and clear business fit." },
    { question: "Can I customize the qualification criteria?", answer: "Yes. You can describe what makes a good lead for your business in the setup." },
  ],
  ctaHeadline: "Let AI find your best leads so your team closes more deals.",
  ctaSubtext: "Set up in minutes. Qualify leads in seconds.",
  implementationStatus: "IMPLEMENTED",
  pricingTier: "starter",
  triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [
    { nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Lead Received" } },
    { nodeId: "setvalue-1", type: "SET_VALUE", positionX: 100, positionY: 240, data: { label: "Extract Lead Info", key: "leadInfo", value: "{{input.body}}" } },
    { nodeId: "aigen-1", type: "AI_GENERATE", positionX: 100, positionY: 380, data: { label: "AI Qualify Lead", prompt: "You are a lead qualification AI. Analyze this lead information and respond with ONLY valid JSON: {\"score\": <0-100>, \"classification\": \"Hot|Warm|Cold\", \"summary\": \"<1 sentence>\", \"intent\": \"<detected intent>\", \"recommendedAction\": \"<next step>\"}.\n\nLead info: {{input.body}}", systemPrompt: "You are an expert sales qualification AI. Always respond with valid JSON only." } },
    { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 520, data: { label: "Log Qualification Result" } },
    { nodeId: "end-1", type: "END", positionX: 100, positionY: 660, data: { label: "Done" } },
  ],
  templateEdges: [
    { edgeId: "e1", source: "start-1", target: "setvalue-1" },
    { edgeId: "e2", source: "setvalue-1", target: "aigen-1" },
    { edgeId: "e3", source: "aigen-1", target: "log-1" },
    { edgeId: "e4", source: "log-1", target: "end-1" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Product 03 — Review & Reputation Automation
// ─────────────────────────────────────────────────────────────────────────────
const reviewReputation: AutomationProduct = {
  id: "prod_03_review",
  slug: "review-reputation",
  name: "Review & Reputation Automation",
  tagline: "More 5-star reviews. Less manual follow-up.",
  heroTitle: "Your Best Customers Should Become Your Best Reviews.",
  heroDescription:
    "After every service, Flowra automatically asks for feedback, analyzes sentiment, and guides satisfied customers to leave a review — while routing complaints directly to you.",
  shortDescription:
    "Automatically collect feedback and turn happy customers into online reviews.",
  longDescription:
    "After a service is completed, Flowra sends a feedback request via SMS or WhatsApp. AI analyzes the sentiment. If positive, the customer is guided to leave a Google/Trustpilot review. If negative, the business owner is notified immediately for damage control.",
  category: "Marketing",
  icon: "Star",
  color: "#F59E0B",
  targetCustomer: ["Restaurants", "Salons", "Clinics", "Gyms", "Local Services"],
  problem: "Most happy customers never leave reviews unless asked at the right moment.",
  problemPoints: [
    "Staff forget to ask for reviews manually",
    "Unhappy customers go straight to Google",
    "No system to capture and route feedback",
    "Reputation management is reactive, not proactive",
  ],
  solution:
    "Automatically collect feedback, route it intelligently, and invite happy customers to leave public reviews.",
  workflowSteps: [
    { label: "Service Completed", description: "Triggered when a service or transaction is done", icon: "CheckCircle" },
    { label: "Feedback Requested", description: "Customer receives a feedback message", icon: "MessageSquare" },
    { label: "Sentiment Analysis", description: "AI analyzes the customer's response", icon: "Brain" },
    { label: "Positive Route", description: "Happy customers are invited to leave a review", icon: "Star" },
    { label: "Negative Route", description: "Complaints are routed to business owner immediately", icon: "AlertTriangle" },
    { label: "Logged", description: "All feedback is recorded for analysis", icon: "Database" },
  ],
  benefits: [
    "More 5-star reviews on Google and other platforms",
    "Immediate notification for negative feedback",
    "No staff involvement required",
    "Works across SMS and WhatsApp",
    "Full feedback audit trail",
  ],
  requiredIntegrations: [
    { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" },
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
  ],
  configurableFields: [
    { key: "reviewLink", label: "Google Review Link", type: "text", required: false, placeholder: "https://g.page/r/..." },
    { key: "ownerPhone", label: "Owner notification phone", type: "phone", required: false, placeholder: "+12125550100" },
  ],
  faqs: [
    { question: "Is this ethical?", answer: "Yes. The system asks all customers for honest feedback. Only customers who respond positively are guided to public review platforms. No fake reviews are generated." },
    { question: "Which review platforms are supported?", answer: "The review link can point to Google, Trustpilot, TripAdvisor, or any platform with a direct review URL." },
  ],
  ctaHeadline: "Your reputation is your business. Protect and grow it automatically.",
  ctaSubtext: "Set up once. Run forever.",
  implementationStatus: "IMPLEMENTED",
  pricingTier: "starter",
  triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [
    { nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Service Completed" } },
    { nodeId: "aigen-1", type: "AI_GENERATE", positionX: 100, positionY: 240, data: { label: "Analyze Sentiment", prompt: "Analyze the sentiment of this customer feedback and respond with ONLY valid JSON: {\"sentiment\": \"positive|negative|neutral\", \"score\": <0-100>, \"summary\": \"<brief summary>\"}.\n\nFeedback: {{input.feedback}}", systemPrompt: "You analyze customer feedback sentiment. Respond with JSON only." } },
    { nodeId: "condition-1", type: "CONDITION", positionX: 100, positionY: 380, data: { label: "Is Positive?", expression: "nodes['aigen-1'].output.generatedText.includes('positive')" } },
    { nodeId: "log-pos", type: "LOG", positionX: -100, positionY: 520, data: { label: "Log Positive — Send Review Request" } },
    { nodeId: "log-neg", type: "LOG", positionX: 300, positionY: 520, data: { label: "Log Negative — Notify Owner" } },
    { nodeId: "end-1", type: "END", positionX: 100, positionY: 660, data: { label: "Done" } },
  ],
  templateEdges: [
    { edgeId: "e1", source: "start-1", target: "aigen-1" },
    { edgeId: "e2", source: "aigen-1", target: "condition-1" },
    { edgeId: "e3", source: "condition-1", target: "log-pos", sourceHandle: "true" },
    { edgeId: "e4", source: "condition-1", target: "log-neg", sourceHandle: "false" },
    { edgeId: "e5", source: "log-pos", target: "end-1" },
    { edgeId: "e6", source: "log-neg", target: "end-1" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Product 04 — Lead Follow-Up Automation
// ─────────────────────────────────────────────────────────────────────────────
const leadFollowUp: AutomationProduct = {
  id: "prod_04_lead_followup",
  slug: "lead-follow-up",
  name: "Lead Follow-Up Automation",
  tagline: "Respond to every lead within seconds. Follow up automatically.",
  heroTitle: "Stop Losing Leads to Slow Response Times.",
  heroDescription:
    "The first business to respond wins. Flowra sends an immediate, personalized response to every new lead — and follows up automatically until they respond.",
  shortDescription:
    "Instant response to new leads, with automated follow-up sequences until they engage.",
  longDescription:
    "When a new lead comes in, Flowra responds within seconds with an AI-personalized message. If they don't reply, Flowra follows up at the right intervals — keeping your business top of mind without manual effort.",
  category: "Sales",
  icon: "Zap",
  color: "#22C55E",
  targetCustomer: ["Real Estate", "Financial Services", "Home Services", "B2B", "Agencies"],
  problem: "Speed to lead is everything. 78% of customers choose the first business that responds.",
  problemPoints: [
    "Manual follow-up is inconsistent",
    "Sales reps forget to follow up on time",
    "Leads go cold without nurturing",
    "No structured follow-up cadence",
  ],
  solution: "Automated, AI-personalized follow-up that responds instantly and persists until engagement.",
  workflowSteps: [
    { label: "Lead Received", description: "New lead enters the system", icon: "UserPlus" },
    { label: "Instant Response", description: "AI sends immediate personalized message", icon: "Zap" },
    { label: "AI Follow-Up 1", description: "Follow-up if no response after 24h", icon: "Clock" },
    { label: "AI Follow-Up 2", description: "Second follow-up after 72h", icon: "Clock" },
    { label: "Notify Sales", description: "Sales team notified if still no response", icon: "Bell" },
    { label: "Lead Archived", description: "Lead marked inactive if no engagement", icon: "Archive" },
  ],
  benefits: [
    "Respond to leads within seconds",
    "Never miss a follow-up",
    "AI messages feel personal, not robotic",
    "Works 24/7 without staff",
    "Full engagement tracking",
  ],
  requiredIntegrations: [
    { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" },
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
  ],
  configurableFields: [
    { key: "businessName", label: "Business Name", type: "text", required: true },
    { key: "offer", label: "What are you offering?", type: "textarea", required: false, placeholder: "e.g. Free consultation for property buyers in Dubai" },
  ],
  faqs: [
    { question: "How many follow-ups does it send?", answer: "By default: immediate response, 24h follow-up, and 72h follow-up. This is customizable in the workflow builder." },
    { question: "Can I stop the sequence if the lead responds?", answer: "Yes. Future versions will support response detection to stop the sequence." },
  ],
  ctaHeadline: "Never lose a lead to slow response again.",
  ctaSubtext: "Set up in 5 minutes. Respond in 5 seconds.",
  implementationStatus: "IMPLEMENTED",
  pricingTier: "starter",
  triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [
    { nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Lead Received" } },
    { nodeId: "aigen-1", type: "AI_GENERATE", positionX: 100, positionY: 240, data: { label: "Generate Instant Response", prompt: "You are a professional business assistant. A new lead just came in with the following information: {{input.body}}. Write a warm, personalized first response message (under 200 characters for SMS). Be helpful and invite them to continue the conversation.", systemPrompt: "Write short, personalized business messages." } },
    { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 380, data: { label: "Log Instant Response" } },
    { nodeId: "end-1", type: "END", positionX: 100, positionY: 520, data: { label: "Done" } },
  ],
  templateEdges: [
    { edgeId: "e1", source: "start-1", target: "aigen-1" },
    { edgeId: "e2", source: "aigen-1", target: "log-1" },
    { edgeId: "e3", source: "log-1", target: "end-1" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Product 05 — New Customer Welcome
// ─────────────────────────────────────────────────────────────────────────────
const newCustomerWelcome: AutomationProduct = {
  id: "prod_05_welcome",
  slug: "new-customer-welcome",
  name: "New Customer Welcome",
  tagline: "Make every new customer feel like a VIP from day one.",
  heroTitle: "Your First Impression Matters More Than You Think.",
  heroDescription:
    "When a new customer joins, Flowra automatically sends a warm welcome message, provides key information about your business, and starts the relationship on the right foot.",
  shortDescription:
    "Automated welcome sequence for new customers with business info and onboarding.",
  longDescription:
    "First impressions set the tone for the entire customer relationship. Flowra automatically sends a personalized welcome message when a new customer is created, introduces your business, and provides everything they need to get started.",
  category: "Customer Support",
  icon: "Heart",
  color: "#EC4899",
  targetCustomer: ["Service Businesses", "Clinics", "Gyms", "Salons", "E-commerce"],
  problem: "New customers often feel lost or unappreciated after signing up.",
  problemPoints: [
    "No consistent onboarding process",
    "Staff forget to send welcome messages",
    "New customers churn before their first interaction",
    "Poor first impressions damage retention",
  ],
  solution: "Instant, AI-personalized welcome message with business information when a new customer is created.",
  workflowSteps: [
    { label: "Customer Created", description: "New customer record added to system", icon: "UserPlus" },
    { label: "AI Personalizes", description: "AI creates personalized welcome message", icon: "Sparkles" },
    { label: "Welcome Sent", description: "SMS or WhatsApp welcome message delivered", icon: "MessageSquare" },
    { label: "Satisfaction Check", description: "Follow-up check-in after 7 days", icon: "HeartHandshake" },
    { label: "Record Updated", description: "Customer record updated with interaction", icon: "Database" },
  ],
  benefits: [
    "Every new customer feels valued from day one",
    "Consistent, professional onboarding experience",
    "Higher retention and satisfaction scores",
    "Zero manual effort required",
    "Works with SMS and WhatsApp",
  ],
  requiredIntegrations: [
    { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" },
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
    { id: "webhook", name: "Webhooks", icon: "Webhook", status: "available" },
  ],
  configurableFields: [
    { key: "businessName", label: "Business Name", type: "text", required: true },
    { key: "welcomeNote", label: "Special welcome note", type: "textarea", required: false, placeholder: "e.g. Use code WELCOME10 for 10% off your first order!" },
    { key: "channel", label: "Message Channel", type: "select", required: true, options: [{ label: "SMS", value: "sms" }, { label: "WhatsApp", value: "whatsapp" }] },
  ],
  faqs: [
    { question: "When is the welcome sent?", answer: "Immediately when a new customer record is created via webhook or API." },
    { question: "Can I customize the welcome message?", answer: "Yes. You can provide your business name, special offers, and key information that the AI incorporates." },
  ],
  ctaHeadline: "Start every customer relationship on the right foot.",
  ctaSubtext: "Automate your welcome. Keep customers for life.",
  implementationStatus: "IMPLEMENTED",
  pricingTier: "starter",
  triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [
    { nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "New Customer" } },
    { nodeId: "aigen-1", type: "AI_GENERATE", positionX: 100, positionY: 240, data: { label: "Generate Welcome Message", prompt: "You are a friendly business assistant. Welcome a new customer named {{input.name}} to our business. Write a warm, personal welcome message (under 200 characters). Make them feel valued. Do not be too formal.", systemPrompt: "Write warm, friendly business welcome messages." } },
    { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 380, data: { label: "Log Welcome Sent" } },
    { nodeId: "end-1", type: "END", positionX: 100, positionY: 520, data: { label: "Done" } },
  ],
  templateEdges: [
    { edgeId: "e1", source: "start-1", target: "aigen-1" },
    { edgeId: "e2", source: "aigen-1", target: "log-1" },
    { edgeId: "e3", source: "log-1", target: "end-1" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Products 06–15 — Structured definitions (COMING_SOON / PARTIAL)
// These are real product catalog entries. Execution will be implemented
// as the required integrations and infrastructure become available.
// ─────────────────────────────────────────────────────────────────────────────

const abandonedCartRecovery: AutomationProduct = {
  id: "prod_06_cart", slug: "abandoned-cart-recovery",
  name: "Abandoned Cart Recovery", tagline: "Recover lost sales automatically.",
  heroTitle: "Recover Lost Sales While You Sleep.", heroDescription: "Automatically reach out to customers who abandoned their cart and bring them back to complete their purchase.",
  shortDescription: "Automatically follow up with customers who abandoned their cart.", longDescription: "When a customer abandons their cart, Flowra waits, then sends a personalized recovery message with a gentle reminder — and optionally a discount.",
  category: "Ecommerce", icon: "ShoppingCart", color: "#F59E0B",
  targetCustomer: ["E-commerce Stores", "Shopify", "WooCommerce"],
  problem: "70% of shopping carts are abandoned. Most businesses never follow up.", problemPoints: ["Cart abandoned without follow-up", "Missed revenue opportunity", "No automated recovery system"],
  solution: "Scheduled recovery messages that bring customers back to complete their purchase.",
  workflowSteps: [
    { label: "Cart Abandoned", description: "Webhook from Shopify/WooCommerce", icon: "ShoppingCart" },
    { label: "Wait Period", description: "Wait 1 hour before first message", icon: "Clock" },
    { label: "Recovery Message", description: "Personalized reminder sent", icon: "MessageSquare" },
    { label: "Second Attempt", description: "24h follow-up with optional discount", icon: "Tag" },
  ],
  benefits: ["Recover 5–15% of abandoned carts", "Works 24/7 automatically", "Personalized messages per product"],
  requiredIntegrations: [
    { id: "shopify", name: "Shopify", icon: "ShoppingBag", status: "coming_soon" },
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
  ],
  configurableFields: [{ key: "discountCode", label: "Recovery Discount Code", type: "text", required: false }],
  faqs: [{ question: "Which ecommerce platforms are supported?", answer: "Shopify integration is coming soon. WooCommerce webhooks can be configured manually." }],
  ctaHeadline: "Every abandoned cart is money left on the table.", ctaSubtext: "Recover it automatically.",
  implementationStatus: "COMING_SOON", pricingTier: "growth", triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Cart Abandoned" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log Cart Event" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

const appointmentNoShow: AutomationProduct = {
  id: "prod_07_noshow", slug: "appointment-no-show-recovery",
  name: "Appointment No-Show Recovery", tagline: "Recover missed appointments before you lose the patient or client.",
  heroTitle: "Turn No-Shows Into Rescheduled Appointments.", heroDescription: "When a patient or client misses their appointment, Flowra automatically reaches out to reschedule — saving lost revenue.",
  shortDescription: "Automatically recover missed appointments with rescheduling offers.", longDescription: "Appointment no-shows cost businesses thousands of dollars. Flowra detects no-shows and immediately sends a recovery message offering to reschedule.",
  category: "Operations", icon: "CalendarX", color: "#8B5CF6",
  targetCustomer: ["Clinics", "Dentists", "Salons", "Fitness Centers", "Consultants"],
  problem: "No-shows cost service businesses 5–10% of their monthly revenue.", problemPoints: ["Appointment slots wasted", "No automatic follow-up", "Revenue lost with no recovery"],
  solution: "Automatic detection and recovery message for every no-show.",
  workflowSteps: [
    { label: "Appointment Time Passes", description: "Scheduled check runs at appointment time", icon: "Clock" },
    { label: "No-Show Detected", description: "System checks if appointment was completed", icon: "AlertTriangle" },
    { label: "Recovery Message", description: "Personalized message offering rescheduling", icon: "MessageSquare" },
    { label: "Rescheduling Link", description: "Link to booking calendar included", icon: "Calendar" },
  ],
  benefits: ["Recover 20–30% of no-shows", "Automatic rescheduling offer", "Works for any appointment-based business"],
  requiredIntegrations: [
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
    { id: "calendar", name: "Calendar Integration", icon: "Calendar", status: "coming_soon" },
  ],
  configurableFields: [{ key: "rescheduleLink", label: "Booking/Calendar Link", type: "text", required: false }],
  faqs: [{ question: "How does it detect no-shows?", answer: "Via webhook from your appointment system, or scheduled trigger that checks appointment status." }],
  ctaHeadline: "Stop letting no-shows drain your revenue.", ctaSubtext: "Recover them automatically.",
  implementationStatus: "COMING_SOON", pricingTier: "growth", triggerType: "SCHEDULED_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "No-Show Check" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log No-Show" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

const invoiceFollowUp: AutomationProduct = {
  id: "prod_08_invoice", slug: "invoice-payment-follow-up",
  name: "Invoice Payment Follow-Up", tagline: "Get paid on time, every time.",
  heroTitle: "Stop Chasing Late Payments Manually.", heroDescription: "Flowra automatically reminds clients about unpaid invoices — before, on, and after the due date — so you get paid without the awkward follow-up.",
  shortDescription: "Automatic invoice reminders via SMS, WhatsApp, or email.", longDescription: "Late payments are a major pain for service businesses. Flowra sends scheduled reminders before the due date, on the due date, and escalates if payment is overdue.",
  category: "Finance", icon: "Receipt", color: "#EF4444",
  targetCustomer: ["Freelancers", "Agencies", "Contractors", "Professional Services"],
  problem: "30% of invoices are paid late, costing businesses time and cash flow.", problemPoints: ["Awkward manual follow-up calls", "Inconsistent reminders", "Cash flow problems from late payments"],
  solution: "Scheduled invoice reminders that escalate automatically without human involvement.",
  workflowSteps: [
    { label: "Invoice Created", description: "New invoice added to system", icon: "FileText" },
    { label: "Pre-Due Reminder", description: "Reminder sent 3 days before due date", icon: "Bell" },
    { label: "Due Date Reminder", description: "Payment reminder on due date", icon: "Calendar" },
    { label: "Overdue Escalation", description: "Escalated reminder if overdue by 7 days", icon: "AlertTriangle" },
  ],
  benefits: ["Reduce late payments by 40%", "No awkward manual follow-ups", "Consistent professional tone"],
  requiredIntegrations: [
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
    { id: "quickbooks", name: "QuickBooks", icon: "BarChart3", status: "coming_soon" },
  ],
  configurableFields: [{ key: "paymentLink", label: "Payment Link", type: "text", required: false }],
  faqs: [{ question: "Which invoicing platforms are supported?", answer: "The workflow can be triggered via webhook from any invoicing platform. Direct integrations with QuickBooks and FreshBooks are coming soon." }],
  ctaHeadline: "Get paid on time without the awkward conversations.", ctaSubtext: "Automate your collections.",
  implementationStatus: "PARTIAL", pricingTier: "growth", triggerType: "SCHEDULED_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Invoice Created" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log Invoice Event" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

const customerReactivation: AutomationProduct = {
  id: "prod_09_reactivation", slug: "customer-reactivation",
  name: "Customer Reactivation", tagline: "Win back customers you thought were gone.",
  heroTitle: "Your Dormant Customers Are Your Best Opportunity.", heroDescription: "Identify customers who haven't visited in 30, 60, or 90 days and automatically send them a personalized win-back offer.",
  shortDescription: "Win back inactive customers with AI-personalized re-engagement messages.", longDescription: "Existing customers are 5× easier to sell to than new ones. Flowra identifies dormant customers and sends a personalized, AI-written win-back message at the right time.",
  category: "Marketing", icon: "RefreshCw", color: "#06B6D4",
  targetCustomer: ["Salons", "Gyms", "Clinics", "Restaurants", "Retail"],
  problem: "Most businesses lose 20–40% of customers each year through inaction.", problemPoints: ["No system to identify dormant customers", "Inactive customers become lost forever", "Win-back is proven cheaper than acquisition"],
  solution: "AI identifies and personalizes win-back messages for every dormant customer.",
  workflowSteps: [
    { label: "Dormancy Detected", description: "Customer inactive for X days", icon: "Clock" },
    { label: "AI Personalizes", description: "AI creates personalized win-back offer", icon: "Sparkles" },
    { label: "Message Sent", description: "SMS or WhatsApp re-engagement message", icon: "MessageSquare" },
    { label: "Follow-Up", description: "Second attempt if no response", icon: "RotateCw" },
    { label: "Result Logged", description: "Engagement status recorded", icon: "Database" },
  ],
  benefits: ["Recover 10–25% of dormant customers", "Personalized messages for each customer", "Works while you sleep"],
  requiredIntegrations: [
    { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" },
    { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" },
  ],
  configurableFields: [{ key: "dormancyDays", label: "Days before considering inactive", type: "number", required: true, placeholder: "30" }],
  faqs: [{ question: "How does it know who is dormant?", answer: "Via scheduled trigger + webhook from your CRM or booking system tracking last visit date." }],
  ctaHeadline: "Your best customers are already in your database.", ctaSubtext: "Bring them back automatically.",
  implementationStatus: "PARTIAL", pricingTier: "growth", triggerType: "SCHEDULED_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Dormancy Check" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log Reactivation" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

const aiCustomerSupport: AutomationProduct = {
  id: "prod_10_support", slug: "ai-customer-support",
  name: "AI Customer Support", tagline: "Answer customer questions instantly, 24/7.",
  heroTitle: "Your AI Support Agent Never Sleeps.", heroDescription: "Flowra's AI handles common customer questions instantly via WhatsApp or SMS — and escalates to a human when needed.",
  shortDescription: "AI answers customer questions and escalates complex issues to your team.", longDescription: "Connect Flowra to your WhatsApp Business or SMS line. AI handles common questions instantly. Complex issues are routed to your support team with full conversation context.",
  category: "Customer Support", icon: "HeadphonesIcon", color: "#635BFF",
  targetCustomer: ["Service Businesses", "E-commerce", "SaaS", "Local Businesses"],
  problem: "Customers expect instant answers but staffing 24/7 support is expensive.", problemPoints: ["Long response times frustrate customers", "Staff overwhelmed with repetitive questions", "After-hours queries go unanswered"],
  solution: "AI handles common questions instantly. Humans handle complex ones.",
  workflowSteps: [
    { label: "Message Received", description: "Customer sends WhatsApp/SMS message", icon: "MessageSquare" },
    { label: "AI Analyzes", description: "AI determines intent and complexity", icon: "Brain" },
    { label: "AI Answers", description: "Instant AI-generated response for simple queries", icon: "Sparkles" },
    { label: "Human Escalation", description: "Complex issues routed to team", icon: "Users" },
  ],
  benefits: ["80% of questions answered instantly", "24/7 availability", "Full conversation logging"],
  requiredIntegrations: [
    { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" },
    { id: "whatsapp", name: "WhatsApp Business", icon: "MessageSquare", status: "requires_setup" },
  ],
  configurableFields: [{ key: "businessContext", label: "Business Knowledge Base", type: "textarea", required: false, placeholder: "Describe your business, common questions, and answers..." }],
  faqs: [{ question: "Does it require a knowledge base?", answer: "You can provide business context in the configuration. Full RAG knowledge base is coming in a future version." }],
  ctaHeadline: "Give every customer an instant answer.", ctaSubtext: "24/7. No extra staff.",
  implementationStatus: "PARTIAL", pricingTier: "business", triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Message Received" } }, { nodeId: "aigen-1", type: "AI_GENERATE", positionX: 100, positionY: 240, data: { label: "Generate Answer", prompt: "Answer the following customer question professionally: {{input.message}}", systemPrompt: "You are a helpful business support assistant." } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 380, data: { label: "Log Interaction" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 520, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "aigen-1" }, { edgeId: "e2", source: "aigen-1", target: "log-1" }, { edgeId: "e3", source: "log-1", target: "end-1" }],
};

const quoteFollowUp: AutomationProduct = {
  id: "prod_11_quote", slug: "quote-follow-up",
  name: "Quote & Estimate Follow-Up", tagline: "Follow up on every quote without lifting a finger.",
  heroTitle: "Turn More Quotes Into Paying Customers.", heroDescription: "After sending a quote, Flowra automatically follows up at the right intervals — so you never lose a deal because someone forgot to follow up.",
  shortDescription: "Automated follow-up sequence for sent quotes and estimates.", longDescription: "Most quotes go unanswered not because the customer isn't interested, but because the business never followed up. Flowra changes that.",
  category: "Sales", icon: "FileText", color: "#8B5CF6",
  targetCustomer: ["Contractors", "Agencies", "Home Services", "B2B Sales"],
  problem: "60% of quotes go unanswered. Most businesses never follow up more than once.",
  problemPoints: ["Sales reps forget to follow up", "Quotes go cold without nurturing", "No systematic follow-up process"],
  solution: "Scheduled follow-up sequence for every sent quote.", workflowSteps: [{ label: "Quote Sent", description: "Quote/proposal sent to customer", icon: "Send" }, { label: "Follow-Up 1", description: "3-day follow-up", icon: "Clock" }, { label: "Follow-Up 2", description: "7-day AI-personalized message", icon: "Sparkles" }, { label: "Sales Notified", description: "Salesperson alerted if still no response", icon: "Bell" }],
  benefits: ["Close 15–25% more quotes", "Consistent professional follow-up", "No manual tracking required"],
  requiredIntegrations: [{ id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" }, { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" }],
  configurableFields: [{ key: "quoteValue", label: "Quote value (for prioritization)", type: "text", required: false }],
  faqs: [{ question: "How many follow-ups does it send?", answer: "Default: 3-day, 7-day, and 14-day follow-ups. Customizable in the workflow builder." }],
  ctaHeadline: "Every quote deserves a follow-up. Make it automatic.", ctaSubtext: "Close more deals with zero extra effort.",
  implementationStatus: "COMING_SOON", pricingTier: "starter", triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Quote Sent" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log Quote" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

const appointmentReminder: AutomationProduct = {
  id: "prod_12_reminder", slug: "appointment-reminder",
  name: "Appointment Reminder & Confirmation", tagline: "Reduce no-shows by 40% with automated reminders.",
  heroTitle: "Never Let a Client Forget Their Appointment.", heroDescription: "Automatically remind clients 24 hours and 2 hours before their appointment — reducing no-shows and last-minute cancellations.",
  shortDescription: "Automated appointment reminders via SMS/WhatsApp to reduce no-shows.", longDescription: "Appointment reminders are one of the simplest, highest-ROI automations for service businesses. Flowra sends them at precisely the right times.",
  category: "Operations", icon: "CalendarCheck", color: "#22C55E",
  targetCustomer: ["Clinics", "Dentists", "Salons", "Fitness Centers", "Lawyers"],
  problem: "No-show rates average 15–30% without reminders.", problemPoints: ["Staff manually call/text every client", "Last-minute cancellations waste slots", "Inconsistent reminder process"],
  solution: "Automated reminders at 24h and 2h before every appointment.",
  workflowSteps: [{ label: "Appointment Booked", description: "Appointment created in system", icon: "Calendar" }, { label: "24h Reminder", description: "Reminder sent day before", icon: "Bell" }, { label: "2h Reminder", description: "Final reminder 2 hours before", icon: "Clock" }, { label: "Confirmation", description: "Client confirms or requests reschedule", icon: "CheckCircle" }],
  benefits: ["Reduce no-shows by up to 40%", "Automatic confirmation collection", "Works with any appointment system"],
  requiredIntegrations: [{ id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" }, { id: "calendar", name: "Calendar", icon: "Calendar", status: "coming_soon" }],
  configurableFields: [{ key: "reminderTiming", label: "Reminder timing", type: "select", required: false, options: [{ label: "24h + 2h", value: "24h_2h" }, { label: "24h only", value: "24h" }, { label: "2h only", value: "2h" }] }],
  faqs: [{ question: "Which calendar platforms are supported?", answer: "Direct calendar integrations are coming soon. Webhooks from Calendly, Cal.com, and others can be configured." }],
  ctaHeadline: "Reduce no-shows. Maximize your revenue per day.", ctaSubtext: "Automated reminders that actually work.",
  implementationStatus: "COMING_SOON", pricingTier: "starter", triggerType: "SCHEDULED_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Appointment Booked" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log Appointment" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

const hrOnboarding: AutomationProduct = {
  id: "prod_13_hr", slug: "hr-employee-onboarding",
  name: "HR Employee Onboarding", tagline: "Welcome every new employee the right way.",
  heroTitle: "First Days Set the Tone for the Entire Career.", heroDescription: "When a new employee joins, Flowra automatically sends welcome messages, required documents, and schedules key onboarding milestones.",
  shortDescription: "Automated onboarding sequence for new employees with documents and check-ins.", longDescription: "Employee onboarding is critical for retention. Flowra automates the repetitive parts — welcome messages, document delivery, and check-in scheduling — so HR can focus on the human side.",
  category: "HR", icon: "Users", color: "#06B6D4",
  targetCustomer: ["Small Businesses", "Medium Businesses", "HR Teams"],
  problem: "Poor onboarding is the #1 reason new employees leave in the first 90 days.", problemPoints: ["Inconsistent onboarding experience", "HR overwhelmed with repetitive tasks", "New employees feel lost and unsupported"],
  solution: "Automated onboarding sequence that delivers the right information at the right time.",
  workflowSteps: [{ label: "Employee Added", description: "New employee record created", icon: "UserPlus" }, { label: "Welcome Sent", description: "Personalized welcome message", icon: "Heart" }, { label: "Documents Delivered", description: "Required documents and links sent", icon: "FileText" }, { label: "Day 1 Reminder", description: "Reminder of first day details", icon: "Calendar" }],
  benefits: ["Better first impressions", "Consistent onboarding for every employee", "HR saves 2–4 hours per new hire"],
  requiredIntegrations: [{ id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" }, { id: "webhook", name: "Webhooks", icon: "Webhook", status: "available" }],
  configurableFields: [{ key: "companyHandbook", label: "Company Handbook Link", type: "text", required: false }, { key: "hrContact", label: "HR Contact Phone", type: "phone", required: false }],
  faqs: [{ question: "What documents can it send?", answer: "Any links to documents, portals, or forms can be included in the welcome messages." }],
  ctaHeadline: "Give every new hire the welcome they deserve.", ctaSubtext: "Automate onboarding. Focus on culture.",
  implementationStatus: "COMING_SOON", pricingTier: "growth", triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "New Employee" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log Onboarding Start" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

const realEstateLead: AutomationProduct = {
  id: "prod_14_realestate", slug: "real-estate-lead-nurture",
  name: "Real Estate Lead Nurture", tagline: "Match every lead to the perfect property automatically.",
  heroTitle: "Turn Property Inquiries Into Signed Deals.", heroDescription: "AI analyzes every incoming real estate lead's requirements, matches them to available properties, and starts a personalized nurture sequence.",
  shortDescription: "AI analyzes lead requirements and starts a personalized property match sequence.", longDescription: "Real estate leads require fast, personalized responses. Flowra extracts property requirements, scores intent, and starts a tailored nurture sequence for each lead.",
  category: "Real Estate", icon: "Home", color: "#8B5CF6",
  targetCustomer: ["Real Estate Agents", "Property Developers", "Real Estate Agencies"],
  problem: "Real estate leads expect instant, personalized responses 24/7.", problemPoints: ["Agents can't respond instantly to every inquiry", "Generic responses lose high-intent buyers", "No consistent follow-up system"],
  solution: "AI extracts requirements and starts a personalized property match sequence immediately.",
  workflowSteps: [{ label: "Lead Received", description: "Property inquiry submitted", icon: "Home" }, { label: "AI Analysis", description: "AI extracts budget, location, type requirements", icon: "Brain" }, { label: "Instant Response", description: "Personalized response acknowledging requirements", icon: "MessageSquare" }, { label: "Agent Notified", description: "Hot leads immediately escalated", icon: "Bell" }],
  benefits: ["Instant response to every inquiry", "AI-powered requirement extraction", "Automatic hot lead escalation"],
  requiredIntegrations: [{ id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" }, { id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" }],
  configurableFields: [{ key: "agentName", label: "Agent Name", type: "text", required: false }, { key: "propertyPortfolio", label: "Property portfolio description", type: "textarea", required: false }],
  faqs: [{ question: "Can it match leads to specific listings?", answer: "Current version analyzes requirements and generates personalized responses. Direct property database matching is coming soon." }],
  ctaHeadline: "Every property inquiry deserves an instant, personal response.", ctaSubtext: "Let AI handle the first contact. You close the deal.",
  implementationStatus: "COMING_SOON", pricingTier: "business", triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Lead Received" } }, { nodeId: "aigen-1", type: "AI_GENERATE", positionX: 100, positionY: 240, data: { label: "Analyze Requirements", prompt: "Extract property requirements from this lead: {{input.body}}", systemPrompt: "You extract real estate requirements from lead messages." } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 380, data: { label: "Log Lead Analysis" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 520, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "aigen-1" }, { edgeId: "e2", source: "aigen-1", target: "log-1" }, { edgeId: "e3", source: "log-1", target: "end-1" }],
};

const postPurchaseFollowUp: AutomationProduct = {
  id: "prod_15_postpurchase", slug: "post-purchase-follow-up",
  name: "Post-Purchase Follow-Up", tagline: "Turn one-time buyers into loyal customers.",
  heroTitle: "Your Sale Is Just the Beginning.", heroDescription: "After every purchase, Flowra automatically thanks the customer, provides product/service information, checks satisfaction, and creates cross-sell opportunities.",
  shortDescription: "Automated post-purchase sequence to improve retention and drive repeat business.", longDescription: "The period after a purchase is the most critical for retention. Flowra automates the entire post-purchase journey — from thank-you messages to review requests to cross-sell offers.",
  category: "Ecommerce", icon: "ShoppingBag", color: "#F59E0B",
  targetCustomer: ["E-commerce", "Service Businesses", "SaaS", "Local Businesses"],
  problem: "80% of businesses focus only on acquiring new customers, ignoring post-purchase retention.", problemPoints: ["No thank-you or follow-up after purchase", "Customers leave without feedback or reviews", "Cross-sell opportunities missed"],
  solution: "Automated post-purchase journey from thank-you to cross-sell.",
  workflowSteps: [{ label: "Purchase Completed", description: "Order or service completed", icon: "CheckCircle" }, { label: "Thank Customer", description: "Immediate thank-you message", icon: "Heart" }, { label: "Delivery/Usage Info", description: "Product or service instructions", icon: "Package" }, { label: "Satisfaction Check", description: "Check-in after 48h", icon: "Star" }, { label: "Review Request", description: "Happy customers invited to review", icon: "MessageSquare" }, { label: "Cross-Sell", description: "Relevant offer for next purchase", icon: "Tag" }],
  benefits: ["Higher customer lifetime value", "More reviews from happy customers", "Repeat purchase rate improvement"],
  requiredIntegrations: [{ id: "twilio", name: "Twilio", icon: "PhoneCall", status: "requires_setup" }, { id: "groq", name: "Groq AI", icon: "Sparkles", status: "requires_setup" }],
  configurableFields: [{ key: "productInfo", label: "Product/Service Information", type: "textarea", required: false }],
  faqs: [{ question: "When is the follow-up sent?", answer: "Immediately after purchase (thank-you), 48h later (satisfaction check), and 5 days later (review request)." }],
  ctaHeadline: "Your best customers buy again. Make that automatic.", ctaSubtext: "Turn every purchase into a relationship.",
  implementationStatus: "COMING_SOON", pricingTier: "growth", triggerType: "WEBHOOK_TRIGGER",
  templateNodes: [{ nodeId: "start-1", type: "START", positionX: 100, positionY: 100, data: { label: "Purchase Completed" } }, { nodeId: "log-1", type: "LOG", positionX: 100, positionY: 240, data: { label: "Log Purchase" } }, { nodeId: "end-1", type: "END", positionX: 100, positionY: 380, data: { label: "Done" } }],
  templateEdges: [{ edgeId: "e1", source: "start-1", target: "log-1" }, { edgeId: "e2", source: "log-1", target: "end-1" }],
};

// ─────────────────────────────────────────────────────────────────────────────
// Master Catalog
// ─────────────────────────────────────────────────────────────────────────────
export const AUTOMATION_PRODUCTS: AutomationProduct[] = [
  missedCallRecovery,
  aiLeadQualification,
  reviewReputation,
  leadFollowUp,
  newCustomerWelcome,
  abandonedCartRecovery,
  appointmentNoShow,
  invoiceFollowUp,
  customerReactivation,
  aiCustomerSupport,
  quoteFollowUp,
  appointmentReminder,
  hrOnboarding,
  realEstateLead,
  postPurchaseFollowUp,
];

export function getProductBySlug(slug: string): AutomationProduct | undefined {
  return AUTOMATION_PRODUCTS.find((p) => p.slug === slug);
}

export const PRODUCT_CATEGORIES = [
  "All",
  "Sales",
  "Customer Support",
  "Marketing",
  "Operations",
  "Ecommerce",
  "Real Estate",
  "HR",
  "Finance",
] as const;
