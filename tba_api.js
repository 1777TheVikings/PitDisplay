
// -------------------------------------------- //
// Enter the event key here!                    //
const eventKey = "2018cttd";	                //
// -------------------------------------------- //
// And enter your team key here:                //
const teamKey = "frc1777";		                //
// -------------------------------------------- //
// If you need a new access code, put it here:  //
const accessCode = "OqcUdRvkqHymqJ7hjgqXK4Ysf33UTY8ZCC9FNH8Cw91HLAOebZvaAkpS95U9nAZL";
// -------------------------------------------- //

// If the times are off for some reason change this value (it's in seconds):
var timeAdjust = -18060;


var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var mouse = {
	x: undefined,
	y: undefined
};

window.addEventListener("mousemove", 
	function(event) {
		mouse.x = event.x;
		mouse.y = event.y;
	}
);

window.addEventListener("click",
	function(event) {
		if (mouse.y >= innerHeight - 50) {
			activeMatch = Math.floor(mouse.x / innerWidth * matchData.length);
		}
	}
);

var keyMap = {
	"1": 0,
	"2": 1,
	"3": 2,
	"4": 3,
	"5": 4,
	"6": 5,
	"7": 6,
	"8": 7,
	"9": 8,
	"0": 9,
	"!": 10,
	"@": 11,
	"#": 12,
	"$": 13,
	"%": 14,
	"^": 15,
	"&": 16,
	"*": 17,
	"(": 18,
	")": 19
};

window.addEventListener("keydown", 
    function(event) {
    	key = event.which || event.keyCode
    	if (event.key === " ") {
    		updateData();
    	} else if (key >= 48 && key <= 57){
    		activeMatch = keyMap[event.key];
    	}
        if (activeMatch >= matchData.length) {
        	activeMatch = matchData.length - 1;
        }
    }
);

window.addEventListener("resize", 
	function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		draw();
	}
);

var matchData;
var eventData;
var nextMatch;
var firstDay;
var time = {};
var ourPosition = [];
const Http = new XMLHttpRequest();
const url1 = "https://www.thebluealliance.com/api/v3/team/" + teamKey + "/event/" + eventKey + "/matches";
const url2 = "https://www.thebluealliance.com/api/v3/team/" + teamKey + "/event/" + eventKey + "/status";

function updateData() {
	Http.open("GET", url1);
	Http.setRequestHeader("X-TBA-Auth-Key", accessCode);
	Http.send();
	Http.onreadystatechange = (e) => {
		if (Http.readyState != 4) { return; }
		matchData = JSON.parse(Http.responseText);
		matchData = matchData.sort(function(a, b) {
			var enforcer = 0;
			if (a.comp_level === "qf") {
				enforcer += 65536;
			}
			if (b.comp_level === "qf") {
				enforcer -= 65536;
			}
			return a.match_number - b.match_number + enforcer;
		});
		console.log(matchData);
		firstDay = Math.floor(matchData[0].predicted_time / 86400) * 86400;

		Http.open("GET", url2);
		Http.setRequestHeader("X-TBA-Auth-Key", accessCode);
		Http.send();
		Http.onreadystatechange = (e) => {
			if (Http.readyState != 4) { return; }
			console.log(Http.responseText);
			eventData = JSON.parse(Http.responseText);
			console.log(eventData);

			updateNextMatch();

			for (var a = 0; a < matchData.length; a++) {
				for (var b = 0; b < 3; b++) {
					if (matchData[a].alliances.red.team_keys[b] === "frc1777") {
						ourPosition[a] = {
							alliance: "red",
							position: b
						};
					} else if (matchData[a].alliances.blue.team_keys[b] === "frc1777") {
						ourPosition[a] = {
							alliance: "blue",
							position: b
						};
					}
				}
			}

			draw();
		}
	}
};

function updateNextMatch () {
	if (eventData.next_match_key === null) {
		nextMatchKey = eventData.last_match_key;
	} else {
		nextMatchKey = eventData.next_match_key;
	}
	
	for (var a = 0; a < matchData.length; a++) {
		if (matchData[a].key === nextMatchKey) {
			nextMatch = a;
		}
	}
}

updateData();

function getTime (raw) {
	raw = raw + timeAdjust;
	var time = {
		raw: raw,
		day: 1 + Math.floor((raw - firstDay) / 86400),
		hour24: Math.floor(raw % 86400 / 3600),
		hour12: Math.floor((raw - 3600) % 43200 / 3600 % 12) + 1,
		minute: Math.floor(raw % 3600 / 60),
		second: raw % 60
	};
	if (time.hour24 >= 12) {
		time.AMorPM = "PM";
	} else {
		time.AMorPM = "AM";
	}

	return time;
};


var activeMatch = 0;
var windowBreak = 320;
var nextMatch = 0;
var nextMatchKey;

function draw() {
	requestAnimationFrame(draw);
	if (matchData.length === undefined) {}

	
	c.fillStyle = "#cfcfcf";
	c.fillRect(0, 0, innerWidth, windowBreak);
	c.fillStyle = "#9f9fbf";
	c.fillRect(0, windowBreak, innerWidth, innerHeight - windowBreak);
	c.strokeStyle = "#1f1f1f";
	c.beginPath();
	c.moveTo(0, windowBreak);
	c.lineTo(innerWidth, windowBreak);
	c.stroke();

	// lower window
	c.beginPath();
	c.moveTo(innerWidth / 2, windowBreak);
	c.lineTo(innerWidth / 2, innerHeight);
	c.stroke();

	// Bottom Bar
	c.fillStyle = "#7f7f9f";
	c.strokeStyle = "#1f1f1f";
	c.fillRect(0, innerHeight - 50, innerWidth, 50);
	c.strokeRect(0, innerHeight - 50, innerWidth, 50);
	c.beginPath();
	for (var a = 1; a < matchData.length; a++) {
		c.moveTo(a * innerWidth / matchData.length, innerHeight);
		c.lineTo(a * innerWidth / matchData.length, innerHeight - 50);
	}
	c.stroke();
	c.font = "25px Comic Sans MS";
	c.fillStyle = "#1f1f1f";
	for (var a = 0; a < matchData.length; a++) {
		c.fillText(a + 1, (a + 0.5) * innerWidth / matchData.length - c.measureText(a + 1).width / 2, innerHeight - 15);
	}

	// Left Pane 
	c.font = "50px Comic Sans MS";
	c.fillText("Winner:", 50, windowBreak + 120);
	if (matchData[activeMatch] == undefined) {
		matchData[activeMatch].winning_alliance = "none";
	} else if (matchData[activeMatch].winning_alliance === "red") {
		c.fillStyle = "#8f1f1f";
	} else if (matchData[activeMatch].winning_alliance === "blue") {
		c.fillStyle = "#1f1f8f";
	} else {
		matchData[activeMatch].winning_alliance = "none";
	}
	c.fillText(matchData[activeMatch].winning_alliance.charAt(0).toUpperCase() + matchData[activeMatch].winning_alliance.slice(1), 270, windowBreak + 120);
	
	c.fillStyle = "#1f1f1f";
	if (matchData[activeMatch].winning_alliance === "none") {
		c.font = "50px Comic Sans MS";
		c.fillText("Undecided", innerWidth * 3 / 8 - c.measureText("Undecided").width / 2, windowBreak + 100);
	} else if (ourPosition[activeMatch].alliance === matchData[activeMatch].winning_alliance) {
		c.font = "80px Comic Sans MS";
		c.fillText("Win", innerWidth * 3 / 8 - c.measureText("Win").width / 2, windowBreak + 100);
	} else {
		c.font = "80px Comic Sans MS";
		c.fillText("Lose", innerWidth * 3 / 8 - c.measureText("Lose").width / 2, windowBreak + 100);
	}
	c.font = "50px Comic Sans MS";
	c.fillStyle = "#1f1f1f";
	c.fillText("Us:", 50, windowBreak + 60)
	if (ourPosition[activeMatch].alliance === "red") {c.fillStyle = "#8f1f1f";} else {c.fillStyle = "#1f1f8f";}
	c.fillText(ourPosition[activeMatch].alliance.charAt(0).toUpperCase() + ourPosition[activeMatch].alliance.slice(1), 270, windowBreak + 60);

	c.fillStyle = "#1f1f1f";
	c.fillText("Points", innerWidth / 4 - c.measureText("Points").width / 2, windowBreak + 210);

	c.fillStyle = "#8f1f1f";
	c.fillText("Red: " + matchData[activeMatch].alliances.red.score, 30, windowBreak + 270);
	c.fillStyle = "#1f1f8f";
	c.fillText("Blue: " + matchData[activeMatch].alliances.blue.score, innerWidth / 2 - 30 - c.measureText("Blue: " + matchData[activeMatch].alliances.blue.score).width, windowBreak + 270);

	var minutes = getTime(matchData[activeMatch].predicted_time).minute;
	if (minutes < 10) {minutes = "0" + minutes;}
	c.font = "60px Comic Sans MS";
	c.fillStyle = "#1f1f1f";
	c.fillText("Time: " + getTime(matchData[activeMatch].predicted_time).hour12 + ":" + minutes + " " + getTime(matchData[activeMatch].predicted_time).AMorPM, innerWidth / 4 - c.measureText("Time: " + getTime(matchData[activeMatch].predicted_time).hour12 + ":" + minutes + " " + getTime(matchData[activeMatch].predicted_time).AMorPM).width / 2, windowBreak + 360);
	c.font = "40px Comic Sans MS";
	c.fillText("Day " + getTime(matchData[activeMatch].predicted_time).day + "   Match " + matchData[activeMatch].match_number, innerWidth / 4 - c.measureText("Day " + getTime(matchData[activeMatch].predicted_time).day + "   Match " + matchData[activeMatch].match_number).width / 2, windowBreak + 410);

	// Right Pane
	c.font = "75px Comic Sans MS";
	c.fillStyle = "#1f1f1f";
	c.fillText("Alliances", innerWidth / 4 * 3 - c.measureText("Alliances").width / 2, windowBreak + 90);
	c.font = "60px Comic Sans MS";
	c.fillStyle = "#8f1f1f";
	c.fillText("Red", innerWidth / 8 * 5 - c.measureText("Red").width / 2, windowBreak + 160);
	c.fillStyle = "#1f1f8f";
	c.fillText("Blue", innerWidth / 8 * 7 - c.measureText("Blue").width / 2, windowBreak + 160);
	c.font = "50px Comic Sans MS";
	c.fillStyle = "#1f1f1f";
	for (var a = 0; a < 3; a++) {
		var team = matchData[activeMatch].alliances.red.team_keys[a].split("");
		for (var b = 0; b < 3; b++) {team.shift();}
		team = team.join("");
		c.fillText(team, innerWidth / 8 * 5 - c.measureText(team).width / 2, windowBreak + 225 + a * 60);
	}
	for (var a = 0; a < 3; a++) {
		var team = matchData[activeMatch].alliances.blue.team_keys[a].split("");
		for (var b = 0; b < 3; b++) {team.shift();}
		team = team.join("");
		c.fillText(team, innerWidth / 8 * 7 - c.measureText(team).width / 2, windowBreak + 225 + a * 60);
	}
	
	// upper window
	c.font = "40px Comic Sans MS";
	c.fillText("Next Match:", 30, 50);

	var minutes = getTime(matchData[nextMatch].predicted_time).minute;
	if (minutes < 10) {minutes = "0" + minutes;}
	c.font = "150px Comic Sans MS";
	c.fillStyle = "#000000";
	c.fillText(getTime(matchData[nextMatch].predicted_time).hour12 + ":" + minutes, 30, 200);
	var textWidth = c.measureText(getTime(matchData[nextMatch].predicted_time).hour12 + ":" + minutes + " ").width;
	c.font = "75px Comic Sans MS";
	c.fillText(getTime(matchData[nextMatch].predicted_time).AMorPM, textWidth, 145);
	c.font = "75px Comic Sans MS";
	c.fillText("Day " + getTime(matchData[nextMatch].predicted_time).day, 50, 275);
	c.fillStyle = "#1f1f1f";
	c.font = "50px Comic Sans MS";
	c.fillText("# " + matchData[nextMatch].match_number, 300, 55);

	c.font = "60px Comic Sans MS";
	c.fillText("Alliance:", 700 - c.measureText("Alliance:").width / 2, 75);
	c.font = "135px Comic Sans MS";
	if (ourPosition[nextMatch].alliance === "red") {
		c.fillStyle = "#8f1f1f";
	} else if (ourPosition[nextMatch].alliance === "blue") {
		c.fillStyle = "#1f1f8f";
	}
	c.fillText(ourPosition[nextMatch].alliance.charAt(0).toUpperCase() + ourPosition[nextMatch].alliance.slice(1), 700 - c.measureText(ourPosition[nextMatch].alliance.charAt(0).toUpperCase() + ourPosition[nextMatch].alliance.slice(1)).width / 2, 200);

	c.font = "60px Comic Sans MS";
	c.fillStyle = "#1f1f1f";
	c.fillText("Position:", 1000 - c.measureText("Position:").width / 2, 75);
	var ordinal = ourPosition[nextMatch].position + 1;
	c.font = "150px Comic Sans MS";
	c.fillText(ordinal, 1000 - c.measureText(ordinal).width / 2 - 20, 205);
	if (ordinal === 1) {
		var suffix = "st";
	} else if (ordinal === 2) {
		var suffix = "nd";
	} else if (ordinal === 3) {
		var suffix = "rd";
	}
	c.font = "50px Comic Sans MS";
	c.fillText(suffix, 1000 + c.measureText(ordinal).width / 2 + 5, 125);
	
};














