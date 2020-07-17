const primes = [ 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 ];

var key = $("#key");
var frag = $("#fragments");
var stepper = $("#step");
var runButton = $("#runMe");
var output = $("#output");
var errorModal = $("#modalBG");
var errorText = $("#errorMessage");
var errorConfirm = $("#errorConfirm");

var checkCommonDenominator = function(a, b) {
	for (var i = 2; i <= Math.min(a, b); i++) {
		if ((a % i == 0) && (b % i == 0)) { // i divides evenly into both numbers, REJECTED!
			return false;
		}
	}

	return true;
}

var doTheMagic = function(event) {
	event.preventDefault();
	var i;
	var apiKey = key.val();
	var fragment = frag.val();
	var step = stepper.val();
	output.removeClass("show");

	if ((!apiKey) || (!fragment) || (!step)) {
		showErrorPopup("Please enter a value for all fields.");
		return;
	} else if (!checkCommonDenominator(fragment, step)) {
		showErrorPopup("The selected fragment and step values have a common denominator and will not work for this.")
		return;
	}

	var splitKey = [];

	for (i = 0; i < apiKey.length; i += apiKey.length / fragment) {
		splitKey.push(apiKey.substring(Math.floor(i), Math.floor(i + apiKey.length / fragment)));
	}

	if (splitKey.length != fragment) {
		showErrorPopup("Oops! Couldn't split the key correctly!  Try using a different step or fragment.");
		return;
	}

	var keyOutput = [];
	keyOutput.length = splitKey.length;

	for (i = 0; i < splitKey.length; i++) {
		var index = (i * step) % keyOutput.length;
		keyOutput[index] = splitKey[i];
	}

	$("#keyOutput").text("const keyFragments = [ \"" + keyOutput.join("\", \"") + "\" ];");

	$("#keyBuildCode").text("");
	$("#keyBuildCode").append(
		"var buildKey = &quot;&quot;;<br />" +
		"<br />" +
		"for (var i = 0; i < keyFragments.length; i++) {<br />" +
		"&nbsp;&nbsp;&nbsp;&nbsp;buildKey += keyFragments[(" + step + " * i) % keyFragments.length];<br />" +
		"}"
	);

	var buildKey = "";

	for (var i = 0; i < keyOutput.length; i++) {
		buildKey += keyOutput[(step * i) % keyOutput.length];
	}

	$("#keyRebuilt").text(buildKey);

	output.addClass("show");
}

var keyMonitor = function() {
	frag.attr("max", Math.max(key.val().length, 2));
}

var fragMonitor = function() {
	frag.toggleClass("good", (primes.indexOf(parseInt(frag.val())) > -1));
}

function showErrorPopup(message) {
	errorModal.addClass("show");
	errorText.text(message);
}

function hideErrorPopup() {
	errorModal.removeClass("show");
}

runButton.on("click", doTheMagic);
key.on("change", keyMonitor);
frag.on("change", fragMonitor);
errorConfirm.on("click", hideErrorPopup);