
export default function cardImage(card, imageUrl, eventUrl) {
    const image_container = card.querySelector('.infinite-image-container')
    image_container.innerHTML = `
        <a href="${eventUrl}" target="_new">
            <div class="image-surface" style="width:100%; height:150px; background:url('${imageUrl}') center center / cover no-repeat; cursor:pointer;"></div>
        </a>`
}
