#!/bin/bash
mkdir -p Bckup; 

mv trafficmonitor.xpi Bckup/trafficmonitor_`date +%Y.%m.%d_%H:%M`.xpi; 
7z a -tzip trafficmonitor.xpi defaults chrome chrome.manifest install.rdf;
