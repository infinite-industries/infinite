module.exports = {
  getEventBase: (DataTypes) => {
    return {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
      time_start: DataTypes.DATE, // delete when front end is updated to use dates
      time_end: DataTypes.DATE, // delete when front end is updated to use dates
      multi_day: DataTypes.BOOLEAN,
      additional_dates: DataTypes.JSONB, // delete when front end is updated to use dates
      date_times: DataTypes.JSONB,
      image: DataTypes.STRING,
      social_image: DataTypes.STRING,
      venue_id: DataTypes.UUIDV4,
      admission_fee: DataTypes.STRING,
      address: DataTypes.STRING,
      organizer_contact: {
        type: DataTypes.STRING,
        allowNull: true
      },
      map_link: DataTypes.STRING,
      brief_description: DataTypes.STRING,
      description: DataTypes.TEXT,
      links: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        set(val) {
          if (!val)
            val = []

          this.setDataValue('links', val);
        }
      },
      website_link: DataTypes.TEXT,
      ticket_link: DataTypes.STRING,
      fb_event_link: DataTypes.STRING,
      eventbrite_link: DataTypes.STRING,
      bitly_link: DataTypes.STRING,
      tags:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        set(val) {
          if (!val)
            val = []

          this.setDataValue('tags', val);
        }
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        set(val) {
          if (!val) // cast any undefined to false
            val = false

          this.setDataValue('verified', val);
        }
      }
    }
  }
}
