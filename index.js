var imaps = require('imap-simple')
var dateFormat = require('dateformat');

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

    return connection.openBox('INBOX').then(function () {
        var searchCriteria = [
            'ALL',
            ['SUBJECT', 'BSS Brastel - Cancelamento'],
            ['SINCE', 'Oct 1, 2017'],
            ['BEFORE', 'Nov 30, 2017']
        ];

        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };

        return connection.search(searchCriteria, fetchOptions).then(function (results) {

            results.map(item => {
                html = (new Buffer(item.parts[0].body, 'base64').toString('ascii'))
                idPedido = html.substr((html.search(/CancelOrderEdit.aspx\?id=/i) + 24), 4)
                console.log(`Data: ${dateFormat(item.parts[1].body.date[0], "dd-mm-yyyy HH:MM:ss")}\tId pedido: ${idPedido}\t\tTitulo: ${item.parts[1].body.subject[0]}`)
            })

            process.exit()

        });
    });
});
