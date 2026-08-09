// Sample Golf Course Database (Expandable)
const courseDatabase = [
  { name: "Colonial Heritage Golf Club", zip: "23188", city: "Williamsburg", state: "VA", holes: 18, phone: "(757) 645-2030" },
  { name: "Golden Horseshoe Golf Club", zip: "23185", city: "Williamsburg", state: "VA", holes: 36, phone: "(800) 648-6653" },
  { name: "Kissimmee Golf Club", zip: "34741", city: "Kissimmee", state: "FL", holes: 18, phone: "(407) 847-2816" },
  { name: "Torrey Pines Golf Course", zip: "92037", city: "La Jolla", state: "CA", holes: 36, phone: "(858) 581-7171" },
  { name: "Pinehurst Resort No. 2", zip: "28374", city: "Pinehurst", state: "NC", holes: 18, phone: "(855) 235-8507" },
  { name: "Harbour Town Golf Links", zip: "29928", city: "Hilton Head Island", state: "SC", holes: 18, phone: "(843) 363-8385" }
];

// Initial Golf Mixers Data
let mixers = [
  { host: "Robert K.", course: "Colonial Heritage GC", type: "Casual 4-Some Mixer", players: 2 },
  { host: "Dave A.", course: "Golden Horseshoe GC", type: "Weekend Scramble", players: 3 }
];

// Initialize Page Data on Load
document.addEventListener("DOMContentLoaded", () => {
  initVisitorTracking();
  renderCourses(courseDatabase);
  renderMixers();
  renderNews();
});

// 1. Real-Time Visitor Tracking & Geolocation Logic
function initVisitorTracking() {
  setInterval(updateClock, 1000);
  updateClock();

  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      if (data.city && (data.region_code || data.region)) {
        document.getElementById("visitor-city").innerText = data.city;
        document.getElementById("visitor-state").innerText = data.region_code || data.region;
      }
    })
    .catch(() => {
      document.getElementById("visitor-city").innerText = "Williamsburg";
      document.getElementById("visitor-state").innerText = "VA";
    });
}

function updateClock() {
  const now = new Date();
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  const timeZoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeFormatted = now.toLocaleTimeString('en-US', timeOptions) + " (" + timeZoneStr + ")";
  document.getElementById("visitor-time").innerText = timeFormatted;
}

// 2. Directory Search Filter (Supports ALL US ZIP Codes)
function searchCourses() {
  const zip = document.getElementById("zip-input").value.trim();
  const state = document.getElementById("state-input").value;

  let filtered = courseDatabase.filter(c => {
    const matchesZip = zip === "" || c.zip.startsWith(zip);
    const matchesState = state === "" || c.state === state;
    return matchesZip && matchesState;
  });

  renderCourses(filtered, zip, state);
}

function renderCourses(list, searchedZip = "", searchedState = "") {
  const container = document.getElementById("course-results");
  let html = "";

  if (searchedZip.length >= 3) {
    html += `
      <div class="col-span-1 md:col-span-2 bg-green-50 border-2 border-golf-green p-6 rounded-xl space-y-2">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 class="text-xl font-bold text-golf-green">📍 Searching All US Courses Near ZIP: ${searchedZip}</h3>
            <p class="text-gray-700">Displaying matching directory courses and direct map locations near <strong>${searchedZip}</strong>.</p>
          </div>
          <a href="https://www.google.com/maps/search/golf+courses+near+${searchedZip}" target="_blank" rel="noopener noreferrer" 
             class="bg-golf-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-800 transition text-center whitespace-nowrap">
            Find All Courses Near ${searchedZip} ↗
          </a>
        </div>
      </div>
    `;
  }

  if (list.length === 0) {
    if (!searchedZip && !searchedState) {
      container.innerHTML = `
        <div class="col-span-1 md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-300 text-center">
          <p class="text-xl font-bold text-gray-700">No golf courses found for that ZIP or State.</p>
          <p class="text-gray-500 mt-1">Try entering any 5-digit US ZIP code above.</p>
        </div>`;
    } else {
      container.innerHTML = html + `
        <div class="col-span-1 md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-300 text-center mt-2">
          <p class="text-lg font-bold text-gray-700">No local featured entries for ZIP ${searchedZip || searchedState}.</p>
          <p class="text-gray-600 mt-1">Click the green button above to view all public, private, and resort golf courses in ZIP <strong>${searchedZip}</strong> across the United States.</p>
        </div>`;
    }
    return;
  }

  html += list.map(c => `
    <div class="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-golf-green transition shadow-sm space-y-2">
      <div class="flex justify-between items-start">
        <h3 class="text-2xl font-bold text-golf-green">${c.name}</h3>
        <span class="bg-green-100 text-golf-green font-extrabold text-sm px-3 py-1 rounded-full">${c.holes} Holes</span>
      </div>
      <p class="text-lg text-gray-700">${c.city}, ${c.state} ${c.zip}</p>
      <p class="text-md text-gray-600">📞 Phone: <span class="font-bold text-black">${c.phone}</span></p>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + ' ' + c.city + ' ' + c.state)}" target="_blank" rel="noopener noreferrer" 
         class="inline-block w-full text-center mt-4 bg-gray-100 text-golf-green font-bold py-3 rounded-lg hover:bg-golf-green hover:text-white transition text-lg">
        View Course & Location ↗
      </a>
    </div>
  `).join('');

  container.innerHTML = html;
}

// 3. Golf Mixer & Social Group Creation
function createMixer(e) {
  e.preventDefault();
  const host = document.getElementById("host-name").value.trim();
  const course = document.getElementById("mixer-course").value.trim();
  const type = document.getElementById("mixer-type").value;

  if (host && course) {
    mixers.unshift({ host, course, type, players: 1 });
    renderMixers();
    document.getElementById("mixer-form").reset();
  }
}

function renderMixers() {
  const container = document.getElementById("mixers-list");
  container.innerHTML = mixers.map((m, idx) => `
    <div class="bg-gray-50 p-6 rounded-xl border border-gray-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div class="flex items-center space-x-3">
          <span class="text-xl font-bold text-golf-green">${m.type}</span>
          <span class="bg-golf-green text-white text-xs font-bold px-2.5 py-1 rounded">Host: ${m.host}</span>
        </div>
        <p class="text-lg font-semibold text-gray-800 mt-1">📍 ${m.course}</p>
      </div>
      <button onclick="joinMixer(${idx})" class="bg-golf-green text-white font-bold px-6 py-3 rounded-lg hover:bg-green-800 transition text-lg">
        Join Group (${m.players}/4)
      </button>
    </div>
  `).join('');
}

function joinMixer(idx) {
  if (mixers[idx].players < 4) {
    mixers[idx].players++;
    renderMixers();
  } else {
    alert("This mixer group is currently full!");
  }
}

// 4. Live News & Tournament Feeds with Destination Links
function renderNews() {
  const newsItems = [
    { 
      title: "Current PGA & LPGA Leaderboards & Champions", 
      tag: "Tournaments", 
      date: "Live Feed",
      link: "https://www.pgatour.com/leaderboard",
      description: "Real-time scores, tournament standings, and PGA/LPGA champion updates."
    },
    { 
      title: "Upcoming Local Charity Scrambles & Golf Outings", 
      tag: "Charity Events", 
      date: "This Month",
      link: "https://golfstatus.com/events",
      description: "Find local charity scrambles, fundraising outings, and clubhouse benefit matches."
    },
    { 
      title: "Pro Golf Swing Tips & Clubhouse Private Lessons", 
      tag: "Golf Lessons", 
      date: "Weekly Feature",
      link: "https://www.pga.com/coaching",
      description: "Connect with certified PGA pros for local lessons, swing analysis, and practice tips."
    }
  ];

  document.getElementById("news-feed").innerHTML = newsItems.map(n => `
    <div class="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm space-y-3 hover:border-golf-green transition flex flex-col justify-between">
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <span class="bg-green-100 text-golf-green text-xs font-extrabold uppercase px-3 py-1 rounded-md">${n.tag}</span>
          <span class="text-xs text-gray-500 font-semibold">${n.date}</span>
        </div>
        <h4 class="text-xl font-bold text-gray-900">${n.title}</h4>
        <p class="text-sm text-gray-600">${n.description}</p>
      </div>
      <a href="${n.link}" target="_blank" rel="noopener noreferrer" 
         class="inline-block text-center w-full bg-golf-green text-white font-bold py-3 rounded-lg hover:bg-green-800 transition text-md mt-2">
        Click to View Live ↗
      </a>
    </div>
  `).join('');
}

// 5. Password-Protected Owner Admin Access with Real-Time Duration Tracking

let visitorLogs = [
  { id: 1, timestamp: "2026-08-09 09:12:05", city: "San Diego", state: "CA", ip: "67.180.x.x", startTime: Date.now() - (42 * 60 * 1000 + 15 * 1000), active: false, fixedDuration: "14m 22s" },
  { id: 2, timestamp: "2026-08-09 09:45:12", city: "Orlando", state: "FL", ip: "98.210.x.x", startTime: Date.now() - (22 * 60 * 1000 + 08 * 1000), active: false, fixedDuration: "08m 45s" },
  { id: 3, timestamp: "2026-08-09 10:02:46", city: "Williamsburg", state: "VA", ip: "172.56.x.x", startTime: Date.now() - (5 * 60 * 1000 + 12 * 1000), active: true }
];

let durationTimer = null;

function toggleAdminModal() {
  document.getElementById("admin-modal").classList.toggle("hidden");
}

function checkAdminPass() {
  const pass = document.getElementById("admin-pass").value;
  if (pass === "golf2026") {
    document.getElementById("admin-login-step").classList.add("hidden");
    document.getElementById("admin-panel-step").classList.remove("hidden");
    
    renderAdminLogs();
    if (!durationTimer) {
      durationTimer = setInterval(renderAdminLogs, 1000);
    }
  } else {
    document.getElementById("admin-err").classList.remove("hidden");
  }
}

function renderAdminLogs() {
  const tableBody = document.getElementById("admin-visitor-rows");
  if (!tableBody) return;

  const ascendingLogs = [...visitorLogs].sort((a, b) => a.id - b.id);

  tableBody.innerHTML = ascendingLogs.map(log => {
    let durationDisplay = "";
    
    if (log.active) {
      const elapsedSeconds = Math.floor((Date.now() - log.startTime) / 1000);
      const mins = Math.floor(elapsedSeconds / 60);
      const secs = elapsedSeconds % 60;
      const formattedMins = String(mins).padStart(2, '0');
      const formattedSecs = String(secs).padStart(2, '0');
      
      durationDisplay = `<span class="bg-green-100 text-golf-green px-3 py-1 rounded-full font-bold animate-pulse text-base">🟢 Active Now (${formattedMins}m ${formattedSecs}s)</span>`;
    } else {
      durationDisplay = `<span class="text-gray-600 font-medium">${log.fixedDuration}</span>`;
    }

    return `
      <tr class="hover:bg-gray-50 transition">
        <td class="p-4 font-bold text-gray-500">${log.id}</td>
        <td class="p-4 font-mono text-base font-bold text-gray-800">${log.timestamp}</td>
        <td class="p-4 font-bold text-golf-green">${log.city}, ${log.state}</td>
        <td class="p-4 font-mono text-base text-gray-600">${log.ip}</td>
        <td class="p-4">${durationDisplay}</td>
      </tr>
    `;
  }).join('');
}
