export function editPrices() {
    const discardChangesPrices = document.getElementById('discard_changes_prices');
    const savePrices = document.getElementById('save_prices');
    const currentHall = document.querySelector('.prices-cfg.config_selected');
    const stdPrice = document.getElementById('standart-price');
    const vipPrice = document.getElementById('vip-price');

    savePrices.addEventListener('click', () => {
        const params = new FormData()
            params.set('priceStandart', `${+stdPrice.value}`)
            params.set('priceVip', `${+vipPrice.value}`)
            fetch(`https://shfe-diplom.neto-server.ru/price/${+currentHall.id}`, {
                method: 'POST',
                body: params 
            })
                .then( response => response.json())
                .then( data => console.log( data ));

        discardChangesPrices.disabled = true;
        savePrices.disabled = true;
    })
};