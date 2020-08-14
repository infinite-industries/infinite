module.exports = filterContactInfo

function filterContactInfo (req, data) {
  if (req.isInfiniteAdmin) {
    return
  } else if (Array.isArray(data)) {
    data.forEach(item => {
      item.set('organizer_contact', undefined)
    })
  } else if (!!data) {
    data.set('organizer_contact', undefined)
  }
}
