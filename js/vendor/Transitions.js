/** Animation played when changing state with canvas render.
 *
 * Reference: http://playgroundjs.com/playground-transitions
 */

PLAYGROUND.Transitions = function(app) {

	this.app = app;

	app.on("enterstate", this.enterstate.bind(this));
	app.on("postrender", this.postrender.bind(this));
	app.on("step", this.step.bind(this));

	this.progress = 1;
	this.lifetime = 0;

	app.transition = app.transition ? app.transition : 'split2';
	app.transitionDuration = app.transitionDuration ?
		app.transitionDuration : 0.75;

};

PLAYGROUND.Transitions.plugin = true;

PLAYGROUND.Transitions.prototype = {

	enterstate: function(data) {

		this.app.screenshot = this.screenshot = this.app.layer.cache();

		if (data.prev) {

			this.lifetime = 0;
			this.progress = 0;

		}

	},

	postrender: function() {

		if (this.progress >= 1) return;

		var transition = PLAYGROUND.Transitions[this.app.transition];

		transition(this.app, this.progress, this.screenshot);

	},

	step: function(delta) {

		if (this.progress >= 1) return;

		this.lifetime += delta;

		this.progress = Math.min(this.lifetime / this.app.transitionDuration, 1);

	}

};

PLAYGROUND.Transitions.implode = function(app, progress, screenshot) {

	progress = app.ease(progress, "outCubic");

	var negative = 1 - progress;

	app.layer.save();
	app.layer.tars(app.center.x, app.center.y, 0.5, 0.5, 0, 0.5 + 0.5 * negative, negative);
	app.layer.drawImage(screenshot, 0, 0);

	app.layer.restore();

};

PLAYGROUND.Transitions.split = function(app, progress, screenshot) {

	progress = app.ease(progress, "inOutCubic");

	var negative = 1 - progress;

	app.layer.save();

	app.layer.a(negative).clear("#fff").ra();

	app.layer.drawImage(screenshot, 0, 0, app.width, app.height / 2 | 0, 0, 0, app.width, negative * app.height / 2 | 0);
	app.layer.drawImage(screenshot, 0, app.height / 2 | 0, app.width, app.height / 2 | 0, 0, app.height / 2 + progress * app.height / 2 + 1 | 0, app.width, Math.max(1, negative * app.height * 0.5 | 0));

	app.layer.restore();

};

PLAYGROUND.Transitions.split2 = function(app, progress, screenshot) {

	progress = app.ease(progress, "inOutExpo");

	var negative = 1 - progress;

	app.layer.save();

	//app.layer.a(negative).clear("#fff").ra();
	app.layer.a(negative)
	// left
	app.layer.drawImage(
		screenshot, // image
		0, // sx
		0, // sy
		app.width / 2, // sw
		app.height, // sh
		0, // dx
		0, // dy
		negative * app.width / 2, // dw
		app.height // dh
	);

	// right
	app.layer.drawImage(
		screenshot, // image
		app.width / 2, // sx
		0, // sy
		app.width / 2, // sw
		app.height, // sh
		app.width / 2 + progress * app.width / 2 + 1, // dx
		0, // dy
		Math.max(1, negative * app.width * 0.5), // dw
		app.height // dh
	);

	app.layer.restore();
};