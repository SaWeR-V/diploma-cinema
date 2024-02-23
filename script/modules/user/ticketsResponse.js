export function ticketsResponse() {
    fetch('https://shfe-diplom.neto-server.ru/ticket', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => console.log(data))
}