var GLOBALS = {}
GLOBALS['writeLn'] = Array()
GLOBALS['writeLnSpeed'] = 20
GLOBALS['demo'] = 'whoami'.split('')
GLOBALS['demoSpeed'] = 40

/*
 *  MyConsole definition
 */
var MyConsole = function () {
}

MyConsole.prototype.commands = {}
MyConsole.prototype.descriptions = {}
MyConsole.prototype.locked = false

MyConsole.prototype.registerCommand = function (cmd, desc, func) {
    this.commands[cmd] = func;
    this.descriptions[cmd] = desc;
}

MyConsole.prototype.exec = function (cmd) {
    this.blockInput();
    var params = cmd.split(' ');
    var cm = params[0].toLowerCase();
    if (cm == 'help') {
        this.writeLn('Available commands:');
        for (var i in this.descriptions) {
            this.writeLn(i + '\t\t' + this.descriptions[i])
        }
    } else if (cm in this.commands) {
        var func = this.commands[cm];
        delete params[0];
        func(this, params);
    } else {
        this.writeLn(params[0] + ': command not found');
    }
}

function _writeLn() {
    var ch = GLOBALS['writeLn'].shift();
    if (typeof ch === 'undefined') {
        clearInterval(GLOBALS['writeLnInt']);
        GLOBALS['writeLnInt'] = undefined;
        Console.newPrompt();
    } else {
		var href_link = '<a ';
		if (ch.slice(0, href_link.length) == href_link) {
			$('#cout').append($(ch));
		} else {
			$('#cout').append(ch);
		}
        $('html, body').animate({scrollTop: $(document).height()}, 0);
    }
}

MyConsole.prototype.writeLn = function (text) {
	var links = /\[(.*)\|(http:\/\/[0-9a-zA-Z\.\?=\/]+)\]/ig;
	text = text.replace(links, "\01$2\01$1\01");
	text = text.split('');
	for (var i = 0; i < text.length; i++) {
		// link
		if (text[i] == '\01') {
			i++;
			var s = '';
			while (text[i] != '\01') {
				s += text[i];
				i++;
			}
			i++;
			var s1 = '';
			while (text[i] != '\01') {
				s1 += text[i];
				i++;
			}
			GLOBALS['writeLn'].push('<a href="' + s + '">' + s1 + '</a>');
		} else {
			GLOBALS['writeLn'].push(text[i]);
		}
	}
    GLOBALS['writeLn'] = GLOBALS['writeLn'].concat('<br />\n');
    if (typeof GLOBALS['writeLnInt'] === 'undefined') {
        GLOBALS['writeLnInt'] = setInterval(_writeLn, GLOBALS['writeLnSpeed']);
    }
}

MyConsole.prototype.blockInput = function () {
    this.locked = true;
    $('#prompt').children('.blink').hide();
 }

MyConsole.prototype.newPrompt = function () {
    // hide old
    $('#prompt').children('.blink').hide();
    $('#prompt').attr('id', 'prompt' + (new Date().getTime()));
    $('#cout').attr('id', 'cout' + (new Date().getTime()));
    // add new
    $('#content').append($('<div></div>')
        .attr('id', 'prompt')
        .addClass('prompt')
        .append($('<span></span>')
                .addClass('login')
                .html('denisix')
        )
        .append($('<span></span>')
                .html('@')
        )
        .append($('<span></span>')
                .addClass('host')
                .html('localhost')
        )
        .append($('<span></span>')
                .html('&nbsp;')
        )
        .append($('<span></span>')
                .addClass('dir')
                .html('~&nbsp;$')
        )
        .append($('<span></span>')
                .html('&nbsp;')
        )
        .append($('<span></span>')
                .attr('id', 'prmpt')
                .addClass('prmpt')
        )
        .append($('<span></span>')
                .addClass('blink')
                .html('_')
        )
    );
    $('#content').append($('<pre></pre>')
        .attr('id', 'cout')
        .addClass('cout')
    );
    $('html, body').animate({scrollTop: $(document).height()}, 0);
    this.locked = false;
}

/*
 *  Index page logic
 */
var Console = new MyConsole();

Console.registerCommand('whoami', 'shows up who i am, not you =)', function (con, params) {
    con.writeLn('name:\t\t\tDenis Shemanaev');
    con.writeLn('birth date:\t\t14.03.1991');
    con.writeLn('interests:\t\tweb, highload, mmo, server-side');
	con.writeLn('portfolio:\t\t[go to|http://shemanaev.com/portfolio]');
    con.writeLn('pet projects:');
    con.writeLn('\t[Whiteboard|http://white.denisix.ru]: Collaborative whiteboard - node.js, HTML5');
	con.writeLn('\tplugins for QIP Infium:');
	con.writeLn('\t\t[ACMe|http://forum.qip.ru/showthread.php?t=24800]: Simple anti-spam - Delphi, PHP');
	con.writeLn('\t\t[HisAW|http://forum.qip.ru/showthread.php?t=36377]: Web history storage - Delphi, PHP, JS');
	con.writeLn('\t\t[TimeNotify|http://forum.qip.ru/showthread.php?t=27340]: Assembler SDK and it`s usage example - MASM');
    con.writeLn('contacts:');
    con.writeLn('\temail:\t\tdenis at shemanaev dot com');
    con.writeLn('\tskype:\t\tdenis.shemanaev');
    con.writeLn('');
    con.writeLn('Type \'help\' to list all available commands');
})

function _demo() {
    var ch = GLOBALS['demo'].shift();
    if (typeof ch === 'undefined') {
        clearInterval(GLOBALS['demoInt']);
        var press = jQuery.Event('keypress');
        press.ctrlKey = false;
        press.which = 13;
        $(document).trigger(press);
    } else {
        $('#prmpt').append(ch);
    }
}

function demo() {
    GLOBALS['demoInt'] = setInterval(_demo, GLOBALS['demoSpeed']);
}

// add listeners
$(function () {
    $(document)
	.on('keypress', function (event) {
        event.preventDefault();
        if (Console.locked) return;
        var prompt = $('#prompt').children('.prmpt');
		switch (event.which) {
			case 13:
				// submit
				var cmd = prompt.html();
				if (cmd.trim() == '') {
					Console.newPrompt();
				} else {
					Console.exec(cmd);
				}
			break;

			case 8:
				// f*cking mozilla hack
				if (!$.browser.mozilla) break;
				var cmd = prompt.html();
				prompt.html(cmd.slice(0, -1));
			break;

			default:
				prompt.append(String.fromCharCode(event.which));
		}
    })
    .on('keydown', function (event) {
        if (event.which == 8 && !$.browser.mozilla) {
            event.preventDefault();
			var prompt = $('#prompt').children('.prmpt');
			var cmd = prompt.html();
			prompt.html(cmd.slice(0, -1));
        }
    });
    Console.newPrompt();
    setTimeout(demo, 1000);
})
