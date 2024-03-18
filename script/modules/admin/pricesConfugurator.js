import { getData } from "../../main.js";
import { editPrices } from "./editPrices.js";

export async function pricesConfigurator() {
    const data = await getData();
    const halls = data.halls;

    let btn = document.querySelector('.prices-cfg.config_selected');

    let frame = document.querySelector('.prices');
    let inputsContainer = document.getElementById('price_inputs')

    if (!inputsContainer) {
        inputsContainer = document.createElement('div');
        inputsContainer.className = 'price_inputs';
        inputsContainer.id = 'price_inputs';
        frame.appendChild(inputsContainer);
    } 
    else {
        inputsContainer.innerHTML = '';
    }

    
    for (let hall of halls) {
        let standart = hall.hall_price_standart;
        let vip = hall.hall_price_vip;
        

        if (hall.id === +btn.id) {

            inputsContainer.innerHTML = `<p class="paragraph">Установите цены для типов кресел:</p>
                            <div class="price_cont">
                                <label class="annot_col">Цена, рублей
                                    <div class="price_annotation"><input class="input price" id="standart-price" type="number" value="${standart}" min="0">
                                    <div class="price_legend_block">за <span class="cell price_legend"></span>обычные кресла</div>
                                </label>                                       
                            </div>
                            <div class="price_cont">
                                <label class="annot_col">Цена, рублей
                                    <div class="price_annotation"><input class="input price price-vip" id="vip-price" type="number" value="${vip}" min="0">
                                    <div class="price_legend_block">за <span class="cell vip price_legend"></span>VIP кресла</div>
                                </label> 
                            </div>
                            <div class="btns_container">
                                <button class="cancel" id="discard_changes_prices" disabled>Отмена</button>
                                <button class="save" id="save_prices" disabled>Сохранить</button>
                            </div>
                            `;


    let standartPrice = document.getElementById('standart-price');
    let vipPrice = document.getElementById('vip-price');


    const discardChangesPrices = document.getElementById('discard_changes_prices');
    const savePrices = document.getElementById('save_prices');

    discardChangesPrices.addEventListener('click', () => {
            standartPrice.value = standart;
            vipPrice.value = vip;
    })

    standartPrice.addEventListener('input', (event) => {
        if (event.target.value <= 0) {
            event.target.style.color = 'rgb(117, 117, 117)';
        }
        else {
            event.target.style.color = 'rgb(0, 0, 0)'
        }

        discardChangesPrices.disabled = false;
        savePrices.disabled = false;

    })
    vipPrice.addEventListener('input', (event) => {
        if (event.target.value <= 0) {
            event.target.style.color = 'rgb(117, 117, 117)';
        }
        else {
            event.target.style.color = 'rgb(0, 0, 0)'
        }

        discardChangesPrices.disabled = false;
        savePrices.disabled = false;
    })
    }
}
    editPrices();
}