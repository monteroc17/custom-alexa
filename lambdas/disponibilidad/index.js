const API_URL = 'http://172.24.160.5:1152/horario';
const http = require('http');
const dateformat = require('dateformat');

const getHorario = (aula) => {
    return new Promise((resolve, reject) => {
        http.get(API_URL, function (res) {
            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                var horarios = JSON.parse(body);
                let res = aula + ' is unavailable at the following times: ';
                // RECORRER HORARIOS EN BASE AL AULA
                const horarioAula = horarios.filter(element => {
                    console.log(element.name.toLowerCase(), element.name.toLowerCase().includes(aula));
                    return element.name.toLowerCase().includes(aula);
                });
                console.log(horarioAula)

                horarioAula.forEach(horario => {
                    let fecha = horario.end.substring(0, 10);
                    console.log('fecha:',fecha)
                    fecha = dateformat(fecha, 'dddd, mmmm dS');
                    res += `\nOn ${fecha}, from ${horario.beginH} to ${horario.endH}, for ${horario.comment}. `
                })
                console.log('res',res);
                resolve(res)
            });
        }).on('error', function (e) {
            console.log("Got an error: ", e);
            reject(e)
        });
    });
}

console.log('hi');

getHorario('mini')
    .then(res => {
        console.log(res);
    })
    .catch(err => console.log(err));