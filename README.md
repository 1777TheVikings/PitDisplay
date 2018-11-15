# PitDisplay

This is team 1777's pit display for FIRST Power Up. We used this at Cow Town Throwdown 2018 to show the time of our next match and our record of previous matches.

This was run on a Raspberry Pi using Chromium and is designed to be used in fullscreen mode. If you use this at competition, you will need to find a way to get wireless access so that you can retrieve new data from The Blue Alliance. We USB tethered an iPhone, which worked pretty well without needing to mess around with network settings.

## How to set this up

  1. Clone this repository
  2. Edit the following variables in tba_api.js:
      1. `eventKey` = the string at the very end of the TBA page for your event
      2. `teamKey` = for FRC, this will probably be `frc` + your team number
      3. `accessCode` = sign up for a developer account on TBA and change this to your API access code
      4. `timeAdjust` (optional) = use this to compensate for any time zone differences or other inaccuracies
  3. Open index.html in a browser (the URL should start with `file://` for Chrome/Chromium)
  4. Fullscreen the page (F11)

## Controls

Pressing the spacebar will pull new data from TBA. This program does not automatically retrieve data to limit the amount of cellular data used.

The number keys can be used to change between match data tabs. You can also click on each tab to switch.
