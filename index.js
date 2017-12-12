var imaps = require('imap-simple')
var dateFormat = require('dateformat')
var fs = require('fs')
var csv = require('fast-csv')
const lista = []

lista.push(['Data', 'Pedido', 'Título'])

var config = {
    imap: {
        user: 'eduardo@cloudcom.com.br',
        password: '',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
}

imaps.connect(config).then(function (connection) {

    connection.openBox('INBOX').then(function () {
        var searchCriteria = [
            'ALL',
            ['SUBJECT', 'BSS Brastel - Novo Pedido'],
            ['SINCE', 'Sep 30, 2017'],
            ['BEFORE', 'Nov 1, 2017']
        ]

        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        }

        return connection.search(searchCriteria, fetchOptions)
    }).then(function (results) {

        results.map(item => {
            html = (new Buffer(item.parts[0].body, 'base64').toString('ascii'))
            idPedido = html.substr((html.search(/OrderEdit.aspx\?id=/i) + 18), 4)
            lista.push([dateFormat(item.parts[1].body.date[0], "dd-mm-yyyy HH:MM:ss"), idPedido, item.parts[1].body.subject[0]])
        })

        return lista

    }).then(function (lista) {

        var file = fs.createWriteStream('Novo Pedido.csv');
        file.on('error', function (err) { });
        lista.forEach(function (v) {
            file.write(v.join(',') + '\r\n');
        });
        file.end();

    }).then(() => {
        process.exit()
    })
})
