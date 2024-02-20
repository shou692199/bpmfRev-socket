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

let port = require('minimist')(process.argv.slice(2)).p;
if(typeof port !== 'number') {
    port = 3000;
    console.warn("Port not specified or is invalid! Using default value: 3000.")
}

server.listen(port, function () {
    console.log('Server listener started.');
});
