
export default function ErrorMessage(error) {
    console.error(error)
    return `
    <div class="infinite-error">
        <h2>Unable to reach the server :(</h2>
        <p>For the nerds among us, the error output is in the console log.</p>
    </div>`
}
