window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();

if (navigator.userAgent.indexOf('Chrome') > -1) {
	let _bodyEl = document.querySelector('body');
	_bodyEl.classList.add('chrome');
}

function save_options() {

	browser.storage.local.set({

		boolEnabledOrion : document.getElementById('boolEnabledOrion').checked,
		boolEnableTakeDrugsToggleOrion : document.getElementById('boolEnableTakeDrugsToggleOrion').checked,
		strTakeDrugsToggleOrion : document.getElementById('strTakeDrugsToggleOrion').value,
		boolHasTripControlOrion : document.getElementById('boolHasTripControlOrion').checked,
		strMeditationLevelOrion : document.getElementById('strMeditationLevelOrion').value,
		boolEnableClockDisplayToggleOrion : document.getElementById('boolEnableClockDisplayToggleOrion').checked,
		strClockLocationOrion : document.getElementById('strClockLocationOrion').value,

		boolEnabledArtemis : document.getElementById('boolEnabledArtemis').checked,
		boolEnableTakeDrugsToggleArtemis : document.getElementById('boolEnableTakeDrugsToggleArtemis').checked,
		strTakeDrugsToggleArtemis : document.getElementById('strTakeDrugsToggleArtemis').value,
		boolHasTripControlArtemis : document.getElementById('boolHasTripControlArtemis').checked,
		strMeditationLevelArtemis : document.getElementById('strMeditationLevelArtemis').value,
		boolEnableClockDisplayToggleArtemis : document.getElementById('boolEnableClockDisplayToggleArtemis').checked,
		strClockLocationArtemis : document.getElementById('strClockLocationArtemis').value,

		boolEnabledPegasus : document.getElementById('boolEnabledPegasus').checked,
		boolEnableTakeDrugsTogglePegasus : document.getElementById('boolEnableTakeDrugsTogglePegasus').checked,
		strTakeDrugsTogglePegasus : document.getElementById('strTakeDrugsTogglePegasus').value,
		boolHasTripControlPegasus : document.getElementById('boolHasTripControlPegasus').checked,
		strMeditationLevelPegasus : document.getElementById('strMeditationLevelPegasus').value,
		boolEnableClockDisplayTogglePegasus : document.getElementById('boolEnableClockDisplayTogglePegasus').checked,
		strClockLocationPegasus : document.getElementById('strClockLocationPegasus').value

	}, function() {
		// Update status to let user know options were saved.
		browser.runtime.sendMessage('REPAINT');
		
		let status = document.getElementById('status');
		status.textContent = 'Options saved';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

function restore_options() {

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

		document.getElementById('boolEnabledOrion').checked = items.boolEnabledOrion;
		document.getElementById('boolEnableTakeDrugsToggleOrion').checked = items.boolEnableTakeDrugsToggleOrion;
		document.getElementById('strTakeDrugsToggleOrion').value = items.strTakeDrugsToggleOrion;
		document.getElementById('boolHasTripControlOrion').checked = items.boolHasTripControlOrion;
		document.getElementById('strMeditationLevelOrion').value = items.strMeditationLevelOrion;
		document.getElementById('boolEnableClockDisplayToggleOrion').checked = items.boolEnableClockDisplayToggleOrion;
		document.getElementById('strClockLocationOrion').value = items.strClockLocationOrion;

		document.getElementById('boolEnabledArtemis').checked = items.boolEnabledArtemis;
		document.getElementById('boolEnableTakeDrugsToggleArtemis').checked = items.boolEnableTakeDrugsToggleArtemis;
		document.getElementById('strTakeDrugsToggleArtemis').value = items.strTakeDrugsToggleArtemis;
		document.getElementById('boolHasTripControlArtemis').checked = items.boolHasTripControlArtemis;
		document.getElementById('strMeditationLevelArtemis').value = items.strMeditationLevelArtemis;
		document.getElementById('boolEnableClockDisplayToggleArtemis').checked = items.boolEnableClockDisplayToggleArtemis;
		document.getElementById('strClockLocationArtemis').value = items.strClockLocationArtemis;

		document.getElementById('boolEnabledPegasus').checked = items.boolEnabledPegasus;
		document.getElementById('boolEnableTakeDrugsTogglePegasus').checked = items.boolEnableTakeDrugsTogglePegasus;
		document.getElementById('strTakeDrugsTogglePegasus').value = items.strTakeDrugsTogglePegasus;
		document.getElementById('boolHasTripControlPegasus').checked = items.boolHasTripControlPegasus;
		document.getElementById('strMeditationLevelPegasus').value = items.strMeditationLevelPegasus;
		document.getElementById('boolEnableClockDisplayTogglePegasus').checked = items.boolEnableClockDisplayTogglePegasus;
		document.getElementById('strClockLocationPegasus').value = items.strClockLocationPegasus;

	});
}

function toggle_settings_visibility(e) {
	document.getElementById('orion_settings_list').className = e.currentTarget.id === 'orion_settings' ? 'show' : '';
	document.getElementById('artemis_settings_list').className = e.currentTarget.id === 'artemis_settings' ? 'show' : '';
	document.getElementById('pegasus_settings_list').className = e.currentTarget.id === 'pegasus_settings' ? 'show' : '';
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.getElementById('orion_settings').addEventListener('click', toggle_settings_visibility);
document.getElementById('artemis_settings').addEventListener('click', toggle_settings_visibility);
document.getElementById('pegasus_settings').addEventListener('click', toggle_settings_visibility);


