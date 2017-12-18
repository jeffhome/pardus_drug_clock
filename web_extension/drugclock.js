window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();

/*
	This method gets called when a content script asks us to do some work for them.
	We use this to allow communication from the options page via the background.js
	directly to this script.
*/

function onMessage(message) {
	if (message === 'REPAINT') {
		drugClock.reset(true);
	}
}
browser.runtime.onMessage.addListener(onMessage);

/*
	This is our main class.
*/
function DrugClock() {
	this.doc = document;
	this.setCurrentUniverse();	
	this.setupSettingsForCurrentUniverse();
}

DrugClock.prototype.init = function() {
	
	if (this['boolEnabled' + this.universe]) {
	
		if (this['boolEnableTakeDrugsToggle' + this.universe]) {
			this.doc.addEventListener('keydown', function(e) {
				if (e.originalTarget instanceof HTMLInputElement || e.originalTarget instanceof HTMLTextAreaElement) {
					return; // not interested in this keypress - in an input element
				}
				let _keyPressed = this._readKeyboardInput(e);

				if (this['boolEnableTakeDrugsToggle' + this.universe] && _keyPressed === this['strTakeDrugsToggle' + this.universe].toUpperCase()) {
					if (this.doc.URL.indexOf('pardus.at/main.php?use=51') < 0) {
						this.loadPage('main.php?use=51');
					}
				}
				
			}.bind(this));
		}
		
		if (this.doc.URL.indexOf('pardus.at/main.php') > -1) {
			if (this['boolEnableClockDisplayToggle' + this.universe]) {
				this.showDrugClock();
			}
		}
		
		if (this.doc.URL.indexOf('pardus.at/main.php?use=51') > -1) {
			let _amountEl = this.doc.querySelector('input[name="amount"]');
			if (_amountEl) {
				_amountEl.focus();
				_amountEl.addEventListener('keydown', this.checkForEnterToSubmitUseDrug.bind(this));
			}
			let _useEl = this.doc.querySelector('input[name="useres"]');
			if (_useEl) {
				this.doc.querySelector('input[name="useres"]').addEventListener('mousedown', this.submitUseDrug.bind(this));
			}
		}
		else

		if (this.doc.URL.indexOf('pardus.at/ship2opponent_combat.php') > -1 
			|| this.doc.URL.indexOf('pardus.at/ship2ship_combat.php') > -1 
			|| this.doc.URL.indexOf('pardus.at/building.php') > -1) {

			let btnEls = this.doc.querySelectorAll('input[name="resid"]');
			for (let i = 0; i < btnEls.length; i++) {
				if (btnEls[i].value === '51') {
					btnEls[i].parentNode.querySelector('input[name="amount"]').addEventListener('keydown', this.checkForEnterToSubmitUseDrug.bind(this));
					btnEls[i].parentNode.querySelector('input[name="useres"]').addEventListener('mousedown', this.submitUseDrug.bind(this));
				}
			}
		}

	}
}

DrugClock.prototype.reset = function(delay) {
	this.setupSettingsForCurrentUniverse();
	if (delay) {
		setTimeout(this._reload.bind(this), 60);
	} else {
		this._reload();
	}
}

DrugClock.prototype._reload = function() {
	this.loadPage('main.php');
}

DrugClock.prototype._readKeyboardInput = function(e) {
	let _keyPressed = '';
	let _keyPressCode = e.which;
	switch(_keyPressCode) {
		case 9: if (e.altKey == false && e.ctrlKey == false && e.metaKey == false && e.shiftKey == false) { _keyPressed = 'TAB'; e.preventDefault(); } break;
		case 16: if (e.altKey == false && e.ctrlKey == false && e.metaKey == false) { _keyPressed = 'SHFT'; } break;
		case 17: if (e.altKey == false && e.metaKey == false && e.shiftKey == false) { _keyPressed = 'CTRL'; } break;
		case 18: if (e.ctrlKey == false && e.metaKey == false && e.shiftKey == false) { _keyPressed = 'ALT'; } break;
		case 20: if (e.altKey == false && e.ctrlKey == false && e.metaKey == false && e.shiftKey == false) { _keyPressed = 'CAPS'; } break;
		case 224: if (e.altKey == false && e.ctrlKey == false && e.shiftKey == false) { _keyPressed = 'WIN'; } break;
		default: if (_keyPressCode < 128 && _keyPressCode > 31 && e.altKey == false && e.ctrlKey == false && e.metaKey == false && e.shiftKey == false) { _keyPressed = String.fromCharCode(_keyPressCode) };
	}
	return _keyPressed;
}

DrugClock.prototype.loadPage = function(page) {
	this.doc.location.href = this.doc.location.protocol + '//' + this.doc.location.hostname + '/' + page;
}

DrugClock.prototype.submitUseDrug = function(e) {
	let amountEl = e.target.parentNode.querySelector('input[name="amount"]');
	if (amountEl) {
		let amount = amountEl.value;
		if (amount.match(/\d+/)) {
			this.useDrugs(parseInt(amount, 10));
		}
	}
}

DrugClock.prototype.checkForEnterToSubmitUseDrug = function(e) {
	if (e.which == 13) {
		let amountEl = e.target;
		if (amountEl) {
			let amount = amountEl.value;
			if (amount.match(/\d+/)) {
				this.useDrugs(parseInt(amount, 10));
			}
		}
	}
}

DrugClock.prototype.showDrugClock = function() {
	this.addDrugClockToThePage();
	this.updateDrugClock();
}

DrugClock.prototype.addDrugClockToThePage = function() {
	let clockLocation = this['strClockLocation' + this.universe];

	let query = '#' + clockLocation;
	if (clockLocation === 'belownav') {
		query = '#tdSpaceChart > table';
	}
	let targetTable = this.doc.querySelector(query);

	if (targetTable) {
		let clockDiv = this.doc.createElement('div');
		clockDiv.id = 'druggednessClock';

		let resetSpan = this.doc.createElement('span');
		resetSpan.id = 'resetDrugCounters';
		resetSpan.textContent = 'R';
		resetSpan.setAttribute('title', 'Reset Drug Counters');

		let sdrugLabelSpan = this.doc.createElement('span');
		sdrugLabelSpan.id = 'SdrugLabel';
		sdrugLabelSpan.textContent = 'DTIME:';

		let sdrugSpan = this.doc.createElement('span');
		sdrugSpan.id = 'Sdrug';
		sdrugSpan.textContent = '-';

		let sdrugiLabelSpan = this.doc.createElement('span');
		sdrugiLabelSpan.id = 'SdrugiLabel';
		sdrugiLabelSpan.textContent = 'DREFF:';

		let sdrugiSpan = this.doc.createElement('span');
		sdrugiSpan.id = 'Sdrugi';
		sdrugiSpan.textContent = '-';

		clockDiv.appendChild(resetSpan);
		clockDiv.appendChild(sdrugLabelSpan);
		clockDiv.appendChild(sdrugSpan);
		clockDiv.appendChild(sdrugiLabelSpan);
		clockDiv.appendChild(sdrugiSpan);

		targetTable.parentNode.insertBefore(clockDiv, targetTable.nextSibling);
		
		resetSpan.addEventListener('click', this.resetDrugPrefs.bind(this));
	}
}

DrugClock.prototype.getPref = function(key, defValue) {
	let result = null;
	if (typeof(Storage) !== "undefined") {
	    let value = localStorage.getItem(key + this.universe);
	    if (value === null) {
	    	result = typeof(defValue) !== 'undefined' ? defValue : null;
	    } else {
			let type = value[0];
			value = value.substring(1);
			switch (type) {
				case 'b': result = value === 'true';
				case 'n': result = Number(value);
				default: result = value;
			}
		}
	}
	return result;
}

DrugClock.prototype.setPref = function(key, value) {
	if (typeof(Storage) !== "undefined") {
		let _value = (typeof value)[0] + value;
		localStorage.setItem(key + this.universe, _value);
	}
}

DrugClock.prototype.resetDrugPrefs = function() {
	if (confirm('Are you sure you want to reset the drug clock for this universe?')) {
		if (typeof(Storage) !== "undefined") {
			localStorage.removeItem('overdrug' + this.universe);
			localStorage.removeItem('drugTime' + this.universe);
			localStorage.removeItem('lastDH' + this.universe);
		}
		this.updateDrugClock();
	}
}

DrugClock.prototype._padTimeWithZeros = function(value) {
	return value > 9 ? '' + value : '0' + value;
}

DrugClock.prototype.updateDrugClock = function() {
	if (!this.doc.getElementById('druggednessClock')) return;

	let hasTripControl = this['boolHasTripControl' + this.universe];
	let meditationLevel = this['strMeditationLevel' + this.universe];

	let overdrug = this.getPref('overdrug', 0) - 0;
	let drugTime = this.getPref('drugTime', 0) * 1000;
	let lasthour = this.getPref('lastDH', 0) * 1000;

	if (overdrug < 0) overdrug = 0;

	let curtime = new Date();
	let difftime = new Date();
	let timeSec = curtime.getTime();
	let timeSince = timeSec - drugTime;
	difftime.setTime(timeSince);

	// how many hours since last checked
	let hours = Math.floor((timeSec - lasthour) / 1000 / 3600);
	if (hours > 0 && overdrug > 0) {
		// drugginess goes down by # hours
		let drugdiff = overdrug - hours;
		if (drugdiff <= 0) {
			// reset clock when DREFF goes to 0. - note only increment by overdrug*3600
			let zeroDrugTime = (lasthour/1000) + (overdrug*3600);
		
			this.setPref('drugTime', zeroDrugTime);
		
			// init display clock
			timeSince = curtime.getTime() - (zeroDrugTime*1000);
			difftime.setTime(timeSince);
			overdrug = 0;
		} else {
			overdrug = drugdiff;
		}

		this.setPref('overdrug', overdrug);
		this.setPref('lastDH', ((lasthour/1000) + (hours * 3600)));
	}

	let tripControlValue = hasTripControl ? meditationLevel : 0;
	let color;
	if (overdrug - tripControlValue > 0) {
		color = '#f00'; // red
	} else {
		if (overdrug) {
			color = '#fc2'; // gold
		} else {
			color = '#090'; // green
		}
	}
	this.doc.getElementById("Sdrug").style.color = color;
	this.doc.getElementById("Sdrugi").style.color = color;

	let _content = '';
	if (overdrug === 0) {
		_content = 'CLEAN';
	}
	else if ((overdrug-tripControlValue) > 0) {
		_content = (overdrug-tripControlValue-1) + ":" + this._padTimeWithZeros(59-difftime.getMinutes()) + ":" + this._padTimeWithZeros(59-difftime.getSeconds());
	}
	else if ((overdrug-tripControlValue) <= 0) {
		_content = (overdrug-1) + ":" + this._padTimeWithZeros(59-difftime.getMinutes()) + ":" + this._padTimeWithZeros(59-difftime.getSeconds());
	}

	this.doc.getElementById("SdrugLabel").setAttribute('title', 'Time remaining (hh:mm:ss) until free of drug effects');
	this.doc.getElementById("Sdrug").textContent = _content;
	this.doc.getElementById("SdrugiLabel").setAttribute('title', 'Current level of Drug effect');
	this.doc.getElementById("Sdrugi").textContent = overdrug - tripControlValue;
	this.doc.getElementById("Sdrugi").setAttribute('title', 'Current level of Drug effect');
}

DrugClock.prototype.useDrugs = function(amount) {
	let overDrug = this.getPref('overdrug', 0) - 0;
	if (overDrug <= 0) {
		// we have no drugginess
		let timeInt = parseInt(new Date().getTime() / 1000, 10);
		this.setPref('drugTime', timeInt);
		this.setPref('lastDH', timeInt);
	}
	// add on the amount of drugs just taken
	this.setPref('overdrug', overDrug + amount);
}

DrugClock.prototype.setCurrentUniverse = function() {
	let universe = this.doc.location.hostname.substring(0, this.doc.location.hostname.indexOf('.')).toLowerCase();
	this.universe = universe.substring(0, 1).toUpperCase() + universe.substring(1);
}

DrugClock.prototype.setupSettingsForCurrentUniverse = function() {
	browser.storage.local.get({
	
		boolEnabledOrion: true,
		boolEnableTakeDrugsToggleOrion: true,
		strTakeDrugsToggleOrion: 'd',
		boolHasTripControlOrion: false,
		strMeditationLevelOrion: '',
		boolEnableClockDisplayToggleOrion: true,
		strClockLocationOrion: 'status',

		boolEnabledArtemis: true,
		boolEnableTakeDrugsToggleArtemis: true,
		strTakeDrugsToggleArtemis: 'd',
		boolHasTripControlArtemis: false,
		strMeditationLevelArtemis: '',
		boolEnableClockDisplayToggleArtemis: true,
		strClockLocationArtemis: 'status',

		boolEnabledPegasus: true,
		boolEnableTakeDrugsTogglePegasus: true,
		strTakeDrugsTogglePegasus: 'd',
		boolHasTripControlPegasus: false,
		strMeditationLevelPegasus: '',
		boolEnableClockDisplayTogglePegasus: true,
		strClockLocationPegasus: 'status'

	}, function(items) {
	
		this.boolEnabledOrion = items.boolEnabledOrion;
		this.boolEnableTakeDrugsToggleOrion = items.boolEnableTakeDrugsToggleOrion;
		this.strTakeDrugsToggleOrion = items.strTakeDrugsToggleOrion;
		this.boolHasTripControlOrion = items.boolHasTripControlOrion;
		this.strMeditationLevelOrion = items.strMeditationLevelOrion;
		this.boolEnableClockDisplayToggleOrion = items.boolEnableClockDisplayToggleOrion;
		this.strClockLocationOrion = items.strClockLocationOrion;

		this.boolEnabledArtemis = items.boolEnabledArtemis;
		this.boolEnableTakeDrugsToggleArtemis = items.boolEnableTakeDrugsToggleArtemis;
		this.strTakeDrugsToggleArtemis = items.strTakeDrugsToggleArtemis;
		this.boolHasTripControlArtemis = items.boolHasTripControlArtemis;
		this.strMeditationLevelArtemis = items.strMeditationLevelArtemis;
		this.boolEnableClockDisplayToggleArtemis = items.boolEnableClockDisplayToggleArtemis;
		this.strClockLocationArtemis = items.strClockLocationArtemis;

		this.boolEnabledPegasus = items.boolEnabledPegasus;
		this.boolEnableTakeDrugsTogglePegasus = items.boolEnableTakeDrugsTogglePegasus;
		this.strTakeDrugsTogglePegasus = items.strTakeDrugsTogglePegasus;
		this.boolHasTripControlPegasus = items.boolHasTripControlPegasus;
		this.strMeditationLevelPegasus = items.strMeditationLevelPegasus;
		this.boolEnableClockDisplayTogglePegasus = items.boolEnableClockDisplayTogglePegasus;
		this.strClockLocationPegasus = items.strClockLocationPegasus;

	}.bind(this));
}

let drugClock = new DrugClock();

let readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		drugClock.init();
	}
}, 20);
