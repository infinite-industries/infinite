// some middleware to convert the date/time strings
module.exports = (req, res, next) => {
  const event = req.body &&  req.body.event

  if (event && event.date_times) {
    try {
      req.body.event = {
        ...event,
        date_times: event.date_times.map(dtEntry => {
          return {
            ...dtEntry,
            start_time: new Date(dtEntry.start_time).toISOString(),
            end_time: new Date(dtEntry.end_time).toISOString()
          }
        })
      }
    } catch (ex) {
      res.status(500, 'could not parse date formats')
    }
  }

  next()
}
