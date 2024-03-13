export function salesToggle() {
    const configSalesBtns = document.querySelectorAll('.sales-cfg');
    const blockSales = document.querySelector('div.sales');
    let statusMsg = document.querySelector('div.sales_message');

    configSalesBtns[0].classList.add('config_selected');
    let selectedSalesBtn = document.querySelector('.sales-cfg.config_selected');

    if (selectedSalesBtn) {
        blockSales.insertAdjacentHTML('beforeend', `<div class="sales_message"></div>`);
        statusMsg = document.querySelector('div.sales_message');
        statusMsg.innerHTML = `<p class="paragraph"></p>
                                <button class="sales_manager" id="sales_manager"></button>`;   

        checkStatus();
    }

    configSalesBtns.forEach(btn => {

        btn.addEventListener('click', () => {
            configSalesBtns.forEach((selected) => {
                selected.classList.remove('config_selected');
                btn.classList.add('config_selected');
            });
  
            checkStatus();

            const salesManager = document.getElementById('sales_manager');
            if (salesManager) {
                salesManager.onclick = salesResponse;
            }
        

        function salesResponse() {
            const params = new FormData()
    
            if (btn.getAttribute('opened') === '0') {
                btn.setAttribute('opened', 1)
                params.set('hallOpen', '1')
            }
            else {
                btn.setAttribute('opened', 0)
                params.set('hallOpen', '0')
            }
            
            fetch(`https://shfe-diplom.neto-server.ru/open/${+btn.id}`, {
                    method: 'POST',
                    body: params 
                })
            .then(response => response.json())
            .then(data => console.log(data));
            checkStatus();
        };
    })

    })

    function checkStatus() {
        let selectedSalesBtn = document.querySelector('.sales-cfg.config_selected');

        const paragraph = statusMsg.querySelector('p');
        const salesManager = document.getElementById('sales_manager');

        if (selectedSalesBtn.getAttribute('opened') === '1') {
            paragraph.textContent = 'Продажи билетов открыты!';
            salesManager.textContent = 'Приостановить продажу билетов';
        }
        else {
            paragraph.textContent = 'Продажи билетов закрыты.';
            salesManager.textContent = 'Открыть продажу билетов';
        } 
    };
};