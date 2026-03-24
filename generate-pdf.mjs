import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// A4 dimensions in pixels at 96dpi
const A4_W = 794;
const A4_H = 1123;
const PAD = 48;
const CONTENT_W = A4_W - PAD * 2;

// Load local images as base64
import fs from 'fs';
function imgSrc(relPath) {
  const abs = path.join(__dirname, relPath);
  if (!fs.existsSync(abs)) return '';
  const ext = path.extname(abs).slice(1).replace('jpg', 'jpeg');
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
  return `data:${mime};base64,${fs.readFileSync(abs).toString('base64')}`;
}

const screenshots = {
  rainmaker: imgSrc('screenshots/cloud-deployer.png'),
  mcpbay: imgSrc('screenshots/mcpbay.png'),
  lumin: imgSrc('screenshots/lumin2.png'),
  lifeafterlikes: imgSrc('screenshots/lifeafterlikes.png'),
  threatsrus: imgSrc('screenshots/threatsrus.png'),
  defensedude: imgSrc('screenshots/thedefensedude.png'),
};

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #060606;
    --card: #111;
    --cyan: #00ccff;
    --blue: #4488ff;
    --red: #ff3333;
    --yellow: #ffcc00;
    --green: #00ff88;
    --purple: #cc44ff;
    --white: #f0f0f0;
    --dim: #999;
    --dimmer: #666;
  }

  @page { size: A4; margin: 0; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--white);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: ${A4_W}px;
    height: ${A4_H}px;
    padding: ${PAD}px;
    position: relative;
    overflow: hidden;
    page-break-after: always;
    display: flex;
    flex-direction: column;
  }

  .page:last-child { page-break-after: auto; }

  .page-content { flex: 1; display: flex; flex-direction: column; }

  .page-footer {
    text-align: center;
    font-size: 8px;
    color: var(--dimmer);
    letter-spacing: 1px;
    border-top: 1px solid #222;
    padding-top: 8px;
    margin-top: auto;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 16px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--cyan);
  }

  .header-compact { padding-bottom: 10px; margin-bottom: 16px; }

  .header h1 {
    font-family: 'Courier Prime', monospace;
    font-size: 32px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: 2px;
    line-height: 1.1;
  }

  .header-compact h1 { font-size: 18px; }

  .header .subtitle {
    font-size: 12px;
    color: var(--dim);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .header-compact .subtitle { font-size: 9px; margin-top: 2px; }

  .header-right {
    text-align: right;
    font-size: 10px;
    color: var(--dim);
    line-height: 1.7;
  }

  .header-compact .header-right { font-size: 8px; }

  .header-right a { color: var(--cyan); text-decoration: none; }

  .badges { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }

  .badge {
    font-size: 8px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 3px;
    border: 1px solid;
  }

  .b-blue   { color: var(--blue);   border-color: var(--blue); }
  .b-cyan   { color: var(--cyan);   border-color: var(--cyan); }
  .b-red    { color: var(--red);    border-color: var(--red); }
  .b-yellow { color: var(--yellow); border-color: var(--yellow); }
  .b-green  { color: var(--green);  border-color: var(--green); }

  /* ── SECTIONS ── */
  .slabel {
    font-family: 'Courier Prime', monospace;
    font-size: 9px;
    color: var(--dimmer);
    letter-spacing: 2px;
    margin-bottom: 3px;
  }

  .stitle {
    font-family: 'Courier Prime', monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .divider { border: none; border-top: 1px solid #1a1a1a; margin: 18px 0; }

  /* ── BIO ── */
  .bio { font-size: 12px; color: var(--dim); line-height: 1.8; }

  /* ── EXPERIENCE ── */
  .job {
    margin-bottom: 16px;
    padding-left: 14px;
    border-left: 3px solid var(--green);
  }

  .job-co { font-size: 13px; font-weight: 700; color: var(--white); }
  .job-title { font-size: 11px; color: var(--cyan); font-weight: 500; }
  .job-dates { font-size: 9px; color: var(--dimmer); margin-bottom: 3px; }
  .job-ctx { font-size: 9px; color: var(--dim); font-style: italic; margin-bottom: 4px; }
  .job-sum { font-size: 10px; color: var(--dim); margin-bottom: 4px; }
  .job ul { padding-left: 14px; margin: 0; }
  .job li { font-size: 9px; color: var(--dim); line-height: 1.55; margin-bottom: 1px; }

  /* ── SPEAKING ── */
  .talk {
    margin-bottom: 12px;
    padding: 10px 14px;
    background: var(--card);
    border-left: 3px solid var(--red);
  }

  .talk-ev { font-size: 8px; color: var(--dimmer); letter-spacing: 1px; text-transform: uppercase; }
  .talk-t { font-size: 13px; font-weight: 600; color: var(--white); margin: 3px 0; }
  .talk-m { font-size: 10px; color: var(--dim); line-height: 1.5; }

  /* ── CARDS ── */
  .cgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cgrid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

  .crd {
    padding: 12px;
    background: var(--card);
    border-left: 3px solid var(--yellow);
  }

  .crd.purple { border-left-color: var(--purple); }
  .crd-org { font-size: 12px; font-weight: 700; color: var(--white); }
  .crd-role { font-size: 10px; color: var(--cyan); }
  .crd-dates { font-size: 8px; color: var(--dimmer); margin-bottom: 5px; }
  .crd p { font-size: 9px; color: var(--dim); line-height: 1.55; }

  /* ── PORTFOLIO ── */
  .pgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .pitem {
    background: var(--card);
    border: 1px solid #222;
    border-left: 3px solid var(--cyan);
    overflow: hidden;
  }

  .pimg {
    width: 100%;
    height: 150px;
    object-fit: cover;
    object-position: top;
    display: block;
    border-bottom: 1px solid #222;
  }

  .pbody { padding: 12px; }
  .pname { font-size: 13px; font-weight: 700; color: var(--cyan); }
  .purl { font-size: 9px; color: var(--dimmer); margin-bottom: 4px; }
  .purl a { color: var(--dimmer); text-decoration: none; }
  .pdesc { font-size: 9px; color: var(--dim); line-height: 1.55; }

  /* ── EDUCATION ── */
  .edu {
    padding: 12px 16px;
    background: var(--card);
    border-left: 3px solid var(--blue);
    margin-bottom: 12px;
  }

  .edu-school { font-size: 13px; font-weight: 700; color: var(--white); }
  .edu-deg { font-size: 11px; color: var(--dim); }

  .certs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

  .cert {
    font-size: 9px;
    font-weight: 600;
    color: var(--yellow);
    border: 1px solid rgba(255,204,0,0.3);
    padding: 2px 8px;
    border-radius: 3px;
    letter-spacing: 1px;
  }

  .contact-row { font-size: 11px; color: var(--dim); margin-bottom: 5px; }
  .contact-row a { color: var(--cyan); text-decoration: none; }
  .contact-row strong { color: var(--white); }
</style>
</head>
<body>

<!-- ═══════ PAGE 1: ABOUT ═══════ -->
<div class="page">
  <div class="page-content">
    <div class="header">
      <div>
        <h1>John Lockie</h1>
        <div class="subtitle">Head of Infrastructure &amp; Platform Services</div>
        <div class="badges">
          <span class="badge b-blue">Cloud &amp; DevOps</span>
          <span class="badge b-cyan">Infrastructure</span>
          <span class="badge b-red">Cybersecurity</span>
          <span class="badge b-yellow">Enterprise Support</span>
          <span class="badge b-green">Agentic Strategy</span>
        </div>
      </div>
      <div class="header-right">
        john.lockie@gmail.com<br>
        (818) 738-5815<br>
        <a href="https://www.linkedin.com/in/johnlockie">linkedin.com/in/johnlockie</a><br>
        <a href="https://johnlockie.com">johnlockie.com</a>
      </div>
    </div>

    <div class="slabel">// 01</div>
    <div class="stitle" style="color:var(--cyan)">About</div>
    <p class="bio">
      Over two decades of experience in technology leadership, specializing in driving business
      transformation through infrastructure, cybersecurity, cloud services, software development,
      data science, and emerging technologies. Leadership responsibilities include mentoring
      high-performing cross-functional teams, managing global technology platforms, and
      spearheading key technology initiatives.
    </p>

    <hr class="divider">

    <div class="slabel">// 07</div>
    <div class="stitle" style="color:var(--blue)">Education</div>

    <div class="edu">
      <div class="edu-school">Western Governors University</div>
      <div class="edu-deg">Bachelor of Science — Cybersecurity and Information Assurance</div>
    </div>

    <div class="edu" style="border-left-color: var(--yellow);">
      <div class="edu-school" style="color:var(--yellow); font-size:11px; letter-spacing:2px; text-transform:uppercase;">Certifications</div>
      <div class="certs">
        <span class="cert">CISSP</span>
        <span class="cert">A+</span>
        <span class="cert">Network+</span>
        <span class="cert">CySA+</span>
        <span class="cert">Project+</span>
        <span class="cert">CIOS</span>
        <span class="cert">CCDA</span>
        <span class="cert">CCNA</span>
        <span class="cert">AWS Cloud Practitioner</span>
        <span class="cert">ITIL Foundation</span>
      </div>
    </div>

    <hr class="divider">

    <div class="slabel">// 08</div>
    <div class="stitle" style="color:var(--cyan)">Contact</div>

    <div class="contact-row"><strong>Email:</strong> &nbsp; <a href="mailto:john.lockie@gmail.com">john.lockie@gmail.com</a></div>
    <div class="contact-row"><strong>Phone:</strong> &nbsp; (818) 738-5815</div>
    <div class="contact-row"><strong>LinkedIn:</strong> &nbsp; <a href="https://www.linkedin.com/in/johnlockie">linkedin.com/in/johnlockie</a></div>
    <div class="contact-row"><strong>Web:</strong> &nbsp; <a href="https://johnlockie.com">johnlockie.com</a></div>
  </div>
  <div class="page-footer">John Lockie &middot; johnlockie.com &middot; Page 1</div>
</div>

<!-- ═══════ PAGE 2: EXPERIENCE ═══════ -->
<div class="page">
  <div class="page-content">
    <div class="header header-compact">
      <div>
        <h1>John Lockie</h1>
        <div class="subtitle">Head of Infrastructure &amp; Platform Services</div>
      </div>
      <div class="header-right">john.lockie@gmail.com<br><a href="https://johnlockie.com">johnlockie.com</a></div>
    </div>

    <div class="slabel">// 02</div>
    <div class="stitle" style="color:var(--green)">Experience</div>

    <div class="job">
      <div class="job-co">Kayne Anderson Capital Advisors</div>
      <div class="job-title">Head of Infrastructure and Platform Services</div>
      <div class="job-dates">July 2020 – Present</div>
      <div class="job-ctx">Global $40B+ private equity and investment management firm with offices in US and Europe.</div>
      <div class="job-sum">Leading global infrastructure and operations teams reporting to the CTO.</div>
      <ul>
        <li>Extremely well-versed in AI technologies: Agentic AI/Agents, RAG, Model Context Protocol (MCP), Ontologies &amp; Knowledge Graphs, Agent Skills, LangChain, Chain-of-Thought Prompting, Semantic Search, and Tool Augmentation.</li>
        <li>Delivering strategic guidance and leadership to the IT Steering, Risk, and Security committees.</li>
        <li>Maturing the firm's cloud computing strategy — highly available, scalable, cost-effective platform supporting fourfold growth from 2020 to 2025.</li>
        <li>Overseeing the divestiture / carve-out of multiple business units (Liquid Credit, Growth Capital, Family Office), and portfolio company wind downs.</li>
        <li>Cultivating a data-driven, "business first" global 24×7 support culture.</li>
        <li>Oversight of vendor relationships, IT budget, and contract management platform.</li>
        <li>Key initiatives: firmwide digital re-brand · email security overhaul · SMS compliance monitoring · ZTNA remote access · eliminated physical data centers · complete AV infrastructure overhaul.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-co">DoubleLine Capital</div>
      <div class="job-title">Head of Infrastructure &amp; CISO</div>
      <div class="job-dates">January 2017 – July 2020</div>
      <div class="job-ctx">Global investment manager with $150B+ AUM. Managing 12+ across global operations in a heavily regulated '40 Act Fund environment.</div>
      <ul>
        <li>Established comprehensive technology risk program; served on Operational Risk and Business Continuity Sub-Committees.</li>
        <li>Overhauled Corporate Information Security and Privacy Policies for GDPR, CCPA, and beyond.</li>
        <li>Aligned security program with NIST standards; rebuilt the Incident Response Plan.</li>
        <li>Led migration to cloud, improving security posture and reducing third-party hosting costs.</li>
        <li>Built tailored user awareness training program, significantly reducing phishing failure rates.</li>
        <li>Developed cross-functional third-party risk management process from scratch.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-co">Caltech Employees Federal Credit Union</div>
      <div class="job-title">AVP, Infrastructure and Information Security</div>
      <div class="job-dates">March 2013 – January 2017</div>
      <div class="job-ctx">34,000+ members throughout North America with $2B+ in assets.</div>
      <ul>
        <li>Led all aspects of technology, reporting directly to the CIO.</li>
        <li>Oversaw development and launch of a new online and mobile banking platform.</li>
        <li>Implemented and managed Palo Alto, Carbon Black, McAfee, Nessus, NetApp, Cisco, Proofpoint, and ZixMail.</li>
        <li>Directed security audits, risk management, and compliance assessments.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-co">Gain Federal Credit Union</div>
      <div class="job-title">Director of Information Technology</div>
      <div class="job-dates">March 2012 – March 2013</div>
      <div class="job-ctx">15,000+ members in Southern California with $300M+ in assets.</div>
      <ul>
        <li>Managed all aspects of IT including in-house development of online and mobile banking platforms.</li>
        <li>Delivered infrastructure oversight including major data center improvements and rapid efficiency gains.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-co">CSI Electrical Contractors, Inc.</div>
      <div class="job-title">Director of Technology</div>
      <div class="job-dates">July 2004 – March 2012</div>
      <div class="job-ctx">Large premier industrial electrical contractor, 1,000+ employees across multiple sites.</div>
      <ul>
        <li>Managed strategy, IT staff, budgeting, purchasing, infrastructure and support — reporting to the CFO.</li>
        <li>Oversaw development of custom mobile applications for field services.</li>
        <li>Virtualized all data centers using converged infrastructure (FlexPod) to accommodate accelerated growth.</li>
        <li>Established and headed the first technology solutions group — expanded into voice and data solutions.</li>
      </ul>
    </div>
  </div>
  <div class="page-footer">John Lockie &middot; johnlockie.com &middot; Page 2</div>
</div>

<!-- ═══════ PAGE 3: SPEAKING ═══════ -->
<div class="page">
  <div class="page-content">
    <div class="header header-compact">
      <div>
        <h1>John Lockie</h1>
        <div class="subtitle">Head of Infrastructure &amp; Platform Services</div>
      </div>
      <div class="header-right">john.lockie@gmail.com<br><a href="https://johnlockie.com">johnlockie.com</a></div>
    </div>

    <div class="slabel">// 03</div>
    <div class="stitle" style="color:var(--red)">Speaking</div>

    <div class="talk">
      <div class="talk-ev">ITNation Connect · Nov 2024</div>
      <div class="talk-t">7 Deadly Sins of MSPs</div>
      <div class="talk-m">Industry conference for MSPs, keynote-style presentation from the customer's perspective of what MSPs do wrong.</div>
    </div>

    <div class="talk">
      <div class="talk-ev">FS-ISAC · June 2024 · 600+ Attendees</div>
      <div class="talk-t">IAM not who I say IAM: Evolving Threat of Deepfakes</div>
      <div class="talk-m">Past, present and future state of deepfake technologies targeting financial services sector. Talk given in multiple settings and multiple industries.</div>
    </div>

    <div class="talk">
      <div class="talk-ev">FS-ISAC · May 2017</div>
      <div class="talk-t">Stranger Things: Active Directory Auditing with Bloodhound</div>
      <div class="talk-m">Technical talk on using what was at the time a novel purple team tool. Given to financial services audience.</div>
    </div>

    <div class="talk">
      <div class="talk-ev">FS-ISAC · May 2017</div>
      <div class="talk-t">Threat Intelligence: From Consumer to Producer</div>
      <div class="talk-m">A talk aimed at providing a roadmap for FS-ISAC members seeking to add their voice to the fight against digital financial crime.</div>
    </div>

    <div class="talk">
      <div class="talk-ev">FS-ISAC · October 2016</div>
      <div class="talk-t">Panel Moderator: Threat Intelligence for Community Institutions</div>
      <div class="talk-m">Panel discussion analyzing the role a threat intelligence program can play within community institutions (regional banks, etc.).</div>
    </div>
  </div>
  <div class="page-footer">John Lockie &middot; johnlockie.com &middot; Page 3</div>
</div>

<!-- ═══════ PAGE 4: VOLUNTEERING & ADVISING ═══════ -->
<div class="page">
  <div class="page-content">
    <div class="header header-compact">
      <div>
        <h1>John Lockie</h1>
        <div class="subtitle">Head of Infrastructure &amp; Platform Services</div>
      </div>
      <div class="header-right">john.lockie@gmail.com<br><a href="https://johnlockie.com">johnlockie.com</a></div>
    </div>

    <div class="slabel">// 04</div>
    <div class="stitle" style="color:var(--yellow)">Volunteering</div>

    <div class="cgrid">
      <div class="crd">
        <div class="crd-org">American Corporate Partners</div>
        <div class="crd-role">Career Mentor for US Veterans</div>
        <div class="crd-dates">April 2023 – Present</div>
        <p>Mentoring active duty and veteran service members who are seeking technology careers in the private sector, or seeking growth through network expansion. It is an incredible honor to be a small part of their professional story, and I consider it a great joy to share knowledge and guidance with the men and women of our military.</p>
      </div>
      <div class="crd">
        <div class="crd-org">The Master's University</div>
        <div class="crd-role">Cyber Security Program Advisor</div>
        <div class="crd-dates">January 2024 – Present</div>
        <p>Having attended Master's from 1998 through 2001, I have since reconnected as alumni and was brought on to advise the technology department with a particular focus on cybersecurity program guidance and mentorship of the CIO's leadership team.</p>
      </div>
    </div>

    <hr class="divider">

    <div class="slabel">// 05</div>
    <div class="stitle" style="color:var(--purple)">Advising</div>

    <div class="cgrid3">
      <div class="crd purple">
        <div class="crd-org">Perch Security</div>
        <div class="crd-role">Founding Advisor · Client #1</div>
        <div class="crd-dates">2016 – 2020</div>
        <p>Worked with founders to test and build a cloud-based IDS — the first of its kind, enabling SMBs to leverage actionable intel through hybrid infrastructure. Served as Client #1, tested the product, and met with investors in-person. Perch was acquired by ConnectWise for over $80M.</p>
      </div>
      <div class="crd purple">
        <div class="crd-org">Vercrio</div>
        <div class="crd-role">Strategic Advisor · Co-Inventor</div>
        <div class="crd-dates">2022 – Present</div>
        <p>Helping shape product and market fit for an IAM and identity proofing platform. Responsible for bringing their first financial services client. Co-inventor on one of their key patents. Vercrio is poised to be a disruptive force in the IAM and agentic security space.</p>
      </div>
      <div class="crd purple">
        <div class="crd-org">Knostic</div>
        <div class="crd-role">Client Advisor</div>
        <div class="crd-dates">2024 – Present</div>
        <p>Helping shape their agentic security and governance platform from the perspective of an AI early adopter. Providing real-world feedback on product direction and enterprise applicability.</p>
      </div>
    </div>
  </div>
  <div class="page-footer">John Lockie &middot; johnlockie.com &middot; Page 4</div>
</div>

<!-- ═══════ PAGE 5: PORTFOLIO ═══════ -->
<div class="page">
  <div class="page-content">
    <div class="header header-compact">
      <div>
        <h1>John Lockie</h1>
        <div class="subtitle">Head of Infrastructure &amp; Platform Services</div>
      </div>
      <div class="header-right">john.lockie@gmail.com<br><a href="https://johnlockie.com">johnlockie.com</a></div>
    </div>

    <div class="slabel">// 06</div>
    <div class="stitle" style="color:var(--cyan)">Portfolio</div>

    <div class="pgrid">
      <div class="pitem">
        <img class="pimg" src="${screenshots.rainmaker}" alt="Rain Maker">
        <div class="pbody">
          <div class="pname">Rain Maker</div>
          <div class="purl">Internal Cloud Deployment Tool</div>
          <div class="pdesc">A cloud deployment tool for designing, deploying, and tracking the build out of cloud infrastructure on a per-project basis. Provides a visual interface for architecting environments and monitoring deployment progress in real time. Also provides budgeting insight for project planning.</div>
        </div>
      </div>
      <div class="pitem">
        <img class="pimg" src="${screenshots.mcpbay}" alt="MCP Bay">
        <div class="pbody">
          <div class="pname">MCP Bay</div>
          <div class="purl"><a href="https://mcpbay.ai">mcpbay.ai</a></div>
          <div class="pdesc">MCP Bay is an IaaS solution offering hosted MCP servers, proxies and gateways with full logging, OAuth, and per tool/operation security. MCP Bay was created because I saw the need for tooling infrastructure to support business adoptions of cloud first agent models (Copilot, ChatGPT, Claude).</div>
        </div>
      </div>
      <div class="pitem">
        <img class="pimg" src="${screenshots.lumin}" alt="Lumin">
        <div class="pbody">
          <div class="pname">Lumin</div>
          <div class="purl"><a href="https://lumin.advisorplatforms.com">lumin.advisorplatforms.com</a></div>
          <div class="pdesc">A friend had a need to build financial models for his clients that could easily be exported into one of the most widely used trading platforms for wealth advisors. We built a multi-tenant complex portfolio and risk modeler (SaaS), and have plans to continue expanding integrations for users.</div>
        </div>
      </div>
      <div class="pitem">
        <img class="pimg" src="${screenshots.lifeafterlikes}" alt="Life After Likes">
        <div class="pbody">
          <div class="pname">Life After Likes</div>
          <div class="purl"><a href="https://lifeafterlikes.com">lifeafterlikes.com</a></div>
          <div class="pdesc">Having abandoned social media over a decade ago, I found myself wanting a way to share my old archives with my children. I opted to build a platform that has "drag and drop" support for Instagram and Facebook archives, importing, categorizing, displaying and sharing a life once lived in social media.</div>
        </div>
      </div>
      <div class="pitem">
        <img class="pimg" src="${screenshots.threatsrus}" alt="Threats-R-Us">
        <div class="pbody">
          <div class="pname">Threats-R-Us</div>
          <div class="purl"><a href="https://threatsr.us">threatsr.us</a></div>
          <div class="pdesc">An OSINT collection of loosely coupled public facing honeypots which aimed to collect low level data about risky IP addresses, and then distribute that info to interested parties. Retired due to the low efficacy of IP intelligence.</div>
        </div>
      </div>
      <div class="pitem">
        <img class="pimg" src="${screenshots.defensedude}" alt="The Defense Dude">
        <div class="pbody">
          <div class="pname">The Defense Dude</div>
          <div class="purl"><a href="https://thedefensedude.com">thedefensedude.com</a></div>
          <div class="pdesc">A cybersecurity blog covering technical defensive topics including Active Directory auditing with BloodHound, credential protection, and Purple Team strategies.</div>
        </div>
      </div>
    </div>
  </div>
  <div class="page-footer">John Lockie &middot; johnlockie.com &middot; Page 5</div>
</div>

</body>
</html>`;

await page.setContent(html, { waitUntil: 'networkidle0' });

const outputPath = path.join(__dirname, 'John_Lockie_Portfolio.pdf');

await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

await browser.close();
console.log('PDF generated: ' + outputPath);
