const net = require('net');
const { JSZhuyin } = require('jszhuyin');

function getTranslatedString(bpmfInput) {
    var result = "";
    var jszhuyin = new JSZhuyin();

    jszhuyin.load();
    jszhuyin.oncandidateschange = function(candidates) {
        console.log(candidates);
        result = candidates[0][0];
    };
    jszhuyin.handleKey(bpmfInput);
    jszhuyin.unload();

    return result;
}

const server = net.createServer(function (connection) {
    console.log('Client has connected.');
    connection.on('end', function () {
        console.log('Client closed connection.');
    });

    connection.on('data', function (data) {
        var inputString = data.toString();
        inputString = inputString.replaceAll(" ","ˉ");
        inputString = inputString.replaceAll("·","˙");
        console.log(inputString);

        connection.write(getTranslatedString(inputString));
    });
});

const argv = require('minimist')(process.argv.slice(2));
let port = argv.p;
let host = "";
const globalAccess = argv.g;

if(typeof port !== 'number') {
    port = 3000;
    console.warn("Port not specified or is invalid! Using default value: 3000.");
}
if(globalAccess === true) {
    host = "0.0.0.0";
} else {
    host = "localhost";
}

server.listen(port, host, function () {
    console.log('Server listener started.');
});
