export function checkForSeances() {
    const blocks = document.querySelectorAll('.cinema_block');
    blocks.forEach(block => {
        if (!block.lastElementChild.classList.contains('halls')){
            block.remove()
        }
    })
};

