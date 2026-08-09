// 4. Live News & Tournament Feeds with Direct Links
function renderNews() {
  const newsItems = [
    {
      title: "PGA Tour Official Leaderboards & Live Scoring",
      tag: "PGA Tour",
      summary: "Track live scores, tournament leaderboards, play-by-play updates, and tee times for active PGA events.",
      link: "https://www.pgatour.com/leaderboard",
      buttonText: "View Live Leaderboards ↗"
    },
    {
      title: "LPGA Tour News, Rankings & Champions",
      tag: "LPGA Tour",
      summary: "Stay current on LPGA tournament standings, official player rankings, and major championship highlights.",
      link: "https://www.lpga.com/news",
      buttonText: "Read LPGA News ↗"
    },
    {
      title: "Golf Channel: Real-Time Breaking Golf News",
      tag: "Live Coverage",
      summary: "Up-to-the-minute coverage on Champions Tour, LIV Golf, international tournaments, and player interviews.",
      link: "https://www.golfchannel.com/news",
      buttonText: "Open Golf Channel ↗"
    },
    {
      title: "National Charity Golf Tournaments & Outings",
      tag: "Charity Events",
      summary: "Discover local charity scrambles, fundraising golf tournaments, and community benefit matches across the US.",
      link: "https://golfstatus.com/events",
      buttonText: "Find Charity Scrambles ↗"
    },
    {
      title: "PGA Coaching: Find a Pro & Book Golf Lessons",
      tag: "Golf Lessons",
      summary: "Connect with certified PGA Coaches nearby for swing analysis, short-game instruction, and beginner lessons.",
      link: "https://www.pga.com/coaching",
      buttonText: "Find Local PGA Coach ↗"
    },
    {
      title: "Golf Digest Swing Instruction & Video Tips",
      tag: "Game Improvement",
      summary: "Expert advice on driving distance, putting accuracy, course management, and iron play techniques.",
      link: "https://www.golfdigest.com/instruction",
      buttonText: "Explore Pro Tips ↗"
    }
  ];

  document.getElementById("news-feed").innerHTML = newsItems.map(n => `
    <div class="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm flex flex-col justify-between hover:border-golf-green transition space-y-4">
      <div class="space-y-3">
        <span class="inline-block bg-green-100 text-golf-green text-xs font-extrabold uppercase px-3 py-1 rounded-md">
          ${n.tag}
        </span>
        <h4 class="text-xl font-bold text-gray-900 leading-snug">${n.title}</h4>
        <p class="text-gray-600 text-sm leading-relaxed">${n.summary}</p>
      </div>
      
      <a href="${n.link}" target="_blank" rel="noopener noreferrer" 
         class="inline-block text-center bg-golf-green text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 transition text-md">
        ${n.buttonText}
      </a>
    </div>
  `).join('');
}
